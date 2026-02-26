-- ============================================
-- PREPARAR STORAGE E TABELA PARA PDFs DE CONTRATOS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Adicionar coluna pdf_url na tabela contratos (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contratos' AND column_name = 'pdf_url') THEN
    ALTER TABLE public.contratos ADD COLUMN pdf_url TEXT;
    RAISE NOTICE 'Coluna pdf_url adicionada com sucesso!';
  ELSE
    RAISE NOTICE 'Coluna pdf_url já existe';
  END IF;
END $$;

-- 2. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_contratos_pdf_url ON public.contratos(pdf_url) WHERE pdf_url IS NOT NULL;

-- 3. Comentário na coluna
COMMENT ON COLUMN public.contratos.pdf_url IS 'URL do PDF do contrato armazenado no Supabase Storage';

-- ============================================
-- IMPORTANTE: CRIAR BUCKET NO STORAGE MANUALMENTE
-- ============================================
-- Vá em Storage > Create bucket
-- Nome: contratos
-- Public: SIM (para clientes poderem baixar)
-- File size limit: 10 MB
-- Allowed MIME types: application/pdf

-- Ou execute via SQL (se tiver permissões):
INSERT INTO storage.buckets (id, name, public)
VALUES ('contratos', 'contratos', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLÍTICAS RLS PARA O BUCKET CONTRATOS
-- ============================================

-- Permitir usuários autenticados lerem PDFs
CREATE POLICY "Usuários autenticados podem ler PDFs de contratos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'contratos' 
  AND auth.role() = 'authenticated'
);

-- Permitir usuários autenticados criarem PDFs
CREATE POLICY "Usuários autenticados podem criar PDFs de contratos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contratos' 
  AND auth.role() = 'authenticated'
);

-- Permitir usuários autenticados atualizarem seus PDFs
CREATE POLICY "Usuários autenticados podem atualizar PDFs de contratos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'contratos' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'contratos' 
  AND auth.role() = 'authenticated'
);

-- Permitir usuários autenticados deletarem seus PDFs
CREATE POLICY "Usuários autenticados podem deletar PDFs de contratos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'contratos' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contratos' 
  AND column_name = 'pdf_url';

-- Deve retornar: pdf_url | text | YES | null

RAISE NOTICE '✅ Preparação concluída! Agora crie o bucket "contratos" no Storage se ainda não existir.';
