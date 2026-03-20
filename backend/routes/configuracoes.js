const express = require('express');
const router = express.Router();
const db = require('../db');

function getConfig() {
    const rows = db.prepare('SELECT chave, valor FROM configuracoes').all();
    return Object.fromEntries(rows.map(r => [r.chave, r.valor]));
}

router.get('/', (_req, res) => {
    res.json(getConfig());
});

router.put('/', (req, res) => {
    const configs = req.body; // { chave: valor, ... }
    const stmt = db.prepare('UPDATE configuracoes SET valor = ? WHERE chave = ?');
    const stmtInsert = db.prepare(
        'INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES (?, ?)'
    );

    const update = db.transaction(() => {
        for (const [chave, valor] of Object.entries(configs)) {
            stmtInsert.run(chave, String(valor));
            stmt.run(String(valor), chave);
        }
    });
    update();

    res.json({
        mensagem: 'Configurações salvas',
        configs: getConfig()
    });
});

module.exports = router;