const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/composicoes/:produtoId  — retorna composição completa de um produto
router.get('/:produtoId', (req, res) => {
    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.produtoId);
    if (!produto) return res.status(404).json({
        erro: 'Produto não encontrado'
    });

    const componentes = db.prepare(`
    SELECT * FROM produto_componentes WHERE produto_id = ? ORDER BY tipo_componente
  `).all(req.params.produtoId);

    // calcula margem em tempo real
    const margemCalc =
        produto.preco_venda > 0 && produto.custo_total > 0 ?
        ((produto.preco_venda - produto.custo_total) / produto.preco_venda) * 100 :
        0;

    res.json({
        produto,
        componentes,
        margem_calculada: margemCalc
    });
});

// POST /api/composicoes/sugerir-blank
// Dado rosca + diametro_haste, retorna blanks compatíveis
router.post('/sugerir-blank', (req, res) => {
    const {
        rosca,
        diametro_haste
    } = req.body;

    if (!rosca || diametro_haste == null) {
        return res.status(400).json({
            erro: 'Informe rosca e diametro_haste'
        });
    }

    const blanks = db.prepare(`
    SELECT * FROM blanks
    WHERE rosca = ? AND diametro_furo = ?
    ORDER BY comprimento
  `).all(rosca, parseFloat(diametro_haste));

    res.json(blanks);
});

// POST /api/composicoes/calcular-haste
// Retorna o comprimento necessário da haste dado o comprimento total e o blank
router.post('/calcular-haste', (req, res) => {
    const {
        comprimento_total,
        blank_id,
        diametro_esfera
    } = req.body;

    if (!comprimento_total || !blank_id) {
        return res.status(400).json({
            erro: 'Informe comprimento_total e blank_id'
        });
    }

    const blank = db.prepare('SELECT * FROM blanks WHERE id = ?').get(blank_id);
    if (!blank) return res.status(404).json({
        erro: 'Blank não encontrado'
    });

    const raio = diametro_esfera ? diametro_esfera / 2 : 0;
    const comprimento_haste = comprimento_total - blank.comprimento - raio;

    if (comprimento_haste < 0) {
        return res.status(422).json({
            erro: 'Comprimento total menor que o comprimento do blank + raio da esfera',
            comprimento_minimo: blank.comprimento + raio
        });
    }

    res.json({
        comprimento_haste: parseFloat(comprimento_haste.toFixed(3)),
        blank,
        raio_esfera: raio
    });
});

// POST /api/composicoes/calcular-custo
// Calcula custo total de uma combinação de componentes (sem salvar)
router.post('/calcular-custo', (req, res) => {
    const {
        componentes = []
    } = req.body;
    // componentes: [{ tipo_componente, custo_unitario, quantidade }]

    const total = componentes.reduce(
        (acc, c) => acc + (parseFloat(c.custo_unitario) || 0) * (parseFloat(c.quantidade) || 1),
        0
    );

    res.json({
        custo_total: parseFloat(total.toFixed(4))
    });
});

module.exports = router;