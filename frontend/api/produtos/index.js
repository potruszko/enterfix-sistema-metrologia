import { query, queryOne, getPool2, setCors } from '../_db.js';

async function recalcularCusto(client, produtoId) {
  const { rows } = await client.query(
    'SELECT quantidade, custo_unitario FROM produto_componentes WHERE produto_id = $1',
    [produtoId]
  );
  const total = rows.reduce((acc, c) => acc + parseFloat(c.quantidade) * parseFloat(c.custo_unitario), 0);
  await client.query(
    'UPDATE produtos SET custo_total = $1, updated_at = NOW() WHERE id = $2',
    [total, produtoId]
  );
  return total;
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const conditions = ['1=1'];
      const params = [];
      if (req.query.tipo) { conditions.push(`p.tipo = $${params.length + 1}`); params.push(req.query.tipo); }
      if (req.query.rosca) { conditions.push(`p.rosca = $${params.length + 1}`); params.push(req.query.rosca); }
      if (req.query.status) { conditions.push(`p.status = $${params.length + 1}`); params.push(req.query.status); }
      if (req.query.q) {
        const t = `%${req.query.q}%`;
        conditions.push(`(p.codigo ILIKE $${params.length + 1} OR p.nome ILIKE $${params.length + 2})`);
        params.push(t, t);
      }
      const sql = `
        SELECT p.*,
          EXISTS(SELECT 1 FROM produto_componentes pc WHERE pc.produto_id = p.id) AS tem_composicao,
          (SELECT COUNT(*) FROM produto_componentes pc WHERE pc.produto_id = p.id) AS quantidade_componentes
        FROM produtos p
        WHERE ${conditions.join(' AND ')}
        ORDER BY p.codigo
      `;
      return res.json(await query(sql, params));
    }

    if (req.method === 'POST') {
      const { codigo, nome, tipo, rosca, comprimento_total, diametro_esfera, preco_venda, margem, observacoes, componentes = [] } = req.body;
      if (!codigo || !nome || !tipo)
        return res.status(400).json({ erro: 'Campos obrigatórios: codigo, nome, tipo' });

      const client = await getPool2().connect();
      try {
        await client.query('BEGIN');
        const { rows: [{ id: produtoId }] } = await client.query(
          `INSERT INTO produtos (codigo, nome, tipo, rosca, comprimento_total, diametro_esfera, preco_venda, margem, observacoes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
          [codigo, nome, tipo, rosca || null, comprimento_total || null, diametro_esfera || null, preco_venda || 0, margem || 0, observacoes || null]
        );
        for (const c of componentes) {
          await client.query(
            `INSERT INTO produto_componentes (produto_id, tipo_componente, ref_id, codigo_componente, nome_componente, quantidade, custo_unitario, bling_id, bling_codigo)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [produtoId, c.tipo_componente, c.ref_id || null, c.codigo_componente, c.nome_componente, c.quantidade, c.custo_unitario || 0, c.bling_id || null, c.bling_codigo || null]
          );
        }
        await recalcularCusto(client, produtoId);
        await client.query('COMMIT');
        const produto = await queryOne('SELECT * FROM produtos WHERE id = $1', [produtoId]);
        const comps = await query('SELECT * FROM produto_componentes WHERE produto_id = $1', [produtoId]);
        return res.status(201).json({ ...produto, componentes: comps });
      } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') return res.status(409).json({ erro: `Código ${codigo} já existe` });
        throw err;
      } finally {
        client.release();
      }
    }

    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
