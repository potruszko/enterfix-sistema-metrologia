import { setCors } from '../../_db.js';
import { obterAccessToken, blingClient } from '../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });
  try {
    const token = await obterAccessToken();
    const params = { pagina: 1, limite: 100 };
    if (req.query.q) params.criterio = req.query.q;
    const resp = await blingClient(token).get('/produtos', { params });
    res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ erro: err.message, detalhe: err.response?.data });
  }
}
