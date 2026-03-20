/**
 * Rota de importaÃ§Ã£o de produtos do Bling via CSV
 * POST /api/importar/blanks   â€” recebe CSV do Bling como texto
 * POST /api/importar/esferas  â€” recebe CSV do Bling como texto
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// â”€â”€â”€ UtilitÃ¡rios de parsing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Converte nÃºmero brasileiro: "8,3500" â†’ 8.35 */
function parseBR(str) {
    if (!str) return 0;
    return parseFloat(String(str).trim().replace(/\./g, '').replace(',', '.')) || 0;
}

/**
 * Parser simples de CSV com delimitador `;` e campos opcionalmente em `"`.
 * Retorna array de objetos usando a primeira linha como header.
 */
function parseCSV(text) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];

    const parseRow = (line) => {
        const fields = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === ';' && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += ch;
            }
        }
        fields.push(current.trim());
        return fields;
    };

    const headers = parseRow(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = parseRow(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = vals[idx] || '';
        });
        rows.push(obj);
    }
    return rows;
}

/**
 * Extrai specs de um blank a partir da descriÃ§Ã£o do Bling.
 * Exemplo: "BLANK INOX M2 - Ã˜. 3,0 MM X L. 6,0 MM - Ã˜F. 2,0 MM"
 * Retorna: { material, rosca, diametro_corpo, comprimento, diametro_furo }
 */
function parsearDescricaoBlank(descricao) {
    const d = (descricao || '').toUpperCase();

    // Material
    let material = 'Inox';
    if (d.includes('METAL DURO') || d.includes('METAL-DURO')) material = 'Metal Duro';
    else if (d.includes('CERAMICA') || d.includes('CERÃ‚MICA')) material = 'CerÃ¢mica';
    else if (d.includes('TITANIO') || d.includes('TITÃ‚NIO')) material = 'TitÃ¢nio';
    else if (d.includes('CARBONO')) material = 'Fibra de Carbono';
    else if (d.includes('ALUMINIO') || d.includes('ALUMÃNIO')) material = 'AlumÃ­nio';
    else if (d.includes('INOX')) material = 'Inox';

    // Rosca: M2, M3, M2,5, M1,6, M12 etc.
    const roscaMatch = d.match(/\bM(\d+(?:[,\.]\d+)?)\b/);
    const rosca = roscaMatch ? 'M' + roscaMatch[1].replace('.', ',') : null;

    // Ã˜ do corpo: "Ã˜. X,X MM" ou "Ã˜. X,X " (sem MM) antes do "X L"
    const corpoMatch = d.match(/Ã˜[.:\s]*([\d,]+)\s*(?:MM\s*)?X\s*L/);
    const diametro_corpo = corpoMatch ? parseBR(corpoMatch[1]) : null;

    // Comprimento: "X L. X,X MM" ou "X L. X,X"
    const compMatch = d.match(/X\s*L[.:\s]*([\d,]+)\s*(?:MM)?/);
    const comprimento = compMatch ? parseBR(compMatch[1]) : null;

    // Ã˜ do furo: "Ã˜F. X,X MM" ou "Ã˜F. X,X"
    const furoMatch = d.match(/Ã˜F[.:\s]*([\d,]+)\s*(?:MM)?/);
    const diametro_furo = furoMatch ? parseBR(furoMatch[1]) : null;

    return {
        material,
        rosca,
        diametro_corpo,
        comprimento,
        diametro_furo
    };
}

/**
 * Extrai specs de uma esfera a partir da descriÃ§Ã£o do Bling.
 * Exemplo: "ESFERA DE RUBI COM FURO - Ã˜. 0,5 MM"
 * Retorna: { material, diametro, tem_furo }
 */
function parsearDescricaoEsfera(descricao) {
    const d = (descricao || '').toUpperCase();

    let material = 'Rubi';
    if (d.includes('METAL DURO') || d.includes('METAL-DURO')) material = 'Metal Duro';
    else if (d.includes('CERAMICA') || d.includes('CERÃ‚MICA') || d.includes('CERÃ„MICA')) material = 'CerÃ¢mica';
    else if (d.includes('NITRETO') || d.includes('SILICIO') || d.includes('SI3N4')) material = 'Nitreto de SilÃ­cio';
    else if (d.includes('INOX') || d.includes('ACO')) material = 'Inox';
    else if (d.includes('RUBI') || d.includes('RUBY')) material = 'Rubi';

    // DiÃ¢metro: "Ã˜. X,X MM"
    const diaMatch = d.match(/Ã˜[.:\s]*([\d,]+)\s*MM/);
    const diametro = diaMatch ? parseBR(diaMatch[1]) : null;

    const tem_furo = d.includes('COM FURO') || d.includes('C/FURO');

    return {
        material,
        diametro,
        tem_furo
    };
}

// â”€â”€â”€ MigraÃ§Ã£o: adicionar colunas extras na tabela de blanks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
try {
    db.exec('ALTER TABLE blanks ADD COLUMN diametro_corpo REAL');
} catch (_) {
    /* coluna jÃ¡ existe */
}
try {
    db.exec('ALTER TABLE blanks ADD COLUMN descricao TEXT');
} catch (_) {
    /* coluna jÃ¡ existe */
}
try {
    db.exec('ALTER TABLE esferas ADD COLUMN descricao TEXT');
} catch (_) {
    /* coluna jÃ¡ existe */
}
try {
    db.exec('ALTER TABLE esferas ADD COLUMN tem_furo INTEGER DEFAULT 1');
} catch (_) {
    /* coluna jÃ¡ existe */
}

