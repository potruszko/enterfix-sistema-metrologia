# 🚀 Guia Rápido de Início - Enterfix Metrologia

## 📝 Checklist de Configuração

### ✅ Passo 1: Verifique as Dependências Instaladas
As dependências já foram instaladas! Você tem:
- ✅ React 18
- ✅ Tailwind CSS
- ✅ Supabase Client
- ✅ jsPDF
- ✅ React Hook Form
- ✅ Lucide React (ícones)

### ⚙️ Passo 2: Configure o Supabase

#### A. Crie uma conta no Supabase
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub ou email

#### B. Crie um novo projeto
1. Clique em "New Project"
2. Escolha um nome (ex: "enterfix-metrologia")
3. Defina uma senha segura para o banco de dados
4. Escolha a região mais próxima (South America - São Paulo)
5. Aguarde 2-3 minutos para o projeto ser criado

#### C. Execute o SQL
1. No menu lateral, clique em **SQL Editor**
2. Clique em "New query"
3. Cole o seguinte código:

```sql
CREATE TABLE relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL,
  cliente TEXT,
  projeto_os TEXT,
  dados JSONB NOT NULL,
  status_final TEXT,
  tecnico_nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_relatorios_cliente ON relatorios(cliente);
CREATE INDEX idx_relatorios_tipo ON relatorios(tipo);
CREATE INDEX idx_relatorios_status ON relatorios(status_final);
CREATE INDEX idx_relatorios_created_at ON relatorios(created_at DESC);
```

4. Clique em "RUN" (ou pressione Ctrl+Enter)
5. Você verá a mensagem: "Success. No rows returned"

#### D. Obtenha as credenciais
1. No menu lateral, clique em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Você verá duas informações importantes:

**Project URL** - parecido com:
```
https://abcdefghijk123456.supabase.co
```

**anon public** (em "Project API keys") - parecido com:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

### 🔐 Passo 3: Configure o Arquivo .env

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua os valores pelas suas credenciais:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_AQUI
```

3. Salve o arquivo

### 🎯 Passo 4: Inicie o Projeto

```bash
npm run dev
```

O sistema abrirá em: **http://localhost:5173**

## 🎨 Primeiros Passos no Sistema

### 1. Explore o Dashboard
- Veja as estatísticas (ainda zeradas porque não há relatórios)
- Familiarize-se com a interface

### 2. Crie seu Primeiro Relatório
1. Clique em **"Novo Relatório"** na sidebar
2. Escolha **"Relatório de Fabricação"**
3. Preencha os dados:
   - **Cliente**: "Teste Cliente Ltda"
   - **OP**: "12345"
   - **Código da Peça**: "PEÇA-001"
   - **Técnico**: "Seu Nome"

4. Adicione uma medição:
   - **Descrição**: "Diâmetro externo"
   - **Nominal**: 20
   - **Tol. (+)**: 0.05
   - **Tol. (-)**: 0.05
   - **Medido**: 20.025

5. Veja o status calcular automaticamente: **OK** ✅

6. Clique em **"Exportar PDF"** para ver o resultado

### 3. Consulte o Histórico
1. Clique em **"Histórico"**
2. Veja seu relatório salvo
3. Use os filtros para buscar

## 🎯 Exemplos de Uso

### Exemplo 1: Peça Aprovada
```
Nominal: 50.0000
Tol. (+): 0.1000
Tol. (-)0.1000
Medido: 50.0450
Resultado: OK ✅ (está dentro da faixa 49.9000 a 50.1000)
```

### Exemplo 2: Peça Reprovada
```
Nominal: 50.0000
Tol. (+): 0.1000
Tol. (-): 0.1000
Medido: 50.1250
Resultado: NOK ❌ (está fora da faixa 49.9000 a 50.1000)
```

## 🆘 Solução Rápida de Problemas

### Problema: "Supabase credentials not found"
**Solução:**
1. Verifique se o `.env` existe
2. Confirme que as credenciais estão corretas
3. Reinicie o servidor: Ctrl+C e depois `npm run dev`

### Problema: Erro ao salvar relatório
**Solução:**
1. Verifique se a tabela `relatorios` foi criada no Supabase
2. No Supabase, vá em **Table Editor** e procure por "relatorios"
3. Se não existir, execute o SQL novamente

### Problema: Página em branco
**Solução:**
1. Abra o Console do navegador (F12)
2. Veja se há erros em vermelho
3. Provavelmente é problema de credenciais do Supabase

## 📱 Atalhos Úteis

- **F12**: Abrir DevTools do navegador
- **Ctrl+C**: Parar o servidor
- **Ctrl+Shift+R**: Recarregar sem cache

## 🎓 Próximos Passos

1. ✅ Personalize as informações da empresa em **Configurações**
2. ✅ Adicione o logo da sua empresa no PDF (edite `pdfGenerator.js`)
3. ✅ Crie relatórios de teste
4. ✅ Treine sua equipe no uso do sistema

## 📞 Comandos Úteis

```bash
# Iniciar o projeto
npm run dev

# Parar o servidor
Ctrl + C

# Gerar build de produção
npm run build

# Ver versão do Node
node --version

# Reinstalar dependências (se necessário)
npm install
```

## 🎉 Pronto!

Agora você tem um sistema completo de metrologia funcionando!

**Dúvidas?** Consulte o README.md principal para informações detalhadas.

---

**Desenvolvido para Enterfix Metrologia**
