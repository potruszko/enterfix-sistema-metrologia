-- ============================================
-- INTEGRAÇÃO BLING ERP - SETUP SUPABASE
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Tabela para armazenar OAuth tokens do Bling por usuário
CREATE TABLE IF NOT EXISTS public.bling_tokens (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  access_token  TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: apenas o service_role acessa (tokens gerenciados server-side)
ALTER TABLE public.bling_tokens ENABLE ROW LEVEL SECURITY;

-- Política: usuários autenticados podem VER apenas o próprio status (sem expor tokens)
CREATE POLICY "users_see_own_connection_status" ON public.bling_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Tabela de produtos importados do Bling
CREATE TABLE IF NOT EXISTS public.produtos (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bling_id          BIGINT UNIQUE,
  codigo            TEXT,
  nome              TEXT NOT NULL,
  unidade           TEXT DEFAULT 'UN',
  preco             DECIMAL(10,2),
  preco_custo       DECIMAL(10,2),
  situacao          TEXT DEFAULT 'ativo' CHECK (situacao IN ('ativo', 'inativo')),
  descricao         TEXT,
  categoria         TEXT,
  estoque_atual     DECIMAL(10,3) DEFAULT 0,
  ultima_sinc_bling TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_users_manage_produtos" ON public.produtos
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_produtos_bling_id  ON public.produtos(bling_id);
CREATE INDEX IF NOT EXISTS idx_produtos_codigo    ON public.produtos(codigo);
CREATE INDEX IF NOT EXISTS idx_produtos_situacao  ON public.produtos(situacao);

-- 3. Tabela de OS importadas do Bling
CREATE TABLE IF NOT EXISTS public.ordens_servico_bling (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bling_id            BIGINT UNIQUE,
  numero              TEXT,
  situacao            TEXT,
  data_abertura       DATE,
  data_prev_termino   DATE,
  data_encerramento   DATE,
  cliente_bling_id    BIGINT,
  cliente_nome        TEXT,
  contato_nome        TEXT,
  observacoes         TEXT,
  total               DECIMAL(10,2),
  -- Vínculo com relatorio interno (opcional)
  relatorio_id        UUID REFERENCES public.relatorios(id) ON DELETE SET NULL,
  cliente_id          UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  ultima_sinc_bling   TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ordens_servico_bling ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_users_manage_os" ON public.ordens_servico_bling
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_os_bling_id    ON public.ordens_servico_bling(bling_id);
CREATE INDEX IF NOT EXISTS idx_os_numero      ON public.ordens_servico_bling(numero);
CREATE INDEX IF NOT EXISTS idx_os_cliente_id  ON public.ordens_servico_bling(cliente_id);

-- 4. Log de sincronizações
CREATE TABLE IF NOT EXISTS public.bling_sync_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo          TEXT NOT NULL CHECK (tipo IN ('clientes', 'produtos', 'ordens_servico')),
  status        TEXT NOT NULL CHECK (status IN ('sucesso', 'erro', 'parcial')),
  total_bling   INT DEFAULT 0,
  importados    INT DEFAULT 0,
  atualizados   INT DEFAULT 0,
  erros         INT DEFAULT 0,
  detalhes      JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bling_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_logs" ON public.bling_sync_logs
  FOR ALL
  USING (auth.uid() = user_id);

-- 5. Garantir campos Bling na tabela clientes (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'bling_id') THEN
    ALTER TABLE public.clientes ADD COLUMN bling_id TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'ultima_sincronizacao_bling') THEN
    ALTER TABLE public.clientes ADD COLUMN ultima_sincronizacao_bling TIMESTAMPTZ;
  END IF;
END $$;

COMMENT ON TABLE public.bling_tokens             IS 'OAuth 2.0 tokens da integração com Bling ERP';
COMMENT ON TABLE public.produtos                 IS 'Produtos importados do Bling ERP';
COMMENT ON TABLE public.ordens_servico_bling     IS 'Ordens de Serviço importadas do Bling ERP';
COMMENT ON TABLE public.bling_sync_logs          IS 'Histórico de sincronizações com Bling ERP';
