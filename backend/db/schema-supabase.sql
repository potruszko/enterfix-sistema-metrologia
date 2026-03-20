-- ============================================================
-- SCHEMA COMPLETO MES - Enterfix / Pontas de Medição
-- Execute este SQL no Supabase SQL Editor
-- https://bxvmakbndinmrghnmyyr.supabase.co
-- ============================================================

-- ─── 1. Centros de Trabalho ───────────────────────────────────────────────────
-- Máquinas, tornos, bancadas com custo por hora
CREATE TABLE IF NOT EXISTS centros_trabalho (
    id                  BIGSERIAL PRIMARY KEY,
    codigo              TEXT NOT NULL UNIQUE,
    nome                TEXT NOT NULL,
    custo_hora_maquina  DECIMAL(10,2) DEFAULT 0,   -- Depreciação + energia
    custo_hora_operador DECIMAL(10,2) DEFAULT 0,   -- Salário + encargos
    status              TEXT DEFAULT 'ativo',       -- ativo | manutencao | inativo
    observacoes         TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. Roteiros de Produção ──────────────────────────────────────────────────
-- Sequência de operações para fabricar cada produto
CREATE TABLE IF NOT EXISTS roteiros (
    id              BIGSERIAL PRIMARY KEY,
    produto_codigo  TEXT NOT NULL,
    sequencia       INTEGER NOT NULL DEFAULT 10,
    operacao        TEXT NOT NULL,
    centro_id       BIGINT REFERENCES centros_trabalho(id) ON DELETE SET NULL,
    tempo_setup_min INTEGER DEFAULT 0,
    tempo_ciclo_min DECIMAL(10,2) DEFAULT 0,
    observacoes     TEXT
);

CREATE INDEX IF NOT EXISTS idx_roteiros_produto ON roteiros(produto_codigo);

-- ─── 3. Ordens de Produção ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ordens_producao (
    id                  BIGSERIAL PRIMARY KEY,
    numero              TEXT NOT NULL UNIQUE,
    bling_pedido_id     TEXT,
    bling_pedido_numero TEXT,
    produto_codigo      TEXT NOT NULL,
    produto_nome        TEXT,
    bling_produto_id    TEXT,
    quantidade          INTEGER NOT NULL DEFAULT 1,
    status              TEXT DEFAULT 'planejada',  -- planejada | em_producao | pausada | concluida | cancelada
    custo_material      DECIMAL(12,4) DEFAULT 0,
    custo_processo      DECIMAL(12,4) DEFAULT 0,
    custo_real          DECIMAL(12,4) DEFAULT 0,
    data_inicio         TIMESTAMPTZ,
    data_fim            TIMESTAMPTZ,
    observacoes         TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_op_status ON ordens_producao(status);
CREATE INDEX IF NOT EXISTS idx_op_produto ON ordens_producao(produto_codigo);

-- ─── 4. Apontamentos (Chão de Fábrica) ───────────────────────────────────────
-- Registro de play/stop por operação — o coração do custo real
CREATE TABLE IF NOT EXISTS apontamentos (
    id              BIGSERIAL PRIMARY KEY,
    op_id           BIGINT NOT NULL REFERENCES ordens_producao(id) ON DELETE CASCADE,
    centro_id       BIGINT REFERENCES centros_trabalho(id) ON DELETE SET NULL,
    operacao        TEXT DEFAULT 'Produção',
    tipo            TEXT DEFAULT 'producao',       -- producao | setup | parada
    status          TEXT DEFAULT 'em_andamento',   -- em_andamento | concluido
    motivo_parada   TEXT,
    inicio          TIMESTAMPTZ DEFAULT NOW(),
    fim             TIMESTAMPTZ,
    duracao_min     DECIMAL(10,2),
    qty_produzida   INTEGER DEFAULT 0,
    qty_refugo      INTEGER DEFAULT 0,             -- Scrap — cost driver real!
    custo_calculado DECIMAL(12,4) DEFAULT 0,
    observacoes     TEXT
);

CREATE INDEX IF NOT EXISTS idx_apt_op ON apontamentos(op_id);
CREATE INDEX IF NOT EXISTS idx_apt_status ON apontamentos(status);

-- ─── 5. View: Custo por Ordem de Produção ────────────────────────────────────
CREATE OR REPLACE VIEW v_custo_op AS
SELECT
    op.id,
    op.numero,
    op.produto_codigo,
    op.quantidade,
    op.status,
    op.custo_material,
    COALESCE(SUM(a.custo_calculado), 0)                                            AS custo_processo_calculado,
    op.custo_material + COALESCE(SUM(a.custo_calculado), 0)                        AS custo_real_calculado,
    COALESCE(SUM(a.duracao_min), 0)                                                AS total_minutos,
    COALESCE(SUM(a.qty_produzida), 0)                                              AS total_produzido,
    COALESCE(SUM(a.qty_refugo), 0)                                                 AS total_refugo,
    COUNT(CASE WHEN a.status = 'em_andamento' THEN 1 END)                         AS apontamentos_ativos,
    CASE
        WHEN op.quantidade > 0 AND COALESCE(SUM(a.custo_calculado), 0) > 0
        THEN (op.custo_material + COALESCE(SUM(a.custo_calculado), 0)) / op.quantidade
        ELSE 0
    END                                                                            AS custo_unitario
FROM ordens_producao op
LEFT JOIN apontamentos a ON a.op_id = op.id
GROUP BY op.id, op.numero, op.produto_codigo, op.quantidade, op.status,
         op.custo_material, op.custo_processo, op.custo_real;

-- ─── 6. Permissões (desativa RLS para acesso via service role / backend) ──────
-- Se quiser usar RLS com o anon key, configure políticas abaixo.
-- Por enquanto, permite tudo para o backend via connection string direta.
ALTER TABLE centros_trabalho DISABLE ROW LEVEL SECURITY;
ALTER TABLE roteiros         DISABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_producao  DISABLE ROW LEVEL SECURITY;
ALTER TABLE apontamentos     DISABLE ROW LEVEL SECURITY;
