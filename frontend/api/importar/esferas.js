import { query, setCors } from '../../_db.js';

export const config = { api: { bodyParser: false } };

function parseBR(str) {
  if (!str) return 0;
  return parseFloat(String(str).trim().replace(/\./g, '').replace(',', '.')) || 0;
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const parseRow = (line) => {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ';' && !inQuotes) { fields.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    fields.push(current.trim());
    return fields;
  };
  const headers = parseRow(lines[0]);
  return lines.slice(1).map(line => {
    const vals = parseRow(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    return obj;
  });
}

function parsearDescricaoEsfera(descricao) {
  const d = (descricao || '').toUpperCase();
  let material = 'Rubi';
  if (d.includes('METAL DURO') || d.includes('METAL-DURO')) material = 'Metal Duro';
  else if (d.includes('CERAMICA') || d.includes('CERÂMICA')) material = 'Cerâmica';
  else if (d.includes('NITRETO') || d.includes('SILICIO') || d.includes('SI3N4')) material = 'Nitreto de Silício';
  else if (d.includes('INOX') || d.includes('ACO')) material = 'Inox';
  else if (d.includes('RUBI') || d.includes('RUBY')) material = 'Rubi';
  const diaMatch = d.match(/Ø[.:\s]*([\d,]+)\s*MM/);
  const diametro = diaMatch ? parseBR(diaMatch[1]) : null;
  const tem_furo = d.includes('COM FURO') || d.includes('C/FURO');
  return { material, diametro, tem_furo };
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const csvText = Buffer.concat(chunks).toString('utf-8');

  if (!csvText) return res.status(400).json({ erro: 'Envie o CSV no body da requisição' });
  const rows = parseCSV(csvText);
  if (!rows.length) return res.status(400).json({ erro: 'CSV vazio ou inválido' });

  const resultados = { importados: 0, erros: [], ignorados: 0 };

  for (const row of rows) {
    const blingId = (row['ID'] || '').trim();
    const codigo = (row['Código'] || '').trim();
    const descricao = (row['Descrição'] || '').trim();
    const custoBling = parseBR(row['Preço de custo']);
    if (!codigo || !blingId) { resultados.ignorados++; continue; }
    const specs = parsearDescricaoEsfera(descricao);
    if (!specs.diametro) { resultados.ignorados++; continue; }
    try {
      await query(
        `INSERT INTO esferas (codigo, descricao, material, diametro, tem_furo, custo, bling_id, bling_codigo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (codigo) DO UPDATE SET
           descricao = EXCLUDED.descricao, material = EXCLUDED.material,
           diametro = EXCLUDED.diametro, tem_furo = EXCLUDED.tem_furo,
           custo = CASE WHEN EXCLUDED.custo > 0 THEN EXCLUDED.custo ELSE esferas.custo END,
           bling_id = EXCLUDED.bling_id, bling_codigo = EXCLUDED.bling_codigo`,
        [codigo, descricao, specs.material, specs.diametro, specs.tem_furo ? 1 : 0, custoBling, blingId, codigo]
      );
      resultados.importados++;
    } catch (err) {
      resultados.erros.push(`${codigo}: ${err.message}`);
    }
  }

  res.json({ mensagem: `Importação concluída: ${resultados.importados} esferas processadas`, total_csv: rows.length, ...resultados });
}
