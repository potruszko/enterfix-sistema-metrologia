import { query, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });
  const { opId } = req.query;
  try {
    const rows = await query(
      `SELECT a.*, ct.nome AS centro_nome, ct.custo_hora_maquina, ct.custo_hora_operador
       FROM apontamentos a
       LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
       WHERE a.op_id = $1
       ORDER BY a.inicio DESC`,
      [opId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
