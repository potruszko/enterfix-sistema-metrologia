# 🚀 Guia de Deploy em Produção - Sistema Enterfix

**Última atualização:** 25 de Fevereiro de 2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação Corporativa](#autenticação-corporativa)
3. [Opções de Deploy](#opções-de-deploy)
4. [Configuração do Supabase](#configuração-do-supabase)
5. [Deploy com Vercel (Recomendado)](#deploy-com-vercel)
6. [Deploy com Netlify](#deploy-com-netlify)
7. [Deploy em Servidor Próprio](#deploy-em-servidor-próprio)
8. [Domínio Customizado](#domínio-customizado)
9. [Segurança e Manutenção](#segurança-e-manutenção)

---

## 🎯 Visão Geral

Este guia fornece instruções completas para publicar o Sistema de Gestão de Relatórios Metrológicos da Enterfix em produção, com autenticação restrita ao domínio **@enterfix.com.br**.

### Requisitos
- ✅ Conta Supabase (já configurada)
- ✅ Conta GitHub (para deploy automatizado)
- ✅ Domínio enterfix.com.br (acesso ao DNS)
- ✅ Node.js 18+ (já instalado)

---

## 🔐 Autenticação Corporativa

> **💡 IMPORTANTE:** Como a Enterfix utiliza **Microsoft 365**, recomendamos o **Método 1 (Azure AD/Microsoft 365 SSO)** para melhor integração com o ambiente corporativo existente. Este método oferece Single Sign-On (SSO) com as contas Microsoft da empresa.

### Método 1: Azure AD / Microsoft 365 SSO (⭐ RECOMENDADO PARA MICROSOFT 365)

Para empresas que utilizam Microsoft 365, esta é a solução ideal pois permite autenticação com as contas corporativas existentes.

**Vantagens:**
- ✅ Single Sign-On (SSO) - usuários fazem login com suas contas Microsoft
- ✅ Integração nativa com Azure Active Directory (Entra ID)
- ✅ Restrição automática por domínio @enterfix.com.br
- ✅ Controle centralizado de usuários no Microsoft 365 Admin
- ✅ MFA (autenticação multifator) se já configurado no Microsoft 365
- ✅ Sem necessidade de criar senhas separadas

**Passo a Passo:**

#### 1. Configurar Azure AD Application

1. **Acesse o Azure Portal:**
   ```
   https://portal.azure.com
   ```

2. **Navegue até Azure Active Directory (Entra ID):**
   - Menu lateral → **Azure Active Directory**
   - Ou buscar por "Azure Active Directory"

3. **Registre um novo aplicativo:**
   - Clique em **App registrations** (Registros de aplicativo)
   - Clique em **+ New registration**
   - Preencha:
     - **Nome:** `Enterfix Sistema Metrologia`
     - **Supported account types:** "Accounts in this organizational directory only (Enterfix only - Single tenant)"
     - **Redirect URI:** 
       - Tipo: Web
       - URL: `https://[SEU_PROJETO].supabase.co/auth/v1/callback`
   - Clique em **Register**

4. **Anote as credenciais:**
   - Na página Overview, copie:
     - **Application (client) ID** - você vai precisar
     - **Directory (tenant) ID** - você vai precisar
   
5. **Criar Client Secret:**
   - No menu lateral, clique em **Certificates & secrets**
   - Clique em **+ New client secret**
   - Descrição: `Supabase Integration`
   - Expira em: `24 months` (ou conforme política da empresa)
   - Clique em **Add**
   - **⚠️ IMPORTANTE:** Copie o **Value** imediatamente (só aparece uma vez)

6. **Configurar Permissões API:**
   - Menu lateral → **API permissions**
   - Clique em **+ Add a permission**
   - Selecione **Microsoft Graph**
   - Selecione **Delegated permissions**
   - Adicione as seguintes permissões:
     - ✅ `User.Read` (para ler perfil do usuário)
     - ✅ `email` (para obter o e-mail)
     - ✅ `openid` (para autenticação OpenID)
     - ✅ `profile` (para obter informações do perfil)
   - Clique em **Add permissions**
   - Clique em **Grant admin consent for Enterfix** (requer admin)

#### 2. Configurar Supabase para Azure AD

1. **Acesse o Dashboard do Supabase:**
   ```
   https://app.supabase.com
   ```

2. **Configure Azure Provider:**
   - **Authentication → Providers → Azure**
   - Habilite **Azure** (toggle ON)
   - Preencha:
     - **Azure Client ID:** Cole o Application (client) ID do passo anterior
     - **Azure Secret:** Cole o Client Secret Value do passo anterior
     - **Azure Tenant ID:** Cole o Directory (tenant) ID
   - **Restrict to Tenant:** Deixe marcado (restringe ao domínio @enterfix.com.br)
   - Clique em **Save**

3. **Adicione Políticas RLS para Azure:**

   No **SQL Editor**, execute:

   ```sql
   -- Habilitar RLS na tabela relatorios
   ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

   -- Política para SELECT (visualização)
   DROP POLICY IF EXISTS "Azure AD users podem ver relatórios" ON relatorios;
   CREATE POLICY "Azure AD users podem ver relatórios"
   ON relatorios FOR SELECT
   USING (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );

   -- Política para INSERT (criação)
   DROP POLICY IF EXISTS "Azure AD users podem criar relatórios" ON relatorios;
   CREATE POLICY "Azure AD users podem criar relatórios"
   ON relatorios FOR INSERT
   WITH CHECK (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );

   -- Política para UPDATE (edição)
   DROP POLICY IF EXISTS "Azure AD users podem atualizar relatórios" ON relatorios;
   CREATE POLICY "Azure AD users podem atualizar relatórios"
   ON relatorios FOR UPDATE
   USING (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );

   -- Política para DELETE (exclusão)
   DROP POLICY IF EXISTS "Azure AD users podem deletar relatórios" ON relatorios;
   CREATE POLICY "Azure AD users podem deletar relatórios"
   ON relatorios FOR DELETE
   USING (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );

   -- Função para verificar domínio corporativo
   CREATE OR REPLACE FUNCTION public.is_enterfix_azure_user()
   RETURNS boolean AS $$
   BEGIN
     RETURN (auth.jwt() ->> 'email') LIKE '%@enterfix.com.br';
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

#### 3. Implementar Login com Azure no Frontend

Atualize ou crie o componente de autenticação:

**`src/components/Auth.jsx`:**

```jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAlert } from './AlertSystem';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const handleAzureLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile',
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error) {
      alert.error('Erro ao fazer login: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Enterfix Metrologia
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestão de Relatórios
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleAzureLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <>
                <svg className="h-6 w-6" viewBox="0 0 23 23" fill="none">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span className="text-base font-medium text-gray-700">
                  Entrar com Microsoft 365
                </span>
              </>
            )}
          </button>

          <p className="mt-6 text-center text-xs text-gray-500">
            Acesso restrito a colaboradores com e-mail @enterfix.com.br
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Ao fazer login, você concorda com os</p>
          <p>Termos de Uso e Política de Privacidade</p>
        </div>
      </div>
    </div>
  );
};
```

#### 4. Testar a Integração

1. **Deploy a aplicação** (Vercel/Netlify - ver seções posteriores)
2. **Acesse a URL da aplicação**
3. **Clique em "Entrar com Microsoft 365"**
4. **Será redirecionado para login Microsoft**
5. **Faça login com uma conta @enterfix.com.br**
6. **Autorize o aplicativo** (primeira vez)
7. **Será redirecionado de volta para o dashboard**

✅ **Pronto!** Os usuários agora podem fazer login com suas contas Microsoft 365.

---

### Método 2: E-mail Domain Restriction (Supabase - Alternativa)

O Supabase permite restringir cadastros por domínio de e-mail.

**Passos:**

1. **Acesse o Dashboard do Supabase**
   ```
   https://app.supabase.com
   ```

2. **Navegue até Authentication → Providers**

3. **Configure Email Provider:**
   ```
   ☑ Enable Email Provider
   ☑ Confirm email
   ☑ Secure email change
   ```

4. **Adicione Restrição de Domínio no RLS (Row Level Security):**

   Acesse **SQL Editor** e execute:

   ```sql
   -- Criar função para validar domínio do e-mail
   CREATE OR REPLACE FUNCTION public.is_enterfix_email(email text)
   RETURNS boolean AS $$
   BEGIN
     RETURN email LIKE '%@enterfix.com.br';
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Política RLS para tabela relatorios
   ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

   DROP POLICY IF EXISTS "Usuários Enterfix podem ver seus relatórios" ON relatorios;
   CREATE POLICY "Usuários Enterfix podem ver seus relatórios"
   ON relatorios FOR SELECT
   USING (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );

   DROP POLICY IF EXISTS "Usuários Enterfix podem criar relatórios" ON relatorios;
   CREATE POLICY "Usuários Enterfix podem criar relatórios"
   ON relatorios FOR INSERT
   WITH CHECK (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );

   DROP POLICY IF EXISTS "Usuários Enterfix podem atualizar seus relatórios" ON relatorios;
   CREATE POLICY "Usuários Enterfix podem atualizar seus relatórios"
   ON relatorios FOR UPDATE
   USING (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );

   DROP POLICY IF EXISTS "Usuários Enterfix podem deletar seus relatórios" ON relatorios;
   CREATE POLICY "Usuários Enterfix podem deletar seus relatórios"
   ON relatorios FOR DELETE
   USING (
     auth.jwt() ->> 'email' LIKE '%@enterfix.com.br'
   );
   ```

---

### Método 3: Google OAuth (Single Sign-On - Alternativa)

Para autenticação com contas Google corporativas (@enterfix.com.br):

1. **Configure Google OAuth no Supabase:**
   - **Authentication → Providers → Google**
   - Habilite o provider
   - Configure Workspace Domain: `enterfix.com.br`

2. **Obtenha Credenciais Google Cloud:**
   - Acesse https://console.cloud.google.com
   - Crie novo projeto "Enterfix Sistema Metrologia"
   - APIs & Services → Credentials → Create OAuth 2.0 Client
   - Authorized redirect URIs:
     ```
     https://[SEU_PROJETO].supabase.co/auth/v1/callback
     ```

3. **Configure Client ID e Secret no Supabase**

4. **Adicione Validação de Domínio:**
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     IF NEW.email NOT LIKE '%@enterfix.com.br' THEN
       DELETE FROM auth.users WHERE id = NEW.id;
       RAISE EXCEPTION 'Acesso restrito a usuários @enterfix.com.br';
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
   AFTER INSERT ON auth.users
   FOR EACH ROW EXECUTE FUNCTION handle_new_user();
   ```

---

### Método 4: Validação no Frontend (Camada Adicional)

Adicione validação extra no componente de registro:

**`src/components/Auth.jsx`** (criar este arquivo):

```jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAlert } from './AlertSystem';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validação de domínio no frontend
    if (!email.endsWith('@enterfix.com.br')) {
      alert.error('Apenas e-mails corporativos @enterfix.com.br são permitidos.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      
      alert.success('Cadastro realizado! Verifique seu e-mail para confirmar.');
    } catch (error) {
      alert.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      alert.success('Login realizado com sucesso!');
      window.location.href = '/dashboard';
    } catch (error) {
      alert.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sistema Enterfix
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gestão de Relatórios Metrológicos
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail Corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.nome@enterfix.com.br"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Cadastrar
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 mt-4">
          Acesso restrito a colaboradores Enterfix
        </div>
      </div>
    </div>
  );
};
```

---

### 📊 Comparação dos Métodos de Autenticação

| Método | Ideal Para | Vantagens | Implementação |
|--------|-----------|-----------|---------------|
| **1. Azure AD/Microsoft 365** | ⭐ **Empresas com Microsoft 365** | SSO, MFA integrado, gerenciamento centralizado | ⭐⭐⭐⭐ Média |
| **2. Email Domain** | Pequenas equipes | Simplicidade, controle total | ⭐⭐⭐⭐⭐ Fácil |
| **3. Google OAuth** | Empresas com Google Workspace | SSO Google, fácil setup | ⭐⭐⭐⭐ Média |
| **4. Frontend Validation** | Camada adicional de segurança | UX melhorada, feedback rápido | ⭐⭐⭐⭐⭐ Fácil |

**Recomendação para Enterfix:**
- 🎯 **Use o Método 1 (Azure AD/Microsoft 365)** como principal
- ➕ **Adicione o Método 4 (Frontend Validation)** para UX aprimorada
- ✅ **Configure as políticas RLS do Supabase** para segurança adicional

---

## 🚀 Opções de Deploy

### Comparação Rápida

| Plataforma | Custo | Facilidade | SSL | CI/CD | Recomendado |
|------------|-------|------------|-----|-------|-------------|
| **Vercel** | Grátis | ⭐⭐⭐⭐⭐ | ✅ Auto | ✅ | ✅ **SIM** |
| **Netlify** | Grátis | ⭐⭐⭐⭐⭐ | ✅ Auto | ✅ | ✅ |
| **Servidor Próprio** | VPS ~R$50/mês | ⭐⭐ | Manual | Manual | Para controle total |

---

## ⚙️ Configuração do Supabase

Antes de fazer o deploy, configure as variáveis de ambiente:

1. **Crie arquivo `.env.production`:**

```env
VITE_SUPABASE_URL=https://[SEU_PROJETO].supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

2. **⚠️ IMPORTANTE:** Adicione `.env.production` ao `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.production
.env.development

# Supabase
.supabase/
```

3. **Configure Allowed URLs no Supabase:**

No Dashboard → **Authentication → URL Configuration**:

```
Site URL: https://sistema.enterfix.com.br
Redirect URLs:
- https://sistema.enterfix.com.br/**
- https://sistema.enterfix.com.br/dashboard
- http://localhost:5173/** (para desenvolvimento)
```

---

## 🌐 Deploy com Vercel (RECOMENDADO)

### Por que Vercel?
- ✅ Deploy automático do GitHub
- ✅ SSL/HTTPS gratuito
- ✅ CDN global
- ✅ Preview de branches
- ✅ Analytics incluído

### Passo a Passo:

#### 1. Preparar Repositório GitHub

```bash
# Inicialize git (se ainda não fez)
git init
git add .
git commit -m "Initial commit - Sistema Enterfix"

# Crie repositório no GitHub
# https://github.com/new
# Nome: enterfix-sistema-metrologia

# Adicione remote e faça push
git remote add origin https://github.com/enterfix/enterfix-sistema-metrologia.git
git branch -M main
git push -u origin main
```

#### 2. Fazer Deploy na Vercel

1. **Acesse https://vercel.com e faça login com GitHub**

2. **Clique em "Add New Project"**

3. **Import do GitHub:**
   - Selecione o repositório `enterfix-sistema-metrologia`
   - Configure:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

4. **Configure Variáveis de Ambiente:**
   
   Clique em "Environment Variables" e adicione:
   
   ```
   VITE_SUPABASE_URL = https://[SEU_PROJETO].supabase.co
   VITE_SUPABASE_ANON_KEY = sua_anon_key_aqui
   ```

5. **Deploy!**
   
   Clique em "Deploy" e aguarde (~2 minutos)

6. **URL de Produção:**
   ```
   https://enderfix-sistema-metrologia.vercel.app
   ```

#### 3. Deploy Automático (CI/CD)

Agora, sempre que você fizer push para `main`, a Vercel fará deploy automaticamente:

```bash
git add .
git commit -m "Atualizações"
git push origin main
# Deploy automático acontece!
```

---

## 🎨 Deploy com Netlify

Alternativa à Vercel:

1. **Acesse https://netlify.com**

2. **Conecte GitHub:**
   - Add new site → Import existing project
   - Selecione repositório

3. **Configure Build:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables:**
   
   Site settings → Build & deploy → Environment
   
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```

5. **Deploy!**

---

## 🖥️ Deploy em Servidor Próprio

### Opção 1: VPS com NGINX (AWS, DigitalOcean, Contabo)

#### Requisitos:
- VPS Ubuntu 22.04 (mínimo 1GB RAM)
- Domínio configurado

#### Script de Deploy:

```bash
#!/bin/bash
# deploy-enterfix.sh

# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Instalar NGINX
sudo apt install -y nginx

# 4. Clonar projeto
cd /var/www
sudo git clone https://github.com/enterfix/enterfix-sistema-metrologia.git
cd enterfix-sistema-metrologia

# 5. Configurar ambiente
sudo nano .env.production
# Cole as variáveis VITE_SUPABASE_*

# 6. Build
sudo npm install
sudo npm run build

# 7. Configurar NGINX
sudo nano /etc/nginx/sites-available/enterfix

# Cole a configuração abaixo:
```

**Configuração NGINX (`/etc/nginx/sites-available/enterfix`):**

```nginx
server {
    listen 80;
    server_name sistema.enterfix.com.br;

    root /var/www/enterfix-sistema-metrologia/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Compressão para melhor performance
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Cache de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Ative o site:

```bash
sudo ln -s /etc/nginx/sites-available/enterfix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Configurar SSL (Certbot):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d sistema.enterfix.com.br
```

### Opção 2: Docker

**`Dockerfile`:**

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`docker-compose.yml`:**

```yaml
version: '3.8'
services:
  enterfix-app:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

Deploy:

```bash
docker-compose up -d --build
```

---

## 🌍 Domínio Customizado

### Configurar DNS

No painel de DNS do seu provedor (Registro.br, Cloudflare, etc):

**Para Vercel/Netlify:**

1. **Adicione registro CNAME:**
   ```
   Tipo: CNAME
   Nome: sistema (ou @)
   Valor: cname.vercel-dns.com (para Vercel)
         apex-loadbalancer.netlify.com (para Netlify)
   TTL: Auto
   ```

2. **No painel Vercel/Netlify:**
   - Settings → Domains
   - Add domain: `sistema.enterfix.com.br`
   - Verifique configuração

**Para Servidor Próprio:**

```
Tipo: A
Nome: sistema
Valor: [IP_DO_SERVIDOR]
TTL: 3600
```

### Verificar Propagação

```bash
nslookup sistema.enterfix.com.br
# ou
dig sistema.enterfix.com.br
```

Propagação pode levar até 48h (geralmente 1-2h).

---

## 🔒 Segurança e Manutenção

### Checklist de Segurança Pré-Deploy

- [ ] Variáveis de ambiente em `.env` (não commitadas)
- [ ] RLS (Row Level Security) ativado no Supabase
- [ ] Validação de domínio @enterfix.com.br implementada
- [ ] HTTPS/SSL configurado
- [ ] CORS configurado corretamente no Supabase
- [ ] Backup do banco de dados agendado
- [ ] Logs de auditoria configurados

### Configurar CORS no Supabase

**Dashboard → Settings → API → CORS Whitelist:**

```
https://sistema.enterfix.com.br
http://localhost:5173
```

### Backup Automático (Supabase)

O Supabase faz backup automático, mas você pode exportar manualmente:

```bash
# Exportar dados
supabase db dump > backup_$(date +%Y%m%d).sql

# Restaurar
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### Monitoramento

**Vercel Analytics (gratuito):**
- Dashboard → Analytics
- Veja visitas, performance, regiões

**Supabase Dashboard:**
- Database → Usage
- Auth → Users (monitorar cadastros)

### Logs de Auditoria

Crie tabela de auditoria no Supabase:

```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id BIGINT,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função de auditoria
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, changes)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar em todas as tabelas
CREATE TRIGGER relatorios_audit
AFTER INSERT OR UPDATE OR DELETE ON relatorios
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

---

## 📝 Checklist de Deploy Final

### Pré-Deploy
- [ ] Código testado localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Build rodando sem erros (`npm run build`)
- [ ] Git commitado e pushed

### Deploy
- [ ] Deploy realizado (Vercel/Netlify/Servidor)
- [ ] URL de produção funcionando
- [ ] SSL/HTTPS ativo

### Pós-Deploy
- [ ] Domínio customizado configurado
- [ ] Autenticação @enterfix.com.br testada
- [ ] RLS verificado no Supabase
- [ ] Teste de criação/edição/exclusão de relatórios
- [ ] Teste de upload de fotos
- [ ] Exportação de PDF funcionando
- [ ] Performance verificada (PageSpeed Insights)

### Documentação
- [ ] README atualizado com URL de produção
- [ ] Credenciais documentadas (1Password/LastPass)
- [ ] Equipe treinada
- [ ] Manual do usuário entregue

---

## 🆘 Solução de Problemas

### Erro: "Invalid API Key"
- Verifique variáveis de ambiente no painel de deploy
- Confirme chaves no Supabase Dashboard

### Erro: "CORS Policy"
- Adicione domínio de produção no CORS do Supabase
- Verifique URL configurada

### Erro: "Email domain not allowed"
- Confirme que o RLS está ativo
- Teste com e-mail @enterfix.com.br válido

### Build falha
```bash
# Limpar cache e tentar novamente
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 Suporte

**Contatos:**
- Supabase: https://supabase.com/support
- Vercel: https://vercel.com/support
- Documentação: `/docs` deste projeto

**Desenvolvedor:**
- Paulo Garcia (Enterfix)
- Email: paulo@enterfix.com.br

---

## 📅 Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0.0 | 25/02/2026 | Deploy inicial em produção |

---

**🎉 Pronto! Seu sistema está no ar com segurança corporativa.**
