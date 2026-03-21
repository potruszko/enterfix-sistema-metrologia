/**
 * Catch-all handler for ALL /api/bling/* routes.
 *
 * Because this file lives at api/bling/[...slug].js, the Vercel filesystem
 * router sends every /api/bling/* request here (except api/bling/auth/callback.js
 * which has its own dedicated file and takes priority).
 *
 * In this handler the slug array starts AFTER /api/bling/, so:
 *   /api/bling/auth/url      → slug = ['auth','url']   → s0='auth', s1='url'
 *   /api/bling/auth/status   → slug = ['auth','status'] → s0='auth', s1='status'
 *   /api/bling/produtos      → slug = ['produtos']      → s0='produtos'
 *   /api/bling/sincronizar/5 → slug = ['sincronizar','5']
 */
import axios from 'axios';
import { query, queryOne, setCors } from '../_db.js';
import {
    getOAuthConfig,
    getBackendUrl,
    getFrontendUrl,
    getTokens,
    saveTokens,
    obterAccessToken,
    blingClient,
    BLING_API
} from '../_bling.js';

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const rawSlug = req.query['...slug'] || req.query.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug : (rawSlug ? rawSlug.split('/') : []);
    const s0 = slug[0] || '';
    const s1 = slug[1] || '';
    const s2 = slug[2] || '';
    const method = req.method;
    const body = req.body || {};

    try {
        // ── AUTH ──────────────────────────────────────────────────────────────
        if (s0 === 'auth') {
            // GET /api/bling/auth/url
            if (s1 === 'url' && method === 'GET') {
                const { clientId, configured } = getOAuthConfig();
                if (!configured) return res.json({ url: '', configurado: false });
                const redirectUri = encodeURIComponent(`${getBackendUrl()}/api/bling/auth/callback`);
                const url = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=composicao&redirect_uri=${redirectUri}`;
                return res.json({ url, configurado: true });
            }

            // GET /api/bling/auth/status
            if (s1 === 'status' && method === 'GET') {
                const tokens = await getTokens();
                const expiry = tokens.bling_token_expiry ? new Date(tokens.bling_token_expiry) : null;
                return res.json({
                    configurado: !!tokens.bling_access_token,
                    valido: expiry ? expiry > new Date() : false,
                    expira_em: expiry ? expiry.toISOString() : null
                });
            }

            // POST /api/bling/auth/token-manual
            if (s1 === 'token-manual' && method === 'POST') {
                const { access_token, refresh_token, expires_in } = body;
                if (!access_token) return res.status(400).json({ erro: 'access_token obrigatorio' });
                await saveTokens({
                    access_token,
                    refresh_token: refresh_token || '',
                    expires_in: expires_in || 21600
                });
                return res.json({ mensagem: 'Token salvo com sucesso' });
            }
        }

        // ── PRODUTOS Bling ────────────────────────────────────────────────────
        if (s0 === 'produtos') {
            const token = await obterAccessToken();
            if (!s1) {
                const params = { pagina: 1, limite: 100 };
                if (req.query.q) params.criterio = req.query.q;
                const resp = await blingClient(token).get('/produtos', { params });
                return res.json(resp.data);
            }
            const resp = await blingClient(token).get(`/produtos/${s1}`);
            return res.json(resp.data);
        }

        // ── SINCRONIZAR produto local → Bling ─────────────────────────────────
        if (s0 === 'sincronizar' && s1 && method === 'POST') {
            const produtoId = s1;
            const produto = await queryOne('SELECT * FROM produtos WHERE id=$1', [produtoId]);
            if (!produto) return res.status(404).json({ erro: 'Produto nao encontrado' });
            const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id=$1', [produtoId]);
            const payload = {
                nome: produto.nome,
                codigo: produto.codigo,
                tipo: 'P',
                situacao: 'A',
                estrutura: {
                    tipo: 'F',
                    componentes: componentes.map(c => ({
                        produto: { codigo: c.bling_codigo || c.codigo_componente },
                        quantidade: c.quantidade
                    }))
                }
            };
            const token = await obterAccessToken();
            const client = blingClient(token);
            let blingId = produto.bling_id;
            if (blingId) {
                await client.put(`/produtos/${blingId}`, payload);
            } else {
                const resp = await client.post('/produtos', payload);
                blingId = resp.data && resp.data.data && resp.data.data.id;
                if (blingId) await query('UPDATE produtos SET bling_id=$1, status=$2 WHERE id=$3', [String(blingId), 'sincronizado', produtoId]);
            }
            if (blingId) {
                const compsComBling = componentes.filter(c => c.bling_id);
                if (compsComBling.length > 0) {
                    try {
                        await client.put(`/produtos/${blingId}/estruturas`, {
                            tipoEstutura: 'P',
                            componentes: compsComBling.map(c => ({
                                produto: { id: parseInt(c.bling_id) },
                                quantidade: parseFloat(c.quantidade)
                            }))
                        });
                    } catch { /* estrutura opcional */ }
                }
            }
            await query('UPDATE produtos SET status=$1, updated_at=NOW() WHERE id=$2', ['sincronizado', produtoId]);
            return res.json({ mensagem: 'Produto sincronizado com Bling', bling_id: blingId });
        }

        // ── IMPORTAR produto do Bling → local ─────────────────────────────────
        if (s0 === 'importar' && s1 && method === 'POST') {
            const token = await obterAccessToken();
            const resp = await blingClient(token).get(`/produtos/${s1}`);
            const p = resp.data && resp.data.data;
            if (!p) return res.status(404).json({ erro: 'Produto nao encontrado no Bling' });
            const existente = await queryOne('SELECT id FROM produtos WHERE codigo=$1', [p.codigo]);
            if (existente) return res.status(409).json({ erro: `Produto ${p.codigo} ja existe localmente`, id: existente.id });
            const prefixos = ['PM', 'EM', 'AM', 'SM', 'DM', 'BM', 'CM'];
            const tipo = prefixos.find(k => p.codigo && p.codigo.toUpperCase().startsWith(k)) || 'PM';
            const row = await queryOne(`INSERT INTO produtos (codigo, nome, tipo, bling_id, status) VALUES ($1,$2,$3,$4,'sincronizado') RETURNING id`, [p.codigo, p.nome, tipo, String(p.id)]);
            return res.status(201).json({ mensagem: 'Importado com sucesso', id: row.id });
        }

        // ── SYNC-FULL → Todos os produtos ativos ──────────────────────────────
        if (s0 === 'sync-full' && method === 'POST') {
            const token = await obterAccessToken();
            const client = blingClient(token);
            const produtos = await query(
                `SELECT * FROM produtos WHERE status != 'inativo'
                 ORDER BY CASE categoria WHEN 'materia_prima' THEN 1 WHEN 'componente' THEN 2 WHEN 'semiacabado' THEN 3 ELSE 4 END, codigo`
            );
            const result = { sincronizados: 0, atualizados: 0, estruturas: 0, erros: [] };
            for (const p of produtos) {
                try {
                    const payload = {
                        nome: p.nome, codigo: p.codigo, situacao: 'A', tipo: 'P',
                        precoCusto: parseFloat(p.custo_total) || 0,
                        preco: parseFloat(p.preco_venda) || 0
                    };
                    let blingId = p.bling_id;
                    if (blingId) {
                        await client.put(`/produtos/${blingId}`, payload);
                        result.atualizados++;
                    } else {
                        const resp = await client.post('/produtos', payload);
                        blingId = resp.data && resp.data.data && resp.data.data.id;
                        if (blingId) await query('UPDATE produtos SET bling_id=$1, updated_at=NOW() WHERE id=$2', [String(blingId), p.id]);
                        result.sincronizados++;
                    }
                    if (blingId) {
                        const comps = await query(
                            "SELECT * FROM produto_componentes WHERE produto_id=$1 AND bling_id IS NOT NULL AND bling_id != ''",
                            [p.id]
                        );
                        if (comps.length > 0) {
                            try {
                                await client.put(`/produtos/${blingId}/estruturas`, {
                                    tipoEstutura: 'P',
                                    componentes: comps.map(c => ({ produto: { id: parseInt(c.bling_id) }, quantidade: parseFloat(c.quantidade) }))
                                });
                                result.estruturas++;
                            } catch { /* estrutura opcional */ }
                        }
                    }
                } catch (err) {
                    result.erros.push({ codigo: p.codigo, erro: (err.response && err.response.data) || err.message });
                }
            }
            return res.json(result);
        }

        // ── PEDIDOS Bling ─────────────────────────────────────────────────────
        if (s0 === 'pedidos') {
            const token = await obterAccessToken();
            if (!s1) {
                const params = { pagina: 1, limite: 100 };
                if (req.query.situacao) params.situacao = req.query.situacao;
                const resp = await blingClient(token).get('/pedidos/vendas', { params });
                return res.json(resp.data);
            }
            const resp = await blingClient(token).get(`/pedidos/vendas/${s1}`);
            return res.json(resp.data);
        }

        // ── BLANKS Bling ──────────────────────────────────────────────────────
        if (s0 === 'blanks') {
            // POST /api/bling/blanks/importar/:blingId
            if (s1 === 'importar' && s2 && method === 'POST') {
                const token = await obterAccessToken();
                const resp = await blingClient(token).get(`/produtos/${s2}`);
                const p = resp.data && resp.data.data;
                if (!p) return res.status(404).json({ erro: 'Produto nao encontrado no Bling' });
                const nome = p.nome || p.descricao || '';
                const mCorpo = nome.match(/[Øø][.\s]*(\d+[,.]?\d*)\s*MM/i);
                const diametro_corpo = mCorpo ? parseFloat(mCorpo[1].replace(',', '.')) : 0;
                const mComp = nome.match(/\bL[.\s]*(\d+[,.]?\d*)\s*MM/i);
                const comprimento = mComp ? parseFloat(mComp[1].replace(',', '.')) : 0;
                const mFuro = nome.match(/[Øø]F[.\s]*(\d+[,.]?\d*)\s*MM/i);
                const diametro_furo = mFuro ? parseFloat(mFuro[1].replace(',', '.')) : 0;
                const mRosca = nome.match(/\bM(\d+(?:[,.]?\d*)?)\b/i);
                const rosca = mRosca ? `M${mRosca[1].replace(',', '.')}` : 'M2';
                const material = /inox/i.test(nome) ? 'Inox' : /alum[íi]nio/i.test(nome) ? 'Alumínio' : 'Inox';
                const custo = parseFloat(p.precoCusto || p.preco || 0);
                await query(
                    `INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                     ON CONFLICT (codigo) DO UPDATE SET descricao=EXCLUDED.descricao, bling_id=EXCLUDED.bling_id, bling_codigo=EXCLUDED.bling_codigo,
                       custo=CASE WHEN EXCLUDED.custo > 0 THEN EXCLUDED.custo ELSE blanks.custo END`,
                    [p.codigo, nome, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, String(p.id), p.codigo]
                );
                return res.status(201).json({ mensagem: 'Blank importado com sucesso' });
            }
            // POST /api/bling/blanks/:blankId/sincronizar
            if (s1 && s2 === 'sincronizar' && method === 'POST') {
                const blank = await queryOne('SELECT * FROM blanks WHERE id=$1', [s1]);
                if (!blank) return res.status(404).json({ erro: 'Blank nao encontrado' });
                const token = await obterAccessToken();
                const client = blingClient(token);
                const payload = { nome: blank.descricao || blank.codigo, codigo: blank.codigo, tipo: 'P', situacao: 'A', precoCusto: blank.custo || 0, preco: blank.custo || 0 };
                let blingId = blank.bling_id;
                if (blingId) {
                    await client.put(`/produtos/${blingId}`, payload);
                } else {
                    const resp = await client.post('/produtos', payload);
                    blingId = resp.data && resp.data.data && resp.data.data.id;
                    if (blingId) await query('UPDATE blanks SET bling_id=$1, bling_codigo=$2 WHERE id=$3', [String(blingId), blank.codigo, s1]);
                }
                return res.json({ mensagem: 'Blank sincronizado com Bling', bling_id: blingId });
            }
        }

        return res.status(404).json({ erro: `Rota bling nao encontrada: ${slug.join('/')}` });
    } catch (err) {
        console.error('[bling/slug]', err.message, err.response && err.response.data);
        return res.status(500).json({ erro: err.message, detalhe: (err.response && err.response.data) || null });
    }
}
