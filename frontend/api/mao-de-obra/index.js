import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      return res.json(await query('SELECT * FROM mao_de_obra ORDER BY descricao'));
    }
    if (req.method === 'POST') {
      const { codigo, descricao, custo, unidade, bling_id, bling_codigo } = req.body;
      if (!codigo || !descricao)
        return res.status(400).json({ erro: 'Campos obrigatórios: codigo, descricao' });
      try {
        const row = await queryOne(
          `INSERT INTO mao_de_obra (codigo, descricao, custo, unidade, bling_id, bling_codigo)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
          [codigo, descricao, custo || 0, unidade || 'UN', bling_id || null, bling_codigo || null]
        );
        return res.status(201).json({ id: row.id, ...req.body });
      } catch (err) {
        if (err.code === '23505') return res.status(409).json({ erro: `Código ${codigo} já existe` });
        throw err;
      }
    }
    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
