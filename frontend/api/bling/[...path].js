// Este arquivo existe para que o Vercel roteie /api/bling/* corretamente.
// Ele delega para o handler principal injetando 'bling' no slug.
import mainHandler from '../[...slug].js';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    const rawPath = req.query['...path'];
    const path = Array.isArray(rawPath) ? rawPath : (rawPath ? rawPath.split('/') : []);
    // Injeta 'bling' como primeiro segmento para o handler principal processar normalmente
    req.query['...slug'] = ['bling', ...path];
    return mainHandler(req, res);
}