// â”€â”€â”€ POST /api/importar/blanks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post('/blanks', express.text({
    type: '*/*',
    limit: '10mb'
}), (req, res) => {
    const csvText = req.body;
    if (!csvText || typeof csvText !== 'string') {
        return res.status(400).json({
            erro: 'Envie o conteÃºdo do CSV no body da requisiÃ§Ã£o (text/csv)'
        });
    }

    const rows = parseCSV(csvText);
    if (!rows.length) return res.status(400).json({
        erro: 'CSV vazio ou invÃ¡lido'
    });

    const resultados = {
        importados: 0,
        atualizados: 0,
        erros: [],
        ignorados: 0
    };

    const stmtInsert = db.prepare(`
        INSERT INTO blanks (codigo, descricao, rosca, diametro_corpo, diametro_furo, comprimento, material, custo, bling_id, bling_codigo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(codigo) DO UPDATE SET
            descricao       = excluded.descricao,
            rosca           = excluded.rosca,
            diametro_corpo  = excluded.diametro_corpo,
            diametro_furo   = excluded.diametro_furo,
            comprimento     = excluded.comprimento,
            material        = excluded.material,
            custo           = CASE WHEN excluded.custo > 0 THEN excluded.custo ELSE custo END,
            bling_id        = excluded.bling_id,
            bling_codigo    = excluded.bling_codigo
    `);

    for (const row of rows) {
        const blingId = row['ID'] ?.trim() || '';
        const codigo = row['CÃ³digo'] ?.trim() || '';
        const descricao = row['DescriÃ§Ã£o'] ?.trim() || '';
        const custoBling = parseBR(row['PreÃ§o de custo']);

        if (!codigo || !blingId) {
            resultados.ignorados++;
            continue;
        }

        const specs = parsearDescricaoBlank(descricao);

        if (!specs.rosca) {
            // Blank sem rosca identificada â€” ignora (pode ser outro tipo de produto)
            resultados.ignorados++;
            continue;
        }

        try {
            stmtInsert.run(
                codigo,
                descricao,
                specs.rosca,
                specs.diametro_corpo ?? 0,
                specs.diametro_furo ?? 0, // 0 = desconhecido (ajustar manualmente)
                specs.comprimento ?? 0,
                specs.material,
                custoBling,
                blingId,
                codigo
            );
            resultados.importados++;
        } catch (err) {
            resultados.erros.push(`${codigo}: ${err.message}`);
        }
    }

    res.json({
        mensagem: `ImportaÃ§Ã£o concluÃ­da: ${resultados.importados} blanks processados`,
        total_csv: rows.length,
        ...resultados
    });
});

// â”€â”€â”€ POST /api/importar/esferas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post('/esferas', express.text({
    type: '*/*',
    limit: '10mb'
}), (req, res) => {
    const csvText = req.body;
    if (!csvText || typeof csvText !== 'string') {
        return res.status(400).json({
            erro: 'Envie o conteÃºdo do CSV no body da requisiÃ§Ã£o'
        });
    }

    const rows = parseCSV(csvText);
    if (!rows.length) return res.status(400).json({
        erro: 'CSV vazio ou invÃ¡lido'
    });

    const resultados = {
        importados: 0,
        erros: [],
        ignorados: 0
    };

    const stmtInsert = db.prepare(`
        INSERT INTO esferas (codigo, descricao, material, diametro, tem_furo, custo, bling_id, bling_codigo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(codigo) DO UPDATE SET
            descricao   = excluded.descricao,
            material    = excluded.material,
            diametro    = excluded.diametro,
            tem_furo    = excluded.tem_furo,
            custo       = CASE WHEN excluded.custo > 0 THEN excluded.custo ELSE esferas.custo END,
            bling_id    = excluded.bling_id,
            bling_codigo = excluded.bling_codigo
    `);

    for (const row of rows) {
        const blingId = row['ID'] ?.trim() || '';
        const codigo = row['CÃ³digo'] ?.trim() || '';
        const descricao = row['DescriÃ§Ã£o'] ?.trim() || '';
        const custoBling = parseBR(row['PreÃ§o de custo']);

        if (!codigo || !blingId) {
            resultados.ignorados++;
            continue;
        }

        const specs = parsearDescricaoEsfera(descricao);
        if (!specs.diametro) {
            resultados.ignorados++;
            continue;
        }

        try {
            stmtInsert.run(
                codigo,
                descricao,
                specs.material,
                specs.diametro,
                specs.tem_furo ? 1 : 0,
                custoBling,
                blingId,
                codigo
            );
            resultados.importados++;
        } catch (err) {
            resultados.erros.push(`${codigo}: ${err.message}`);
        }
    }

    res.json({
        mensagem: `ImportaÃ§Ã£o concluÃ­da: ${resultados.importados} esferas processadas`,
        total_csv: rows.length,
        ...resultados
    });
});

module.exports = router;
