-- ============================================
-- TABELA DE PERFIS DE USUÁRIOS - VERSÃO CORRIGIDA
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Criar tabela de perfis profissionais
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

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
OLÍTICA: Todos podem ver todos os perfis (necessário para listar técnicos)
CREATE POLICY "profiles_select_all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. POLÍTICA: Usuários podem inserir seu próprio perfil
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 5. POLÍTICA: Usuários podem atualizar seu próprio perfil (exceto role)
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (OLD.role = NEW.role OR NEW.role IS NULL) -- Não pode mudar próprio role
  );

-- 6. POLÍTICA: Ninguém pode deletar perfis diretamente (apenas cascade do auth.users)
CREATE POLICY "profiles_delete_none"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (false
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
SELECT , role)
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

-- ============================================
-- GARANTIR QUE PAULO.OTAVIO É ADMIN
-- ============================================
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