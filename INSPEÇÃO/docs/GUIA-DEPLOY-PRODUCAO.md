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

### Método 1: E-mail Domain Restriction (Supabase - RECOMENDADO)

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

5. **Adicionar Hook de Validação no Signup:**

   No Supabase Dashboard:
   - **Database → Functions → Create Function**
   - Nome: `validate_enterfix_email`

   ```sql
   CREATE OR REPLACE FUNCTION public.validate_enterfix_email()
   RETURNS TRIGGER AS $$
   BEGIN
     IF NEW.email NOT LIKE '%@enterfix.com.br' THEN
       RAISE EXCEPTION 'Apenas e-mails @enterfix.com.br são permitidos';
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Trigger para validar no insert
   DROP TRIGGER IF EXISTS validate_email_domain ON auth.users;
   CREATE TRIGGER validate_email_domain
   BEFORE INSERT ON auth.users
   FOR EACH ROW EXECUTE FUNCTION validate_enterfix_email();
   ```

### Método 2: Google OAuth (Single Sign-On)

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

### Método 3: Validação no Frontend (Adicional)

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
