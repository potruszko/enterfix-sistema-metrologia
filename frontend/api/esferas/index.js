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
      return res.json(await query(`SELECT * FROM esferas WHERE ${conditions.join(' AND ')} ORDER BY material, diametro`, params));
    }
    if (req.method === 'POST') {
      const { codigo, descricao, material, diametro, custo, tem_furo, bling_id, bling_codigo, observacoes } = req.body;
      if (!codigo || !material || diametro == null)
        return res.status(400).json({ erro: 'Campos obrigatórios: codigo, material, diametro' });
      try {
        const row = await queryOne(
          `INSERT INTO esferas (codigo, descricao, material, diametro, custo, tem_furo, bling_id, bling_codigo, observacoes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
          [codigo, descricao || null, material, diametro, custo || 0, tem_furo != null ? tem_furo : 1, bling_id || null, bling_codigo || null, observacoes || null]
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
