import { setCors } from '../../_db.js';
import { obterAccessToken, blingClient } from '../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });
  const { id } = req.query;
  try {
    const token = await obterAccessToken();
    const resp = await blingClient(token).get(`/pedidos/vendas/${id}`);
    res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ erro: err.message, detalhe: err.response?.data });
  }
}
