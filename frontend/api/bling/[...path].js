// Handler autossuficiente para todas as rotas /api/bling/*
// Importa apenas de arquivos com prefixo _ (não são rotas Vercel)
import axios from 'axios';
import { query, queryOne, setCors } from '../_db.js';
import {
    getOAuthConfig, getBackendUrl, getFrontendUrl,
    getTokens, saveTokens, obterAccessToken, blingClient, BLING_API
} from '../_bling.js';

export const config = { api: { bodyParser: false } };

async function readBody(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf-8');
    const ct = req.headers['content-type'] || '';
    if (ct.includes('application/json') && raw) {
        try { return JSON.parse(raw); } catch { return {}; }
    }
    return {};
}

export default async function handler(req, res) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const rawPath = req.query['...path'];
    const parts = Array.isArray(rawPath) ? rawPath : (rawPath ? rawPath.split('/') : []);
    const [s0, s1, s2] = parts;
    const method = req.method;
    const body = await readBody(req);

    try {
        // ── Auth ──────────────────────────────────────────────────────────────
        if (s0 === 'auth') {
            if (s1 === 'url' && method === 'GET') {
                const { clientId, configured } = getOAuthConfig();
                if (!configured) return res.json({ url: '', configurado: false, detalhe: 'Configure BLING_CLIENT_ID e BLING_CLIENT_SECRET' });
                const backendUrl = getBackendUrl();
                const redirectUri = encodeURIComponent(`${backendUrl}/api/bling/auth/callback`);
                const url = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=composicao&redirect_uri=${redirectUri}`;
                return res.json({ url, configurado: true });
            }

            if (s1 === 'callback' && method === 'GET') {
                const { code } = req.query;
                if (!code) return res.status(400).send('Parâmetro "code" não encontrado');
                const { clientId, clientSecret, configured } = getOAuthConfig();
                if (!configured) return res.status(500).json({ erro: 'Credenciais Bling não configuradas' });
                const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
                try {
                    const resp = await axios.post(
                        `${BLING_API}/oauth/token`,
                        new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: `${getBackendUrl()}/api/bling/auth/callback` }),
                        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` } }
                    );
                    await saveTokens(resp.data);
                    return res.redirect(`${getFrontendUrl()}/configuracoes?bling=ok`);
                } catch (err) {
                    return res.status(500).json({ erro: 'Falha na autenticação Bling', detalhe: (err.response && err.response.data) || err.message });
                }
            }

            if (s1 === 'token-manual' && method === 'POST') {
                const { access_token, refresh_token, expires_in } = body;
                if (!access_token) return res.status(400).json({ erro: 'access_token obrigatório' });
                await saveTokens({ access_token, refresh_token: refresh_token || '', expires_in: expires_in || 21600 });
                return res.json({ mensagem: 'Token salvo com sucesso' });
            }

            if (s1 === 'status' && method === 'GET') {
                const tokens = await getTokens();
                const expiry = tokens.bling_token_expiry ? new Date(tokens.bling_token_expiry) : null;
                return res.json({
                    configurado: !!tokens.bling_access_token,
                    valido: expiry ? expiry > new Date() : false,
                    expira_em: expiry ? expiry.toISOString() : null
                });
            }
        }

        // ── Preview ───────────────────────────────────────────────────────────
        if (s0 === 'preview' && s1 && method === 'GET') {
            const produto = await queryOne(
                `SELECT p.*, (SELECT COUNT(*) FROM produto_componentes WHERE produto_id=p.id)::int AS componentes_count FROM produtos p WHERE p.id=$1`,
                [s1]
            );
            if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
            let produtoBling = null, estruturaBling = null, erroPreview = null;
            if (produto.bling_id) {
                try {
                    const token = await obterAccessToken();
                    const client = blingClient(token);
                    const resp = await client.get(`/produtos/${produto.bling_id}`);
                    produtoBling = resp.data && resp.data.data;
                    try {
                        const re = await client.get(`/produtos/${produto.bling_id}/estruturas`);
                        const est = re.data && re.data.data;
                        if (est && est.componentes && est.componentes.length > 0) estruturaBling = est;
                    } catch { /* opcional */ }
                } catch (e) { erroPreview = e.message; }
            }
            const mudancas = [];
            if (produtoBling) {
                if (produtoBling.nome !== produto.nome) mudancas.push({ campo: 'nome', local: produto.nome, bling: produtoBling.nome });
                if (produtoBling.codigo !== produto.codigo) mudancas.push({ campo: 'codigo', local: produto.codigo, bling: produtoBling.codigo });
                const cb = parseFloat(produtoBling.precoCusto || 0), cl = parseFloat(produto.custo_total || 0);
                if (Math.abs(cb - cl) > 0.01) mudancas.push({ campo: 'custo', local: cl, bling: cb });
            }
            return res.json({ produto_local: produto, produto_bling: produtoBling || null, estrutura_bling: estruturaBling || null, mudancas, acao: produto.bling_id ? (produtoBling ? 'atualizar' : 'erro') : 'criar', erro: erroPreview || null });
        }

        // ── Produtos ──────────────────────────────────────────────────────────
        if (s0 === 'produtos') {
            const token = await obterAccessToken();
            if (!s1) {
                if (method === 'GET') {
                    const params = { pagina: 1, limite: 100 };
                    if (req.query.q) params.criterio = req.query.q;
                    const resp = await blingClient(token).get('/produtos', { params });
                    return res.json(resp.data);
                }
            } else {
                if (method === 'GET') {
                    const resp = await blingClient(token).get(`/produtos/${s1}`);
                    return res.json(resp.data);
                }
            }
        }

        // ── Sincronizar produto local → Bling ─────────────────────────────────
        if (s0 === 'sincronizar' && s1 && method === 'POST') {
            const produto = await queryOne('SELECT * FROM produtos WHERE id=$1', [s1]);
            if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
            const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id=$1', [s1]);
            const payload = {
                nome: produto.nome, codigo: produto.codigo, tipo: 'P', situacao: 'A',
                estrutura: { tipo: 'F', componentes: componentes.map(c => ({ produto: { codigo: c.bling_codigo || c.codigo_componente }, quantidade: c.quantidade })) }
            };
            const token = await obterAccessToken();
            const client = blingClient(token);
            let blingId = produto.bling_id;
            if (blingId) {
                await client.put(`/produtos/${blingId}`, payload);
            } else {
                const resp = await client.post('/produtos', payload);
                blingId = resp.data && resp.data.data && resp.data.data.id;
                if (blingId) await query('UPDATE produtos SET bling_id=$1, status=$2 WHERE id=$3', [String(blingId), 'sincronizado', s1]);
            }
            if (blingId) {
                const compsComBling = componentes.filter(c => c.bling_id);
                if (compsComBling.length > 0) {
                    try {
                        await client.put(`/produtos/${blingId}/estruturas`, { tipoEstutura: 'P', componentes: compsComBling.map(c => ({ produto: { id: parseInt(c.bling_id) }, quantidade: parseFloat(c.quantidade) })) });
                    } catch { /* opcional */ }
                }
            }
            await query('UPDATE produtos SET status=$1, updated_at=NOW() WHERE id=$2', ['sincronizado', s1]);
            return res.json({ mensagem: 'Produto sincronizado com Bling', bling_id: blingId });
        }

        // ── Importar produto do Bling → local ─────────────────────────────────
        if (s0 === 'importar' && s1 && method === 'POST') {
            const token = await obterAccessToken();
            const resp = await blingClient(token).get(`/produtos/${s1}`);
            const p = resp.data && resp.data.data;
            if (!p) return res.status(404).json({ erro: 'Produto não encontrado no Bling' });
            const existente = await queryOne('SELECT id FROM produtos WHERE codigo=$1', [p.codigo]);
            if (existente) return res.status(409).json({ erro: `Produto ${p.codigo} já existe localmente`, id: existente.id });
            const prefixos = ['PM', 'EM', 'AM', 'SM', 'DM', 'BM', 'CM'];
            const tipo = prefixos.find(k => p.codigo && p.codigo.toUpperCase().startsWith(k)) || 'PM';
            const row = await queryOne(`INSERT INTO produtos (codigo, nome, tipo, bling_id, status) VALUES ($1,$2,$3,$4,'sincronizado') RETURNING id`, [p.codigo, p.nome, tipo, String(p.id)]);
            return res.status(201).json({ mensagem: 'Importado com sucesso', id: row.id });
        }

        // ── Pedidos ───────────────────────────────────────────────────────────
        if (s0 === 'pedidos') {
            const token = await obterAccessToken();
            if (!s1) {
                if (method === 'GET') {
                    const params = { pagina: 1, limite: 100 };
                    if (req.query.situacao) params.situacao = req.query.situacao;
                    const resp = await blingClient(token).get('/pedidos/vendas', { params });
                    return res.json(resp.data);
                }
            } else {
                if (method === 'GET') {
                    const resp = await blingClient(token).get(`/pedidos/vendas/${s1}`);
                    return res.json(resp.data);
                }
            }
        }

        return res.status(404).json({ erro: 'Rota Bling não encontrada' });

    } catch (err) {
        console.error('[bling handler]', err);
        return res.status(500).json({ erro: err.message });
    }
}
