-- ============================================
-- TABELA DE CONFIGURAÇÕES DA EMPRESA
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Criar tabela de configurações (apenas 1 registro por sistema)
CREATE TABLE IF NOT EXISTS public.configuracoes_empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados básicos
  nome_empresa TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj TEXT NOT NULL,
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  
  -- Endereço
  endereco_completo TEXT,
  cep TEXT,
  cidade TEXT,
  estado TEXT,
  
  -- Contatos
  telefone TEXT,
  celular TEXT,
  email TEXT,
  website TEXT,
  
  -- Dados adicionais para contratos
  acreditacao_inmetro TEXT, -- Ex: RBC-XXXX
  regime_tributario TEXT,
  
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  CONSTRAINT unico_config UNIQUE (id)
);

-- Comentários
COMMENT ON TABLE public.configuracoes_empresa IS 'Configurações da empresa (singleton - apenas 1 registro)';
COMMENT ON COLUMN public.configuracoes_empresa.nome_empresa IS 'Razão social completa';
COMMENT ON COLUMN public.configuracoes_empresa.acreditacao_inmetro IS 'Número de acreditação RBC (se aplicável)';

-- Índices
CREATE INDEX IF NOT EXISTS idx_config_empresa_cnpj ON public.configuracoes_empresa(cnpj);

-- RLS Policies
ALTER TABLE public.configuracoes_empresa ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ler
CREATE POLICY "Usuários autenticados podem ler configurações"
  ON public.configuracoes_empresa FOR SELECT
  USING (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem atualizar (apenas admin deveria, mas simplificado)
CREATE POLICY "Usuários autenticados podem atualizar configurações"
  ON public.configuracoes_empresa FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Permitir insert para criar registro inicial
CREATE POLICY "Usuários autenticados podem inserir configurações"
  ON public.configuracoes_empresa FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_config()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp
DROP TRIGGER IF EXISTS trigger_atualizar_timestamp_config ON public.configuracoes_empresa;
CREATE TRIGGER trigger_atualizar_timestamp_config
  BEFORE UPDATE ON public.configuracoes_empresa
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_config();

-- Inserir configuração padrão (baseada nos dados do usuário)
INSERT INTO public.configuracoes_empresa (
  nome_empresa,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  endereco_completo,
  cep,
  cidade,
  estado,
  telefone,
  email,
  website
) VALUES (
  'ENTERFIX INDUSTRIA COMERCIO E SERVIÇOS LTDA',
  'Enterfix Ind. Com. Serv. Ltda.',
  '13.250.539/0001-40',
  '635.379.359.117',
  'Rua Waldemar Martins Ferreira, 287, Vila Alvinópolis',
  '09891-010',
  'São Bernardo do Campo',
  'SP',
  '(11) 4942-2222',
  'service@enterfix.com.br',
  'www.enterfix.com.br'
)
ON CONFLICT (id) DO NOTHING;

-- Verificação
SELECT * FROM public.configuracoes_empresa;

-- Mensagem de sucesso
DO $$ 
BEGIN
  RAISE NOTICE '✅ Tabela configuracoes_empresa criada com sucesso!';
  RAISE NOTICE '✅ Dados padrão inseridos!';
  RAISE NOTICE '📝 Configure os dados na página Configurações do sistema.';
END $$;
