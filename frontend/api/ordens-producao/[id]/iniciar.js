import { query, queryOne, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { id } = req.query;
  try {
    const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [id]);
    if (!op) return res.status(404).json({ erro: 'OP não encontrada' });
    await query(
      `UPDATE ordens_producao SET status='em_producao', data_inicio=COALESCE(data_inicio, NOW()) WHERE id=$1`,
      [id]
    );
    res.json({ mensagem: 'OP iniciada' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
