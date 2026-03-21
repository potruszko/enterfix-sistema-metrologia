export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const rawSlug = req.query['...slug'] || req.query.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug : (rawSlug ? rawSlug.split('/') : []);
    res.json({
        pong: true,
        ts: new Date().toISOString(),
        url: req.url,
        method: req.method,
        query: req.query,
        slug_raw: rawSlug,
        slug_parsed: slug
    });
}