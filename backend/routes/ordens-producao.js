const express = require('express');
const router = express.Router();
const {
    query,
    queryOne
} = require('../db/postgres');

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

// GET /api/ordens-producao
router.get('/', async (_req, res) => {
    try {
        const ops = await query(
            `SELECT op.*,
               COUNT(DISTINCT a.id) AS total_apontamentos,
               SUM(CASE WHEN a.status='em_andamento' THEN 1 ELSE 0 END) AS apontamentos_ativos
             FROM ordens_producao op
             LEFT JOIN apontamentos a ON a.op_id = op.id
             GROUP BY op.id
             ORDER BY op.created_at DESC`
        );
        res.json(ops);
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// GET /api/ordens-producao/:id
router.get('/:id', async (req, res) => {
    try {
        const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [req.params.id]);
        if (!op) return res.status(404).json({
            erro: 'OP não encontrada'
        });
        const apontamentos = await query(
            `SELECT a.*, ct.nome AS centro_nome, ct.custo_hora_maquina, ct.custo_hora_operador
             FROM apontamentos a
             LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
             WHERE a.op_id = $1
             ORDER BY a.inicio DESC`,
            [req.params.id]
        );
        res.json({
            ...op,
            apontamentos
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// POST /api/ordens-producao
router.post('/', async (req, res) => {
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
    try {
        const numero = await gerarNumeroOP();
        const row = await queryOne(
            `INSERT INTO ordens_producao
               (numero, produto_codigo, produto_nome, quantidade, bling_produto_id, bling_pedido_id, bling_pedido_numero, custo_material, observacoes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
            [numero, produto_codigo, produto_nome || '', quantidade || 1, bling_produto_id || '', bling_pedido_id || '', bling_pedido_numero || '', custo_material || 0, observacoes || '']
        );
        res.status(201).json({
            id: row.id,
            numero,
            mensagem: 'OP criada com sucesso'
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// PUT /api/ordens-producao/:id
router.put('/:id', async (req, res) => {
    const {
        produto_nome,
        quantidade,
        status,
        custo_material,
        observacoes
    } = req.body;
    try {
        await query(
            `UPDATE ordens_producao SET produto_nome=$1, quantidade=$2, status=$3, custo_material=$4, observacoes=$5 WHERE id=$6`,
            [produto_nome || '', quantidade || 1, status, custo_material || 0, observacoes || '', req.params.id]
        );
        res.json({
            mensagem: 'OP atualizada'
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// POST /api/ordens-producao/:id/iniciar
router.post('/:id/iniciar', async (req, res) => {
    try {
        const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [req.params.id]);
        if (!op) return res.status(404).json({
            erro: 'OP não encontrada'
        });
        await query(
            `UPDATE ordens_producao SET status='em_producao', data_inicio=COALESCE(data_inicio, NOW()) WHERE id=$1`,
            [req.params.id]
        );
        res.json({
            mensagem: 'OP iniciada'
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// POST /api/ordens-producao/:id/concluir
router.post('/:id/concluir', async (req, res) => {
    try {
        const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [req.params.id]);
        if (!op) return res.status(404).json({
            erro: 'OP não encontrada'
        });

        // Fecha apontamentos em aberto
        await query(
            `UPDATE apontamentos
             SET status='concluido', fim=NOW(),
                 duracao_min = ROUND(EXTRACT(EPOCH FROM (NOW() - inicio)) / 60, 2)
             WHERE op_id=$1 AND status='em_andamento'`,
            [req.params.id]
        );

        const custo_processo = await calcularCustoProcesso(req.params.id);
        const custo_real = (parseFloat(op.custo_material) || 0) + custo_processo;

        await query(
            `UPDATE ordens_producao SET status='concluida', custo_processo=$1, custo_real=$2, data_fim=NOW() WHERE id=$3`,
            [custo_processo, custo_real, req.params.id]
        );

        res.json({
            mensagem: 'OP concluída com sucesso',
            custo_real,
            custo_processo,
            custo_material: parseFloat(op.custo_material) || 0
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

// DELETE /api/ordens-producao/:id
router.delete('/:id', async (req, res) => {
    try {
        await query('DELETE FROM ordens_producao WHERE id=$1', [req.params.id]);
        res.json({
            mensagem: 'OP removida'
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;