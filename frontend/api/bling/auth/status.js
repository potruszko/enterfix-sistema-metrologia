import { setCors } from '../../_db.js';
import { getTokens } from '../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });
  try {
    const tokens = await getTokens();
    const expiry = tokens.bling_token_expiry ? new Date(tokens.bling_token_expiry) : null;
    const valido = expiry ? expiry > new Date() : false;
    res.json({
      configurado: !!tokens.bling_access_token,
      valido,
      expira_em: expiry ? expiry.toISOString() : null
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
