import {
    query,
    queryOne,
    getPool2,
    setCors
} from './_db.js';
import {
    getOAuthConfig,
    getBackendUrl,
    getFrontendUrl,
    getTokens,
    saveTokens,
    obterAccessToken,
    blingClient,
    BLING_API
} from './bling/_bling.js';
import axios from 'axios';

// Disable body parser so we can handle both JSON and CSV manually
export const config = {
    api: {
        bodyParser: false
    }
};

// ─── Body parsing ─────────────────────────────────────────────────────────────
async function readBody(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf-8');
    const ct = req.headers['content-type'] || '';
    if (ct.includes('application/json') && raw) {
        try {
            return {
                json: JSON.parse(raw),
                raw
            };
        } catch {
            return {
                json: {},
                raw
            };
        }
    }
    return {
        json: {},
        raw
    };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const slug = Array.isArray(req.query.slug) ? req.query.slug : [req.query.slug].filter(Boolean);
    const {
        json: body,
        raw
    } = await readBody(req);
    req.body = body;
    try {
        return await route(req, res, slug, raw);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            erro: err.message
        });
    }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
async function recalcularCusto(client, produtoId) {
    const {
        rows
    } = await client.query(
        'SELECT quantidade, custo_unitario FROM produto_componentes WHERE produto_id = $1',
        [produtoId]
    );
    const total = rows.reduce((acc, c) => acc + parseFloat(c.quantidade) * parseFloat(c.custo_unitario), 0);
    await client.query('UPDATE produtos SET custo_total=$1, updated_at=NOW() WHERE id=$2', [total, produtoId]);
    return total;
}

async function gerarNumeroOP() {
    const ano = new Date().getFullYear();
    const last = await queryOne('SELECT numero FROM ordens_producao ORDER BY id DESC LIMIT 1');
    let seq = 1;
    if (last) {
        const m = last.numero.match(/(\d+)$/);
        if (m) seq = parseInt(m[1]) + 1;
    }
    return `OP-${ano}-${String(seq).padStart(4, '0')}`;
}

async function calcularCustoProcesso(opId) {
    const rows = await query(
        `SELECT a.duracao_min, ct.custo_hora_maquina, ct.custo_hora_operador
     FROM apontamentos a
     LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
     WHERE a.op_id = $1 AND a.status = 'concluido'`,
        [opId]
    );
    return rows.reduce((total, a) => {
        const horas = (parseFloat(a.duracao_min) || 0) / 60;
        const taxa = (parseFloat(a.custo_hora_maquina) || 0) + (parseFloat(a.custo_hora_operador) || 0);
        return total + horas * taxa;
    }, 0);
}

// ─── CSV helpers (importar) ───────────────────────────────────────────────────
function parseBR(str) {
    if (!str) return 0;
    return parseFloat(String(str).trim().replace(/\./g, '').replace(',', '.')) || 0;
}

function parseCSV(text) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const parseRow = (line) => {
        const fields = [];
        let current = '';
        let inQuotes = false;
        for (const ch of line) {
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === ';' && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += ch;
            }
        }
        fields.push(current.trim());
        return fields;
    };
    const headers = parseRow(lines[0]);
    return lines.slice(1).map(line => {
        const vals = parseRow(line);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = vals[i] || '';
        });
        return obj;
    });
}

function parsearDescricaoBlank(descricao) {
    const d = (descricao || '').toUpperCase();
    let material = 'Inox';
    if (d.includes('METAL DURO') || d.includes('METAL-DURO')) material = 'Metal Duro';
    else if (d.includes('CERAMICA') || d.includes('CERÂMICA')) material = 'Cerâmica';
    else if (d.includes('TITANIO') || d.includes('TITÂNIO')) material = 'Titânio';
    else if (d.includes('CARBONO')) material = 'Fibra de Carbono';
    else if (d.includes('ALUMINIO') || d.includes('ALUMÍNIO')) material = 'Alumínio';
    const roscaMatch = d.match(/\bM(\d+(?:[,.]\d+)?)\b/);
    const rosca = roscaMatch ? 'M' + roscaMatch[1].replace('.', ',') : null;
    const corpoMatch = d.match(/Ø[.:\s]*([\d,]+)\s*(?:MM\s*)?X\s*L/);
    const diametro_corpo = corpoMatch ? parseBR(corpoMatch[1]) : null;
    const compMatch = d.match(/X\s*L[.:\s]*([\d,]+)\s*(?:MM)?/);
    const comprimento = compMatch ? parseBR(compMatch[1]) : null;
    const furoMatch = d.match(/ØF[.:\s]*([\d,]+)\s*(?:MM)?/);
    const diametro_furo = furoMatch ? parseBR(furoMatch[1]) : null;
    return {
        material,
        rosca,
        diametro_corpo,
        comprimento,
        diametro_furo
    };
}

function parsearDescricaoEsfera(descricao) {
    const d = (descricao || '').toUpperCase();
    let material = 'Rubi';
    if (d.includes('METAL DURO') || d.includes('METAL-DURO')) material = 'Metal Duro';
    else if (d.includes('CERAMICA') || d.includes('CERÂMICA')) material = 'Cerâmica';
    else if (d.includes('NITRETO') || d.includes('SILICIO') || d.includes('SI3N4')) material = 'Nitreto de Silício';
    else if (d.includes('INOX') || d.includes('ACO')) material = 'Inox';
    else if (d.includes('RUBI') || d.includes('RUBY')) material = 'Rubi';
    const diaMatch = d.match(/Ø[.:\s]*([\d,]+)\s*MM/);
    const diametro = diaMatch ? parseBR(diaMatch[1]) : null;
    const tem_furo = d.includes('COM FURO') || d.includes('C/FURO');
    return {
        material,
        diametro,
        tem_furo
    };
}

