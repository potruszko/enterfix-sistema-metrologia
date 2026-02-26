-- ============================================
-- CONFIGURAÇÃO DO STORAGE PARA AVATARS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- PASSO 1: Criar bucket 'avatars' (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- PASSO 2: Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Usuários podem fazer upload de avatars" ON storage.objects;
DROP POLICY IF EXISTS "Avatars são públicos para visualização" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios avatars" ON storage.objects;
DROP POLICY IF EXISTS "avatars_upload" ON storage.objects;
DROP POLICY IF EXISTS "avatars_select" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete" ON storage.objects;

-- PASSO 3: Criar políticas de acesso ao bucket 'avatars'

-- Política 1: Upload - Usuários autenticados podem fazer upload
CREATE POLICY "avatars_upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Política 2: Leitura - Qualquer pessoa pode visualizar avatars (bucket público)
CREATE POLICY "avatars_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Política 3: Atualização - Usuários podem atualizar seus próprios avatars
CREATE POLICY "avatars_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND name LIKE 'profiles/' || auth.uid()::text || '%'
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND name LIKE 'profiles/' || auth.uid()::text || '%'
);

-- Política 4: Deleção - Usuários podem deletar seus próprios avatars
CREATE POLICY "avatars_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND name LIKE 'profiles/' || auth.uid()::text || '%'
);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Confirme que o bucket foi criado:
-- SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Confirme as políticas:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE 'avatars%';
