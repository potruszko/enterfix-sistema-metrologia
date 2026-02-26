-- ============================================
-- EXPANSÃO TABELA CLIENTES - CAMPOS BLING ERP
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Adicionar campos compatíveis com Bling ERP
DO $$ 
BEGIN
  -- Dados cadastrais
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'codigo') THEN
    ALTER TABLE public.clientes ADD COLUMN codigo TEXT; -- Código interno do cliente
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'tipo_pessoa') THEN
    ALTER TABLE public.clientes ADD COLUMN tipo_pessoa TEXT DEFAULT 'juridica' CHECK (tipo_pessoa IN ('fisica', 'juridica'));
  END IF;
  
  -- Dados fiscais
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'regime_tributario') THEN
    ALTER TABLE public.clientes ADD COLUMN regime_tributario TEXT; -- Simples Nacional, Lucro Presumido, etc
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'contribuinte_icms') THEN
    ALTER TABLE public.clientes ADD COLUMN contribuinte_icms BOOLEAN DEFAULT false;
  END IF;
  
  -- Contatos adicionais
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'fax') THEN
    ALTER TABLE public.clientes ADD COLUMN fax TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'email_nfe') THEN
    ALTER TABLE public.clientes ADD COLUMN email_nfe TEXT; -- E-mail específico para NF-e
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'whatsapp') THEN
    ALTER TABLE public.clientes ADD COLUMN whatsapp TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'skype') THEN
    ALTER TABLE public.clientes ADD COLUMN skype TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'site') THEN
    ALTER TABLE public.clientes ADD COLUMN site TEXT;
  END IF;
  
  -- Dados comerciais
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'primeira_visita') THEN
    ALTER TABLE public.clientes ADD COLUMN primeira_visita DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'tipo_contato') THEN
    ALTER TABLE public.clientes ADD COLUMN tipo_contato TEXT; -- Cliente, Fornecedor, Prospect, etc
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'situacao') THEN
    ALTER TABLE public.clientes ADD COLUMN situacao TEXT DEFAULT 'ativo' CHECK (situacao IN ('ativo', 'inativo', 'bloqueado', 'prospect'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'vendedor_responsavel') THEN
    ALTER TABLE public.clientes ADD COLUMN vendedor_responsavel TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'natureza_operacao') THEN
    ALTER TABLE public.clientes ADD COLUMN natureza_operacao TEXT; -- CFOP padrão
  END IF;
  
  -- Dados financeiros
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'limite_credito') THEN
    ALTER TABLE public.clientes ADD COLUMN limite_credito DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'condicao_pagamento') THEN
    ALTER TABLE public.clientes ADD COLUMN condicao_pagamento TEXT; -- Ex: "30 dias", "À vista", etc
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'categoria_financeira') THEN
    ALTER TABLE public.clientes ADD COLUMN categoria_financeira TEXT;
  END IF;
  
  -- Observações
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'observacoes_gerais') THEN
    ALTER TABLE public.clientes ADD COLUMN observacoes_gerais TEXT;
  END IF;
  
  -- Integração Bling
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'bling_id') THEN
    ALTER TABLE public.clientes ADD COLUMN bling_id TEXT UNIQUE; -- ID do cliente no Bling ERP
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'ultima_sincronizacao_bling') THEN
    ALTER TABLE public.clientes ADD COLUMN ultima_sincronizacao_bling TIMESTAMPTZ;
  END IF;
  
  RAISE NOTICE 'Campos do Bling ERP adicionados com sucesso!';
END $$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_codigo ON public.clientes(codigo);
CREATE INDEX IF NOT EXISTS idx_clientes_tipo_pessoa ON public.clientes(tipo_pessoa);
CREATE INDEX IF NOT EXISTS idx_clientes_situacao ON public.clientes(situacao);
CREATE INDEX IF NOT EXISTS idx_clientes_bling_id ON public.clientes(bling_id);
CREATE INDEX IF NOT EXISTS idx_clientes_cidade_estado ON public.clientes(cidade, estado);

-- Comentários para documentação
COMMENT ON COLUMN public.clientes.codigo IS 'Código interno único do cliente (pode ser diferente do ID)';
COMMENT ON COLUMN public.clientes.tipo_pessoa IS 'Pessoa Física ou Jurídica';
COMMENT ON COLUMN public.clientes.regime_tributario IS 'Regime tributário: Simples Nacional, Lucro Presumido, Lucro Real';
COMMENT ON COLUMN public.clientes.contribuinte_icms IS 'Se é contribuinte do ICMS';
COMMENT ON COLUMN public.clientes.email_nfe IS 'E-mail específico para envio de Notas Fiscais Eletrônicas';
COMMENT ON COLUMN public.clientes.situacao IS 'Status do cliente: ativo, inativo, bloqueado, prospect';
COMMENT ON COLUMN public.clientes.bling_id IS 'ID do cliente no Bling ERP para sincronização';
COMMENT ON COLUMN public.clientes.limite_credito IS 'Limite de crédito aprovado para o cliente';
