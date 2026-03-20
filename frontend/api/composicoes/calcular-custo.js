import { setCors } from '../../_db.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { componentes = [] } = req.body;
  const total = componentes.reduce(
    (acc, c) => acc + (parseFloat(c.custo_unitario) || 0) * (parseFloat(c.quantidade) || 1),
    0
  );
  res.json({ custo_total: parseFloat(total.toFixed(4)) });
}
