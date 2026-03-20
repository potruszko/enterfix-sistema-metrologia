-- ============================================================
-- MIGRATION: SQLite → Supabase PostgreSQL
-- Cole este SQL no Supabase SQL Editor e execute.
-- ============================================================

-- blanks
CREATE TABLE IF NOT EXISTS blanks (
  id            SERIAL PRIMARY KEY,
  codigo        TEXT UNIQUE NOT NULL,
  descricao     TEXT,
  rosca         TEXT NOT NULL,
  diametro_corpo FLOAT DEFAULT 0,
  diametro_furo  FLOAT NOT NULL DEFAULT 0,
  comprimento    FLOAT NOT NULL DEFAULT 0,
  material       TEXT DEFAULT 'Inox',
  custo          FLOAT DEFAULT 0,
  bling_id       TEXT,
  bling_codigo   TEXT,
  observacoes    TEXT,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- hastes
CREATE TABLE IF NOT EXISTS hastes (
  id            SERIAL PRIMARY KEY,
  codigo        TEXT UNIQUE NOT NULL,
  material      TEXT NOT NULL,
  diametro      FLOAT NOT NULL,
  custo_por_mm  FLOAT DEFAULT 0,
  bling_id      TEXT,
  bling_codigo  TEXT,
  observacoes   TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- esferas
CREATE TABLE IF NOT EXISTS esferas (
  id           SERIAL PRIMARY KEY,
  codigo       TEXT UNIQUE NOT NULL,
  descricao    TEXT,
  material     TEXT NOT NULL,
  diametro     FLOAT NOT NULL,
  custo        FLOAT DEFAULT 0,
  tem_furo     INTEGER DEFAULT 1,
  bling_id     TEXT,
  bling_codigo TEXT,
  observacoes  TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- mao_de_obra
CREATE TABLE IF NOT EXISTS mao_de_obra (
  id           SERIAL PRIMARY KEY,
  codigo       TEXT UNIQUE NOT NULL,
  descricao    TEXT NOT NULL,
  custo        FLOAT DEFAULT 0,
  unidade      TEXT DEFAULT 'UN',
  bling_id     TEXT,
  bling_codigo TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- produtos
CREATE TABLE IF NOT EXISTS produtos (
  id               SERIAL PRIMARY KEY,
  codigo           TEXT UNIQUE NOT NULL,
  nome             TEXT NOT NULL,
  tipo             TEXT NOT NULL,
  rosca            TEXT,
  comprimento_total FLOAT,
  diametro_esfera  FLOAT,
  preco_venda      FLOAT DEFAULT 0,
  margem           FLOAT DEFAULT 0,
  custo_total      FLOAT DEFAULT 0,
  status           TEXT DEFAULT 'rascunho',
  bling_id         TEXT,
  observacoes      TEXT,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- produto_componentes
CREATE TABLE IF NOT EXISTS produto_componentes (
  id                SERIAL PRIMARY KEY,
  produto_id        INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
  tipo_componente   TEXT,
  ref_id            INTEGER,
  codigo_componente TEXT,
  nome_componente   TEXT,
  quantidade        FLOAT DEFAULT 1,
  custo_unitario    FLOAT DEFAULT 0,
  bling_id          TEXT,
  bling_codigo      TEXT
);

-- configuracoes (chave-valor)
CREATE TABLE IF NOT EXISTS configuracoes (
  id    SERIAL PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT DEFAULT ''
);

INSERT INTO configuracoes (chave, valor) VALUES
  ('custo_hora_mao_de_obra', '50'),
  ('margem_padrao', '30'),
  ('bling_access_token', ''),
  ('bling_refresh_token', ''),
  ('bling_token_expiry', '')
ON CONFLICT (chave) DO NOTHING;

-- centros_trabalho (já pode existir)
CREATE TABLE IF NOT EXISTS centros_trabalho (
  id                  SERIAL PRIMARY KEY,
  codigo              TEXT UNIQUE NOT NULL,
  nome                TEXT NOT NULL,
  custo_hora_maquina  FLOAT DEFAULT 0,
  custo_hora_operador FLOAT DEFAULT 0,
  status              TEXT DEFAULT 'ativo',
  observacoes         TEXT DEFAULT '',
  created_at          TIMESTAMP DEFAULT NOW()
);

-- roteiros
CREATE TABLE IF NOT EXISTS roteiros (
  id              SERIAL PRIMARY KEY,
  produto_codigo  TEXT,
  centro_id       INTEGER REFERENCES centros_trabalho(id),
  operacao        TEXT,
  tempo_padrao_min FLOAT DEFAULT 0,
  ordem           INTEGER DEFAULT 1
);

-- ordens_producao (já pode existir)
CREATE TABLE IF NOT EXISTS ordens_producao (
  id                   SERIAL PRIMARY KEY,
  numero               TEXT UNIQUE NOT NULL,
  produto_codigo       TEXT NOT NULL,
  produto_nome         TEXT DEFAULT '',
  quantidade           INTEGER DEFAULT 1,
  status               TEXT DEFAULT 'planejada',
  data_inicio          TIMESTAMP,
  data_fim             TIMESTAMP,
  custo_material       FLOAT DEFAULT 0,
  custo_processo       FLOAT DEFAULT 0,
  custo_real           FLOAT DEFAULT 0,
  bling_produto_id     TEXT DEFAULT '',
  bling_pedido_id      TEXT DEFAULT '',
  bling_pedido_numero  TEXT DEFAULT '',
  observacoes          TEXT DEFAULT '',
  created_at           TIMESTAMP DEFAULT NOW()
);

-- apontamentos (já pode existir)
CREATE TABLE IF NOT EXISTS apontamentos (
  id             SERIAL PRIMARY KEY,
  op_id          INTEGER REFERENCES ordens_producao(id) ON DELETE CASCADE,
  centro_id      INTEGER REFERENCES centros_trabalho(id),
  operacao       TEXT DEFAULT 'Produção',
  tipo           TEXT DEFAULT 'producao',
  status         TEXT DEFAULT 'em_andamento',
  motivo_parada  TEXT DEFAULT '',
  inicio         TIMESTAMP DEFAULT NOW(),
  fim            TIMESTAMP,
  duracao_min    FLOAT DEFAULT 0,
  qty_produzida  INTEGER DEFAULT 0,
  qty_refugo     INTEGER DEFAULT 0,
  custo_calculado FLOAT DEFAULT 0,
  observacoes    TEXT DEFAULT ''
);
