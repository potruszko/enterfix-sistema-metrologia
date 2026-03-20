import { query, setCors } from '../../../_db.js';
import { obterAccessToken, blingClient } from '../../_bling.js';

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

    const nome = p.nome || p.descricao || '';
    const mCorpo = nome.match(/[Øø][.\s]*(\d+[,.]?\d*)\s*MM/i);
    const diametro_corpo = mCorpo ? parseFloat(mCorpo[1].replace(',', '.')) : 0;
    const mComp = nome.match(/\bL[.\s]*(\d+[,.]?\d*)\s*MM/i);
    const comprimento = mComp ? parseFloat(mComp[1].replace(',', '.')) : 0;
    const mFuro = nome.match(/[Øø]F[.\s]*(\d+[,.]?\d*)\s*MM/i);
    const diametro_furo = mFuro ? parseFloat(mFuro[1].replace(',', '.')) : 0;
    const mRosca = nome.match(/\bM(\d+(?:[,.]?\d*)?)\b/i);
    const rosca = mRosca ? `M${mRosca[1].replace(',', '.')}` : 'M2';
    const material = /inox/i.test(nome) ? 'Inox' : /alum[íi]nio/i.test(nome) ? 'Alumínio' : 'Inox';
    const custo = parseFloat(p.precoCusto || p.preco || 0);

    await query(
      `INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (codigo) DO UPDATE SET
         descricao=EXCLUDED.descricao, bling_id=EXCLUDED.bling_id, bling_codigo=EXCLUDED.bling_codigo,
         custo=CASE WHEN EXCLUDED.custo > 0 THEN EXCLUDED.custo ELSE blanks.custo END`,
      [p.codigo, nome, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, String(p.id), p.codigo]
    );
    res.status(201).json({ mensagem: 'Blank importado com sucesso' });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ erro: err.message, detalhe: err.response?.data });
  }
}
