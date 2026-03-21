const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

const BLING_API = 'https://www.bling.com.br/Api/v3';

function getOAuthConfig() {
    const clientId = process.env.BLING_CLIENT_ID;
    const clientSecret = process.env.BLING_CLIENT_SECRET;

    return {
        clientId,
        clientSecret,
        configured: !!(clientId && clientSecret)
    };
}

// â”€â”€â”€ Token helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getTokens() {
    const rows = db.prepare(
        "SELECT chave, valor FROM configuracoes WHERE chave IN ('bling_access_token','bling_refresh_token','bling_token_expiry')"
    ).all();
    return Object.fromEntries(rows.map(r => [r.chave, r.valor]));
}

function saveTokens({
    access_token,
    refresh_token,
    expires_in
}) {
    const expiry = new Date(Date.now() + (expires_in - 60) * 1000).toISOString();
    const stmt = db.prepare("UPDATE configuracoes SET valor=? WHERE chave=?");
    stmt.run(access_token, 'bling_access_token');
    stmt.run(refresh_token || '', 'bling_refresh_token');
    stmt.run(expiry, 'bling_token_expiry');
}

async function obterAccessToken() {
    const tokens = getTokens();

    // Verifica se ainda Ã© vÃ¡lido
    if (tokens.bling_access_token && tokens.bling_token_expiry) {
        if (new Date(tokens.bling_token_expiry) > new Date()) {
            return tokens.bling_access_token;
        }
    }

    // Tenta renovar via refresh_token
    if (tokens.bling_refresh_token) {
        try {
            const {
                clientId,
                clientSecret,
                configured
            } = getOAuthConfig();

            if (!configured) {
                throw new Error('BLING_CLIENT_ID e BLING_CLIENT_SECRET nÃ£o configurados no backend/.env');
            }

            const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

            const resp = await axios.post(
                `${BLING_API}/oauth/token`,
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: tokens.bling_refresh_token
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );

            saveTokens(resp.data);
            return resp.data.access_token;
        } catch {
            // refresh falhou â€” precisa reautenticar
        }
    }

    // Ãšltimo recurso: usa token manual do .env
    if (process.env.BLING_ACCESS_TOKEN) return process.env.BLING_ACCESS_TOKEN;

    throw new Error('Token Bling nÃ£o configurado. Acesse /api/bling/auth para autenticar.');
}

function blingClient(token) {
    return axios.create({
        baseURL: BLING_API,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// â”€â”€â”€ Rota de autenticaÃ§Ã£o OAuth (code flow) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// GET /api/bling/auth/url  â€” Retorna URL para o usuÃ¡rio autorizar no Bling
router.get('/auth/url', (_req, res) => {
    const {
        clientId,
        configured
    } = getOAuthConfig();

    if (!configured) {
        return res.json({
            url: '',
            configurado: false,
            detalhe: 'Configure BLING_CLIENT_ID e BLING_CLIENT_SECRET no backend/.env'
        });
    }

    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
    const redirectUri = encodeURIComponent(`${backendUrl}/api/bling/auth/callback`);
    const url = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=composicao&redirect_uri=${redirectUri}`;
    res.json({
        url,
        configurado: true
    });
});

// GET /api/bling/auth/callback  â€” Bling redireciona aqui com o code
router.get('/auth/callback', async (req, res) => {
    const {
        code
    } = req.query;
    if (!code) return res.status(400).send('ParÃ¢metro "code" nÃ£o encontrado');

    const {
        clientId,
        clientSecret,
        configured
    } = getOAuthConfig();

    if (!configured) {
        return res.status(500).json({
            erro: 'BLING_CLIENT_ID e BLING_CLIENT_SECRET nÃ£o configurados no backend/.env'
        });
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const resp = await axios.post(
            `${BLING_API}/oauth/token`,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`}/api/bling/auth/callback`
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            }
        );
        saveTokens(resp.data);
        // Redireciona para o frontend com sucesso
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/configuracoes?bling=ok`);
    } catch (err) {
        const msg = err.response ? .data || err.message;
        res.status(500).json({
            erro: 'Falha na autenticaÃ§Ã£o Bling',
            detalhe: msg
        });
    }
});

// POST /api/bling/auth/token-manual  â€” Salvar token manualmente (sem OAuth flow)
router.post('/auth/token-manual', (req, res) => {
    const {
        access_token,
        refresh_token,
        expires_in
    } = req.body;
    if (!access_token) return res.status(400).json({
        erro: 'access_token obrigatÃ³rio'
    });
    saveTokens({
        access_token,
        refresh_token: refresh_token || '',
        expires_in: expires_in || 21600
    });
    res.json({
        mensagem: 'Token salvo com sucesso'
    });
});

// GET /api/bling/auth/status
router.get('/auth/status', (_req, res) => {
    const tokens = getTokens();
    const expiry = tokens.bling_token_expiry ? new Date(tokens.bling_token_expiry) : null;
    const valido = expiry ? expiry > new Date() : false;
    res.json({
        configurado: !!tokens.bling_access_token,
        valido,
        expira_em: expiry ? expiry.toISOString() : null
    });
});

