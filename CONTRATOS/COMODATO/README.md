# 🔧 Sistema de Contratos de Comodato - Enterfix Metrologia

Sistema profissional para geração automatizada de contratos de comodato de equipamentos, desenvolvido especialmente para a **Enterfix Metrologia**.

## 📋 Sobre o Sistema

Este sistema gera contratos de comodato completos e juridicamente estruturados, seguindo todas as normas e boas práticas legais para empréstimo de equipamentos de metrologia.

### ✨ Funcionalidades

- ✅ **Geração automática de contratos em formato DOCX**
- ✅ **Formulário completo com todos os dados necessários**
- ✅ **Estrutura jurídica profissional** (13 cláusulas obrigatórias)
- ✅ **Histórico de contratos gerados**
- ✅ **Download direto dos contratos**
- ✅ **Interface moderna e responsiva**
- ✅ **Pronto para uso em rede local**

### 📄 Estrutura Jurídica Completa

O contrato gerado inclui todas as seções necessárias:

1. **Identificação das Partes** (Comodante e Comodatário)
2. **Objeto do Contrato** (equipamento, modelo, série, valor)
3. **Natureza do Comodato** (gratuito, sem transferência de propriedade)
4. **Prazo** (período determinado e renovação)
5. **Obrigações do Comodatário**
6. **Manutenção e Suporte**
7. **Valor de Referência do Bem**
8. **Responsabilização em Caso de Dano**
9. **Devolução**
10. **Eventual Negociação Futura**
11. **Rescisão**
12. **Privacidade e Confidencialidade (LGPD)**
13. **Foro**

---

## 🚀 Instalação e Configuração

### 📦 Pré-requisitos

