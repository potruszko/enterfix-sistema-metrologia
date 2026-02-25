# 🔧 Enterfix Metrologia - Sistema de Relatórios

Sistema web completo para geração de Relatórios de Fabricação e Calibração de Esferas com foco em rastreabilidade metrológica.

## � Documentação

📖 **Toda a documentação técnica está disponível na pasta [`/docs`](docs/)**

**Destaques:**
- 🚀 **[GUIA-DEPLOY-PRODUCAO.md](docs/GUIA-DEPLOY-PRODUCAO.md)** - Deploy em produção com autenticação corporativa (@enterfix.com.br)- 🔑 **[azure-ad-configuracao.md](docs/azure-ad-configuracao.md)** - ⭐ Checklist SSO com Microsoft 365/Azure AD- ⚡ **[GUIA-RAPIDO.md](docs/GUIA-RAPIDO.md)** - Guia rápido para desenvolvedores
- ⚙️ **[CORRIGIR-API-KEY.md](docs/CORRIGIR-API-KEY.md)** - Configuração do Supabase

Veja o [índice completo de documentação](docs/README.md) para mais recursos.

## �🚀 Tecnologias Utilizadas

- **React 18** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Supabase** - Backend as a Service (Banco de dados PostgreSQL)
- **Lucide React** - Biblioteca de ícones
- **jsPDF** - Geração de PDFs
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📋 Funcionalidades

### ✅ Relatórios
- **Relatório de Fabricação**: Controle de qualidade de peças fabricadas
- **Relatório de Calibração**: Calibração de esferas de medição
- Tabelas dinâmicas com adição/remoção de linhas
- Cálculo automático de status (OK/NOK) baseado em tolerâncias
- Formatação automática para 4 casas decimais

### 📊 Dashboard
- Estatísticas gerais (total, aprovados, reprovados)
- Gráfico de taxa de aprovação
- Relatórios recentes

### 🗂️ Histórico
- Busca por cliente ou número de desenho
- Filtros por tipo e status
- Visualização de detalhes
- Download de PDFs

### 📄 Geração de PDF
- Layout profissional com logo da empresa
- Tabelas formatadas
- Campo para assinatura digital
- Padrão industrial moderno

### ⚙️ Configurações
- Informações da empresa
- Dados do responsável técnico
- Configuração do Supabase

## 🛠️ Instalação

### 1. Clone ou inicialize o projeto

```bash
# Se ainda não tem o projeto iniciado
cd "C:\Users\paulo\OneDrive\Documentos\CODIGUINHO\INSPEÇÃO"
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1. Crie uma conta no Supabase
- Acesse [https://supabase.com](https://supabase.com)
- Crie um novo projeto

#### 3.2. Execute o SQL no Supabase
No painel do Supabase, vá em **SQL Editor** e execute:

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

-- Criar índices para melhor performance
CREATE INDEX idx_relatorios_cliente ON relatorios(cliente);
CREATE INDEX idx_relatorios_tipo ON relatorios(tipo);
CREATE INDEX idx_relatorios_status ON relatorios(status_final);
CREATE INDEX idx_relatorios_created_at ON relatorios(created_at DESC);
```

#### 3.3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```

**Para obter as credenciais:**
1. No painel do Supabase, vá em **Settings** → **API**
2. Copie a **Project URL** (VITE_SUPABASE_URL)
3. Copie a **anon/public key** (VITE_SUPABASE_ANON_KEY)

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em: `http://localhost:5173`

## 📖 Guia de Uso

### Criando um Novo Relatório

1. **Acesse "Novo Relatório"** na barra lateral
2. **Escolha o tipo**: Fabricação ou Calibração
3. **Preencha os campos de identificação**:
   - Cliente, OP/Projeto, Código da Peça, etc.
4. **Adicione medições**:
   - Clique em "Adicionar Linha" para nova medição
   - Preencha: Descrição, Nominal, Tolerâncias, Valor Medido
   - O status (OK/NOK) é calculado automaticamente
5. **Adicione observações** (opcional)
6. **Salve ou exporte**:
   - "Salvar Relatório": Grava no banco de dados
   - "Exportar PDF": Baixa o relatório em PDF

### Cálculo de Status

O sistema calcula automaticamente se uma medição está aprovada:

```
Valor OK se: (Nominal - Tol. Negativa) ≤ Medido ≤ (Nominal + Tol. Positiva)
```

**Exemplo:**
- Nominal: 20.0000
- Tolerância (+): 0.0500
- Tolerância (-): 0.0500
- Faixa aceita: 19.9500 a 20.0500
- Medido: 20.0250 → **OK** ✅

