# 📸 Configuração do Storage para Fotos de Perfil

## Passo a Passo para configurar no Supabase:

### 1️⃣ Criar Bucket "avatars"

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto: **udxdjmqfzdldrjsiauka**
3. No menu lateral, clique em **Storage**
4. Clique no botão **"New bucket"**
5. Configure:
   - **Name:** `avatars`
   - **Public bucket:** ✅ **SIM** (para aceitar URLs públicas)
   - **File size limit:** `2 MB` (tamanho máximo por arquivo)
   - **Allowed MIME types:** `image/*` (apenas imagens)

### 2️⃣ Configurar Políticas de Acesso (RLS)

Na aba **Policies** do bucket `avatars`, crie 3 políticas:

#### **Política 1: Upload de Fotos** ✍️
```sql
CREATE POLICY "Usuários podem fazer upload de suas fotos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### **Política 2: Visualizar Fotos** 👁️
```sql
CREATE POLICY "Fotos são públicas para visualização"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

#### **Política 3: Deletar/Atualizar Fotos** 🗑️
```sql
CREATE POLICY "Usuários podem deletar/atualizar suas próprias fotos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🔧 Alternativa Rápida (Via Interface)

Se preferir criar as políticas pela interface:

### Upload Policy:
- **Policy name:** `Usuários podem fazer upload`
- **Allowed operation:** `INSERT`
- **Target roles:** `authenticated`
- **USING expression:**
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

### Select Policy:
- **Policy name:** `Fotos públicas`
- **Allowed operation:** `SELECT`
- **Target roles:** `public`
- **USING expression:**
```sql
bucket_id = 'avatars'
```

### Delete Policy:
- **Policy name:** `Deletar próprias fotos`
- **Allowed operation:** `DELETE`
- **Target roles:** `authenticated`
- **USING expression:**
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

---

## ✅ Verificação

Após configurar, teste:

1. Faça login no sistema
2. Vá em **"Meu Perfil"**
3. Clique no ícone da câmera na foto de perfil
4. Selecione uma imagem (máx 2MB)
5. A foto deve aparecer imediatamente!

---

## 📁 Estrutura de Pastas no Storage

As fotos serão organizadas automaticamente assim:

```
avatars/
└── profiles/
    ├── <user-id-1>-foto-<timestamp>.jpg
    ├── <user-id-2>-foto-<timestamp>.png
    └── <user-id-3>-foto-<timestamp>.webp
```

---

## 🔒 Segurança

✅ Cada usuário só pode fazer upload na sua própria pasta  
✅ Fotos são públicas apenas para visualização  
✅ Ninguém pode deletar fotos de outros usuários  
✅ Limite de 2MB previne uploads abusivos  
✅ Apenas imagens são aceitas (sem executáveis)

---

## 🆘 Problemas Comuns

### ❌ Erro: "new row violates row-level security policy"
**Solução:** Verifique se o bucket está com RLS habilitado e as policies criadas corretamente.

### ❌ Foto não aparece
**Solução:** Confirme que o bucket é **público** (Public bucket: Yes)

### ❌ Upload falha
**Solução:** Verifique o tamanho da imagem (máx 2MB) e tipo (apenas images/*)

---

## 💡 Opcional: Assinaturas Digitais

No futuro, você pode criar outro bucket para **assinaturas digitais**:

```sql
CREATE BUCKET signatures;
-- Mesma configuração de policies do bucket avatars
```

Útil para assinar certificados digitalmente! 🖊️
