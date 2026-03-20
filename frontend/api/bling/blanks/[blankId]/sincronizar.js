import { query, queryOne, setCors } from '../../../_db.js';
import { obterAccessToken, blingClient } from '../../_bling.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { blankId } = req.query;
  try {
    const blank = await queryOne('SELECT * FROM blanks WHERE id=$1', [blankId]);
    if (!blank) return res.status(404).json({ erro: 'Blank não encontrado' });

    const token = await obterAccessToken();
    const client = blingClient(token);
    const payload = {
      nome: blank.descricao || blank.codigo,
      codigo: blank.codigo,
      tipo: 'P',
      situacao: 'A',
      precoCusto: blank.custo || 0,
      preco: blank.custo || 0
    };

    let blingId = blank.bling_id;
    if (blingId) {
      await client.put(`/produtos/${blingId}`, payload);
    } else {
      const resp = await client.post('/produtos', payload);
      blingId = resp.data?.data?.id;
      if (blingId) {
        await query('UPDATE blanks SET bling_id=$1, bling_codigo=$2 WHERE id=$3', [String(blingId), blank.codigo, blankId]);
      }
    }

    res.json({ mensagem: 'Blank sincronizado com Bling', bling_id: blingId });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ erro: err.response?.data || err.message });
  }
}
