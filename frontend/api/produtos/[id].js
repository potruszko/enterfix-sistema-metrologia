import { query, queryOne, getPool2, setCors } from '../_db.js';

async function recalcularCusto(client, produtoId) {
  const { rows } = await client.query(
    'SELECT quantidade, custo_unitario FROM produto_componentes WHERE produto_id = $1',
    [produtoId]
  );
  const total = rows.reduce((acc, c) => acc + parseFloat(c.quantidade) * parseFloat(c.custo_unitario), 0);
  await client.query('UPDATE produtos SET custo_total = $1, updated_at = NOW() WHERE id = $2', [total, produtoId]);
  return total;
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const produto = await queryOne('SELECT * FROM produtos WHERE id = $1', [id]);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
      const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id = $1 ORDER BY tipo_componente', [id]);
      return res.json({ ...produto, componentes });
    }

    if (req.method === 'PUT') {
      const { codigo, nome, tipo, rosca, comprimento_total, diametro_esfera, preco_venda, margem, observacoes, status, componentes = [] } = req.body;
      const exists = await queryOne('SELECT id FROM produtos WHERE id = $1', [id]);
      if (!exists) return res.status(404).json({ erro: 'Produto não encontrado' });

      const client = await getPool2().connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `UPDATE produtos SET codigo=$1, nome=$2, tipo=$3, rosca=$4, comprimento_total=$5, diametro_esfera=$6,
           preco_venda=$7, margem=$8, observacoes=$9, status=$10, updated_at=NOW() WHERE id=$11`,
          [codigo, nome, tipo, rosca || null, comprimento_total || null, diametro_esfera || null, preco_venda || 0, margem || 0, observacoes || null, status || 'rascunho', id]
        );
        await client.query('DELETE FROM produto_componentes WHERE produto_id = $1', [id]);
        for (const c of componentes) {
          await client.query(
            `INSERT INTO produto_componentes (produto_id, tipo_componente, ref_id, codigo_componente, nome_componente, quantidade, custo_unitario, bling_id, bling_codigo)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [id, c.tipo_componente, c.ref_id || null, c.codigo_componente, c.nome_componente, c.quantidade, c.custo_unitario || 0, c.bling_id || null, c.bling_codigo || null]
          );
        }
        await recalcularCusto(client, id);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
      const produto = await queryOne('SELECT * FROM produtos WHERE id = $1', [id]);
      const comps = await query('SELECT * FROM produto_componentes WHERE produto_id = $1', [id]);
      return res.json({ ...produto, componentes: comps });
    }

    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM produtos WHERE id = $1 RETURNING id', [id]);
      if (!result.length) return res.status(404).json({ erro: 'Produto não encontrado' });
      return res.json({ mensagem: 'Produto removido com sucesso' });
    }

    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
