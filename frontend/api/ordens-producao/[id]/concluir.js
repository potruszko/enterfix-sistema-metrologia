import { query, queryOne, setCors } from '../../_db.js';

async function calcularCustoProcesso(opId) {
  const rows = await query(
    `SELECT a.duracao_min, ct.custo_hora_maquina, ct.custo_hora_operador
     FROM apontamentos a
     LEFT JOIN centros_trabalho ct ON ct.id = a.centro_id
     WHERE a.op_id = $1 AND a.status = 'concluido'`,
    [opId]
  );
  return rows.reduce((total, a) => {
    const horas = (parseFloat(a.duracao_min) || 0) / 60;
    const taxa = (parseFloat(a.custo_hora_maquina) || 0) + (parseFloat(a.custo_hora_operador) || 0);
    return total + horas * taxa;
  }, 0);
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { id } = req.query;
  try {
    const op = await queryOne('SELECT * FROM ordens_producao WHERE id=$1', [id]);
    if (!op) return res.status(404).json({ erro: 'OP não encontrada' });

    await query(
      `UPDATE apontamentos
       SET status='concluido', fim=NOW(),
           duracao_min = ROUND(EXTRACT(EPOCH FROM (NOW() - inicio)) / 60, 2)
       WHERE op_id=$1 AND status='em_andamento'`,
      [id]
    );

    const custo_processo = await calcularCustoProcesso(id);
    const custo_real = (parseFloat(op.custo_material) || 0) + custo_processo;

    await query(
      `UPDATE ordens_producao SET status='concluida', custo_processo=$1, custo_real=$2, data_fim=NOW() WHERE id=$3`,
      [custo_processo, custo_real, id]
    );

    res.json({
      mensagem: 'OP concluída com sucesso',
      custo_real,
      custo_processo,
      custo_material: parseFloat(op.custo_material) || 0
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
