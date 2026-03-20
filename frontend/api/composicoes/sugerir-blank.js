import { query, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { rosca, diametro_haste } = req.body;
  if (!rosca || diametro_haste == null)
    return res.status(400).json({ erro: 'Informe rosca e diametro_haste' });
  try {
    const blanks = await query(
      'SELECT * FROM blanks WHERE rosca = $1 AND diametro_furo = $2 ORDER BY comprimento',
      [rosca, parseFloat(diametro_haste)]
    );
    res.json(blanks);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
