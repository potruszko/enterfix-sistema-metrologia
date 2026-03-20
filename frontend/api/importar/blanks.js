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

function parsearDescricaoBlank(descricao) {
  const d = (descricao || '').toUpperCase();
  let material = 'Inox';
  if (d.includes('METAL DURO') || d.includes('METAL-DURO')) material = 'Metal Duro';
  else if (d.includes('CERAMICA') || d.includes('CERÂMICA')) material = 'Cerâmica';
  else if (d.includes('TITANIO') || d.includes('TITÂNIO')) material = 'Titânio';
  else if (d.includes('CARBONO')) material = 'Fibra de Carbono';
  else if (d.includes('ALUMINIO') || d.includes('ALUMÍNIO')) material = 'Alumínio';
  const roscaMatch = d.match(/\bM(\d+(?:[,.]\d+)?)\b/);
  const rosca = roscaMatch ? 'M' + roscaMatch[1].replace('.', ',') : null;
  const corpoMatch = d.match(/Ø[.:\s]*([\d,]+)\s*(?:MM\s*)?X\s*L/);
  const diametro_corpo = corpoMatch ? parseBR(corpoMatch[1]) : null;
  const compMatch = d.match(/X\s*L[.:\s]*([\d,]+)\s*(?:MM)?/);
  const comprimento = compMatch ? parseBR(compMatch[1]) : null;
  const furoMatch = d.match(/ØF[.:\s]*([\d,]+)\s*(?:MM)?/);
  const diametro_furo = furoMatch ? parseBR(furoMatch[1]) : null;
  return { material, rosca, diametro_corpo, comprimento, diametro_furo };
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

  const resultados = { importados: 0, atualizados: 0, erros: [], ignorados: 0 };

  for (const row of rows) {
    const blingId = (row['ID'] || '').trim();
    const codigo = (row['Código'] || '').trim();
    const descricao = (row['Descrição'] || '').trim();
    const custoBling = parseBR(row['Preço de custo']);
    if (!codigo || !blingId) { resultados.ignorados++; continue; }
    const specs = parsearDescricaoBlank(descricao);
    if (!specs.rosca) { resultados.ignorados++; continue; }
    try {
      await query(
        `INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (codigo) DO UPDATE SET
           descricao = EXCLUDED.descricao, rosca = EXCLUDED.rosca,
           diametro_corpo = EXCLUDED.diametro_corpo, diametro_furo = EXCLUDED.diametro_furo,
           comprimento = EXCLUDED.comprimento, material = EXCLUDED.material,
           custo = CASE WHEN EXCLUDED.custo > 0 THEN EXCLUDED.custo ELSE blanks.custo END,
           bling_id = EXCLUDED.bling_id, bling_codigo = EXCLUDED.bling_codigo`,
        [codigo, descricao, specs.rosca, specs.diametro_corpo ?? 0, specs.diametro_furo ?? 0, specs.comprimento ?? 0, specs.material, custoBling, blingId, codigo]
      );
      resultados.importados++;
    } catch (err) {
      resultados.erros.push(`${codigo}: ${err.message}`);
    }
  }

  res.json({ mensagem: `Importação concluída: ${resultados.importados} blanks processados`, total_csv: rows.length, ...resultados });
}
