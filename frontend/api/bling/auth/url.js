import { setCors } from '../../_db.js';
import { getOAuthConfig as _getOAuthConfig, getBackendUrl as _getBackendUrl } from '../_bling.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });

  const { clientId, configured } = _getOAuthConfig();
  if (!configured) {
    return res.json({
      url: '',
      configurado: false,
      detalhe: 'Configure BLING_CLIENT_ID e BLING_CLIENT_SECRET nas variáveis de ambiente do Vercel'
    });
  }

  const backendUrl = _getBackendUrl();
  const redirectUri = encodeURIComponent(`${backendUrl}/api/bling/auth/callback`);
  const url = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=composicao&redirect_uri=${redirectUri}`;
  res.json({ url, configurado: true });
}
