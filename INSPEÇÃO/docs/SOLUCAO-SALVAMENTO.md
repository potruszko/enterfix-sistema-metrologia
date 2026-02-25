# ✅ Solução de Problemas - Botão Salvar

## 🔍 Diagnóstico Rápido

Se o botão "Salvar Relatório" não está funcionando, siga este checklist:

---

## 1️⃣ Verificar Configuração do .env

O arquivo `.env` deve estar **na raiz do projeto** (não dentro de `src/`):

```
INSPEÇÃO/
  ├── .env                    ← AQUI
  ├── src/
  ├── public/
  └── package.json
```

### Conteúdo do .env:
```env
VITE_SUPABASE_URL=https://udxdjmqfzdldrjsiauka.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeGRqbXFmemRsZHJqc2lhdWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MTUzMjAsImV4cCI6MjA1MDk5MTMyMH0.sb_publishable_Lksj_2IsCvQEDFAZtcgBYQ_FqLYnhwa
```

### ⚠️ IMPORTANTE:
- **NÃO coloque espaços** antes ou depois do `=`
- **NÃO coloque aspas** nos valores
- **SEMPRE reinicie** o servidor após alterar o `.env`

---

## 2️⃣ Criar Tabela no Supabase

A tabela `relatorios` DEVE existir no Supabase antes de salvar.

### Como Criar:
1. Acesse: https://app.supabase.com/project/udxdjmqfzdldrjsiauka/sql
2. Abra o arquivo: [supabase-setup.sql](../supabase-setup.sql)
3. Copie **TODO** o conteúdo
4. Cole no SQL Editor do Supabase
5. Clique em **"RUN"**

### Script Completo:
```sql
-- Criar tabela de relatórios
CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL,
  cliente TEXT,
  projeto_os TEXT,
  dados JSONB NOT NULL,  -- Inclui: medicoes, fotos (base64), versao, numeroRelatorio
  status_final TEXT,
  tecnico_nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente ON relatorios(cliente);
CREATE INDEX IF NOT EXISTS idx_relatorios_tipo ON relatorios(tipo);
CREATE INDEX IF NOT EXISTS idx_relatorios_status ON relatorios(status_final);
CREATE INDEX IF NOT EXISTS idx_relatorios_created_at ON relatorios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_relatorios_numero ON relatorios USING GIN ((dados->'numeroRelatorio'));
CREATE INDEX IF NOT EXISTS idx_relatorios_original ON relatorios USING GIN ((dados->'relatorioOriginal'));

-- Habilitar Row Level Security (RLS)
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações
CREATE POLICY "Permitir todas operações" ON relatorios
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Verificar se a Tabela Existe:
Execute no SQL Editor:
```sql
SELECT * FROM relatorios LIMIT 1;
```

Se retornar erro = **Tabela não existe** → Executar script acima  
Se retornar vazio ou dados = **Tabela OK** ✅

---

## 3️⃣ Reiniciar o Servidor

Após qualquer alteração no `.env`, SEMPRE reinicie:

### Windows PowerShell:
```powershell
# Parar servidor (Ctrl+C no terminal)
npm run dev
```

### Verificar se Carregou:
Abra o Console do Navegador (F12) e execute:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

Se retornar `undefined` = `.env` não está sendo lido → Verifique localização

---

## 4️⃣ Testar Conexão com Supabase

### Teste no Console do Navegador (F12):

```javascript
// Copie e cole no Console:
import { supabase } from './src/lib/supabase';

// Testar SELECT
const testar = async () => {
  const { data, error } = await supabase
    .from('relatorios')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('❌ Erro:', error.message);
  } else {
    console.log('✅ Conexão OK!', data);
  }
};

