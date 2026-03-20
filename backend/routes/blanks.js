const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/blanks?rosca=M2&diametro_furo=1.5
router.get('/', (req, res) => {
    let query = 'SELECT * FROM blanks WHERE 1=1';
    const params = [];

    if (req.query.rosca) {
        query += ' AND rosca = ?';
        params.push(req.query.rosca);
    }
    if (req.query.diametro_furo) {
        query += ' AND diametro_furo = ?';
        params.push(parseFloat(req.query.diametro_furo));
    }
    query += ' ORDER BY rosca, diametro_furo, comprimento';

    const rows = db.prepare(query).all(...params);
    res.json(rows);
});

// GET /api/blanks/:id
router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM blanks WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({
        erro: 'Blank não encontrado'
    });
    res.json(row);
});

// POST /api/blanks
router.post('/', (req, res) => {
    const {
        codigo,
        descricao,
        rosca,
        diametro_corpo,
        diametro_furo,
        comprimento,
        material,
        custo,
        bling_id,
        bling_codigo,
        observacoes
    } = req.body;

    if (!codigo || !rosca || diametro_furo == null || comprimento == null) {
        return res.status(400).json({
            erro: 'Campos obrigatórios: codigo, rosca, diametro_furo, comprimento'
        });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(
            codigo,
            descricao || null,
            rosca,
            diametro_corpo || 0,
            diametro_furo,
            comprimento,
            material || 'Inox',
            custo || 0,
            bling_id,
            bling_codigo,
            observacoes
        );
        res.status(201).json({
            id: result.lastInsertRowid,
            ...req.body
        });
    } catch (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({
            erro: `Código ${codigo} já existe`
        });
        throw err;
    }
});

// PUT /api/blanks/:id
router.put('/:id', (req, res) => {
    const {
        codigo,
        descricao,
        rosca,
        diametro_corpo,
        diametro_furo,
        comprimento,
        material,
        custo,
        bling_id,
        bling_codigo,
        observacoes
    } = req.body;

    const exists = db.prepare('SELECT id FROM blanks WHERE id = ?').get(req.params.id);
    if (!exists) return res.status(404).json({
        erro: 'Blank não encontrado'
    });

    db.prepare(`
        UPDATE blanks SET codigo=?, descricao=?, rosca=?, diametro_corpo=?, diametro_furo=?, comprimento=?, material=?, custo=?, bling_id=?, bling_codigo=?, observacoes=?
    WHERE id=?
    `).run(codigo, descricao || null, rosca, diametro_corpo || 0, diametro_furo, comprimento, material, custo, bling_id, bling_codigo, observacoes, req.params.id);

    res.json({
        id: parseInt(req.params.id),
        ...req.body
    });
});

// DELETE /api/blanks/:id
router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM blanks WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({
        erro: 'Blank não encontrado'
    });
    res.json({
        mensagem: 'Blank removido com sucesso'
    });
});

module.exports = router;