import { query, queryOne, setCors } from '../_db.js';

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

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const ops = await query(
        `SELECT op.*,
           COUNT(DISTINCT a.id) AS total_apontamentos,
           SUM(CASE WHEN a.status='em_andamento' THEN 1 ELSE 0 END) AS apontamentos_ativos
         FROM ordens_producao op
         LEFT JOIN apontamentos a ON a.op_id = op.id
         GROUP BY op.id
         ORDER BY op.created_at DESC`
      );
      return res.json(ops);
    }
    if (req.method === 'POST') {
      const { produto_codigo, produto_nome, quantidade, bling_produto_id, bling_pedido_id, bling_pedido_numero, custo_material, observacoes } = req.body;
      if (!produto_codigo) return res.status(400).json({ erro: 'produto_codigo é obrigatório' });
      const numero = await gerarNumeroOP();
      const row = await queryOne(
        `INSERT INTO ordens_producao
           (numero, produto_codigo, produto_nome, quantidade, bling_produto_id, bling_pedido_id, bling_pedido_numero, custo_material, observacoes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [numero, produto_codigo, produto_nome || '', quantidade || 1, bling_produto_id || '', bling_pedido_id || '', bling_pedido_numero || '', custo_material || 0, observacoes || '']
      );
      return res.status(201).json({ id: row.id, numero, mensagem: 'OP criada com sucesso' });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
