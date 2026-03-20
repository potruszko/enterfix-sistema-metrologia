const express = require('express');
const router = express.Router();
const {
    query,
    queryOne
} = require('../db/postgres');

// GET /api/centros-trabalho
router.get('/', async (_req, res) => {
    try {
        const rows = await query('SELECT * FROM centros_trabalho ORDER BY codigo');
        res.json(rows);
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// POST /api/centros-trabalho
router.post('/', async (req, res) => {
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
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [codigo.toUpperCase(), nome, custo_hora_maquina || 0, custo_hora_operador || 0, status || 'ativo', observacoes || '']
        );
        res.status(201).json({
            id: row.id,
            mensagem: 'Centro criado'
        });
    } catch (e) {
        if (e.code === '23505') return res.status(409).json({
            erro: `Código ${codigo} já existe`
        });
        res.status(500).json({
            erro: e.message
        });
    }
});

// PUT /api/centros-trabalho/:id
router.put('/:id', async (req, res) => {
    const {
        nome,
        custo_hora_maquina,
        custo_hora_operador,
        status,
        observacoes
    } = req.body;
    try {
        await query(
            `UPDATE centros_trabalho
             SET nome=$1, custo_hora_maquina=$2, custo_hora_operador=$3, status=$4, observacoes=$5
             WHERE id=$6`,
            [nome, custo_hora_maquina || 0, custo_hora_operador || 0, status || 'ativo', observacoes || '', req.params.id]
        );
        res.json({
            mensagem: 'Centro atualizado'
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// DELETE /api/centros-trabalho/:id
router.delete('/:id', async (req, res) => {
    try {
        await query('DELETE FROM centros_trabalho WHERE id=$1', [req.params.id]);
        res.json({
            mensagem: 'Centro removido'
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;