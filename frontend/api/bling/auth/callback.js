/**
 * Dedicated handler for Bling OAuth callback.
 * Vercel routes /api/bling/auth/callback exclusively to this file,
 * avoiding any catch-all routing ambiguity.
 */
import axios from 'axios';
import { setCors } from '../../_db.js';
import {
    getOAuthConfig,
    getBackendUrl,
    getFrontendUrl,
    saveTokens,
    BLING_API
} from '../../_bling.js';

export default async function handler(req, res) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Parâmetro "code" não encontrado na resposta do Bling.');
    }

    const { clientId, clientSecret, configured } = getOAuthConfig();
    if (!configured) {
        return res.status(500).json({ erro: 'Credenciais Bling não configuradas no servidor.' });
    }

    try {
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const resp = await axios.post(
            `${BLING_API}/oauth/token`,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: `${getBackendUrl()}/api/bling/auth/callback`
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            }
        );

        await saveTokens(resp.data);
        return res.redirect(`${getFrontendUrl()}/configuracoes?bling=ok`);
    } catch (err) {
        const detail = (err.response && err.response.data) || err.message;
        console.error('[bling/auth/callback] Falha na troca do code:', detail);
        return res.redirect(
            `${getFrontendUrl()}/configuracoes?bling=erro&detalhe=${encodeURIComponent(JSON.stringify(detail))}`
        );
    }
}
