import axios from 'axios';
import {
    query,
    queryOne
} from '../_db.js';

export const BLING_API = 'https://www.bling.com.br/Api/v3';

export function getOAuthConfig() {
    const clientId     = process.env.BLING_CLIENT_ID     || 'fa9f73b7934f56edb9f8c40a3a81b7abc2d4f365';
    const clientSecret = process.env.BLING_CLIENT_SECRET || '2684d10caffd971a4e8a293b4a9543e1954c23cfcb3b089558263d7d6edd';
    return {
        clientId,
        clientSecret,
        configured: !!(clientId && clientSecret)
    };
}

const PROD_URL = 'https://composicao.enterfix.com.br';

export function getBackendUrl() {
    if (process.env.APP_URL) return process.env.APP_URL;
    return PROD_URL;
}

export function getFrontendUrl() {
    if (process.env.APP_URL) return process.env.APP_URL;
    return PROD_URL;
}

export async function getTokens() {
    const rows = await query(
        "SELECT chave, valor FROM configuracoes WHERE chave IN ('bling_access_token','bling_refresh_token','bling_token_expiry')"
    );
    return Object.fromEntries(rows.map(r => [r.chave, r.valor]));
}

export async function saveTokens({
    access_token,
    refresh_token,
    expires_in
}) {
    const expiry = new Date(Date.now() + (expires_in - 60) * 1000).toISOString();
    const upsert = `INSERT INTO configuracoes (chave, valor) VALUES ($1,$2)
    ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor`;
    await Promise.all([
        query(upsert, ['bling_access_token', access_token]),
        query(upsert, ['bling_refresh_token', refresh_token || '']),
        query(upsert, ['bling_token_expiry', expiry]),
    ]);
}

export async function obterAccessToken() {
    const tokens = await getTokens();

    if (tokens.bling_access_token && tokens.bling_token_expiry) {
        if (new Date(tokens.bling_token_expiry) > new Date()) {
            return tokens.bling_access_token;
        }
    }

    if (tokens.bling_refresh_token) {
        try {
            const {
                clientId,
                clientSecret,
                configured
            } = getOAuthConfig();
            if (!configured) throw new Error('BLING_CLIENT_ID e BLING_CLIENT_SECRET não configurados');
            const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
            const resp = await axios.post(
                `${BLING_API}/oauth/token`,
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: tokens.bling_refresh_token
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            await saveTokens(resp.data);
            return resp.data.access_token;
        } catch {
            // refresh falhou — precisa reautenticar
        }
    }

    if (process.env.BLING_ACCESS_TOKEN) return process.env.BLING_ACCESS_TOKEN;

    throw new Error('Token Bling não configurado. Acesse /configuracoes para autenticar.');
}

export function blingClient(token) {
    return axios.create({
        baseURL: BLING_API,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}