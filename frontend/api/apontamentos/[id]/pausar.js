import { query, queryOne, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ erro: 'Método não permitido' });
  const { id } = req.query;
  const { motivo_parada } = req.body;
  try {
    const apt = await queryOne('SELECT * FROM apontamentos WHERE id=$1', [id]);
    if (!apt) return res.status(404).json({ erro: 'Apontamento não encontrado' });

    const durMin = await queryOne(
      `SELECT ROUND(EXTRACT(EPOCH FROM (NOW() - $1::timestamptz)) / 60, 2) AS min`,
      [apt.inicio]
    );

    await query(
      `UPDATE apontamentos
       SET status='concluido', tipo='parada', motivo_parada=$1, fim=NOW(), duracao_min=$2
       WHERE id=$3`,
      [motivo_parada || '', parseFloat(durMin.min) || 0, id]
    );
    res.json({ mensagem: 'Apontamento pausado', duracao_min: parseFloat(durMin.min) });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
