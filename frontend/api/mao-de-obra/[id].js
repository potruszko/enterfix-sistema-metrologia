import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const row = await queryOne('SELECT * FROM mao_de_obra WHERE id = $1', [id]);
      if (!row) return res.status(404).json({ erro: 'Mão de obra não encontrada' });
      return res.json(row);
    }
    if (req.method === 'PUT') {
      const { codigo, descricao, custo, unidade, bling_id, bling_codigo } = req.body;
      const exists = await queryOne('SELECT id FROM mao_de_obra WHERE id = $1', [id]);
      if (!exists) return res.status(404).json({ erro: 'Mão de obra não encontrada' });
      await query(
        `UPDATE mao_de_obra SET codigo=$1, descricao=$2, custo=$3, unidade=$4, bling_id=$5, bling_codigo=$6 WHERE id=$7`,
        [codigo, descricao, custo || 0, unidade || 'UN', bling_id || null, bling_codigo || null, id]
      );
      return res.json({ id: parseInt(id), ...req.body });
    }
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM mao_de_obra WHERE id = $1 RETURNING id', [id]);
      if (!result.length) return res.status(404).json({ erro: 'Mão de obra não encontrada' });
      return res.json({ mensagem: 'Removido com sucesso' });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
