-- ============================================
-- MIGRAÇÃO: INTEGRAR CLIENTES COM RELATÓRIOS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- PASSO 1: Adicionar coluna cliente_id na tabela relatorios_metrologia
-- (mantém o campo cliente antigo temporariamente para migração)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'relatorios_metrologia' 
    AND column_name = 'cliente_id'
  ) THEN
    ALTER TABLE public.relatorios_metrologia 
    ADD COLUMN cliente_id UUID REFERENCES public.clientes(id);
  END IF;
END $$;

-- PASSO 2: Criar função para migrar clientes existentes nos relatórios
-- Esta função tenta encontrar ou criar clientes baseado no nome nos relatórios
CREATE OR REPLACE FUNCTION migrar_clientes_relatorios()
RETURNS void AS $$
DECLARE
  relatorio RECORD;
  cliente_id_encontrado UUID;
BEGIN
  -- Para cada relatório sem cliente_id linkado
  FOR relatorio IN 
    SELECT id, cliente FROM public.relatorios_metrologia 
    WHERE cliente_id IS NULL AND cliente IS NOT NULL AND cliente != ''
  LOOP
    -- Tentar encontrar cliente existente pelo nome
    SELECT id INTO cliente_id_encontrado
    FROM public.clientes
    WHERE razao_social ILIKE relatorio.cliente 
       OR nome_fantasia ILIKE relatorio.cliente
    LIMIT 1;

    -- Se não encontrou, criar novo cliente
    IF cliente_id_encontrado IS NULL THEN
      INSERT INTO public.clientes (razao_social, nome_fantasia, ativo)
      VALUES (relatorio.cliente, relatorio.cliente, true)
      RETURNING id INTO cliente_id_encontrado;
      
      RAISE NOTICE 'Cliente criado: % (ID: %)', relatorio.cliente, cliente_id_encontrado;
    END IF;

    -- Atualizar relatório com o cliente_id
    UPDATE public.relatorios_metrologia
    SET cliente_id = cliente_id_encontrado
    WHERE id = relatorio.id;
    
    RAISE NOTICE 'Relatório % linkado ao cliente %', relatorio.id, cliente_id_encontrado;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- PASSO 3: Executar migração
SELECT migrar_clientes_relatorios();

-- PASSO 4: Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente_id ON public.relatorios_metrologia(cliente_id);

-- PASSO 5: Atualizar View (se existir) para incluir dados do cliente
CREATE OR REPLACE VIEW public.vw_relatorios_completos AS
SELECT 
  r.*,
  c.razao_social AS cliente_razao_social,
  c.nome_fantasia AS cliente_nome_fantasia,
  c.cnpj AS cliente_cnpj,
  c.cpf AS cliente_cpf,
  c.email AS cliente_email,
  c.telefone AS cliente_telefone,
  c.cidade AS cliente_cidade,
  c.estado AS cliente_estado,
  c.contato_responsavel AS cliente_contato
FROM public.relatorios_metrologia r
LEFT JOIN public.clientes c ON r.cliente_id = c.id;

-- ============================================
-- COMENTÁRIO IMPORTANTE
-- ============================================
-- Após confirmar que a migração funcionou e todos os relatórios
-- têm cliente_id preenchido, você PODE (futuro):
-- 1. Tornar cliente_id obrigatório: ALTER TABLE relatorios_metrologia ALTER COLUMN cliente_id SET NOT NULL;
-- 2. Remover coluna antiga 'cliente': ALTER TABLE relatorios_metrologia DROP COLUMN cliente;
-- 
-- MAS MANTENHA POR ENQUANTO para garantir compatibilidade!

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Ver relatórios sem cliente linkado:
-- SELECT id, cliente, cliente_id FROM public.relatorios_metrologia WHERE cliente_id IS NULL;

-- Ver clientes criados na migração:
-- SELECT * FROM public.clientes ORDER BY created_at DESC LIMIT 10;

-- Ver relatórios com dados do cliente:
-- SELECT * FROM public.vw_relatorios_completos LIMIT 5;
