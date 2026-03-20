import { setCors } from '../../_db.js';
import { saveTokens } from '../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { access_token, refresh_token, expires_in } = req.body;
  if (!access_token) return res.status(400).json({ erro: 'access_token obrigatório' });
  try {
    await saveTokens({ access_token, refresh_token: refresh_token || '', expires_in: expires_in || 21600 });
    res.json({ mensagem: 'Token salvo com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
