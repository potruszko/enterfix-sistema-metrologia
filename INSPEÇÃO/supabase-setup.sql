-- ============================================
-- ENTERFIX METROLOGIA - CONFIGURAÇÃO DO BANCO
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- PASSO 1: Criar tabela base (sem a coluna nova)
CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL,
  cliente TEXT,
  projeto_os TEXT,
  dados JSONB NOT NULL,  -- Inclui: medicoes (cada med com equipamento opcional), fotos (base64), versao, numeroRelatorio, relatorioOriginal
  status_final TEXT,     -- APROVADO ou REPROVADO (baseado nas medições)
  tecnico_nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 2: Adicionar coluna status_relatorio (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'relatorios' AND column_name = 'status_relatorio'
  ) THEN
    ALTER TABLE relatorios ADD COLUMN status_relatorio TEXT DEFAULT 'rascunho';
    
    -- Atualizar registros antigos para 'emitido' (assumindo que já foram emitidos)
    UPDATE relatorios SET status_relatorio = 'emitido' WHERE status_relatorio IS NULL;
    
    RAISE NOTICE 'Coluna status_relatorio adicionada com sucesso!';
  ELSE
    RAISE NOTICE 'Coluna status_relatorio já existe.';
  END IF;
END $$;

-- PASSO 3: Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente ON relatorios(cliente);
CREATE INDEX IF NOT EXISTS idx_relatorios_tipo ON relatorios(tipo);
CREATE INDEX IF NOT EXISTS idx_relatorios_status ON relatorios(status_final);
CREATE INDEX IF NOT EXISTS idx_relatorios_status_relatorio ON relatorios(status_relatorio);
CREATE INDEX IF NOT EXISTS idx_relatorios_created_at ON relatorios(created_at DESC);

-- Índice para busca por número de relatório (versionamento)
CREATE INDEX IF NOT EXISTS idx_relatorios_numero ON relatorios USING GIN ((dados->'numeroRelatorio'));

-- Índice para busca por relatório original (versões)
CREATE INDEX IF NOT EXISTS idx_relatorios_original ON relatorios USING GIN ((dados->'relatorioOriginal'));

-- PASSO 4: Habilitar Row Level Security (RLS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'relatorios' AND policyname = 'Permitir todas operações'
  ) THEN
    ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Permitir todas operações" ON relatorios
      FOR ALL
      USING (true)
      WITH CHECK (true);
      
    RAISE NOTICE 'RLS e política criados com sucesso!';
  ELSE
    RAISE NOTICE 'Política RLS já existe.';
  END IF;
END $$;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar se a tabela foi criada corretamente
SELECT 
  table_name,
  column_name,
  data_type,
  column_default
FROM 
  information_schema.columns
WHERE 
  table_name = 'relatorios'
ORDER BY 
  ordinal_position;

-- Verificar índices criados
SELECT 
  tablename,
  indexname,
  indexdef
FROM 
  pg_indexes
WHERE 
  tablename = 'relatorios'
ORDER BY 
  indexname;
