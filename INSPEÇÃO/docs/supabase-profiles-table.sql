-- ============================================
-- TABELA DE PERFIS DE USUÁRIOS - VERSÃO CORRIGIDA
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- PASSO 1: Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_none" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem atualizar qualquer perfil" ON public.profiles;

-- PASSO 2: Criar ou atualizar tabela de perfis profissionais
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações Pessoais
  nome_completo TEXT,
  cpf TEXT UNIQUE, -- CPF como documento principal
  cargo TEXT,
  telefone TEXT,
  foto_url TEXT,
  
  -- Informações Profissionais (Opcional)
  registro_profissional TEXT, -- CREA, CRM, CRQ, etc (OPCIONAL)
  tipo_registro TEXT, -- "CREA", "CRM", "CRQ", "Não se aplica"
  empresa TEXT,
  departamento TEXT,
  
  -- Especialização e Bio
  especializacao TEXT,
  bio TEXT,
  
  -- Assinatura Digital (para certificados)
  assinatura_url TEXT,
  
  -- Permissões e Categoria
  role TEXT DEFAULT 'tecnico' CHECK (role IN ('admin', 'gestor', 'tecnico', 'visualizador')),
  ativo BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASSO 3: Adicionar coluna CPF se a tabela já existia (sem essa coluna)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'cpf'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN cpf TEXT UNIQUE;
  END IF;
END $$;

-- PASSO 4: Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- PASSO 5: Criar políticas RLS (Row Level Security)

-- Todos podem ver todos os perfis (necessário para listar técnicos)
CREATE POLICY "profiles_select_all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Usuários podem inserir seu próprio perfil
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ninguém pode deletar perfis diretamente (apenas cascade do auth.users)
CREATE POLICY "profiles_delete_none"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (false);

-- PASSO 6: Triggers para automação

-- Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- PASSO 7: Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_ativo ON public.profiles(ativo);
CREATE INDEX IF NOT EXISTS idx_profiles_empresa ON public.profiles(empresa);

-- PASSO 8: Seed - Criar perfil para usuários existentes
INSERT INTO public.profiles (id, nome_completo, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  CASE 
    WHEN email = 'paulo.otavio@enterfix.com.br' THEN 'admin'
    ELSE 'tecnico'
  END as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- PASSO 9: Garantir que Paulo.otavio é admin
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'paulo.otavio@enterfix.com.br'
);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- SELECT p.nome_completo, u.email, p.role, p.cargo, p.cpf
-- FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id;

-- ============================================
-- PARA TESTAR AS POLÍTICAS
-- ============================================
-- SELECT auth.uid(); -- Ver seu ID atual
-- SELECT * FROM public.profiles; -- Deve funcionar (select_all)