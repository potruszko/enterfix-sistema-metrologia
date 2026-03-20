import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [id]);
      if (!op) return res.status(404).json({ erro: 'OP não encontrada' });
      const apontamentos = await query(
        `SELECT a.*, ct.nome AS centro_nome, ct.custo_hora_maquina, ct.custo_hora_operador
         FROM apontamentos a
         LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
         WHERE a.op_id = $1
         ORDER BY a.inicio DESC`,
        [id]
      );
      return res.json({ ...op, apontamentos });
    }
    if (req.method === 'PUT') {
      const { produto_nome, quantidade, status, custo_material, observacoes } = req.body;
      await query(
        `UPDATE ordens_producao SET produto_nome=$1, quantidade=$2, status=$3, custo_material=$4, observacoes=$5 WHERE id=$6`,
        [produto_nome || '', quantidade || 1, status, custo_material || 0, observacoes || '', id]
      );
      return res.json({ mensagem: 'OP atualizada' });
    }
    if (req.method === 'DELETE') {
      await query('DELETE FROM apontamentos WHERE op_id=$1', [id]);
      const result = await query('DELETE FROM ordens_producao WHERE id=$1 RETURNING id', [id]);
      if (!result.length) return res.status(404).json({ erro: 'OP não encontrada' });
      return res.json({ mensagem: 'OP removida' });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
