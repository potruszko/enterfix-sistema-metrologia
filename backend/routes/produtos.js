const express = require('express');
const router = express.Router();
const db = require('../db');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Recalcula e persiste o custo total de um produto a partir dos seus componentes */
function recalcularCusto(produtoId) {
    const componentes = db.prepare(
        'SELECT quantidade, custo_unitario FROM produto_componentes WHERE produto_id = ?'
    ).all(produtoId);

    const total = componentes.reduce((acc, c) => acc + c.quantidade * c.custo_unitario, 0);
    db.prepare('UPDATE produtos SET custo_total = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(total, produtoId);
    return total;
}

// ─── GET ──────────────────────────────────────────────────────────────────────

// GET /api/produtos?tipo=PM&rosca=M2&status=rascunho
router.get('/', (req, res) => {
    let query = `
        SELECT
            p.*,
            EXISTS(
                SELECT 1
                FROM produto_componentes pc
                WHERE pc.produto_id = p.id
            ) AS tem_composicao,
            (
                SELECT COUNT(*)
                FROM produto_componentes pc
                WHERE pc.produto_id = p.id
            ) AS quantidade_componentes
        FROM produtos p
        WHERE 1=1
    `;
    const params = [];

    if (req.query.tipo) {
        query += ' AND p.tipo = ?';
        params.push(req.query.tipo);
    }
    if (req.query.rosca) {
        query += ' AND p.rosca = ?';
        params.push(req.query.rosca);
    }
    if (req.query.status) {
        query += ' AND p.status = ?';
        params.push(req.query.status);
    }
    if (req.query.q) {
        query += ' AND (p.codigo LIKE ? OR p.nome LIKE ?)';
        const t = `%${req.query.q}%`;
        params.push(t, t);
    }
    query += ' ORDER BY p.codigo';

    const produtos = db.prepare(query).all(...params);
    res.json(produtos);
});

// GET /api/produtos/:id  (com componentes)
router.get('/:id', (req, res) => {
    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
    if (!produto) return res.status(404).json({
        erro: 'Produto não encontrado'
    });

    const componentes = db.prepare(
        'SELECT * FROM produto_componentes WHERE produto_id = ? ORDER BY tipo_componente'
    ).all(req.params.id);

    res.json({
        ...produto,
        componentes
    });
});

// ─── POST ─────────────────────────────────────────────────────────────────────

// POST /api/produtos
router.post('/', (req, res) => {
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

    if (!codigo || !nome || !tipo) {
        return res.status(400).json({
            erro: 'Campos obrigatórios: codigo, nome, tipo'
        });
    }

    try {
        db.exec('BEGIN');
        try {
            const result = db.prepare(`
        INSERT INTO produtos (codigo, nome, tipo, rosca, comprimento_total, diametro_esfera, preco_venda, margem, observacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(codigo, nome, tipo, rosca, comprimento_total, diametro_esfera, preco_venda || 0, margem || 0, observacoes);

            const produtoId = result.lastInsertRowid;

            // Inserir componentes
            const stmtComp = db.prepare(`
        INSERT INTO produto_componentes
          (produto_id, tipo_componente, ref_id, codigo_componente, nome_componente, quantidade, custo_unitario, bling_id, bling_codigo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            for (const c of componentes) {
                stmtComp.run(
                    produtoId, c.tipo_componente, c.ref_id || null,
                    c.codigo_componente, c.nome_componente,
                    c.quantidade, c.custo_unitario || 0,
                    c.bling_id || null, c.bling_codigo || null
                );
            }

            recalcularCusto(produtoId);
            db.exec('COMMIT');

            const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(produtoId);
            const comps = db.prepare('SELECT * FROM produto_componentes WHERE produto_id = ?').all(produtoId);
            return res.status(201).json({
                ...produto,
                componentes: comps
            });
        } catch (err) {
            db.exec('ROLLBACK');
            throw err;
        }
    } catch (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({
            erro: `Código ${codigo} já existe`
        });
        throw err;
    }
});

// ─── PUT ──────────────────────────────────────────────────────────────────────

// PUT /api/produtos/:id  (atualiza produto + substitui todos os componentes)
router.put('/:id', (req, res) => {
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
        status,
        componentes = []
    } = req.body;

    const exists = db.prepare('SELECT id FROM produtos WHERE id = ?').get(req.params.id);
    if (!exists) return res.status(404).json({
        erro: 'Produto não encontrado'
    });

    const update = () => {
        db.exec('BEGIN');
        try {
            db.prepare(`
        UPDATE produtos SET codigo=?, nome=?, tipo=?, rosca=?, comprimento_total=?, diametro_esfera=?,
          preco_venda=?, margem=?, observacoes=?, status=?, updated_at=CURRENT_TIMESTAMP
        WHERE id=?
      `).run(codigo, nome, tipo, rosca, comprimento_total, diametro_esfera, preco_venda, margem, observacoes, status || 'rascunho', req.params.id);

            // Substituir componentes
            db.prepare('DELETE FROM produto_componentes WHERE produto_id = ?').run(req.params.id);

            const stmtComp = db.prepare(`
        INSERT INTO produto_componentes
          (produto_id, tipo_componente, ref_id, codigo_componente, nome_componente, quantidade, custo_unitario, bling_id, bling_codigo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            for (const c of componentes) {
                stmtComp.run(
                    req.params.id, c.tipo_componente, c.ref_id || null,
                    c.codigo_componente, c.nome_componente,
                    c.quantidade, c.custo_unitario || 0,
                    c.bling_id || null, c.bling_codigo || null
                );
            }

            recalcularCusto(req.params.id);
            db.exec('COMMIT');
        } catch (err) {
            db.exec('ROLLBACK');
            throw err;
        }
    };

    update();
    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
    const comps = db.prepare('SELECT * FROM produto_componentes WHERE produto_id = ?').all(req.params.id);
    res.json({
        ...produto,
        componentes: comps
    });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({
        erro: 'Produto não encontrado'
    });
    res.json({
        mensagem: 'Produto removido com sucesso'
    });
});

module.exports = router;