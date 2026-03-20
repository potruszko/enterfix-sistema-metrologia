import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const row = await queryOne('SELECT * FROM blanks WHERE id = $1', [id]);
      if (!row) return res.status(404).json({ erro: 'Blank não encontrado' });
      return res.json(row);
    }
    if (req.method === 'PUT') {
      const { codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo, observacoes } = req.body;
      const exists = await queryOne('SELECT id FROM blanks WHERE id = $1', [id]);
      if (!exists) return res.status(404).json({ erro: 'Blank não encontrado' });
      await query(
        `UPDATE blanks SET codigo=$1, descricao=$2, rosca=$3, diametro_corpo=$4, diametro_furo=$5,
         comprimento=$6, material=$7, custo=$8, bling_id=$9, bling_codigo=$10, observacoes=$11 WHERE id=$12`,
        [codigo, descricao || null, rosca, diametro_corpo || 0, diametro_furo, comprimento, material || 'Inox', custo || 0, bling_id || null, bling_codigo || null, observacoes || null, id]
      );
      return res.json({ id: parseInt(id), ...req.body });
    }
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM blanks WHERE id = $1 RETURNING id', [id]);
      if (!result.length) return res.status(404).json({ erro: 'Blank não encontrado' });
      return res.json({ mensagem: 'Blank removido com sucesso' });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
