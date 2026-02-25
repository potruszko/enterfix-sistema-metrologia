# 🚨 SOLUÇÃO PARA ERRO "Invalid API Key"

## ⚠️ Problema Identificado

A chave de API do Supabase no arquivo `.env` está **INCOMPLETA**.

**Chave atual (INCORRETA):**
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeGRqbXFmemRsZHJqc2lhdWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MTUzMjAsImV4cCI6MjA1MDk5MTMyMH0.sb_publishable_Lksj_2IsCvQEDFAZtcgBYQ_FqLYnhwa
```

❌ **A chave está cortada!** Ela termina abruptamente em `...FqLYnhwa` mas deveria ter mais caracteres.

---

## ✅ SOLUÇÃO - Passo a Passo

### 1. Acessar o Supabase

**URL:** https://app.supabase.com/project/udxdjmqfzdldrjsiauka/settings/api

### 2. Copiar a chave COMPLETA

No painel do Supabase:

1. Vá em **Settings** → **API**
2. Localize a seção **"Project API keys"**
3. Encontre **"anon public"**
4. Clique no ícone de **copiar** (📋)
5. **IMPORTANTE:** Certifique-se de copiar a chave COMPLETA

A chave deve ter este formato:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeGRqbXFmemRsZHJqc2lhdWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MTUzMjAsImV4cCI6MjA1MDk5MTMyMH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Características:**
- ✅ Começa com `eyJhbGc...`
- ✅ Tem 3 partes separadas por `.` (ponto)
- ✅ A terceira parte é LONGA (não termina cedo)
- ✅ Total de ~200+ caracteres

### 3. Atualizar o arquivo .env

**Arquivo:** `INSPEÇÃO\.env`

**Substitua a linha:**
```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeGRqbXFmemRsZHJqc2lhdWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MTUzMjAsImV4cCI6MjA1MDk5MTMyMH0.sb_publishable_Lksj_2IsCvQEDFAZtcgBYQ_FqLYnhwa
```

**Pela chave COMPLETA copiada do Supabase:**
```env
VITE_SUPABASE_ANON_KEY=<COLE_AQUI_A_CHAVE_COMPLETA_DO_SUPABASE>
```

### 4. Salvar e Reiniciar

1. **Salve o arquivo** `.env` (Ctrl+S)
2. **Pare o servidor** (Ctrl+C no terminal)
3. **Reinicie:** `npm run dev`
4. **Recarregue o navegador** (F5)

---

## 🧪 Verificar se Funcionou

### Teste rápido:

1. Vá em **Novo Relatório**
2. Preencha os campos obrigatórios:
   - Cliente
   - Equipamento
   - Técnico
   - Data
3. Adicione uma linha de medição
4. Clique **"Salvar Relatório"**

### Resultado esperado:

✅ **Sucesso:** Alerta verde aparece: "Relatório REL-XXXXXX salvo com sucesso!"

❌ **Ainda com erro:** Se ainda aparecer erro "Invalid API key", siga o **Plano B** abaixo.

---

## 🔧 Plano B - Gerar Nova Chave

Se a chave atual não funcionar mesmo depois de copiada corretamente:

### 1. Gerar nova chave (RLS desabilitado temporariamente)

No Supabase SQL Editor, execute:

```sql
-- Desabilitar RLS temporariamente para teste
ALTER TABLE relatorios DISABLE ROW LEVEL SECURITY;
```

### 2. Testar novamente

Tente salvar um relatório. Se funcionar, o problema era com as políticas RLS.

### 3. Reabilitar RLS com política correta

```sql
-- Reabilitar RLS
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

-- Remover política antiga
DROP POLICY IF EXISTS "Permitir todas operações" ON relatorios;

