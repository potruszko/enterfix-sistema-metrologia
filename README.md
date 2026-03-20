# Sistema de Composição de Pontas de Medição

Aplicação para gestão de **BOM (Bill of Materials)** de pontas de medição CMM, com integração direta à **API v3 do Bling**.

---

## O que faz

| Funcionalidade | Descrição |
|---|---|
| **Construtor de Produto (Wizard)** | 5 etapas guiadas: tipo → esfera → haste+blank → mão de obra → revisão |
| **BOM automática** | Sugere blanks compatíveis pelo Ø do furo vs Ø da haste. Calcula comprimento da haste automaticamente |
| **Custo em tempo real** | Soma custo do blank + haste (por mm) + esfera + mão de obra com atualização imediata |
| **Sincronização Bling** | Cria/atualiza produto e ficha técnica (estrutura de composição) no Bling via API v3 |
| **Importação do Bling** | Busca e importa produtos existentes no Bling para o sistema local |
| **Catálogos** | CRUD completo de Blanks, Hastes, Esferas e Mão de Obra |

---

## Pré-requisitos

- **Node.js** v18 ou superior → [nodejs.org](https://nodejs.org)
- Conta no **Bling** com acesso à API v3 → [developer.bling.com.br](https://developer.bling.com.br)

---

## Instalação e execução

### 1. Backend

```bash
cd backend
npm install
```

Copie o arquivo de variáveis de ambiente:

```bash
copy .env.example .env
```

Edite o `.env` com suas credenciais Bling:

```env
PORT=3001
BLING_CLIENT_ID=seu_client_id
BLING_CLIENT_SECRET=seu_client_secret
```

Inicie o servidor:

```bash
npm run dev       # desenvolvimento (com hot-reload)
# ou
npm start         # produção
```

O banco de dados SQLite é criado automaticamente em `backend/data/composicoes.db`.

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## Autenticação Bling (OAuth v3)

O Bling exige OAuth 2.0. Há duas formas:

### Opção A — Fluxo OAuth (recomendado)
1. Acesse **Configurações** no app
2. Clique em **"Autorizar no Bling"**
3. Faça login no Bling e autorize o aplicativo
4. O sistema salva o token automaticamente

### Opção B — Token manual
1. Gere um token no [Portal Bling Developer](https://developer.bling.com.br)
2. Em **Configurações**, cole o token no campo **"Access Token"**
3. Clique em "Salvar token"

---

## Estrutura do projeto

```
sistema-composicao/
├── backend/
│   ├── server.js              ← Servidor Express
│   ├── db/
│   │   └── index.js          ← SQLite + criação do schema
│   ├── routes/
│   │   ├── blanks.js
│   │   ├── hastes.js
│   │   ├── esferas.js
│   │   ├── maoDeObra.js
│   │   ├── produtos.js        ← CRUD + recálculo de custo
│   │   ├── composicoes.js     ← Lógica: sugerir blank, calcular haste
│   │   ├── bling.js          ← OAuth + sync com Bling API v3
│   │   └── configuracoes.js
│   └── data/
│       └── composicoes.db    ← Banco criado automaticamente
│
└── frontend/
    └── src/
        ├── App.jsx            ← Rotas
        ├── lib/
        │   ├── api.js        ← Chamadas à API backend
        │   └── utils.js      ← Formatadores, constantes
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── Modal.jsx
        │   └── ...
        └── pages/
            ├── Dashboard.jsx
            ├── ConstruirProduto.jsx  ← Wizard principal
            ├── Blanks.jsx
            ├── Hastes.jsx
            ├── Esferas.jsx
            ├── MaoDeObra.jsx
            ├── Produtos.jsx
            ├── Bling.jsx            ← Sincronização
            └── Configuracoes.jsx
```

---

## Lógica de negócio

### Nomenclatura dos produtos

| Prefixo | Tipo |
|---|---|
| `PM` | Ponta de Medição |
| `EM` | Extensão |
| `AM` | Adaptador |
| `SM` | Ponta Star |
| `DM` | Ponta Disco |
| `CM` | Ponta Cônica |
| `BM` | Blank |

### Como o blank é selecionado

O sistema filtra os blanks com base em duas condições:
1. `rosca` do blank = rosca selecionada (ex: M2)
2. `diametro_furo` do blank = `diametro` da haste selecionada

Exemplo: haste Metal Duro Ø1.5mm + rosca M2 → mostra apenas blanks `BM2-xxx` com furo de 1.5mm.

### Cálculo do comprimento da haste

```
comprimento_haste = comprimento_total - comprimento_blank - raio_esfera
```

### Payload enviado ao Bling

```json
{
  "nome": "Ponta de Medição PM2-D0203",
  "codigo": "PM2-D0203",
  "tipo": "P",
  "situacao": "A",
  "estrutura": {
    "tipo": "F",
    "componentes": [
      { "produto": { "codigo": "BM2-I0006" }, "quantidade": 1 },
      { "produto": { "codigo": "HASTE-MD-1.5" }, "quantidade": 25.0 },
      { "produto": { "codigo": "ESFERA-RUBI-2.0" }, "quantidade": 1 },
      { "produto": { "codigo": "MO-SETUP" }, "quantidade": 1 }
    ]
  }
}
```

---

## API do Backend

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/blanks` | Listar blanks (filtros: `rosca`, `diametro_furo`) |
| POST | `/api/blanks` | Criar blank |
| PUT | `/api/blanks/:id` | Atualizar blank |
| DELETE | `/api/blanks/:id` | Remover blank |
| GET | `/api/hastes` | Listar hastes |
| GET | `/api/esferas` | Listar esferas |
| GET | `/api/produtos` | Listar produtos |
| POST | `/api/produtos` | Criar produto com composição |
| POST | `/api/composicoes/sugerir-blank` | Sugerir blanks compatíveis |
| POST | `/api/composicoes/calcular-haste` | Calcular comprimento da haste |
| GET | `/api/bling/auth/status` | Status da autenticação Bling |
| GET | `/api/bling/auth/url` | URL OAuth Bling |
| POST | `/api/bling/auth/token-manual` | Salvar token manualmente |
| POST | `/api/bling/sincronizar/:id` | Sincronizar produto com Bling |
| POST | `/api/bling/importar/:blingId` | Importar produto do Bling |