testar();
```

### Possíveis Erros:

| Erro | Causa | Solução |
|------|-------|---------|
| `relation "relatorios" does not exist` | Tabela não criada | Executar `supabase-setup.sql` |
| `Invalid API key` | Chave incorreta no .env | Verificar credenciais |
| `undefined` | .env não carregado | Reiniciar servidor |
| `Network error` | Supabase offline | Verificar status do Supabase |

---

## 5️⃣ Verificar Console do Navegador

Sempre que clicar em "Salvar Relatório":

1. Abra o **Console** (F12 → aba Console)
2. Clique em **"Salvar Relatório"**
3. Veja se aparece algum erro vermelho

### Erros Comuns:

**❌ "Cannot read property 'from' of undefined"**
- **Causa**: Supabase não inicializado
- **Solução**: Verificar `.env` e reiniciar servidor

**❌ "relatorios" does not exist"**
- **Causa**: Tabela não criada no Supabase
- **Solução**: Executar `supabase-setup.sql`

**❌ "unauthorized"**
- **Causa**: RLS sem política
- **Solução**: Executar a parte de políticas do SQL

**❌ "Invalid JWT"**
- **Causa**: Chave do .env está errada
- **Solução**: Copiar novamente as credenciais do Supabase

---

## 6️⃣ Checklist Final

Antes de testar novamente:

- [ ] Arquivo `.env` está na raiz do projeto
- [ ] Credenciais estão corretas (sem aspas, sem espaços)
- [ ] Servidor foi reiniciado após alterar `.env`
- [ ] Tabela `relatorios` existe no Supabase
- [ ] Políticas RLS foram criadas
- [ ] Console do navegador não mostra erros

---

## 🧪 Teste Completo

### Criar Relatório de Teste:

1. Preencha **apenas** os campos obrigatórios:
   - Cliente: "Teste"
   - OP: "001"
   - Equipamento: "Teste"
   - Técnico: "Teste"
   - Data: (atual)

2. Medições: **Deixe a linha padrão**
   - Não precisa preencher nada

3. Clique **"Salvar Relatório"**

4. **O que deve acontecer**:
   - Alert: "Relatório REL-XXXXXX salvo com sucesso!"
   - Formulário é resetado
   - Console não mostra erros

5. **Verificar no Supabase**:
   - Acesse: https://app.supabase.com/project/udxdjmqfzdldrjsiauka/editor
   - Tabela: `relatorios`
   - Deve aparecer 1 linha nova ✅

---

## 📞 Se Ainda Não Funcionar

### Envie estas informações:

1. **Console do Navegador**:
   - Abra F12 → Console
   - Tire print de qualquer erro vermelho

2. **Resultado do teste de conexão**:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   // Cole o resultado aqui
   ```

3. **Conteúdo do .env** (mostre apenas primeiros caracteres):
   ```
   VITE_SUPABASE_URL=https://udxdj...
   VITE_SUPABASE_ANON_KEY=eyJhbG...
   ```

4. **Resultado do SQL**:
   ```sql
   SELECT * FROM relatorios LIMIT 1;
   -- Retornou erro ou dados?
   ```

---

## ✅ Status das Configurações Atuais

Baseado na análise do código:

| Item | Status | Observação |
|------|--------|------------|
| Arquivo .env | ✅ OK | Credenciais configuradas |
| Cliente Supabase | ✅ OK | Inicializado corretamente |
| Código de Salvamento | ✅ OK | RelatorioForm.jsx correto |
| Tabela no Supabase | ⚠️ **VERIFICAR** | Executar supabase-setup.sql |

### Próximo Passo Recomendado:
**→ Executar o arquivo `supabase-setup.sql` no Supabase SQL Editor**

---

## 🎯 Resumo Rápido

Se o salvamento não funciona, 90% das vezes é:

1. **Tabela não foi criada** → Executar `supabase-setup.sql`
2. **Servidor não foi reiniciado** → Reiniciar após alterar `.env`
3. **.env está em local errado** → Deve estar na raiz

---

**Última atualização:** 24/02/2026  
**Autor:** Sistema Enterfix Metrologia