-- Criar política permissiva (apenas para desenvolvimento)
CREATE POLICY "Permitir acesso público" ON relatorios
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
```

---

## 📋 Checklist Completo

### Antes de testar:

- [ ] ✅ Copiei a chave **COMPLETA** do Supabase (Settings → API)
- [ ] ✅ Colei no arquivo `.env` (VITE_SUPABASE_ANON_KEY)
- [ ] ✅ Salvei o arquivo `.env`
- [ ] ✅ Parei e reiniciei o servidor (`npm run dev`)
- [ ] ✅ Recarreguei o navegador (F5)
- [ ] ✅ Executei `supabase-setup.sql` no Supabase SQL Editor

### Ao testar:

- [ ] ✅ Criei um relatório de teste
- [ ] ✅ Preenchi todos os campos obrigatórios
- [ ] ✅ Cliquei em "Salvar Relatório"
- [ ] ✅ Vi alerta verde de sucesso
- [ ] ✅ Fui em "Histórico" e vi o relatório listado

---

## 🎨 Novo Sistema de Alertas Customizados

### O que mudou:

**ANTES:** ❌ Alertas padrão do JavaScript (feios e sem personalidade)
```javascript
alert('Erro ao salvar relatório: ' + error.message);
confirm('Tem certeza?');
```

**AGORA:** ✅ Alertas customizados com a cara do sistema
```javascript
alert.success('Relatório salvo!', 'Sucesso');
alert.error('Falha ao salvar', 'Erro');
alert.warning('Atenção!', 'Aviso');
alert.confirm('Tem certeza?', 'Confirmar');
```

### Tipos de alertas:

| Tipo | Cor | Quando usar | Exemplo |
|------|-----|-------------|---------|
| **success** | 🟢 Verde | Operação bem-sucedida | "Equipamento cadastrado!" |
| **error** | 🔴 Vermelho | Erro ou falha | "Chave de API inválida" |
| **warning** | 🟡 Amarelo | Atenção ou aviso | "Preencha todos os campos" |
| **info** | 🔵 Azul | Informação geral | "Processando..." |
| **confirm** | ⚪ Cinza | Pedir confirmação | "Remover equipamento?" |

### Características:

- ✨ **Design moderno** com ícones e cores
- 🎯 **Posicionamento inteligente** (canto superior direito)
- ⏱️ **Aparecem e somem automaticamente** (4-6 segundos)
- 🖱️ **Botão de fechar** (X)
- 🎨 **Animação suave** (desliza da direita)
- 🎭 **Múltiplos alertas** ao mesmo tempo
- 📱 **Responsivo** para mobile

### Onde ver os alertas em ação:

- ✅ **Salvar relatório** (sucesso/erro)
- ✅ **Cadastrar equipamento** (sucesso)
- ✅ **Registrar calibração** (sucesso)
- ✅ **Remover equipamento** (confirmação + sucesso)
- ✅ **Upload de foto** (erro de formato)
- ✅ **Carregar histórico** (erro de conexão)
- ✅ **Campo obrigatório vazio** (aviso)

---

## 🐛 Troubleshooting

### Erro persiste após corrigir .env

**Possíveis causas:**

1. **Cache do navegador**
   - Solução: Ctrl+Shift+Del → Limpar cache
   - Ou: Abrir em aba anônima (Ctrl+Shift+N)

2. **Servidor não reiniciou**
   - Pare: Ctrl+C no terminal
   - Inicie: `npm run dev`
   - Aguarde: "Local: http://localhost:5173/"

3. **Arquivo .env não foi salvo**
   - Verifique se há asterisco (*) no nome do arquivo
   - Salve novamente: Ctrl+S

4. **Tabela não criada no Supabase**
   - Execute: `supabase-setup.sql` no SQL Editor
   - Verifique: `SELECT * FROM relatorios LIMIT 1;`

### Chave ainda inválida

**Sintomas:**
- Erro: "Invalid API key"
- Erro: "JWT malformed"
- Erro: "Invalid JWT"

**Solução:**

1. Verifique se a URL está correta no `.env`:
   ```env
   VITE_SUPABASE_URL=https://udxdjmqfzdldrjsiauka.supabase.co
   ```

2. Certifique-se de que a chave começa com `eyJ...` (JWT válido)

3. Se o projeto foi pausado no Supabase:
   - Acesse: https://app.supabase.com/project/udxdjmqfzdldrjsiauka
   - Clique em "Restore project" se pausado

4. Verifique a expiração da chave:
   - As chaves JWT têm data de expiração
   - Se expirou, gere uma nova no painel

---

## 📞 Suporte Adicional

### Console do navegador (F12):

Verifique mensagens de erro:

```javascript
// Se ver isso:
"Invalid API key"  → Chave errada ou incompleta

// Se ver isso:
"relation 'relatorios' does not exist" → Falta executar SQL

// Se ver isso:
"Failed to fetch" → Problema de conexão ou URL errada
```

### Verificar no Supabase:

1. **API Settings:** https://app.supabase.com/project/udxdjmqfzdldrjsiauka/settings/api
2. **Table Editor:** https://app.supabase.com/project/udxdjmqfzdldrjsiauka/editor
3. **SQL Editor:** https://app.supabase.com/project/udxdjmqfzdldrjsiauka/sql

---

## ✅ Resumo da Correção

### O que foi feito:

1. ✅ **Diagnosticado:** Chave de API incompleta no `.env`
2. ✅ **Criado:** Sistema de alertas customizados
3. ✅ **Substituído:** Todos os `alert()` e `confirm()` do JavaScript
4. ✅ **Melhorado:** UX com alertas visuais e informativos

### O que você precisa fazer:

1. ⏳ **Copiar chave COMPLETA do Supabase**
2. ⏳ **Colar no arquivo `.env`**
3. ⏳ **Reiniciar servidor**
4. ⏳ **Testar salvamento de relatório**

### Depois de corrigir:

- ✅ Alertas customizados funcionando
- ✅ Salvamento de relatórios funcionando
- ✅ Sistema 100% operacional

---

**Data:** 24 de Fevereiro de 2026  
**Problema:** Invalid API key + Alertas JavaScript  
**Status:** ✅ Sistema de alertas implementado | ⏳ Requer atualização da chave Supabase
