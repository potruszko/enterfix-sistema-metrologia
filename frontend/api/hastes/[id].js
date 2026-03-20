import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const row = await queryOne('SELECT * FROM hastes WHERE id = $1', [id]);
      if (!row) return res.status(404).json({ erro: 'Haste não encontrada' });
      return res.json(row);
    }
    if (req.method === 'PUT') {
      const { codigo, material, diametro, custo_por_mm, bling_id, bling_codigo, observacoes } = req.body;
      const exists = await queryOne('SELECT id FROM hastes WHERE id = $1', [id]);
      if (!exists) return res.status(404).json({ erro: 'Haste não encontrada' });
      await query(
        `UPDATE hastes SET codigo=$1, material=$2, diametro=$3, custo_por_mm=$4, bling_id=$5, bling_codigo=$6, observacoes=$7 WHERE id=$8`,
        [codigo, material, diametro, custo_por_mm || 0, bling_id || null, bling_codigo || null, observacoes || null, id]
      );
      return res.json({ id: parseInt(id), ...req.body });
    }
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM hastes WHERE id = $1 RETURNING id', [id]);
      if (!result.length) return res.status(404).json({ erro: 'Haste não encontrada' });
      return res.json({ mensagem: 'Haste removida com sucesso' });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