// ─── Router ───────────────────────────────────────────────────────────────────
async function route(req, res, slug, rawBody) {
    const [s0, s1, s2, s3] = slug;
    const method = req.method;

    // GET /api/health — também retorna slug para debug
    if (s0 === 'health' || !s0) {
        return res.json({
            status: 'ok',
            version: '2.0.0',
            debug_slug: slug,
            debug_s0: s0,
            debug_query: req.query,
            debug_url: req.url
        });
    }

    // ═══════════════════════════════════════════════════════ BLANKS ══════════
    if (s0 === 'blanks') {
        if (!s1) {
            if (method === 'GET') {
                const {
                    rosca,
                    diametro_furo
                } = req.query;
                let sql = 'SELECT * FROM blanks WHERE 1=1';
                const params = [];
                if (rosca) {
                    params.push(rosca);
                    sql += ` AND rosca = $${params.length}`;
                }
                if (diametro_furo) {
                    params.push(parseFloat(diametro_furo));
                    sql += ` AND diametro_furo = $${params.length}`;
                }
                sql += ' ORDER BY rosca, diametro_corpo';
                return res.json(await query(sql, params));
            }
            if (method === 'POST') {
                const {
                    codigo,
                    descricao,
                    rosca,
                    diametro_corpo,
                    diametro_furo,
                    comprimento,
                    material,
                    custo
                } = req.body;
                if (!codigo || !rosca) return res.status(400).json({
                    erro: 'codigo e rosca são obrigatórios'
                });
                try {
                    const row = await queryOne(
                        `INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
                        [codigo.toUpperCase(), descricao || '', rosca, diametro_corpo || 0, diametro_furo || 0, comprimento || 0, material || 'Inox', custo || 0]
                    );
                    return res.status(201).json({
                        id: row.id,
                        mensagem: 'Blank criado'
                    });
                } catch (err) {
                    if (err.code === '23505') return res.status(409).json({
                        erro: `Código ${codigo} já existe`
                    });
                    throw err;
                }
            }
        } else {
            const id = s1;
            if (method === 'GET') {
                const row = await queryOne('SELECT * FROM blanks WHERE id=$1', [id]);
                if (!row) return res.status(404).json({
                    erro: 'Blank não encontrado'
                });
                return res.json(row);
            }
            if (method === 'PUT') {
                const {
                    codigo,
                    descricao,
                    rosca,
                    diametro_corpo,
                    diametro_furo,
                    comprimento,
                    material,
                    custo
                } = req.body;
                await query(
                    `UPDATE blanks SET codigo=$1, descricao=$2, rosca=$3, diametro_corpo=$4, diametro_furo=$5, comprimento=$6, material=$7, custo=$8 WHERE id=$9`,
                    [codigo.toUpperCase(), descricao || '', rosca, diametro_corpo || 0, diametro_furo || 0, comprimento || 0, material || 'Inox', custo || 0, id]
                );
                return res.json({
                    id: parseInt(id),
                    mensagem: 'Blank atualizado'
                });
            }
            if (method === 'DELETE') {
                const result = await query('DELETE FROM blanks WHERE id=$1 RETURNING id', [id]);
                if (!result.length) return res.status(404).json({
                    erro: 'Blank não encontrado'
                });
                return res.json({
                    mensagem: 'Blank removido'
                });
            }
        }
    }

    // ═══════════════════════════════════════════════════════ HASTES ══════════
    if (s0 === 'hastes') {
        if (!s1) {
            if (method === 'GET') {
                return res.json(await query('SELECT * FROM hastes ORDER BY rosca, comprimento'));
            }
            if (method === 'POST') {
                const {
                    codigo,
                    descricao,
                    rosca,
                    comprimento,
                    diametro,
                    material,
                    custo
                } = req.body;
                if (!codigo || !rosca) return res.status(400).json({
                    erro: 'codigo e rosca são obrigatórios'
                });
                try {
                    const row = await queryOne(
                        `INSERT INTO hastes (codigo, descricao, rosca, comprimento, diametro, material, custo) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
                        [codigo.toUpperCase(), descricao || '', rosca, comprimento || 0, diametro || 0, material || 'Inox', custo || 0]
                    );
                    return res.status(201).json({
                        id: row.id,
                        mensagem: 'Haste criada'
                    });
                } catch (err) {
                    if (err.code === '23505') return res.status(409).json({
                        erro: `Código ${codigo} já existe`
                    });
                    throw err;
                }
            }
        } else {
            const id = s1;
            if (method === 'GET') {
                const row = await queryOne('SELECT * FROM hastes WHERE id=$1', [id]);
                if (!row) return res.status(404).json({
                    erro: 'Haste não encontrada'
                });
                return res.json(row);
            }
            if (method === 'PUT') {
                const {
                    codigo,
                    descricao,
                    rosca,
                    comprimento,
                    diametro,
                    material,
                    custo
                } = req.body;
                await query(
                    `UPDATE hastes SET codigo=$1, descricao=$2, rosca=$3, comprimento=$4, diametro=$5, material=$6, custo=$7 WHERE id=$8`,
                    [codigo.toUpperCase(), descricao || '', rosca, comprimento || 0, diametro || 0, material || 'Inox', custo || 0, id]
                );
                return res.json({
                    id: parseInt(id),
                    mensagem: 'Haste atualizada'
                });
            }
            if (method === 'DELETE') {
                const result = await query('DELETE FROM hastes WHERE id=$1 RETURNING id', [id]);
                if (!result.length) return res.status(404).json({
                    erro: 'Haste não encontrada'
                });
                return res.json({
                    mensagem: 'Haste removida'
                });
            }
        }
    }

    // ═══════════════════════════════════════════════════════ ESFERAS ═════════
    if (s0 === 'esferas') {
        if (!s1) {
            if (method === 'GET') {
                return res.json(await query('SELECT * FROM esferas ORDER BY material, diametro'));
            }
            if (method === 'POST') {
                const {
                    codigo,
                    descricao,
                    material,
                    diametro,
                    tem_furo,
                    custo
                } = req.body;
                if (!codigo || !material) return res.status(400).json({
                    erro: 'codigo e material são obrigatórios'
                });
                try {
                    const row = await queryOne(
                        `INSERT INTO esferas (codigo, descricao, material, diametro, tem_furo, custo) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
                        [codigo.toUpperCase(), descricao || '', material, diametro || 0, tem_furo ? 1 : 0, custo || 0]
                    );
                    return res.status(201).json({
                        id: row.id,
                        mensagem: 'Esfera criada'
                    });
                } catch (err) {
                    if (err.code === '23505') return res.status(409).json({
                        erro: `Código ${codigo} já existe`
                    });
                    throw err;
                }
            }
        } else {
            const id = s1;
            if (method === 'GET') {
                const row = await queryOne('SELECT * FROM esferas WHERE id=$1', [id]);
                if (!row) return res.status(404).json({
                    erro: 'Esfera não encontrada'
                });
                return res.json(row);
            }
            if (method === 'PUT') {
                const {
                    codigo,
                    descricao,
                    material,
                    diametro,
                    tem_furo,
                    custo
                } = req.body;
                await query(
                    `UPDATE esferas SET codigo=$1, descricao=$2, material=$3, diametro=$4, tem_furo=$5, custo=$6 WHERE id=$7`,
                    [codigo.toUpperCase(), descricao || '', material, diametro || 0, tem_furo ? 1 : 0, custo || 0, id]
                );
                return res.json({
                    id: parseInt(id),
                    mensagem: 'Esfera atualizada'
                });
            }
            if (method === 'DELETE') {
                const result = await query('DELETE FROM esferas WHERE id=$1 RETURNING id', [id]);
                if (!result.length) return res.status(404).json({
                    erro: 'Esfera não encontrada'
                });
                return res.json({
                    mensagem: 'Esfera removida'
                });
            }
        }
    }

    // ═══════════════════════════════════════════════════ MAO-DE-OBRA ══════════
    if (s0 === 'mao-de-obra') {
        if (!s1) {
            if (method === 'GET') {
                return res.json(await query('SELECT * FROM mao_de_obra ORDER BY descricao'));
            }
            if (method === 'POST') {
                const {
                    codigo,
                    descricao,
                    tipo,
                    custo_hora,
                    custo_por_unidade
                } = req.body;
                if (!codigo || !descricao) return res.status(400).json({
                    erro: 'codigo e descricao são obrigatórios'
                });
                try {
                    const row = await queryOne(
                        `INSERT INTO mao_de_obra (codigo, descricao, tipo, custo_hora, custo_por_unidade) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
                        [codigo.toUpperCase(), descricao, tipo || 'hora', custo_hora || 0, custo_por_unidade || 0]
                    );
                    return res.status(201).json({
                        id: row.id,
                        mensagem: 'Mão de obra criada'
                    });
                } catch (err) {
                    if (err.code === '23505') return res.status(409).json({
                        erro: `Código ${codigo} já existe`
                    });
                    throw err;
                }
            }
        } else {
            const id = s1;
            if (method === 'GET') {
                const row = await queryOne('SELECT * FROM mao_de_obra WHERE id=$1', [id]);
                if (!row) return res.status(404).json({
                    erro: 'Mão de obra não encontrada'
                });
                return res.json(row);
            }
            if (method === 'PUT') {
                const {
                    codigo,
                    descricao,
                    tipo,
                    custo_hora,
                    custo_por_unidade
                } = req.body;
                await query(
                    `UPDATE mao_de_obra SET codigo=$1, descricao=$2, tipo=$3, custo_hora=$4, custo_por_unidade=$5 WHERE id=$6`,
                    [codigo.toUpperCase(), descricao, tipo || 'hora', custo_hora || 0, custo_por_unidade || 0, id]
                );
                return res.json({
                    id: parseInt(id),
                    mensagem: 'Mão de obra atualizada'
                });
            }
            if (method === 'DELETE') {
                const result = await query('DELETE FROM mao_de_obra WHERE id=$1 RETURNING id', [id]);
                if (!result.length) return res.status(404).json({
                    erro: 'Mão de obra não encontrada'
                });
                return res.json({
                    mensagem: 'Mão de obra removida'
                });
            }
        }
    }

    // ═══════════════════════════════════════════════════════ PRODUTOS ═════════
    if (s0 === 'produtos') {
        if (!s1) {
            if (method === 'GET') {
                const conditions = ['1=1'];
                const params = [];
                if (req.query.tipo) {
                    conditions.push(`p.tipo = $${params.length + 1}`);
                    params.push(req.query.tipo);
                }
                if (req.query.rosca) {
                    conditions.push(`p.rosca = $${params.length + 1}`);
                    params.push(req.query.rosca);
                }
                if (req.query.status) {
                    conditions.push(`p.status = $${params.length + 1}`);
                    params.push(req.query.status);
                }
                if (req.query.q) {
                    const t = `%${req.query.q}%`;
                    conditions.push(`(p.codigo ILIKE $${params.length + 1} OR p.nome ILIKE $${params.length + 2})`);
                    params.push(t, t);
                }
                return res.json(await query(
                    `SELECT p.*,
             EXISTS(SELECT 1 FROM produto_componentes pc WHERE pc.produto_id = p.id) AS tem_composicao,
             (SELECT COUNT(*) FROM produto_componentes pc WHERE pc.produto_id = p.id) AS quantidade_componentes
           FROM produtos p WHERE ${conditions.join(' AND ')} ORDER BY p.codigo`,
                    params
                ));
            }
            if (method === 'POST') {
                const {
                    codigo,
                    nome,
                    tipo,
                    rosca,
                    comprimento_total,
                    diametro_esfera,
                    preco_venda,
                    margem,
                    observacoes,
                    componentes = []
                } = req.body;
                if (!codigo || !nome || !tipo) return res.status(400).json({
                    erro: 'Campos obrigatórios: codigo, nome, tipo'
                });
                const client = await getPool2().connect();
                try {
                    await client.query('BEGIN');
                    const {
                        rows: [{
                            id: produtoId
                        }]
                    } = await client.query(
                        `INSERT INTO produtos (codigo, nome, tipo, rosca, comprimento_total, diametro_esfera, preco_venda, margem, observacoes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
                        [codigo, nome, tipo, rosca || null, comprimento_total || null, diametro_esfera || null, preco_venda || 0, margem || 0, observacoes || null]
                    );
                    for (const c of componentes) {
                        await client.query(
                            `INSERT INTO produto_componentes (produto_id, tipo_componente, ref_id, codigo_componente, nome_componente, quantidade, custo_unitario, bling_id, bling_codigo)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                            [produtoId, c.tipo_componente, c.ref_id || null, c.codigo_componente, c.nome_componente, c.quantidade, c.custo_unitario || 0, c.bling_id || null, c.bling_codigo || null]
                        );
                    }
                    await recalcularCusto(client, produtoId);
                    await client.query('COMMIT');
                    const produto = await queryOne('SELECT * FROM produtos WHERE id=$1', [produtoId]);
                    const comps = await query('SELECT * FROM produto_componentes WHERE produto_id=$1', [produtoId]);
                    return res.status(201).json({
                        ...produto,
                        componentes: comps
                    });
                } catch (err) {
                    await client.query('ROLLBACK');
                    if (err.code === '23505') return res.status(409).json({
                        erro: `Código ${codigo} já existe`
                    });
                    throw err;
                } finally {
                    client.release();
                }
            }
        } else {
            const id = s1;
            if (method === 'GET') {
                const produto = await queryOne('SELECT * FROM produtos WHERE id=$1', [id]);
                if (!produto) return res.status(404).json({
                    erro: 'Produto não encontrado'
                });
                const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id=$1 ORDER BY id', [id]);
                return res.json({
                    ...produto,
                    componentes
                });
            }
            if (method === 'PUT') {
                const {
                    codigo,
                    nome,
                    tipo,
                    rosca,
                    comprimento_total,
                    diametro_esfera,
                    preco_venda,
                    margem,
                    status,
                    observacoes,
                    componentes = []
                } = req.body;
                const client = await getPool2().connect();
                try {
                    await client.query('BEGIN');
                    await client.query(
                        `UPDATE produtos SET codigo=$1, nome=$2, tipo=$3, rosca=$4, comprimento_total=$5, diametro_esfera=$6, preco_venda=$7, margem=$8, status=$9, observacoes=$10, updated_at=NOW() WHERE id=$11`,
                        [codigo, nome, tipo, rosca || null, comprimento_total || null, diametro_esfera || null, preco_venda || 0, margem || 0, status || 'ativo', observacoes || null, id]
                    );
                    await client.query('DELETE FROM produto_componentes WHERE produto_id=$1', [id]);
                    for (const c of componentes) {
                        await client.query(
                            `INSERT INTO produto_componentes (produto_id, tipo_componente, ref_id, codigo_componente, nome_componente, quantidade, custo_unitario, bling_id, bling_codigo)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                            [id, c.tipo_componente, c.ref_id || null, c.codigo_componente, c.nome_componente, c.quantidade, c.custo_unitario || 0, c.bling_id || null, c.bling_codigo || null]
                        );
                    }
                    await recalcularCusto(client, id);
                    await client.query('COMMIT');
                    return res.json({
                        id: parseInt(id),
                        mensagem: 'Produto atualizado'
                    });
                } catch (err) {
                    await client.query('ROLLBACK');
                    throw err;
                } finally {
                    client.release();
                }
            }
            if (method === 'DELETE') {
                const client = await getPool2().connect();
                try {
                    await client.query('BEGIN');
                    await client.query('DELETE FROM produto_componentes WHERE produto_id=$1', [id]);
                    const result = await client.query('DELETE FROM produtos WHERE id=$1 RETURNING id', [id]);
                    await client.query('COMMIT');
                    if (!result.rows.length) return res.status(404).json({
                        erro: 'Produto não encontrado'
                    });
                    return res.json({
                        mensagem: 'Produto removido'
                    });
                } catch (err) {
                    await client.query('ROLLBACK');
                    throw err;
                } finally {
                    client.release();
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════ COMPOSICOES ══════════
    if (s0 === 'composicoes') {
        if (s1 === 'sugerir-blank' && method === 'POST') {
            const {
                rosca,
                diametro_furo
            } = req.body;
            if (!rosca) return res.status(400).json({
                erro: 'rosca é obrigatória'
            });
            let sql = 'SELECT * FROM blanks WHERE rosca=$1';
            const params = [rosca];
            if (diametro_furo !== undefined && diametro_furo !== null) {
                sql += ` AND diametro_furo = $${params.length + 1}`;
                params.push(parseFloat(diametro_furo));
            }
            sql += ' ORDER BY diametro_corpo, comprimento';
            return res.json(await query(sql, params));
        }
        if (s1 === 'calcular-haste' && method === 'POST') {
            const {
                comprimento_total,
                blank_id,
                diametro_esfera
            } = req.body;
            if (!comprimento_total || !blank_id) return res.status(400).json({
                erro: 'comprimento_total e blank_id são obrigatórios'
            });
            const blank = await queryOne('SELECT * FROM blanks WHERE id=$1', [blank_id]);
            if (!blank) return res.status(404).json({
                erro: 'Blank não encontrado'
            });
            const raio = diametro_esfera ? parseFloat(diametro_esfera) / 2 : 0;
            const comprimento_haste = parseFloat(comprimento_total) - parseFloat(blank.comprimento) - raio;
            return res.json({
                comprimento_haste: Math.max(0, comprimento_haste),
                raio_esfera: raio
            });
        }
        if (s1 === 'calcular-custo' && method === 'POST') {
            const {
                componentes = [], margem = 0
            } = req.body;
            const custo_total = componentes.reduce((acc, c) => acc + parseFloat(c.quantidade || 0) * parseFloat(c.custo_unitario || 0), 0);
            const preco_sugerido = custo_total * (1 + parseFloat(margem) / 100);
            return res.json({
                custo_total,
                preco_sugerido,
                margem_calculada: parseFloat(margem)
            });
        }
        if (s1 && !s2) {
            // GET /api/composicoes/:produtoId
            const produtoId = s1;
            if (method === 'GET') {
                const produto = await queryOne('SELECT * FROM produtos WHERE id=$1', [produtoId]);
                if (!produto) return res.status(404).json({
                    erro: 'Produto não encontrado'
                });
                const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id=$1 ORDER BY id', [produtoId]);
                const custo_total = componentes.reduce((acc, c) => acc + parseFloat(c.quantidade) * parseFloat(c.custo_unitario), 0);
                const margem_calculada = produto.preco_venda > 0 ? ((parseFloat(produto.preco_venda) - custo_total) / custo_total) * 100 : 0;
                return res.json({
                    ...produto,
                    componentes,
                    custo_total,
                    margem_calculada
                });
            }
        }
    }

    // ══════════════════════════════════════════════════ CONFIGURACOES ══════════
    if (s0 === 'configuracoes' && !s1) {
        if (method === 'GET') {
            const rows = await query('SELECT chave, valor FROM configuracoes ORDER BY chave');
            const config = Object.fromEntries(rows.map(r => [r.chave, r.valor]));
            return res.json(config);
        }
        if (method === 'PUT') {
            const configs = req.body;
            for (const [chave, valor] of Object.entries(configs)) {
                await query(
                    `INSERT INTO configuracoes (chave, valor) VALUES ($1,$2) ON CONFLICT (chave) DO UPDATE SET valor=EXCLUDED.valor`,
                    [chave, String(valor)]
                );
            }
            return res.json({
                mensagem: 'Configurações salvas'
            });
        }
    }

    // ═══════════════════════════════════════════════════════ IMPORTAR ═════════
    if (s0 === 'importar') {
        if (!rawBody) return res.status(400).json({
            erro: 'Envie o CSV no body da requisição'
        });

        if (s1 === 'blanks' && method === 'POST') {
            const rows = parseCSV(rawBody);
            if (!rows.length) return res.status(400).json({
                erro: 'CSV vazio ou inválido'
            });
            const resultados = {
                importados: 0,
                atualizados: 0,
                erros: [],
                ignorados: 0
            };
            for (const row of rows) {
                const blingId = (row['ID'] || '').trim();
                const codigo = (row['Código'] || '').trim();
                const descricao = (row['Descrição'] || '').trim();
                const custoBling = parseBR(row['Preço de custo']);
                if (!codigo || !blingId) {
                    resultados.ignorados++;
                    continue;
                }
                const specs = parsearDescricaoBlank(descricao);
                if (!specs.rosca) {
                    resultados.ignorados++;
                    continue;
                }
                try {
                    await query(
                        `INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT (codigo) DO UPDATE SET
               descricao=EXCLUDED.descricao, rosca=EXCLUDED.rosca,
               diametro_corpo=EXCLUDED.diametro_corpo, diametro_furo=EXCLUDED.diametro_furo,
               comprimento=EXCLUDED.comprimento, material=EXCLUDED.material,
               custo=CASE WHEN EXCLUDED.custo > 0 THEN EXCLUDED.custo ELSE blanks.custo END,
               bling_id=EXCLUDED.bling_id, bling_codigo=EXCLUDED.bling_codigo`,
                        [codigo, descricao, specs.rosca, specs.diametro_corpo ? ? 0, specs.diametro_furo ? ? 0, specs.comprimento ? ? 0, specs.material, custoBling, blingId, codigo]
                    );
                    resultados.importados++;
                } catch (err) {
                    resultados.erros.push(`${codigo}: ${err.message}`);
                }
            }
            return res.json({
                mensagem: `Importação concluída: ${resultados.importados} blanks processados`,
                total_csv: rows.length,
                ...resultados
            });
        }

        if (s1 === 'esferas' && method === 'POST') {
            const rows = parseCSV(rawBody);
            if (!rows.length) return res.status(400).json({
                erro: 'CSV vazio ou inválido'
            });
            const resultados = {
                importados: 0,
                erros: [],
                ignorados: 0
            };
            for (const row of rows) {
                const blingId = (row['ID'] || '').trim();
                const codigo = (row['Código'] || '').trim();
                const descricao = (row['Descrição'] || '').trim();
                const custoBling = parseBR(row['Preço de custo']);
                if (!codigo || !blingId) {
                    resultados.ignorados++;
                    continue;
                }
                const specs = parsearDescricaoEsfera(descricao);
                if (!specs.diametro) {
                    resultados.ignorados++;
                    continue;
                }
                try {
                    await query(
                        `INSERT INTO esferas (codigo, descricao, material, diametro, tem_furo, custo, bling_id, bling_codigo)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             ON CONFLICT (codigo) DO UPDATE SET
               descricao=EXCLUDED.descricao, material=EXCLUDED.material,
               diametro=EXCLUDED.diametro, tem_furo=EXCLUDED.tem_furo,
               custo=CASE WHEN EXCLUDED.custo > 0 THEN EXCLUDED.custo ELSE esferas.custo END,
               bling_id=EXCLUDED.bling_id, bling_codigo=EXCLUDED.bling_codigo`,
                        [codigo, descricao, specs.material, specs.diametro, specs.tem_furo ? 1 : 0, custoBling, blingId, codigo]
                    );
                    resultados.importados++;
                } catch (err) {
                    resultados.erros.push(`${codigo}: ${err.message}`);
                }
            }
            return res.json({
                mensagem: `Importação concluída: ${resultados.importados} esferas processadas`,
                total_csv: rows.length,
                ...resultados
            });
        }
    }

    // ══════════════════════════════════════════════ CENTROS-TRABALHO ══════════
    if (s0 === 'centros-trabalho') {
        if (!s1) {
            if (method === 'GET') {
                return res.json(await query('SELECT * FROM centros_trabalho ORDER BY codigo'));
            }
            if (method === 'POST') {
                const {
                    codigo,
                    nome,
                    custo_hora_maquina,
                    custo_hora_operador,
                    status,
                    observacoes
                } = req.body;
                if (!codigo || !nome) return res.status(400).json({
                    erro: 'codigo e nome são obrigatórios'
                });
                try {
                    const row = await queryOne(
                        `INSERT INTO centros_trabalho (codigo, nome, custo_hora_maquina, custo_hora_operador, status, observacoes)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
                        [codigo.toUpperCase(), nome, custo_hora_maquina || 0, custo_hora_operador || 0, status || 'ativo', observacoes || '']
                    );
                    return res.status(201).json({
                        id: row.id,
                        mensagem: 'Centro criado'
                    });
                } catch (err) {
                    if (err.code === '23505') return res.status(409).json({
                        erro: `Código ${codigo} já existe`
                    });
                    throw err;
                }
            }
        } else {
            const id = s1;
            if (method === 'PUT') {
                const {
                    nome,
                    custo_hora_maquina,
                    custo_hora_operador,
                    status,
                    observacoes
                } = req.body;
                await query(
                    `UPDATE centros_trabalho SET nome=$1, custo_hora_maquina=$2, custo_hora_operador=$3, status=$4, observacoes=$5 WHERE id=$6`,
                    [nome, custo_hora_maquina || 0, custo_hora_operador || 0, status || 'ativo', observacoes || '', id]
                );
                return res.json({
                    id: parseInt(id),
                    mensagem: 'Centro atualizado'
                });
            }
            if (method === 'DELETE') {
                const result = await query('DELETE FROM centros_trabalho WHERE id=$1 RETURNING id', [id]);
                if (!result.length) return res.status(404).json({
                    erro: 'Centro não encontrado'
                });
                return res.json({
                    mensagem: 'Centro removido'
                });
            }
        }
    }

    // ══════════════════════════════════════════════ ORDENS-PRODUCAO ═══════════
    if (s0 === 'ordens-producao') {
        if (!s1) {
            if (method === 'GET') {
                return res.json(await query(
                    `SELECT op.*, COUNT(DISTINCT a.id) AS total_apontamentos,
             SUM(CASE WHEN a.status='em_andamento' THEN 1 ELSE 0 END) AS apontamentos_ativos
           FROM ordens_producao op LEFT JOIN apontamentos a ON a.op_id = op.id
           GROUP BY op.id ORDER BY op.created_at DESC`
                ));
            }
            if (method === 'POST') {
                const {
                    produto_codigo,
                    produto_nome,
                    quantidade,
                    bling_produto_id,
                    bling_pedido_id,
                    bling_pedido_numero,
                    custo_material,
                    observacoes
                } = req.body;
                if (!produto_codigo) return res.status(400).json({
                    erro: 'produto_codigo é obrigatório'
                });
                const numero = await gerarNumeroOP();
                const row = await queryOne(
                    `INSERT INTO ordens_producao (numero, produto_codigo, produto_nome, quantidade, bling_produto_id, bling_pedido_id, bling_pedido_numero, custo_material, observacoes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
                    [numero, produto_codigo, produto_nome || '', quantidade || 1, bling_produto_id || '', bling_pedido_id || '', bling_pedido_numero || '', custo_material || 0, observacoes || '']
                );
                return res.status(201).json({
                    id: row.id,
                    numero,
                    mensagem: 'OP criada com sucesso'
                });
            }
        } else if (s1 && !s2) {
            // /ordens-producao/:id
            const id = s1;
            if (method === 'GET') {
                const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [id]);
                if (!op) return res.status(404).json({
                    erro: 'OP não encontrada'
                });
                const apontamentos = await query(
                    `SELECT a.*, ct.nome AS centro_nome, ct.custo_hora_maquina, ct.custo_hora_operador
           FROM apontamentos a LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
           WHERE a.op_id=$1 ORDER BY a.inicio DESC`,
                    [id]
                );
                return res.json({
                    ...op,
                    apontamentos
                });
            }
            if (method === 'PUT') {
                const {
                    produto_nome,
                    quantidade,
                    status,
                    custo_material,
                    observacoes
                } = req.body;
                await query(
                    `UPDATE ordens_producao SET produto_nome=$1, quantidade=$2, status=$3, custo_material=$4, observacoes=$5 WHERE id=$6`,
                    [produto_nome || '', quantidade || 1, status, custo_material || 0, observacoes || '', id]
                );
                return res.json({
                    mensagem: 'OP atualizada'
                });
            }
            if (method === 'DELETE') {
                await query('DELETE FROM apontamentos WHERE op_id=$1', [id]);
                const result = await query('DELETE FROM ordens_producao WHERE id=$1 RETURNING id', [id]);
                if (!result.length) return res.status(404).json({
                    erro: 'OP não encontrada'
                });
                return res.json({
                    mensagem: 'OP removida'
                });
            }
        } else if (s2 === 'iniciar' && method === 'POST') {
            const id = s1;
            const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [id]);
            if (!op) return res.status(404).json({
                erro: 'OP não encontrada'
            });
            await query(`UPDATE ordens_producao SET status='em_producao', data_inicio=COALESCE(data_inicio,NOW()) WHERE id=$1`, [id]);
            return res.json({
                mensagem: 'OP iniciada'
            });
        } else if (s2 === 'concluir' && method === 'POST') {
            const id = s1;
            const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [id]);
            if (!op) return res.status(404).json({
                erro: 'OP não encontrada'
            });
            await query(
                `UPDATE apontamentos SET status='concluido', fim=NOW(), duracao_min=ROUND(EXTRACT(EPOCH FROM (NOW()-inicio))/60,2)
         WHERE op_id=$1 AND status='em_andamento'`,
                [id]
            );
            const custo_processo = await calcularCustoProcesso(id);
            const custo_real = (parseFloat(op.custo_material) || 0) + custo_processo;
            await query(
                `UPDATE ordens_producao SET status='concluida', custo_processo=$1, custo_real=$2, data_fim=NOW() WHERE id=$3`,
                [custo_processo, custo_real, id]
            );
            return res.json({
                mensagem: 'OP concluída com sucesso',
                custo_real,
                custo_processo,
                custo_material: parseFloat(op.custo_material) || 0
            });
        }
    }

    // ═══════════════════════════════════════════════════ APONTAMENTOS ═════════
    if (s0 === 'apontamentos') {
        if (!s1 && method === 'POST') {
            const {
                op_id,
                centro_id,
                operacao,
                tipo
            } = req.body;
            if (!op_id) return res.status(400).json({
                erro: 'op_id é obrigatório'
            });
            if (centro_id) {
                const ativo = await queryOne(`SELECT id FROM apontamentos WHERE centro_id=$1 AND status='em_andamento'`, [centro_id]);
                if (ativo) return res.status(409).json({
                    erro: 'Centro de trabalho já possui apontamento em andamento'
                });
            }
            await query(
                `UPDATE ordens_producao SET status='em_producao', data_inicio=COALESCE(data_inicio,NOW()) WHERE id=$1 AND status='planejada'`,
                [op_id]
            );
            const row = await queryOne(
                `INSERT INTO apontamentos (op_id, centro_id, operacao, tipo) VALUES ($1,$2,$3,$4) RETURNING id`,
                [op_id, centro_id || null, operacao || 'Produção', tipo || 'producao']
            );
            return res.status(201).json({
                id: row.id,
                mensagem: 'Apontamento iniciado'
            });
        }
        if (s1 === 'op' && s2 && method === 'GET') {
            // GET /api/apontamentos/op/:opId
            return res.json(await query(
                `SELECT a.*, ct.nome AS centro_nome, ct.custo_hora_maquina, ct.custo_hora_operador
         FROM apontamentos a LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
         WHERE a.op_id=$1 ORDER BY a.inicio DESC`,
                [s2]
            ));
        }
        if (s1 && s2 === 'concluir' && method === 'PUT') {
            const id = s1;
            const {
                qty_produzida,
                qty_refugo,
                observacoes
            } = req.body;
            const apt = await queryOne(
                `SELECT a.*, ct.custo_hora_maquina, ct.custo_hora_operador FROM apontamentos a LEFT JOIN centros_trabalho ct ON ct.id=a.centro_id WHERE a.id=$1`,
                [id]
            );
            if (!apt) return res.status(404).json({
                erro: 'Apontamento não encontrado'
            });
            const durMin = await queryOne(`SELECT ROUND(EXTRACT(EPOCH FROM (NOW()-$1::timestamptz))/60,2) AS min`, [apt.inicio]);
            const duracao_min = parseFloat(durMin.min) || 0;
            const custo_calculado = (duracao_min / 60) * ((parseFloat(apt.custo_hora_maquina) || 0) + (parseFloat(apt.custo_hora_operador) || 0));
            await query(
                `UPDATE apontamentos SET status='concluido', fim=NOW(), duracao_min=$1, qty_produzida=$2, qty_refugo=$3, custo_calculado=$4, observacoes=$5 WHERE id=$6`,
                [duracao_min, qty_produzida || 0, qty_refugo || 0, custo_calculado, observacoes || '', id]
            );
            return res.json({
                mensagem: 'Apontamento concluído',
                duracao_min,
                custo_calculado
            });
        }
        if (s1 && s2 === 'pausar' && method === 'PUT') {
            const id = s1;
            const {
                motivo_parada
            } = req.body;
            const apt = await queryOne('SELECT * FROM apontamentos WHERE id=$1', [id]);
            if (!apt) return res.status(404).json({
                erro: 'Apontamento não encontrado'
            });
            const durMin = await queryOne(`SELECT ROUND(EXTRACT(EPOCH FROM (NOW()-$1::timestamptz))/60,2) AS min`, [apt.inicio]);
            await query(
                `UPDATE apontamentos SET status='concluido', tipo='parada', motivo_parada=$1, fim=NOW(), duracao_min=$2 WHERE id=$3`,
                [motivo_parada || '', parseFloat(durMin.min) || 0, id]
            );
            return res.json({
                mensagem: 'Apontamento pausado',
                duracao_min: parseFloat(durMin.min)
            });
        }
    }

    // ═══════════════════════════════════════════════════════ BLING ════════════
    if (s0 === 'bling') {
        // ── Auth ──────────────────────────────────────────────────────────────
        if (s1 === 'auth') {
            if (s2 === 'url' && method === 'GET') {
                const {
                    clientId,
                    configured
                } = getOAuthConfig();
                if (!configured) return res.json({
                    url: '',
                    configurado: false,
                    detalhe: 'Configure BLING_CLIENT_ID e BLING_CLIENT_SECRET nas variáveis de ambiente'
                });
                const backendUrl = getBackendUrl();
                const redirectUri = encodeURIComponent(`${backendUrl}/api/bling/auth/callback`);
                const url = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=composicao&redirect_uri=${redirectUri}`;
                return res.json({
                    url,
                    configurado: true
                });
            }
            if (s2 === 'callback' && method === 'GET') {
                const {
                    code
                } = req.query;
                if (!code) return res.status(400).send('Parâmetro "code" não encontrado');
                const {
                    clientId,
                    clientSecret,
                    configured
                } = getOAuthConfig();
                if (!configured) return res.status(500).json({
                    erro: 'Credenciais Bling não configuradas'
                });
                const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
                try {
                    const resp = await axios.post(
                        `${BLING_API}/oauth/token`,
                        new URLSearchParams({
                            grant_type: 'authorization_code',
                            code,
                            redirect_uri: `${getBackendUrl()}/api/bling/auth/callback`
                        }), {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `Basic ${credentials}`
                            }
                        }
                    );
                    await saveTokens(resp.data);
                    return res.redirect(`${getFrontendUrl()}/configuracoes?bling=ok`);
                } catch (err) {
                    return res.status(500).json({
                        erro: 'Falha na autenticação Bling',
                        detalhe: err.response ? .data || err.message
                    });
                }
            }
            if (s2 === 'token-manual' && method === 'POST') {
                const {
                    access_token,
                    refresh_token,
                    expires_in
                } = req.body;
                if (!access_token) return res.status(400).json({
                    erro: 'access_token obrigatório'
                });
                await saveTokens({
                    access_token,
                    refresh_token: refresh_token || '',
                    expires_in: expires_in || 21600
                });
                return res.json({
                    mensagem: 'Token salvo com sucesso'
                });
            }
            if (s2 === 'status' && method === 'GET') {
                const tokens = await getTokens();
                const expiry = tokens.bling_token_expiry ? new Date(tokens.bling_token_expiry) : null;
                return res.json({
                    configurado: !!tokens.bling_access_token,
                    valido: expiry ? expiry > new Date() : false,
                    expira_em: expiry ? expiry.toISOString() : null
                });
            }
        }

        // ── Produtos Bling ────────────────────────────────────────────────────
        if (s1 === 'produtos') {
            const token = await obterAccessToken();
            if (!s2) {
                if (method === 'GET') {
                    const params = {
                        pagina: 1,
                        limite: 100
                    };
                    if (req.query.q) params.criterio = req.query.q;
                    const resp = await blingClient(token).get('/produtos', {
                        params
                    });
                    return res.json(resp.data);
                }
            } else {
                if (method === 'GET') {
                    const resp = await blingClient(token).get(`/produtos/${s2}`);
                    return res.json(resp.data);
                }
            }
        }

        // ── Sincronizar produto local → Bling ─────────────────────────────────
        if (s1 === 'sincronizar' && s2 && method === 'POST') {
            const produtoId = s2;
            const produto = await queryOne('SELECT * FROM produtos WHERE id=$1', [produtoId]);
            if (!produto) return res.status(404).json({
                erro: 'Produto não encontrado'
            });
            const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id=$1', [produtoId]);
            const payload = {
                nome: produto.nome,
                codigo: produto.codigo,
                tipo: 'P',
                situacao: 'A',
                estrutura: {
                    tipo: 'F',
                    componentes: componentes.map(c => ({
                        produto: {
                            codigo: c.bling_codigo || c.codigo_componente
                        },
                        quantidade: c.quantidade
                    }))
                }
            };
            const token = await obterAccessToken();
            const client = blingClient(token);
            let blingId = produto.bling_id;
            let respData;
            if (blingId) {
                const resp = await client.patch(`/produtos/${blingId}`, payload);
                respData = resp.data;
            } else {
                const resp = await client.post('/produtos', payload);
                respData = resp.data;
                blingId = respData ? .data ? .id;
                if (blingId) await query('UPDATE produtos SET bling_id=$1, status=$2 WHERE id=$3', [String(blingId), 'sincronizado', produtoId]);
            }
            await query('UPDATE produtos SET status=$1, updated_at=NOW() WHERE id=$2', ['sincronizado', produtoId]);
            return res.json({
                mensagem: 'Produto sincronizado com Bling',
                bling_id: blingId,
                resposta: respData
            });
        }

        // ── Importar produto do Bling → local ─────────────────────────────────
        if (s1 === 'importar' && s2 && method === 'POST') {
            const token = await obterAccessToken();
            const resp = await blingClient(token).get(`/produtos/${s2}`);
            const p = resp.data ? .data;
            if (!p) return res.status(404).json({
                erro: 'Produto não encontrado no Bling'
            });
            const existente = await queryOne('SELECT id FROM produtos WHERE codigo=$1', [p.codigo]);
            if (existente) return res.status(409).json({
                erro: `Produto ${p.codigo} já existe localmente`,
                id: existente.id
            });
            const prefixos = ['PM', 'EM', 'AM', 'SM', 'DM', 'BM', 'CM'];
            const tipo = prefixos.find(k => p.codigo ? .toUpperCase().startsWith(k)) || 'PM';
            const row = await queryOne(`INSERT INTO produtos (codigo, nome, tipo, bling_id, status) VALUES ($1,$2,$3,$4,'sincronizado') RETURNING id`, [p.codigo, p.nome, tipo, String(p.id)]);
            return res.status(201).json({
                mensagem: 'Importado com sucesso',
                id: row.id
            });
        }

        // ── Pedidos ───────────────────────────────────────────────────────────
        if (s1 === 'pedidos') {
            const token = await obterAccessToken();
            if (!s2) {
                if (method === 'GET') {
                    const params = {
                        pagina: 1,
                        limite: 100
                    };
                    if (req.query.situacao) params.situacao = req.query.situacao;
                    const resp = await blingClient(token).get('/pedidos/vendas', {
                        params
                    });
                    return res.json(resp.data);
                }
            } else {
                if (method === 'GET') {
                    const resp = await blingClient(token).get(`/pedidos/vendas/${s2}`);
                    return res.json(resp.data);
                }
            }
        }

        // ── Blanks Bling ──────────────────────────────────────────────────────
        if (s1 === 'blanks') {
            // POST /api/bling/blanks/importar/:blingId
            if (s2 === 'importar' && s3 && method === 'POST') {
                const token = await obterAccessToken();
                const resp = await blingClient(token).get(`/produtos/${s3}`);
                const p = resp.data ? .data;
                if (!p) return res.status(404).json({
                    erro: 'Produto não encontrado no Bling'
                });
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
                return res.status(201).json({
                    mensagem: 'Blank importado com sucesso'
                });
            }
            // POST /api/bling/blanks/:blankId/sincronizar
            if (s2 && s3 === 'sincronizar' && method === 'POST') {
                const blank = await queryOne('SELECT * FROM blanks WHERE id=$1', [s2]);
                if (!blank) return res.status(404).json({
                    erro: 'Blank não encontrado'
                });
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
                    blingId = resp.data ? .data ? .id;
                    if (blingId) await query('UPDATE blanks SET bling_id=$1, bling_codigo=$2 WHERE id=$3', [String(blingId), blank.codigo, s2]);
                }
                return res.json({
                    mensagem: 'Blank sincronizado com Bling',
                    bling_id: blingId
                });
            }
        }

    }

    return res.status(404).json({
        erro: 'Rota não encontrada',
        debug_slug: slug,
        debug_s0: s0,
        debug_s1: s1,
        debug_method: method,
        debug_url: req.url
    });
}