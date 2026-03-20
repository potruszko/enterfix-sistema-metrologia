import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { op_id, centro_id, operacao, tipo } = req.body;
  if (!op_id) return res.status(400).json({ erro: 'op_id é obrigatório' });
  try {
    if (centro_id) {
      const ativo = await queryOne(
        `SELECT id FROM apontamentos WHERE centro_id=$1 AND status='em_andamento'`,
        [centro_id]
      );
      if (ativo) return res.status(409).json({ erro: 'Centro de trabalho já possui apontamento em andamento' });
    }
    await query(
      `UPDATE ordens_producao SET status='em_producao', data_inicio=COALESCE(data_inicio, NOW())
       WHERE id=$1 AND status='planejada'`,
      [op_id]
    );
    const row = await queryOne(
      `INSERT INTO apontamentos (op_id, centro_id, operacao, tipo)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [op_id, centro_id || null, operacao || 'Produção', tipo || 'producao']
    );
    res.status(201).json({ id: row.id, mensagem: 'Apontamento iniciado' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
