-- ============================================
-- MÓDULO DE CONTRATOS - ENTERFIX METROLOGIA
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- PASSO 1: Criar tabela de CLIENTES (se não existir)
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj TEXT UNIQUE,
  cpf TEXT,
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  
  -- Contatos
  email TEXT,
  telefone TEXT,
  celular TEXT,
  contato_responsavel TEXT,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  
  -- Informações comerciais
  ramo_atividade TEXT,
  porte_empresa TEXT, -- MEI, ME, EPP, Grande
  
  -- Metadados
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- PASSO 2: Criar tabela de CONTRATOS
CREATE TABLE IF NOT EXISTS public.contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  numero_contrato TEXT UNIQUE NOT NULL, -- Ex: CT-2026-001
  tipo_contrato TEXT NOT NULL, -- 'prestacao_servico', 'comodato', 'manutencao', 'sla', 'consultoria', 'gestao_parque', 'suporte', 'validacao', 'nda'
  
  -- Partes envolvidas
  cliente_id UUID NOT NULL REFERENCES public.clientes(id),
  numero_os_bling TEXT, -- Referência à OS do Bling ERP
  
  -- Vigência
  data_inicio DATE NOT NULL,
  data_fim DATE,
  prazo_indeterminado BOOLEAN DEFAULT false,
  renovacao_automatica BOOLEAN DEFAULT false,
  
  -- Valores (opcional, pode estar no Bling)
  valor_mensal DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  forma_pagamento TEXT, -- 'mensal', 'anual', 'por_servico'
  
  -- Status
  status TEXT DEFAULT 'minuta' CHECK (status IN ('minuta', 'ativo', 'suspenso', 'encerrado', 'cancelado')),
  
  -- Dados específicos do contrato (JSON flexível)
  dados_especificos JSONB DEFAULT '{}',
  -- Exemplos de campos em dados_especificos:
  -- Para comodato: {equipamentos: [{descricao, numero_serie, valor_estimado}]}
  -- Para SLA: {prazo_atendimento: '24h', prazo_resolucao: '72h', penalidades: {}}
  -- Para manutenção: {periodicidade: 'mensal', escopo: [...]}
  
  -- Cláusulas personalizadas
  clausulas_adicionais TEXT,
  observacoes TEXT,
  
  -- Assinaturas
  assinado_cliente BOOLEAN DEFAULT false,
  assinado_enterfix BOOLEAN DEFAULT false,
  data_assinatura_cliente TIMESTAMPTZ,
  data_assinatura_enterfix TIMESTAMPTZ,
  assinante_cliente_nome TEXT,
  assinante_enterfix_nome TEXT,
  
  -- Arquivos
  pdf_url TEXT, -- URL do PDF gerado
  
  -- Versionamento (para aditivos)
  versao INTEGER DEFAULT 1,
  contrato_original_id UUID REFERENCES public.contratos(id), -- Se for aditivo
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- PASSO 3: Criar tabela de HISTÓRICO DE CONTRATOS
CREATE TABLE IF NOT EXISTS public.contratos_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES public.contratos(id) ON DELETE CASCADE,
  
  acao TEXT NOT NULL, -- 'criado', 'editado', 'assinado', 'suspenso', 'reativado', 'encerrado', 'cancelado'
  descricao TEXT,
  
  usuario_id UUID REFERENCES auth.users(id),
  usuario_nome TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASSO 4: Habilitar RLS nas tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos_historico ENABLE ROW LEVEL SECURITY;

-- PASSO 5: Políticas RLS para CLIENTES
DROP POLICY IF EXISTS "clientes_select_all" ON public.clientes;
DROP POLICY IF EXISTS "clientes_insert_authenticated" ON public.clientes;
DROP POLICY IF EXISTS "clientes_update_authenticated" ON public.clientes;
DROP POLICY IF EXISTS "clientes_delete_none" ON public.clientes;

CREATE POLICY "clientes_select_all"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "clientes_insert_authenticated"
  ON public.clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "clientes_update_authenticated"
  ON public.clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "clientes_delete_none"
  ON public.clientes FOR DELETE
  TO authenticated
  USING (false); -- Soft delete (usar campo 'ativo')

-- PASSO 6: Políticas RLS para CONTRATOS
DROP POLICY IF EXISTS "contratos_select_all" ON public.contratos;
DROP POLICY IF EXISTS "contratos_insert_authenticated" ON public.contratos;
DROP POLICY IF EXISTS "contratos_update_authenticated" ON public.contratos;
DROP POLICY IF EXISTS "contratos_delete_none" ON public.contratos;

CREATE POLICY "contratos_select_all"
  ON public.contratos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "contratos_insert_authenticated"
  ON public.contratos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "contratos_update_authenticated"
  ON public.contratos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "contratos_delete_none"
  ON public.contratos FOR DELETE
  TO authenticated
  USING (false);

