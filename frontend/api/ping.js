export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ pong: true, ts: new Date().toISOString(), slug: req.query });
}