// â”€â”€â”€ Produtos no Bling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// GET /api/bling/produtos?q=PM2  â€” lista produtos do Bling
router.get('/produtos', async (req, res) => {
    try {
        const token = await obterAccessToken();
        const client = blingClient(token);
        const params = {
            pagina: 1,
            limite: 100
        };
        if (req.query.q) params.criterio = req.query.q;

        const resp = await client.get('/produtos', {
            params
        });
        res.json(resp.data);
    } catch (err) {
        const status = err.response ? .status || 500;
        res.status(status).json({
            erro: err.message,
            detalhe: err.response ? .data
        });
    }
});

// GET /api/bling/produtos/:id  â€” detalhe de um produto no Bling
router.get('/produtos/:id', async (req, res) => {
    try {
        const token = await obterAccessToken();
        const resp = await blingClient(token).get(`/produtos/${req.params.id}`);
        res.json(resp.data);
    } catch (err) {
        const status = err.response ? .status || 500;
        res.status(status).json({
            erro: err.message,
            detalhe: err.response ? .data
        });
    }
});

// â”€â”€â”€ Sincronizar composiÃ§Ã£o de um produto local â†’ Bling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// POST /api/bling/sincronizar/:produtoId
router.post('/sincronizar/:produtoId', async (req, res) => {
    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.produtoId);
    if (!produto) return res.status(404).json({
        erro: 'Produto nÃ£o encontrado'
    });

    const componentes = db.prepare(
        'SELECT * FROM produto_componentes WHERE produto_id = ?'
    ).all(req.params.produtoId);

    // Monta o JSON da composiÃ§Ã£o conforme Bling API v3
    const payload = {
        nome: produto.nome,
        codigo: produto.codigo,
        tipo: 'P',
        situacao: 'A',
        estrutura: {
            tipo: 'F', // F = FabricaÃ§Ã£o
            componentes: componentes.map(c => ({
                produto: {
                    codigo: c.bling_codigo || c.codigo_componente
                },
                quantidade: c.quantidade
            }))
        }
    };

    try {
        const token = await obterAccessToken();
        const client = blingClient(token);

        let blingId = produto.bling_id;
        let respData;

        if (blingId) {
            // Atualiza produto existente no Bling
            const resp = await client.patch(`/produtos/${blingId}`, payload);
            respData = resp.data;
        } else {
            // Cria novo produto no Bling
            const resp = await client.post('/produtos', payload);
            respData = resp.data;
            blingId = respData ? .data ? .id;

            if (blingId) {
                db.prepare('UPDATE produtos SET bling_id = ?, status = ? WHERE id = ?')
                    .run(String(blingId), 'sincronizado', req.params.produtoId);
            }
        }

        // Marca como sincronizado
        db.prepare('UPDATE produtos SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run('sincronizado', req.params.produtoId);

        res.json({
            mensagem: 'Produto sincronizado com Bling',
            bling_id: blingId,
            resposta: respData
        });
    } catch (err) {
        const status = err.response ? .status || 500;
        res.status(status).json({
            erro: 'Falha ao sincronizar com Bling',
            detalhe: err.response ? .data || err.message
        });
    }
});

// POST /api/bling/importar/:blingId  â€” importa produto do Bling para o banco local
router.post('/importar/:blingId', async (req, res) => {
    try {
        const token = await obterAccessToken();
        const resp = await blingClient(token).get(`/produtos/${req.params.blingId}`);
        const p = resp.data ? .data;
        if (!p) return res.status(404).json({
            erro: 'Produto nÃ£o encontrado no Bling'
        });

        // Verifica se jÃ¡ existe localmente
        const existente = db.prepare('SELECT id FROM produtos WHERE codigo = ?').get(p.codigo);
        if (existente) {
            return res.status(409).json({
                erro: `Produto ${p.codigo} jÃ¡ existe localmente`,
                id: existente.id
            });
        }

        // Determina tipo pelo prefixo do cÃ³digo
        const prefixos = {
            PM: 'PM',
            EM: 'EM',
            AM: 'AM',
            SM: 'SM',
            DM: 'DM',
            BM: 'BM',
            CM: 'CM'
        };
        const tipo = Object.keys(prefixos).find(k => p.codigo ? .toUpperCase().startsWith(k)) || 'PM';

        const result = db.prepare(`
      INSERT INTO produtos (codigo, nome, tipo, bling_id, status)
      VALUES (?, ?, ?, ?, 'sincronizado')
    `).run(p.codigo, p.nome, tipo, String(p.id));

        res.status(201).json({
            mensagem: 'Importado com sucesso',
            id: result.lastInsertRowid
        });
    } catch (err) {
        const status = err.response ? .status || 500;
        res.status(status).json({
            erro: err.message,
            detalhe: err.response ? .data
        });
    }
});

// ─── Pedidos de Venda do Bling ────────────────────────────────────────────────

