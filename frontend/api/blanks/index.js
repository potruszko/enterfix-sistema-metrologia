import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const conditions = ['1=1'];
      const params = [];
      if (req.query.rosca) { conditions.push(`rosca = $${params.length + 1}`); params.push(req.query.rosca); }
      if (req.query.diametro_furo) { conditions.push(`diametro_furo = $${params.length + 1}`); params.push(parseFloat(req.query.diametro_furo)); }
      const sql = `SELECT * FROM blanks WHERE ${conditions.join(' AND ')} ORDER BY rosca, diametro_furo, comprimento`;
      return res.json(await query(sql, params));
    }
    if (req.method === 'POST') {
      const { codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo, observacoes } = req.body;
      if (!codigo || !rosca || diametro_furo == null || comprimento == null)
        return res.status(400).json({ erro: 'Campos obrigatórios: codigo, rosca, diametro_furo, comprimento' });
      try {
        const row = await queryOne(
          `INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo, observacoes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
          [codigo, descricao || null, rosca, diametro_corpo || 0, diametro_furo, comprimento, material || 'Inox', custo || 0, bling_id || null, bling_codigo || null, observacoes || null]
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
