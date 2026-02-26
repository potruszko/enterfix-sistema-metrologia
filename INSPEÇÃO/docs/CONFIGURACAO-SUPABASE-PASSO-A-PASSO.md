# 🔧 CONFIGURAÇÃO COMPLETA DO SUPABASE - PASSO A PASSO

## ⚠️ EXECUTE NA ORDEM! NÃO PULE ETAPAS!

---

## 📍 **PASSO 1: Acessar Supabase**

1. Acesse: **https://supabase.com/dashboard**
2. Login com sua conta
3. Selecione o projeto: **udxdjmqfzdldrjsiauka**

---

## 📊 **PASSO 2: Criar Tabela de Perfis**

### **2.1 Abrir SQL Editor**
- No menu lateral esquerdo → **SQL Editor**
- Clique em **"+ New query"**

### **2.2 Executar SQL**
1. **COPIE TODO O CONTEÚDO** do arquivo: `docs/supabase-profiles-table.sql`
2. **COLE** no SQL Editor
3. Clique em **"Run"** (ou pressione Ctrl+Enter)
4. ✅ Deve aparecer: **"Success. No rows returned"**

### **2.3 Verificar Criação**
Execute este SQL para confirmar:
```sql
SELECT p.nome_completo, u.email, p.role, p.cargo 
FROM public.profiles p
JOIN auth.users u ON u.id = p.id;
```

**Resultado esperado:**
```
nome_completo         | email                          | role  | cargo
--------------------  | ------------------------------ | ----- | -----
paulo.otavio (ou ...)| paulo.otavio@enterfix.com.br   | admin | null
```

✅ **Se Paulo aparece com role='admin', está correto!**

---

## 📦 **PASSO 3: Criar Bucket de Storage (Fotos)**

### **3.1 Acessar Storage**
- No menu lateral esquerdo → **Storage**
- Clique em **"Create a new bucket"**

### **3.2 Configurar Bucket**
```
Name: avatars
Public bucket: ✅ YES (marque esta opção!)
File size limit: 2 MB
Allowed MIME types: image/*
```

Clique em **"Create bucket"**

### **3.3 Configurar Políticas do Bucket**

Clique no bucket **"avatars"** → Aba **"Policies"** → **"New Policy"**

#### **Política 1: Permitir UPLOAD**
```
Policy name: users_upload_own_avatar
Allowed operation: INSERT
Target roles: authenticated
```

**USING expression:**
```sql
bucket_id = 'avatars'
```

**WITH CHECK expression (IMPORTANTE!):**
```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

Clique em **"Review"** → **"Save policy"**

---

#### **Política 2: Permitir VISUALIZAR** 
```
Policy name: public_avatar_access
Allowed operation: SELECT
Target roles: public
```

**USING expression:**
```sql
bucket_id = 'avatars'
```

Clique em **"Review"** → **"Save policy"**

---

#### **Política 3: Permitir DELETAR**
```
Policy name: users_delete_own_avatar
Allowed operation: DELETE
Target roles: authenticated
```

**USING expression:**
```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

Clique em **"Review"** → **"Save policy"**

---

### **3.4 Verificar Bucket**

Volte para **Storage** → **avatars**

Você deve ver:
- ✅ Bucket criado
- ✅ Public: Yes
- ✅ 3 políticas ativas

---

## 🧪 **PASSO 4: Testar o Sistema**

### **4.1 Acessar Sistema**
https://enterfix-sistema-metrologia.vercel.app

### **4.2 Login**
Use: `paulo.otavio@enterfix.com.br`

### **4.3 Acessar Perfil**
- Clique no menu: **"👤 Meu Perfil"**
- Você deve ver o formulário completo

### **4.4 Testar Upload de Foto**
1. Clique no ícone da câmera (📷)
2. Selecione uma foto (máx 2MB)
3. ✅ **Deve funcionar sem erros!**
4. A foto deve aparecer imediatamente

### **4.5 Preencher Perfil**
- Nome completo
- **CPF** (documento principal)
- Cargo
- Telefone
- Empresa: Enterfix Metrologia
- Registro profissional: **Deixe vazio ou preencha se tiver CREA/CRM**
- Tipo registro: **"Não se aplica"** (se não tiver)

Clique em **"Salvar Perfil"**

✅ **Deve aparecer:** "Perfil atualizado com sucesso! ✅"

---

## 🔍 **PASSO 5: Verificar se é Admin**

Execute no SQL Editor:
```sql
SELECT 
  u.email,
  p.nome_completo,
  p.role,
  CASE p.role
    WHEN 'admin' THEN '✅ ADMINISTRADOR'
    WHEN 'gestor' THEN '👔 GESTOR'
    WHEN 'tecnico' THEN '🔧 TÉCNICO'
    ELSE '👁️ VISUALIZADOR'
  END as nivel_acesso
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'paulo.otavio@enterfix.com.br';
```

**Resultado esperado:**
```
email                          | nome_completo | role  | nivel_acesso
------------------------------ | ------------- | ----- | ------------------
paulo.otavio@enterfix.com.br   | Paulo Otávio  | admin | ✅ ADMINISTRADOR
```

---

## ❌ **TROUBLESHOOTING - Se der erro:**

### **Erro: "Bucket not found"**
**Causa:** Bucket "avatars" não foi criado  
**Solução:** Volte ao PASSO 3

### **Erro: "new row violates row-level security policy"**
**Causa:** Políticas não configuradas corretamente  
**Solução:** Delete as políticas antigas e recrie conforme PASSO 3.3

### **Erro: "infinite recursion detected"**
**Causa:** SQL antigo com política recursiva  
**Solução:** 
1. SQL Editor → Execute:
```sql
DROP POLICY IF EXISTS "Admins podem atualizar qualquer perfil" ON public.profiles;
```
2. Execute novamente o SQL completo do `supabase-profiles-table.sql`

### **Erro: "Failed to fetch"**
**Causa:** Bucket não é público  
**Solução:** 
1. Storage → avatars → Settings
2. Marque: **"Public bucket"** → Save

---

## ✅ **CHECKLIST FINAL**

Antes de continuar, confirme:

- [ ] ✅ Tabela `profiles` criada
- [ ] ✅ Paulo com role='admin' confirmado
- [ ] ✅ Bucket `avatars` criado e público
- [ ] ✅ 3 políticas do Storage criadas
- [ ] ✅ Upload de foto funcionando
- [ ] ✅ Perfil salvo com sucesso
- [ ] ✅ CPF como campo principal

---

## 🎯 **PRÓXIMOS PASSOS (Após Configuração)**

Depois que tudo estiver funcionando:

1. ✅ Criar mais usuários de teste
2. ✅ Testar permissões (admin vs técnico)
3. ✅ Preencher dados completos dos perfis
4. 🔄 Implementar gestão de usuários (tela admin)

---

## 📞 **AJUDA**

Se ainda houver erros:
1. Tire print da mensagem de erro
2. Execute no SQL Editor e me envie o resultado:
```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar políticas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verificar buckets
SELECT * FROM storage.buckets;
```

---

**Última atualização:** 26/02/2026  
**Versão:** 1.1 (Corrigida - CPF como principal, sem recursão RLS)
