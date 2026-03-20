import axios from 'axios';
import { setCors } from '../../_db.js';
import { getOAuthConfig, getBackendUrl, getFrontendUrl, saveTokens, BLING_API } from '../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });

  const { code } = req.query;
  if (!code) return res.status(400).send('Parâmetro "code" não encontrado');

  const { clientId, clientSecret, configured } = getOAuthConfig();
  if (!configured) return res.status(500).json({ erro: 'BLING_CLIENT_ID e BLING_CLIENT_SECRET não configurados' });

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  try {
    const resp = await axios.post(
      `${BLING_API}/oauth/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${getBackendUrl()}/api/bling/auth/callback`
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` } }
    );
    await saveTokens(resp.data);
    res.redirect(`${getFrontendUrl()}/configuracoes?bling=ok`);
  } catch (err) {
    const msg = err.response?.data || err.message;
    res.status(500).json({ erro: 'Falha na autenticação Bling', detalhe: msg });
  }
}
