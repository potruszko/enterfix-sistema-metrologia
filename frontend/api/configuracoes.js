import { query, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const rows = await query('SELECT chave, valor FROM configuracoes');
      return res.json(Object.fromEntries(rows.map(r => [r.chave, r.valor])));
    }
    if (req.method === 'PUT') {
      const configs = req.body;
      for (const [chave, valor] of Object.entries(configs)) {
        await query(
          `INSERT INTO configuracoes (chave, valor) VALUES ($1, $2)
           ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor`,
          [chave, String(valor)]
        );
      }
      const rows = await query('SELECT chave, valor FROM configuracoes');
      return res.json({ mensagem: 'Configurações salvas', configs: Object.fromEntries(rows.map(r => [r.chave, r.valor])) });
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
