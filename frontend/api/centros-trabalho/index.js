import { query, queryOne, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      return res.json(await query('SELECT * FROM centros_trabalho ORDER BY codigo'));
    }
    if (req.method === 'POST') {
      const { codigo, nome, custo_hora_maquina, custo_hora_operador, status, observacoes } = req.body;
      if (!codigo || !nome) return res.status(400).json({ erro: 'codigo e nome são obrigatórios' });
      try {
        const row = await queryOne(
          `INSERT INTO centros_trabalho (codigo, nome, custo_hora_maquina, custo_hora_operador, status, observacoes)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
          [codigo.toUpperCase(), nome, custo_hora_maquina || 0, custo_hora_operador || 0, status || 'ativo', observacoes || '']
        );
        return res.status(201).json({ id: row.id, mensagem: 'Centro criado' });
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
