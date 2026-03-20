const express = require('express');
const router = express.Router();
const {
    query,
    queryOne
} = require('../db/postgres');

// GET /api/apontamentos/op/:opId
router.get('/op/:opId', async (req, res) => {
    try {
        const rows = await query(
            `SELECT a.*, ct.nome AS centro_nome, ct.custo_hora_maquina, ct.custo_hora_operador
             FROM apontamentos a
             LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
             WHERE a.op_id = $1
             ORDER BY a.inicio DESC`,
            [req.params.opId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// POST /api/apontamentos  – Inicia (Play)
router.post('/', async (req, res) => {
    const {
        op_id,
        centro_id,
        operacao,
        tipo
    } = req.body;
    if (!op_id) return res.status(400).json({
        erro: 'op_id é obrigatório'
    });
    try {
        // Verifica centro ocupado
        if (centro_id) {
            const ativo = await queryOne(
                `SELECT id FROM apontamentos WHERE centro_id=$1 AND status='em_andamento'`,
                [centro_id]
            );
            if (ativo) return res.status(409).json({
                erro: 'Centro de trabalho já possui apontamento em andamento'
            });
        }

        // Avança OP para em_producao
        await query(
            `UPDATE ordens_producao
             SET status='em_producao', data_inicio=COALESCE(data_inicio, NOW())
             WHERE id=$1 AND status='planejada'`,
            [op_id]
        );

        const row = await queryOne(
            `INSERT INTO apontamentos (op_id, centro_id, operacao, tipo)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [op_id, centro_id || null, operacao || 'Produção', tipo || 'producao']
        );
        res.status(201).json({
            id: row.id,
            mensagem: 'Apontamento iniciado'
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// PUT /api/apontamentos/:id/concluir
router.put('/:id/concluir', async (req, res) => {
    const {
        qty_produzida,
        qty_refugo,
        observacoes
    } = req.body;
    try {
        const apt = await queryOne(
            `SELECT a.*, ct.custo_hora_maquina, ct.custo_hora_operador
             FROM apontamentos a
             LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
             WHERE a.id=$1`,
            [req.params.id]
        );
        if (!apt) return res.status(404).json({
            erro: 'Apontamento não encontrado'
        });

        const durMin = await queryOne(
            `SELECT ROUND(EXTRACT(EPOCH FROM (NOW() - $1::timestamptz)) / 60, 2) AS min`,
            [apt.inicio]
        );
        const duracao_min = parseFloat(durMin.min) || 0;
        const horas = duracao_min / 60;
        const taxa = (parseFloat(apt.custo_hora_maquina) || 0) + (parseFloat(apt.custo_hora_operador) || 0);
        const custo_calculado = horas * taxa;

        await query(
            `UPDATE apontamentos
             SET status='concluido', fim=NOW(), duracao_min=$1,
                 qty_produzida=$2, qty_refugo=$3, custo_calculado=$4, observacoes=$5
             WHERE id=$6`,
            [duracao_min, qty_produzida || 0, qty_refugo || 0, custo_calculado, observacoes || '', req.params.id]
        );
        res.json({
            mensagem: 'Apontamento concluído',
            duracao_min,
            custo_calculado
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// PUT /api/apontamentos/:id/pausar
router.put('/:id/pausar', async (req, res) => {
    const {
        motivo_parada
    } = req.body;
    try {
        const apt = await queryOne('SELECT * FROM apontamentos WHERE id=$1', [req.params.id]);
        if (!apt) return res.status(404).json({
            erro: 'Apontamento não encontrado'
        });

        const durMin = await queryOne(
            `SELECT ROUND(EXTRACT(EPOCH FROM (NOW() - $1::timestamptz)) / 60, 2) AS min`,
            [apt.inicio]
        );

        await query(
            `UPDATE apontamentos
             SET status='concluido', tipo='parada', motivo_parada=$1, fim=NOW(), duracao_min=$2
             WHERE id=$3`,
            [motivo_parada || '', parseFloat(durMin.min) || 0, req.params.id]
        );
        res.json({
            mensagem: 'Apontamento pausado',
            duracao_min: parseFloat(durMin.min)
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;