### Consultando Histórico

1. Acesse **"Histórico"** na barra lateral
2. Use os filtros:
   - **Busca**: Digite nome do cliente ou nº do desenho
   - **Tipo**: Fabricação ou Calibração
   - **Status**: Aprovado ou Reprovado
3. **Ações disponíveis**:
   - 👁️ Visualizar detalhes
   - 📥 Download do PDF

## 🎨 Estrutura do Projeto

```
INSPEÇÃO/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Menu lateral
│   │   ├── Dashboard.jsx        # Dashboard com estatísticas
│   │   ├── RelatorioForm.jsx    # Formulário de relatórios
│   │   ├── Historico.jsx        # Histórico e busca
│   │   └── Configuracoes.jsx    # Configurações do sistema
│   ├── lib/
│   │   └── supabase.js          # Cliente Supabase
│   ├── utils/
│   │   ├── metrologyUtils.js    # Funções de cálculo metrológico
│   │   └── pdfGenerator.js      # Geração de PDFs
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Ponto de entrada
│   └── index.css                # Estilos globais
├── .env                         # Variáveis de ambiente
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 📐 Regras Metrológicas

### Formatação de Números
Todos os valores são formatados com **4 casas decimais**:
- 20 → 20.0000
- 20.1 → 20.1000
- 20.12345 → 20.1235 (arredondado)

### Tolerâncias
- **Tolerância Positiva (+)**: Valor máximo aceitável acima do nominal
- **Tolerância Negativa (-)**: Valor máximo aceitável abaixo do nominal
- Valores são sempre tratados como **absolutos**

### Parecer Final
O parecer é calculado automaticamente:
- **APROVADO**: Todas as medições estão OK
- **REPROVADO**: Pelo menos uma medição está NOK

## 🎯 Tipos de Relatório

### Relatório de Fabricação
Campos específicos:
- Código da Peça
- Revisão do Desenho
- Material (Aço/Alumínio)
- Lote da Matéria-prima
- Dureza

### Relatório de Calibração
Campos específicos:
- Modelo da Esfera
- Nº de Série
- Temperatura (°C)
- Umidade (%)
- Diâmetro Médio
- Erro de Esfericidade
- Incerteza de Medição (k=2)

## 🔒 Segurança

- As credenciais do Supabase **nunca** devem ser commitadas no Git
- Use o arquivo `.env` que está no `.gitignore`
- Em produção, configure as variáveis de ambiente no host

## 🚀 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

### Deploy em Produção

Para publicar a aplicação no domínio da Enterfix com restrição de acesso apenas para emails **@enterfix.com.br**, consulte o **[GUIA-DEPLOY-PRODUCAO.md](docs/GUIA-DEPLOY-PRODUCAO.md)**.

**🔑 Para usuários Microsoft 365:** Siga o checklist rápido **[azure-ad-configuracao.md](docs/azure-ad-configuracao.md)** para configurar SSO com Azure AD.

Este guia completo inclui:
- ✅ **SSO com Azure AD/Microsoft 365** (recomendado para quem usa Microsoft 365)
- ✅ Autenticação corporativa (restrição @enterfix.com.br)
- ✅ Deploy no Vercel (gratuito, SSL automático, CI/CD)
- ✅ Configuração do Supabase com Row Level Security
- ✅ Domínio customizado (sistema.enterfix.com.br)
- ✅ Segurança e melhores práticas
- ✅ Troubleshooting e checklist de deploy

**Opções de hospedagem:**
- **Vercel** (recomendado): Deploy gratuito, SSL automático, integração com GitHub
- **Netlify**: Alternativa gratuita similar ao Vercel
- **VPS/Docker**: Para hospedagem própria com NGINX

## 📝 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Verifica erros de código
```

## 🐛 Solução de Problemas

### Erro: "Supabase credentials not found"
- Verifique se o arquivo `.env` existe na raiz
- Confirme que as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Tabela não encontrada no Supabase
- Execute o script SQL no Editor do Supabase
- Verifique se a tabela `relatorios` foi criada
- Confira as permissões RLS (Row Level Security)

### PDF não está gerando
- Verifique se `jspdf` e `jspdf-autotable` estão instalados
- Limpe o cache: `npm cache clean --force`
- Reinstale as dependências: `npm install`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção de Solução de Problemas
2. Revise a documentação do Supabase
3. Consulte os logs do console do navegador

## 📄 Licença

Este projeto foi desenvolvido para uso interno da **Enterfix Metrologia**.

---

**Desenvolvido com ❤️ para Enterfix Metrologia**