-- PASSO 7: Políticas RLS para HISTÓRICO
DROP POLICY IF EXISTS "historico_select_all" ON public.contratos_historico;
DROP POLICY IF EXISTS "historico_insert_authenticated" ON public.contratos_historico;
DROP POLICY IF EXISTS "historico_update_none" ON public.contratos_historico;
DROP POLICY IF EXISTS "historico_delete_none" ON public.contratos_historico;

CREATE POLICY "historico_select_all"
  ON public.contratos_historico FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "historico_insert_authenticated"
  ON public.contratos_historico FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "historico_update_none"
  ON public.contratos_historico FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "historico_delete_none"
  ON public.contratos_historico FOR DELETE
  TO authenticated
  USING (false);

-- PASSO 8: Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at_contratos()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASSO 9: Triggers para updated_at
DROP TRIGGER IF EXISTS set_updated_at_clientes ON public.clientes;
CREATE TRIGGER set_updated_at_clientes
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at_contratos();

DROP TRIGGER IF EXISTS set_updated_at_contratos ON public.contratos;
CREATE TRIGGER set_updated_at_contratos
  BEFORE UPDATE ON public.contratos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at_contratos();

-- PASSO 10: Função para registrar histórico automaticamente
CREATE OR REPLACE FUNCTION public.log_contrato_historico()
RETURNS TRIGGER AS $$
DECLARE
  acao_texto TEXT;
  descricao_texto TEXT;
BEGIN
  -- Determinar ação
  IF (TG_OP = 'INSERT') THEN
    acao_texto := 'criado';
    descricao_texto := 'Contrato criado';
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.status != NEW.status) THEN
      acao_texto := 'status_alterado';
      descricao_texto := 'Status alterado de ' || OLD.status || ' para ' || NEW.status;
    ELSE
      acao_texto := 'editado';
      descricao_texto := 'Contrato editado';
    END IF;
  END IF;

  -- Inserir no histórico
  INSERT INTO public.contratos_historico (
    contrato_id, 
    acao, 
    descricao, 
    usuario_id
  ) VALUES (
    NEW.id,
    acao_texto,
    descricao_texto,
    NEW.updated_by
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 11: Trigger para histórico
DROP TRIGGER IF EXISTS log_contrato_changes ON public.contratos;
CREATE TRIGGER log_contrato_changes
  AFTER INSERT OR UPDATE ON public.contratos
  FOR EACH ROW
  EXECUTE FUNCTION public.log_contrato_historico();

-- PASSO 12: Índices para performance
CREATE INDEX IF NOT EXISTS idx_contratos_cliente_id ON public.contratos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contratos_tipo ON public.contratos(tipo_contrato);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON public.contratos(status);
CREATE INDEX IF NOT EXISTS idx_contratos_data_fim ON public.contratos(data_fim);
CREATE INDEX IF NOT EXISTS idx_contratos_numero ON public.contratos(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON public.clientes(cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON public.clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_razao_social ON public.clientes(razao_social);

-- PASSO 13: View para contratos com informações do cliente
CREATE OR REPLACE VIEW public.vw_contratos_completos AS
SELECT 
  c.*,
  cl.razao_social,
  cl.nome_fantasia,
  cl.cnpj,
  cl.cpf,
  cl.email AS cliente_email,
  cl.telefone AS cliente_telefone,
  cl.cidade AS cliente_cidade,
  cl.estado AS cliente_estado,
  -- Calcula dias até vencimento
  CASE 
    WHEN c.data_fim IS NOT NULL THEN c.data_fim - CURRENT_DATE
    ELSE NULL
  END AS dias_ate_vencimento,
  -- Status de vencimento
  CASE 
    WHEN c.data_fim IS NULL THEN 'indeterminado'
    WHEN c.data_fim < CURRENT_DATE THEN 'vencido'
    WHEN c.data_fim - CURRENT_DATE <= 30 THEN 'vence_em_30_dias'
    WHEN c.data_fim - CURRENT_DATE <= 60 THEN 'vence_em_60_dias'
    ELSE 'vigente'
  END AS status_vencimento
FROM public.contratos c
LEFT JOIN public.clientes cl ON c.cliente_id = cl.id;

-- ============================================
-- SEED: Dados de exemplo (opcional - remover em produção)
-- ============================================

-- Exemplo de cliente
INSERT INTO public.clientes (razao_social, nome_fantasia, cnpj, email, telefone, cidade, estado, ativo)
VALUES 
  ('Enterfix Metrologia LTDA', 'Enterfix', '12.345.678/0001-90', 'contato@enterfix.com.br', '(11) 98765-4321', 'São Paulo', 'SP', true)
ON CONFLICT (cnpj) DO NOTHING;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- SELECT * FROM public.clientes;
-- SELECT * FROM public.contratos;
-- SELECT * FROM public.vw_contratos_completos;
