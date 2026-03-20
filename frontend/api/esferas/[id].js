import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const row = await queryOne('SELECT * FROM esferas WHERE id = $1', [id]);
      if (!row) return res.status(404).json({ erro: 'Esfera não encontrada' });
      return res.json(row);
    }
    if (req.method === 'PUT') {
      const { codigo, descricao, material, diametro, custo, tem_furo, bling_id, bling_codigo, observacoes } = req.body;
      const exists = await queryOne('SELECT id FROM esferas WHERE id = $1', [id]);
      if (!exists) return res.status(404).json({ erro: 'Esfera não encontrada' });
      await query(
        `UPDATE esferas SET codigo=$1, descricao=$2, material=$3, diametro=$4, custo=$5, tem_furo=$6, bling_id=$7, bling_codigo=$8, observacoes=$9 WHERE id=$10`,
        [codigo, descricao || null, material, diametro, custo || 0, tem_furo != null ? tem_furo : 1, bling_id || null, bling_codigo || null, observacoes || null, id]
      );
      return res.json({ id: parseInt(id), ...req.body });
    }
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM esferas WHERE id = $1 RETURNING id', [id]);
      if (!result.length) return res.status(404).json({ erro: 'Esfera não encontrada' });
      return res.json({ mensagem: 'Esfera removida com sucesso' });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