- **Node.js** versão 14 ou superior ([Download aqui](https://nodejs.org/))
- **npm** (já vem com o Node.js)

### 🔧 Passo 1: Instalar Dependências

Abra o PowerShell na pasta do projeto e execute:

```powershell
# Instalar dependências do backend e frontend
npm run install:all
```

Ou, se preferir instalar manualmente:

```powershell
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### ⚙️ Passo 2: Configurar Dados da Empresa

Edite o arquivo `.env` na raiz do projeto e configure os dados da Enterfix:

```env
# Configurações do Sistema
PORT=3000
NODE_ENV=development

# Dados da Enterfix (Comodante)
ENTERFIX_RAZAO_SOCIAL=Enterfix Metrologia Ltda.
ENTERFIX_CNPJ=XX.XXX.XXX/XXXX-XX
ENTERFIX_ENDERECO=Rua Exemplo, 123 - Cidade/UF - CEP 00000-000
ENTERFIX_REPRESENTANTE=Paulo Roberto
ENTERFIX_CARGO=Diretor

# Configurações de Foro
FORO_CIDADE=Sua Cidade
FORO_ESTADO=UF
```

### ▶️ Passo 3: Iniciar o Sistema

#### Modo Desenvolvimento (recomendado para testes):

```powershell
# Inicia backend e frontend simultaneamente
npm run dev:full
```

#### Ou iniciar separadamente:

```powershell
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

O sistema estará disponível em:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

---

## 📱 Como Usar

### 1️⃣ Gerar um Contrato

1. Acesse a aba **"📝 Gerar Contrato"**
2. Preencha os dados do **Comodatário** (cliente)
3. Preencha os dados do **Equipamento** (objeto do comodato)
4. Defina o **Prazo** do contrato
5. Clique em **"📄 Gerar Contrato de Comodato"**
6. O contrato será gerado em formato `.docx` e estará disponível para download

### 2️⃣ Consultar Histórico

1. Acesse a aba **"📄 Histórico de Contratos"**
2. Visualize todos os contratos gerados
3. Clique em **"⬇️ Download"** para baixar qualquer contrato

---

## 🌐 Colocar em Rede Local (para uso por múltiplos computadores)

### Opção 1: Modo Desenvolvimento

1. **No computador servidor**, inicie o sistema:
   ```powershell
   npm run dev:full
   ```

2. **Descubra o IP do servidor**:
   ```powershell
   ipconfig
   ```
   Procure por "Endereço IPv4" (ex: `192.168.1.100`)

3. **Nos outros computadores**, acesse:
   ```
   http://192.168.1.100:3001
   ```

### Opção 2: Modo Produção (recomendado para uso permanente)

1. **Compile o frontend**:
   ```powershell
   npm run build
   ```

2. **Configure para produção** no `.env`:
   ```env
   NODE_ENV=production
   PORT=3000
   ```

3. **Inicie o servidor**:
   ```powershell
   npm start
   ```

4. **Acesse de qualquer computador da rede**:
   ```
   http://192.168.1.100:3000
   ```

### 🔒 Dicas de Segurança para Rede

- Configure o **Firewall do Windows** para permitir conexões na porta 3000
- Use apenas na rede interna (não exponha à internet)
- Considere configurar um domínio interno (ex: `contratos.enterfix.local`)

---

## 📁 Estrutura do Projeto

```
COMODATO/
├── src/                          # Backend (Node.js + Express)
│   ├── server.js                 # Servidor principal
│   ├── routes/
│   │   └── contratoRoutes.js     # Rotas da API
│   └── controllers/
│       └── contratoController.js # Lógica de geração de contratos
│
├── client/                       # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                # Componente principal
│   │   ├── components/
│   │   │   ├── Header.js         # Cabeçalho
│   │   │   ├── ContratoForm.js   # Formulário de geração
│   │   │   └── ListaContratos.js # Histórico
│   │   └── index.js
│   └── package.json
│
├── contratos/                    # Contratos gerados (criado automaticamente)
├── .env                          # Configurações da empresa
├── package.json                  # Dependências do backend
└── README.md                     # Este arquivo
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Plataforma JavaScript
- **Express** - Framework web
- **docx** - Geração de documentos Word
- **dotenv** - Variáveis de ambiente

### Frontend
- **React** - Biblioteca UI
- **Axios** - Cliente HTTP
- **React Icons** - Ícones

---

## 🔧 Comandos Disponíveis

### Backend

```powershell
npm run dev        # Inicia backend em modo desenvolvimento
npm start          # Inicia backend em modo produção
```

### Frontend

```powershell
npm run client     # Inicia frontend em modo desenvolvimento
npm run build      # Compila frontend para produção
```

### Completo

```powershell
npm run dev:full   # Inicia backend + frontend simultaneamente
npm run install:all # Instala todas as dependências
```

---

## 📊 API Endpoints

### `POST /api/contratos/gerar`
Gera um novo contrato de comodato

**Body (JSON)**:
```json
{
  "comodatario_razao_social": "Empresa XYZ Ltda.",
  "comodatario_cnpj": "00.000.000/0001-00",
  "comodatario_endereco": "Rua ABC, 123",
  "comodatario_representante": "João Silva",
  "comodatario_cargo": "Diretor",
  "objeto_nome": "Paquímetro Digital",
  "objeto_modelo": "PRO-500",
  "objeto_numero_serie": "SN123456",
  "objeto_valor_referencia": "5000.00",
  "prazo_dias": "30",
  "prazo_inicio": "2025-11-26"
}
```

**Resposta**:
```json
{
  "success": true,
  "message": "Contrato gerado com sucesso",
  "filename": "Contrato_Comodato_Empresa_XYZ_2025-11-26.docx",
  "downloadUrl": "/contratos/Contrato_Comodato_Empresa_XYZ_2025-11-26.docx"
}
```

### `GET /api/contratos/listar`
Lista todos os contratos gerados

**Resposta**:
```json
{
  "total": 5,
  "contratos": [
    {
      "filename": "Contrato_Comodato_Cliente1.docx",
      "data_criacao": "2025-11-26T10:30:00.000Z",
      "tamanho": "45.32 KB",
      "downloadUrl": "/contratos/Contrato_Comodato_Cliente1.docx"
    }
  ]
}
```

### `GET /api/contratos/download/:filename`
Download de contrato específico

---

## 🚀 Próximas Melhorias (Roadmap)

- [ ] **Geração de PDF** (além do DOCX)
- [ ] **Assinatura digital** integrada
- [ ] **Banco de dados** para histórico persistente
- [ ] **Busca e filtros** no histórico
- [ ] **Templates customizáveis** de contratos
- [ ] **Integração com sistema de ativos** da Enterfix
- [ ] **Notificações por email** quando contrato vencer
- [ ] **Dashboard com estatísticas**
- [ ] **Múltiplos usuários** com controle de acesso
- [ ] **Versionamento de contratos**

---

## ❓ Solução de Problemas

### Erro: "Cannot find module 'express'"
```powershell
npm install
```

### Erro: "Port 3000 already in use"
Altere a porta no `.env`:
```env
PORT=3001
```

### Frontend não carrega
```powershell
cd client
npm install
npm start
```

### Contratos não aparecem no histórico
Verifique se a pasta `contratos/` foi criada na raiz do projeto.

---

## 📞 Suporte

Para dúvidas ou melhorias, entre em contato com a equipe de TI da Enterfix.

---

## 📄 Licença

© 2025 Enterfix Metrologia Ltda. - Todos os direitos reservados.

Sistema desenvolvido exclusivamente para uso interno da Enterfix Metrologia.

---

## 🎯 Desenvolvido com

❤️ + ☕ + GitHub Copilot

**Versão**: 1.0.0  
**Data**: Novembro 2025  
**Desenvolvido para**: Enterfix Metrologia Ltda.