// GET /api/bling/pedidos?situacao=6  – lista pedidos do Bling
router.get('/pedidos', async (req, res) => {
    try {
        const token = await obterAccessToken();
        const params = {
            pagina: 1,
            limite: 100
        };
        if (req.query.situacao) params.situacao = req.query.situacao;
        const resp = await blingClient(token).get('/pedidos/vendas', {
            params
        });
        res.json(resp.data);
    } catch (err) {
        const status = err.response ? .status || 500;
        res.status(status).json({
            erro: err.message,
            detalhe: err.response ? .data
        });
    }
});

// GET /api/bling/pedidos/:id  – detalhe de um pedido
router.get('/pedidos/:id', async (req, res) => {
    try {
        const token = await obterAccessToken();
        const resp = await blingClient(token).get(`/pedidos/vendas/${req.params.id}`);
        res.json(resp.data);
    } catch (err) {
        const status = err.response ? .status || 500;
        res.status(status).json({
            erro: err.message,
            detalhe: err.response ? .data
        });
    }
});

// ─── Blanks no Bling ──────────────────────────────────────────────────────────

// POST /api/bling/blanks/importar/:blingId  – importa produto do Bling como blank
router.post('/blanks/importar/:blingId', async (req, res) => {
    try {
        const token = await obterAccessToken();
        const resp = await blingClient(token).get(`/produtos/${req.params.blingId}`);
        const p = resp.data && resp.data.data;
        if (!p) return res.status(404).json({
            erro: 'Produto não encontrado no Bling'
        });

        const nome = p.nome || p.descricao || '';

        // Extrai diâmetro corpo: ex "Ø. 3,0 MM" ou "Ø3,0MM"
        const mCorpo = nome.match(/[Øø][.\s]*(\d+[,.]?\d*)\s*MM/i);
        const diametro_corpo = mCorpo ? parseFloat(mCorpo[1].replace(',', '.')) : 0;

        // Extrai comprimento: ex "L. 6,0 MM"
        const mComp = nome.match(/\bL[.\s]*(\d+[,.]?\d*)\s*MM/i);
        const comprimento = mComp ? parseFloat(mComp[1].replace(',', '.')) : 0;

        // Extrai diâmetro furo: ex "ØF. 2,0 MM"
        const mFuro = nome.match(/[Øø]F[.\s]*(\d+[,.]?\d*)\s*MM/i);
        const diametro_furo = mFuro ? parseFloat(mFuro[1].replace(',', '.')) : 0;

        // Extrai rosca: M2, M3, M4...
        const mRosca = nome.match(/\bM(\d+(?:[,.]?\d*)?)\b/i);
        const rosca = mRosca ? `M${mRosca[1].replace(',', '.')}` : 'M2';

        // Material
        const material = /inox/i.test(nome) ? 'Inox' : /alum[íi]nio/i.test(nome) ? 'Alumínio' : 'Inox';

        // Custo do Bling
        const custo = parseFloat(p.precoCusto || p.preco || 0);

        const stmt = db.prepare(`
            INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(codigo) DO UPDATE SET
                descricao    = excluded.descricao,
                bling_id     = excluded.bling_id,
                bling_codigo = excluded.bling_codigo,
                custo        = CASE WHEN excluded.custo > 0 THEN excluded.custo ELSE custo END
        `);
        const result = stmt.run(p.codigo, nome, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, String(p.id), p.codigo);

        res.status(201).json({
            mensagem: 'Blank importado com sucesso',
            id: result.lastInsertRowid
        });
    } catch (err) {
        const status = (err.response && err.response.status) || 500;
        res.status(status).json({
            erro: err.message,
            detalhe: err.response && err.response.data
        });
    }
});

// POST /api/bling/blanks/:blankId/sincronizar  – envia custo/dados do blank para o Bling
router.post('/blanks/:blankId/sincronizar', async (req, res) => {
    const blank = db.prepare('SELECT * FROM blanks WHERE id = ?').get(req.params.blankId);
    if (!blank) return res.status(404).json({
        erro: 'Blank não encontrado'
    });

    try {
        const token = await obterAccessToken();
        const client = blingClient(token);

        const payload = {
            nome: blank.descricao || blank.codigo,
            codigo: blank.codigo,
            tipo: 'P',
            situacao: 'A',
            precoCusto: blank.custo || 0,
            preco: blank.custo || 0
        };

        let blingId = blank.bling_id;
        if (blingId) {
            await client.put(`/produtos/${blingId}`, payload);
        } else {
            const resp = await client.post('/produtos', payload);
            blingId = resp.data && resp.data.data && resp.data.data.id;
            if (blingId) {
                db.prepare('UPDATE blanks SET bling_id = ?, bling_codigo = ? WHERE id = ?')
                    .run(String(blingId), blank.codigo, req.params.blankId);
            }
        }

        res.json({
            mensagem: 'Blank sincronizado com Bling',
            bling_id: blingId
        });
    } catch (err) {
        const status = (err.response && err.response.status) || 500;
        res.status(status).json({
            erro: 'Falha ao sincronizar',
            detalhe: (err.response && err.response.data) || err.message
        });
    }
});

module.exports = router;