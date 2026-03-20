const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'composicoes.db');

let db;

try {
  const { DatabaseSync } = require('node:sqlite');

  // garante que a pasta data existe
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
} catch (err) {
  console.warn('⚠️  SQLite não disponível neste ambiente:', err.message);
  console.warn('   Rotas SQLite retornarão 503. Rotas PostgreSQL continuam funcionando.');
  // Stub: permite que o servidor suba, mas falha nas chamadas individuais
  const unavailable = () => { throw Object.assign(new Error('SQLite não disponível neste ambiente (requer Node.js 22+)'), { code: 'SQLITE_UNAVAILABLE' }); };
  db = {
    prepare: () => ({ all: unavailable, get: unavailable, run: unavailable }),
    exec: () => {},
  };
}

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((item) => item.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

// ─── SCHEMA ───────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS blanks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo          TEXT    NOT NULL UNIQUE,
    rosca           TEXT    NOT NULL,          -- M2, M3, M4, M5, M6, M8
    diametro_furo   REAL    NOT NULL,          -- mm (define haste compatível)
    comprimento     REAL    NOT NULL,          -- mm
    material        TEXT    DEFAULT 'Inox',
    custo           REAL    DEFAULT 0,
    bling_id        TEXT,
    bling_codigo    TEXT,
    observacoes     TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS hastes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo          TEXT    NOT NULL UNIQUE,
    material        TEXT    NOT NULL,          -- MD, Inox, Ceramica, Fibra, Titanio
    diametro        REAL    NOT NULL,          -- mm
    custo_por_mm    REAL    DEFAULT 0,         -- custo por mm de comprimento
    bling_id        TEXT,
    bling_codigo    TEXT,
    observacoes     TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS esferas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo          TEXT    NOT NULL UNIQUE,
    material        TEXT    NOT NULL,          -- Rubi, Ceramica, Inox, Metal Duro
    diametro        REAL    NOT NULL,          -- mm: 0.5,0.7,0.8,1.0,1.5,2.0...10.0
    custo           REAL    DEFAULT 0,
    bling_id        TEXT,
    bling_codigo    TEXT,
    observacoes     TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mao_de_obra (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo          TEXT    NOT NULL UNIQUE,
    descricao       TEXT    NOT NULL,
    custo           REAL    DEFAULT 0,         -- custo unitário (por peça ou por hora)
    unidade         TEXT    DEFAULT 'UN',      -- UN, HR
    bling_id        TEXT,
    bling_codigo    TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo          TEXT    NOT NULL UNIQUE,
    nome            TEXT    NOT NULL,
    tipo            TEXT    NOT NULL,          -- PM, EM, AM, SM, DM, BM
    rosca           TEXT,                      -- M2, M3, M4, M5, M6, M8
    comprimento_total REAL,                    -- mm
    diametro_esfera REAL,                      -- mm
    custo_total     REAL    DEFAULT 0,
    preco_venda     REAL    DEFAULT 0,
    margem          REAL    DEFAULT 0,         -- %
    bling_id        TEXT,
    status          TEXT    DEFAULT 'rascunho',-- rascunho | sincronizado
    observacoes     TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS produto_componentes (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id          INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    tipo_componente     TEXT    NOT NULL,      -- blank | haste | esfera | mao_de_obra | outro
    ref_id              INTEGER,              -- id na tabela de origem (opcional)
    codigo_componente   TEXT    NOT NULL,
    nome_componente     TEXT,
    quantidade          REAL    NOT NULL DEFAULT 1,
    custo_unitario      REAL    DEFAULT 0,
    bling_id            TEXT,
    bling_codigo        TEXT
  );

  CREATE TABLE IF NOT EXISTS configuracoes (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    chave   TEXT NOT NULL UNIQUE,
    valor   TEXT,
    descricao TEXT
  );

  -- Dados de configuração padrão
  INSERT OR IGNORE INTO configuracoes (chave, valor, descricao) VALUES
    ('bling_access_token',  '', 'Token de acesso Bling API v3'),
    ('bling_refresh_token', '', 'Token de refresh Bling API v3'),
    ('bling_token_expiry',  '', 'Expiração do token (ISO 8601)'),
    ('hora_maquina',        '150', 'Custo por hora da máquina Nexturn (R$)'),
    ('lote_padrao',         '10', 'Lote padrão para rateio de setup');
`);

ensureColumn('blanks', 'descricao', 'TEXT');
ensureColumn('blanks', 'diametro_corpo', 'REAL DEFAULT 0');
ensureColumn('esferas', 'descricao', 'TEXT');
ensureColumn('esferas', 'tem_furo', 'INTEGER DEFAULT 1');

// ─── MES (Manufacturing Execution System) ────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS centros_trabalho (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo              TEXT    NOT NULL UNIQUE,
    nome                TEXT    NOT NULL,
    custo_hora_maquina  REAL    DEFAULT 0,
    custo_hora_operador REAL    DEFAULT 0,
    status              TEXT    DEFAULT 'ativo',
    observacoes         TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS roteiros (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_codigo  TEXT    NOT NULL,
    sequencia       INTEGER NOT NULL DEFAULT 10,
    operacao        TEXT    NOT NULL,
    centro_id       INTEGER REFERENCES centros_trabalho(id) ON DELETE SET NULL,
    tempo_setup_min INTEGER DEFAULT 0,
    tempo_ciclo_min REAL    DEFAULT 0,
    observacoes     TEXT
  );

  CREATE TABLE IF NOT EXISTS ordens_producao (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    numero              TEXT    NOT NULL UNIQUE,
    bling_pedido_id     TEXT,
    bling_pedido_numero TEXT,
    produto_codigo      TEXT    NOT NULL,
    produto_nome        TEXT,
    bling_produto_id    TEXT,
    quantidade          INTEGER NOT NULL DEFAULT 1,
    status              TEXT    DEFAULT 'planejada',
    custo_material      REAL    DEFAULT 0,
    custo_processo      REAL    DEFAULT 0,
    custo_real          REAL    DEFAULT 0,
    data_inicio         DATETIME,
    data_fim            DATETIME,
    observacoes         TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS apontamentos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    op_id           INTEGER NOT NULL REFERENCES ordens_producao(id) ON DELETE CASCADE,
    centro_id       INTEGER REFERENCES centros_trabalho(id) ON DELETE SET NULL,
    operacao        TEXT    DEFAULT 'Produção',
    tipo            TEXT    DEFAULT 'producao',
    status          TEXT    DEFAULT 'em_andamento',
    motivo_parada   TEXT,
    inicio          DATETIME DEFAULT CURRENT_TIMESTAMP,
    fim             DATETIME,
    duracao_min     REAL,
    qty_produzida   INTEGER DEFAULT 0,
    qty_refugo      INTEGER DEFAULT 0,
    custo_calculado REAL    DEFAULT 0,
    observacoes     TEXT
  );
`);

module.exports = db;