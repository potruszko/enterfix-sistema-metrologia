const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/hastes?material=MD&diametro=1.5
router.get('/', (req, res) => {
    let query = 'SELECT * FROM hastes WHERE 1=1';
    const params = [];

    if (req.query.material) {
        query += ' AND material = ?';
        params.push(req.query.material);
    }
    if (req.query.diametro) {
        query += ' AND diametro = ?';
        params.push(parseFloat(req.query.diametro));
    }
    query += ' ORDER BY material, diametro';

    res.json(db.prepare(query).all(...params));
});

router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM hastes WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({
        erro: 'Haste não encontrada'
    });
    res.json(row);
});

router.post('/', (req, res) => {
    const {
        codigo,
        material,
        diametro,
        custo_por_mm,
        bling_id,
        bling_codigo,
        observacoes
    } = req.body;

    if (!codigo || !material || diametro == null) {
        return res.status(400).json({
            erro: 'Campos obrigatórios: codigo, material, diametro'
        });
    }

    try {
        const result = db.prepare(`
      INSERT INTO hastes (codigo, material, diametro, custo_por_mm, bling_id, bling_codigo, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(codigo, material, diametro, custo_por_mm || 0, bling_id, bling_codigo, observacoes);
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

router.put('/:id', (req, res) => {
    const {
        codigo,
        material,
        diametro,
        custo_por_mm,
        bling_id,
        bling_codigo,
        observacoes
    } = req.body;
    const exists = db.prepare('SELECT id FROM hastes WHERE id = ?').get(req.params.id);
    if (!exists) return res.status(404).json({
        erro: 'Haste não encontrada'
    });

    db.prepare(`
    UPDATE hastes SET codigo=?, material=?, diametro=?, custo_por_mm=?, bling_id=?, bling_codigo=?, observacoes=?
    WHERE id=?
  `).run(codigo, material, diametro, custo_por_mm, bling_id, bling_codigo, observacoes, req.params.id);

    res.json({
        id: parseInt(req.params.id),
        ...req.body
    });
});

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM hastes WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({
        erro: 'Haste não encontrada'
    });
    res.json({
        mensagem: 'Haste removida com sucesso'
    });
});

module.exports = router;