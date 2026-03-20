const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/esferas?material=Rubi&diametro=2.0
router.get('/', (req, res) => {
    let query = 'SELECT * FROM esferas WHERE 1=1';
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
    const row = db.prepare('SELECT * FROM esferas WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({
        erro: 'Esfera não encontrada'
    });
    res.json(row);
});

router.post('/', (req, res) => {
    const {
        codigo,
        material,
        diametro,
        custo,
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
      INSERT INTO esferas (codigo, material, diametro, custo, bling_id, bling_codigo, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(codigo, material, diametro, custo || 0, bling_id, bling_codigo, observacoes);
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
        custo,
        bling_id,
        bling_codigo,
        observacoes
    } = req.body;
    const exists = db.prepare('SELECT id FROM esferas WHERE id = ?').get(req.params.id);
    if (!exists) return res.status(404).json({
        erro: 'Esfera não encontrada'
    });

    db.prepare(`
    UPDATE esferas SET codigo=?, material=?, diametro=?, custo=?, bling_id=?, bling_codigo=?, observacoes=?
    WHERE id=?
  `).run(codigo, material, diametro, custo, bling_id, bling_codigo, observacoes, req.params.id);

    res.json({
        id: parseInt(req.params.id),
        ...req.body
    });
});

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM esferas WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({
        erro: 'Esfera não encontrada'
    });
    res.json({
        mensagem: 'Esfera removida com sucesso'
    });
});

module.exports = router;