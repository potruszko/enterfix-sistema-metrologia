import { query, queryOne, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });
  const { produtoId } = req.query;
  try {
    const produto = await queryOne('SELECT * FROM produtos WHERE id = $1', [produtoId]);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id = $1 ORDER BY tipo_componente', [produtoId]);
    const margemCalc = produto.preco_venda > 0 && produto.custo_total > 0
      ? ((produto.preco_venda - produto.custo_total) / produto.preco_venda) * 100
      : 0;
    res.json({ produto, componentes, margem_calculada: margemCalc });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
