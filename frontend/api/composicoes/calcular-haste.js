import { queryOne, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { comprimento_total, blank_id, diametro_esfera } = req.body;
  if (!comprimento_total || !blank_id)
    return res.status(400).json({ erro: 'Informe comprimento_total e blank_id' });
  try {
    const blank = await queryOne('SELECT * FROM blanks WHERE id = $1', [blank_id]);
    if (!blank) return res.status(404).json({ erro: 'Blank não encontrado' });
    const raio = diametro_esfera ? diametro_esfera / 2 : 0;
    const comprimento_haste = comprimento_total - blank.comprimento - raio;
    if (comprimento_haste < 0) {
      return res.status(422).json({
        erro: 'Comprimento total menor que o comprimento do blank + raio da esfera',
        comprimento_minimo: blank.comprimento + raio,
      });
    }
    res.json({ comprimento_haste: parseFloat(comprimento_haste.toFixed(3)), blank, raio_esfera: raio });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
