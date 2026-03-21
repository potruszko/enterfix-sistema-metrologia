import {
    createClient
} from '@supabase/supabase-js';

/**
 * Vercel Serverless Function - Proxy para Bling API v3
 * URL: /api/bling/proxy
 *
 * Query params:
 *   endpoint (string) - Caminho da API Bling, ex: /contatos
 *   params   (string) - JSON stringificado com query params adicionais
 *
 * Headers obrigatórios:
 *   Authorization: Bearer <supabase_access_token>
 */
export default async function handler(req, res) {
    const allowedOrigin = process.env.VITE_APP_URL || '*';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({
        error: 'Method not allowed'
    });

    // 1. Verificar autenticação Supabase
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Token de autenticação ausente'
        });
    }

    const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const userSupabaseToken = authHeader.replace('Bearer ', '');
    const {
        data: {
            user
        },
        error: authError
    } = await supabase.auth.getUser(userSupabaseToken);

    if (authError || !user) {
        return res.status(401).json({
            error: 'Token inválido ou expirado'
        });
    }

    // 2. Buscar tokens Bling do usuário
    const {
        data: tokenRow,
        error: tokenError
    } = await supabase
        .from('bling_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', user.id)
        .single();

    if (tokenError || !tokenRow) {
        return res.status(401).json({
            error: 'Bling não conectado. Faça a autorização primeiro.'
        });
    }

    // 3. Renovar token se expirado
    let accessToken = tokenRow.access_token;

    if (new Date(tokenRow.expires_at) <= new Date()) {
        try {
            const credentials = Buffer.from(
                `${process.env.BLING_CLIENT_ID}:${process.env.BLING_CLIENT_SECRET}`
            ).toString('base64');

            const refreshResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`,
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: tokenRow.refresh_token,
                }),
            });

            if (refreshResponse.ok) {
                const newTokens = await refreshResponse.json();
                accessToken = newTokens.access_token;
                await supabase.from('bling_tokens').update({
                    access_token: newTokens.access_token,
                    refresh_token: newTokens.refresh_token,
                    expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                }).eq('user_id', user.id);
            } else {
                // Token de refresh também inválido - desconectar
                await supabase.from('bling_tokens').delete().eq('user_id', user.id);
                return res.status(401).json({
                    error: 'Sessão Bling expirada. Reconecte-se.'
                });
            }
        } catch (refreshErr) {
            console.error('[bling/proxy] Erro ao renovar token:', refreshErr);
            return res.status(500).json({
                error: 'Falha ao renovar token Bling'
            });
        }
    }

    // 4. Executar chamada para a API do Bling
    const {
        endpoint,
        params
    } = req.query;

    if (!endpoint) {
        return res.status(400).json({
            error: 'Parâmetro "endpoint" obrigatório'
        });
    }

    // Whitelist de endpoints permitidos para segurança
    const allowedEndpoints = ['/contatos', '/produtos', '/ordens-de-servico'];
    const isAllowed = allowedEndpoints.some(e => endpoint.startsWith(e));
    if (!isAllowed) {
        return res.status(403).json({
            error: 'Endpoint não permitido'
        });
    }

    try {
        const blingUrl = new URL(`https://www.bling.com.br/Api/v3${endpoint}`);

        if (params) {
            const parsedParams = JSON.parse(params);
            Object.entries(parsedParams).forEach(([k, v]) => {
                blingUrl.searchParams.set(k, String(v));
            });
        }

        const blingResponse = await fetch(blingUrl.toString(), {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            },
        });

        const data = await blingResponse.json();
        return res.status(blingResponse.status).json(data);
    } catch (err) {
        console.error('[bling/proxy] Erro ao chamar Bling API:', err);
        return res.status(500).json({
            error: 'Erro ao comunicar com a API do Bling'
        });
    }
}