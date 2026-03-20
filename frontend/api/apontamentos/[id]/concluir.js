import { query, queryOne, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ erro: 'Método não permitido' });
  const { id } = req.query;
  const { qty_produzida, qty_refugo, observacoes } = req.body;
  try {
    const apt = await queryOne(
      `SELECT a.*, ct.custo_hora_maquina, ct.custo_hora_operador
       FROM apontamentos a
       LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
       WHERE a.id=$1`,
      [id]
    );
    if (!apt) return res.status(404).json({ erro: 'Apontamento não encontrado' });

    const durMin = await queryOne(
      `SELECT ROUND(EXTRACT(EPOCH FROM (NOW() - $1::timestamptz)) / 60, 2) AS min`,
      [apt.inicio]
    );
    const duracao_min = parseFloat(durMin.min) || 0;
    const horas = duracao_min / 60;
    const taxa = (parseFloat(apt.custo_hora_maquina) || 0) + (parseFloat(apt.custo_hora_operador) || 0);
    const custo_calculado = horas * taxa;

    await query(
      `UPDATE apontamentos
       SET status='concluido', fim=NOW(), duracao_min=$1,
           qty_produzida=$2, qty_refugo=$3, custo_calculado=$4, observacoes=$5
       WHERE id=$6`,
      [duracao_min, qty_produzida || 0, qty_refugo || 0, custo_calculado, observacoes || '', id]
    );
    res.json({ mensagem: 'Apontamento concluído', duracao_min, custo_calculado });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
