const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (_req, res) => {
    res.json(db.prepare('SELECT * FROM mao_de_obra ORDER BY descricao').all());
});

router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM mao_de_obra WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({
        erro: 'Mão de obra não encontrada'
    });
    res.json(row);
});

router.post('/', (req, res) => {
    const {
        codigo,
        descricao,
        custo,
        unidade,
        bling_id,
        bling_codigo
    } = req.body;
    if (!codigo || !descricao) return res.status(400).json({
        erro: 'Campos obrigatórios: codigo, descricao'
    });

    try {
        const result = db.prepare(`
      INSERT INTO mao_de_obra (codigo, descricao, custo, unidade, bling_id, bling_codigo)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(codigo, descricao, custo || 0, unidade || 'UN', bling_id, bling_codigo);
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
        descricao,
        custo,
        unidade,
        bling_id,
        bling_codigo
    } = req.body;
    const exists = db.prepare('SELECT id FROM mao_de_obra WHERE id = ?').get(req.params.id);
    if (!exists) return res.status(404).json({
        erro: 'Mão de obra não encontrada'
    });

    db.prepare(`
    UPDATE mao_de_obra SET codigo=?, descricao=?, custo=?, unidade=?, bling_id=?, bling_codigo=? WHERE id=?
  `).run(codigo, descricao, custo, unidade, bling_id, bling_codigo, req.params.id);

    res.json({
        id: parseInt(req.params.id),
        ...req.body
    });
});

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM mao_de_obra WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({
        erro: 'Mão de obra não encontrada'
    });
    res.json({
        mensagem: 'Removido com sucesso'
    });
});

module.exports = router;