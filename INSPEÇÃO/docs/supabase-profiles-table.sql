-- ============================================
-- TABELA DE PERFIS DE USUÁRIOS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Criar tabela de perfis profissionais
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações Pessoais
  nome_completo TEXT,
  cargo TEXT,
  telefone TEXT,
  foto_url TEXT,
  
  -- Informações Profissionais
  registro_profissional TEXT, -- CRM, CREA, CRQ, etc
  tipo_registro TEXT, -- "CREA", "CRM", "CRQ", "Outro"
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

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Política: Usuários podem ver todos os perfis
CREATE POLICY "Perfis são visíveis para usuários autenticados"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Política: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Política: Admins podem atualizar qualquer perfil
CREATE POLICY "Admins podem atualizar qualquer perfil"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Política: Inserir perfil automaticamente ao criar usuário
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 7. Função para criar perfil automaticamente ao registrar
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

-- 8. Trigger para executar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Trigger para updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_ativo ON public.profiles(ativo);
CREATE INDEX IF NOT EXISTS idx_profiles_empresa ON public.profiles(empresa);

-- ============================================
-- SEED: Criar perfil para usuários existentes
-- ============================================
INSERT INTO public.profiles (id, nome_completo)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- SELECT * FROM public.profiles;
