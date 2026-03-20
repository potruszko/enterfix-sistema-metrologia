import { query, queryOne, setCors } from '../../_db.js';
import { obterAccessToken, blingClient } from '../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { produtoId } = req.query;
  try {
    const produto = await queryOne('SELECT * FROM produtos WHERE id=$1', [produtoId]);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    const componentes = await query('SELECT * FROM produto_componentes WHERE produto_id=$1', [produtoId]);

    const payload = {
      nome: produto.nome,
      codigo: produto.codigo,
      tipo: 'P',
      situacao: 'A',
      estrutura: {
        tipo: 'F',
        componentes: componentes.map(c => ({
          produto: { codigo: c.bling_codigo || c.codigo_componente },
          quantidade: c.quantidade
        }))
      }
    };

    const token = await obterAccessToken();
    const client = blingClient(token);
    let blingId = produto.bling_id;
    let respData;

    if (blingId) {
      const resp = await client.patch(`/produtos/${blingId}`, payload);
      respData = resp.data;
    } else {
      const resp = await client.post('/produtos', payload);
      respData = resp.data;
      blingId = respData?.data?.id;
      if (blingId) {
        await query('UPDATE produtos SET bling_id=$1, status=$2 WHERE id=$3', [String(blingId), 'sincronizado', produtoId]);
      }
    }

    await query('UPDATE produtos SET status=$1, updated_at=NOW() WHERE id=$2', ['sincronizado', produtoId]);
    res.json({ mensagem: 'Produto sincronizado com Bling', bling_id: blingId, resposta: respData });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ erro: 'Falha ao sincronizar com Bling', detalhe: err.response?.data || err.message });
  }
}
