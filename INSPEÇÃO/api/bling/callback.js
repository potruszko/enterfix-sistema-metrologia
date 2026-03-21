import {
    createClient
} from '@supabase/supabase-js';

/**
 * Vercel Serverless Function - Bling OAuth 2.0 Callback
 * URL: /api/bling/callback
 *
 * Variables de ambiente necessárias (Vercel Dashboard → Settings → Environment Variables):
 *   BLING_CLIENT_ID         - Client ID do app no portal Bling
 *   BLING_CLIENT_SECRET     - Client Secret do app no portal Bling
 *   BLING_REDIRECT_URI      - Ex: https://seu-app.vercel.app/api/bling/callback
 *   VITE_SUPABASE_URL       - URL do projeto Supabase
 *   SUPABASE_SERVICE_ROLE_KEY - Service Role Key (não o anon key!)
 *   VITE_APP_URL            - URL base do app, ex: https://seu-app.vercel.app
 */
export default async function handler(req, res) {
    const {
        code,
        state,
        error,
        error_description
    } = req.query;
    const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173';

    if (error) {
        const msg = encodeURIComponent(error_description || error);
        return res.redirect(`${appUrl}?bling_error=${msg}`);
    }

    if (!code || !state) {
        return res.redirect(`${appUrl}?bling_error=${encodeURIComponent('Parâmetros inválidos no callback')}`);
    }

    try {
        // O state contém o user_id em base64
        const userId = Buffer.from(decodeURIComponent(state), 'base64').toString('utf8');

        if (!userId) {
            throw new Error('State inválido');
        }

        // Trocar code por tokens
        const credentials = Buffer.from(
            `${process.env.BLING_CLIENT_ID}:${process.env.BLING_CLIENT_SECRET}`
        ).toString('base64');

        const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.BLING_REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(tokenData.error_description || tokenData.error || 'Falha na troca do código');
        }

        // Salvar tokens no Supabase com service_role (sem RLS)
        const supabase = createClient(
            process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

        const {
            error: dbError
        } = await supabase
            .from('bling_tokens')
            .upsert({
                user_id: userId,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: expiresAt,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (dbError) throw dbError;

        return res.redirect(`${appUrl}?bling_connected=true`);
    } catch (err) {
        console.error('[bling/callback] Erro:', err);
        return res.redirect(`${appUrl}?bling_error=${encodeURIComponent(err.message || 'Erro interno')}`);
    }
}