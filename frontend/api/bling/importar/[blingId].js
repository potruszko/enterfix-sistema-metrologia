import { query, queryOne, setCors } from '../../_db.js';
import { obterAccessToken, blingClient } from '../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { blingId } = req.query;
  try {
    const token = await obterAccessToken();
    const resp = await blingClient(token).get(`/produtos/${blingId}`);
    const p = resp.data?.data;
    if (!p) return res.status(404).json({ erro: 'Produto não encontrado no Bling' });

    const existente = await queryOne('SELECT id FROM produtos WHERE codigo=$1', [p.codigo]);
    if (existente) return res.status(409).json({ erro: `Produto ${p.codigo} já existe localmente`, id: existente.id });

    const prefixos = ['PM', 'EM', 'AM', 'SM', 'DM', 'BM', 'CM'];
    const tipo = prefixos.find(k => p.codigo?.toUpperCase().startsWith(k)) || 'PM';

    const row = await queryOne(
      `INSERT INTO produtos (codigo, nome, tipo, bling_id, status) VALUES ($1,$2,$3,$4,'sincronizado') RETURNING id`,
      [p.codigo, p.nome, tipo, String(p.id)]
    );
    res.status(201).json({ mensagem: 'Importado com sucesso', id: row.id });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ erro: err.message, detalhe: err.response?.data });
  }
}
