# 🔑 Configuração Rápida - Azure AD/Microsoft 365

**Checklist de configuração do Azure AD para o Sistema Enterfix**

---

## ✅ Pré-requisitos

- [ ] Acesso ao Azure Portal (https://portal.azure.com)
- [ ] Permissões de Administrador no Azure AD
- [ ] Projeto criado no Supabase
- [ ] Domínio @enterfix.com.br verificado no Microsoft 365

---

## 📋 Passos de Configuração

### 1️⃣ Azure Portal - Registro do App

- [ ] Acessar Azure Portal → Azure Active Directory
- [ ] Ir em **App registrations** → **New registration**

**Dados do registro:**
```
Nome: Enterfix Sistema Metrologia
Account types: Single tenant (Enterfix only)
Redirect URI: https://[SEU_PROJETO].supabase.co/auth/v1/callback
```

- [ ] Anotar **Application (client) ID**: `_______________________`
- [ ] Anotar **Directory (tenant) ID**: `_______________________`

---

### 2️⃣ Client Secret

- [ ] Menu lateral → **Certificates & secrets**
- [ ] **New client secret**
  - Descrição: `Supabase Integration`
  - Expira em: `24 months`
- [ ] Copiar **Secret Value** imediatamente: `_______________________`

⚠️ **IMPORTANTE:** O secret só aparece uma vez! Guarde em local seguro.

---

### 3️⃣ Permissões API

- [ ] Menu lateral → **API permissions**
- [ ] **Add a permission** → **Microsoft Graph** → **Delegated permissions**

**Permissões necessárias:**
- [ ] `User.Read`
- [ ] `email`
- [ ] `openid`
- [ ] `profile`

- [ ] Clicar em **Grant admin consent for Enterfix** (requer admin)

---

### 4️⃣ Supabase - Configuração

Acessar: https://app.supabase.com → Seu projeto → **Authentication** → **Providers**

- [ ] Habilitar **Azure** (toggle ON)
- [ ] Preencher:
  - **Azure Client ID:** `[Application ID do passo 1]`
  - **Azure Secret:** `[Secret Value do passo 2]`
  - **Azure Tenant ID:** `[Tenant ID do passo 1]`
- [ ] ✅ Marcar **Restrict to Tenant**
- [ ] Clicar em **Save**

---

### 5️⃣ Supabase - Políticas RLS

No **SQL Editor**, executar o script completo:

```sql
-- Habilitar Row Level Security
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

-- Política SELECT
DROP POLICY IF EXISTS "Azure AD users podem ver relatórios" ON relatorios;
CREATE POLICY "Azure AD users podem ver relatórios"
ON relatorios FOR SELECT
USING (auth.jwt() ->> 'email' LIKE '%@enterfix.com.br');

-- Política INSERT
DROP POLICY IF EXISTS "Azure AD users podem criar relatórios" ON relatorios;
CREATE POLICY "Azure AD users podem criar relatórios"
ON relatorios FOR INSERT
WITH CHECK (auth.jwt() ->> 'email' LIKE '%@enterfix.com.br');

-- Política UPDATE
DROP POLICY IF EXISTS "Azure AD users podem atualizar relatórios" ON relatorios;
CREATE POLICY "Azure AD users podem atualizar relatórios"
ON relatorios FOR UPDATE
USING (auth.jwt() ->> 'email' LIKE '%@enterfix.com.br');

-- Política DELETE
DROP POLICY IF EXISTS "Azure AD users podem deletar relatórios" ON relatorios;
CREATE POLICY "Azure AD users podem deletar relatórios"
ON relatorios FOR DELETE
USING (auth.jwt() ->> 'email' LIKE '%@enterfix.com.br');

-- Função auxiliar
CREATE OR REPLACE FUNCTION public.is_enterfix_azure_user()
RETURNS boolean AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') LIKE '%@enterfix.com.br';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] Script executado com sucesso

---

### 6️⃣ Frontend - Componente de Login

Criar/atualizar arquivo **`src/components/Auth.jsx`**:

```jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const [loading, setLoading] = useState(false);

  const handleAzureLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email profile',
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      alert('Erro: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Enterfix Metrologia</h2>
          <p className="text-gray-600 mt-2">Sistema de Gestão de Relatórios</p>
        </div>
        
        <button
          onClick={handleAzureLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 border rounded-lg bg-white hover:bg-gray-50 transition"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          ) : (
            <>
              <svg className="h-6 w-6" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span className="font-medium">Entrar com Microsoft 365</span>
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          Acesso restrito a @enterfix.com.br
        </p>
      </div>
    </div>
  );
};
```

- [ ] Componente criado
- [ ] Importado no App.jsx

---

### 7️⃣ App.jsx - Integração

Atualizar **`src/App.jsx`** para verificar autenticação:

```jsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import Sidebar from './components/Sidebar';
// ... outros imports

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  // Renderizar aplicação normalmente
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {/* ... resto do app */}
    </div>
  );
}

export default App;
```

- [ ] App.jsx atualizado
- [ ] Verificação de sessão implementada

---

### 8️⃣ Teste Local

Antes de fazer deploy:

```bash
# Compilar e testar
npm run dev
```

- [ ] Aplicação abre em localhost:5173
- [ ] Botão "Entrar com Microsoft 365" visível
- [ ] Ao clicar, redireciona para login Microsoft
- [ ] Após login, retorna para a aplicação
- [ ] Dashboard carrega corretamente

---

### 9️⃣ Deploy

- [ ] Push código para GitHub
- [ ] Deploy no Vercel (ver [GUIA-DEPLOY-PRODUCAO.md](GUIA-DEPLOY-PRODUCAO.md#deploy-com-vercel))
- [ ] Configurar variáveis de ambiente no Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Atualizar Redirect URI no Azure com URL de produção
- [ ] Testar login em produção

---

### 🔟 Verificação Final

- [ ] Login com conta @enterfix.com.br funciona ✅
- [ ] Login com conta externa é bloqueado ✅
- [ ] Relatórios são salvos e carregados corretamente ✅
- [ ] PDF é gerado corretamente ✅
- [ ] Logout funciona ✅

---

## 🆘 Problemas Comuns

### "Redirect URI mismatch"
- Verifique se a URL no Azure App Registration corresponde exatamente à URL do Supabase
- Formato: `https://[projeto].supabase.co/auth/v1/callback`

### "Admin consent required"
- No Azure Portal → App Registration → API Permissions
- Click em "Grant admin consent for [organização]"

### "User login blocked"
- Verifique se a conta tem email @enterfix.com.br
- Confirme que as políticas RLS foram aplicadas corretamente
- Teste com `SELECT * FROM auth.users;` no Supabase SQL Editor

### "CORS error"
- Verifique em Supabase → Authentication → URL Configuration
- Adicione a URL da aplicação em "Site URL" e "Redirect URLs"

---

## 📞 Suporte

Documentação completa: [GUIA-DEPLOY-PRODUCAO.md](GUIA-DEPLOY-PRODUCAO.md)

**Recursos úteis:**
- [Documentação Azure AD](https://docs.microsoft.com/azure/active-directory/)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Azure Provider](https://supabase.com/docs/guides/auth/social-login/auth-azure)

---

**✅ Configuração Completa!**

Agora sua aplicação está protegida com autenticação corporativa Microsoft 365, restrita apenas a colaboradores com email @enterfix.com.br.
