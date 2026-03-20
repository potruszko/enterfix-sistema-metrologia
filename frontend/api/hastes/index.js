import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const conditions = ['1=1'];
      const params = [];
      if (req.query.material) { conditions.push(`material = $${params.length + 1}`); params.push(req.query.material); }
      if (req.query.diametro) { conditions.push(`diametro = $${params.length + 1}`); params.push(parseFloat(req.query.diametro)); }
      return res.json(await query(`SELECT * FROM hastes WHERE ${conditions.join(' AND ')} ORDER BY material, diametro`, params));
    }
    if (req.method === 'POST') {
      const { codigo, material, diametro, custo_por_mm, bling_id, bling_codigo, observacoes } = req.body;
      if (!codigo || !material || diametro == null)
        return res.status(400).json({ erro: 'Campos obrigatórios: codigo, material, diametro' });
      try {
        const row = await queryOne(
          `INSERT INTO hastes (codigo, material, diametro, custo_por_mm, bling_id, bling_codigo, observacoes)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [codigo, material, diametro, custo_por_mm || 0, bling_id || null, bling_codigo || null, observacoes || null]
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
