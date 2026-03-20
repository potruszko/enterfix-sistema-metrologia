import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    if (req.method === 'PUT') {
      const { codigo, nome, custo_hora_maquina, custo_hora_operador, status, observacoes } = req.body;
      const exists = await queryOne('SELECT id FROM centros_trabalho WHERE id = $1', [id]);
      if (!exists) return res.status(404).json({ erro: 'Centro não encontrado' });
      await query(
        `UPDATE centros_trabalho SET codigo=$1, nome=$2, custo_hora_maquina=$3, custo_hora_operador=$4, status=$5, observacoes=$6 WHERE id=$7`,
        [codigo.toUpperCase(), nome, custo_hora_maquina || 0, custo_hora_operador || 0, status || 'ativo', observacoes || '', id]
      );
      return res.json({ id: parseInt(id), mensagem: 'Centro atualizado' });
    }
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM centros_trabalho WHERE id = $1 RETURNING id', [id]);
      if (!result.length) return res.status(404).json({ erro: 'Centro não encontrado' });
      return res.json({ mensagem: 'Centro removido' });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
