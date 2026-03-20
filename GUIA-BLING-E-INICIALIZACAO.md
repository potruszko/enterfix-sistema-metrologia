# Guia de Configuração do Bling e Inicialização

Este arquivo descreve o que precisa ser configurado para integrar o sistema com o Bling e iniciar a aplicação localmente para validação.

## 1. O que já está pronto no sistema

- Backend Express em `http://localhost:3001`
- Frontend Vite em `http://localhost:5173`
- Tela de configuração do Bling em `Configurações`
- Callback OAuth configurado para `http://localhost:3001/api/bling/auth/callback`
- Arquivo base de ambiente em `backend/.env`

## 2. Instâncias necessárias

Você precisa de 3 instâncias ativas ou configuradas:

1. Aplicativo criado no portal do Bling Developer
2. Backend local rodando na porta `3001`
3. Frontend local rodando na porta `5173`

## 3. Configurar o aplicativo no Bling Developer

1. Acesse o portal do Bling Developer.
2. Crie um aplicativo OAuth v3 para uso interno.
3. Cadastre a URL de redirecionamento exatamente assim:

```text
http://localhost:3001/api/bling/auth/callback
```

4. Copie o `Client ID` e o `Client Secret` gerados.

## 4. Preencher o arquivo de ambiente do backend

Abra o arquivo `backend/.env` e preencha pelo menos estes campos:

```env
PORT=3001
BLING_CLIENT_ID=COLE_AQUI_O_CLIENT_ID
BLING_CLIENT_SECRET=COLE_AQUI_O_CLIENT_SECRET
BLING_ACCESS_TOKEN=
BLING_REFRESH_TOKEN=
NODE_ENV=development
```

Observações:

- Para usar o fluxo recomendado de OAuth, bastam `BLING_CLIENT_ID` e `BLING_CLIENT_SECRET`.
- `BLING_ACCESS_TOKEN` e `BLING_REFRESH_TOKEN` são opcionais e servem para configuração manual.

## 5. Iniciar a aplicação

Há duas formas.

### Opção A: arquivo BAT

Execute o arquivo abaixo:

`INICIAR.bat`

Ele abre duas janelas:

- Backend
- Frontend

### Opção B: manual

No terminal 1:

```powershell
cd backend
npm start
```

No terminal 2:

```powershell
cd frontend
npm run dev
```

Depois abra:

```text
http://localhost:5173
```

## 6. Autenticar o Bling dentro do sistema

Depois que backend e frontend estiverem rodando:

1. Abra `Configurações` no menu lateral.
2. Na seção `Integração Bling API v3`, use a opção `Autorizar no Bling`.
3. Faça login no Bling.
4. Autorize o aplicativo.
5. Aguarde o redirecionamento de volta para o sistema.
6. Confirme se a tela mostra que o token está válido.

## 7. Alternativa: token manual

Se não quiser usar OAuth agora:

1. Obtenha um `access_token` e, se houver, um `refresh_token`.
2. Abra `Configurações`.
3. Preencha os campos da área `Token manual`.
4. Clique em `Salvar token`.

## 8. Como validar se ficou certo

Valide nesta ordem:

1. `http://localhost:3001/api/health` deve retornar `status: ok`
2. `Configurações` deve abrir sem erro
3. O botão `Autorizar no Bling` deve aparecer apenas quando `Client ID` e `Client Secret` estiverem preenchidos
4. Após autenticar, a página deve mostrar o token como válido
5. A listagem ou sincronização com o Bling deve funcionar sem erro de autenticação

## 9. Problemas comuns

### Botão de autorizar não aparece

Causa provável:

- `BLING_CLIENT_ID` ou `BLING_CLIENT_SECRET` não preenchidos em `backend/.env`

### Erro no callback OAuth

Causa provável:

- URL de redirecionamento cadastrada diferente de `http://localhost:3001/api/bling/auth/callback`

### Frontend abre em outra porta

O sistema foi configurado para trabalhar com `5173`. Se essa porta estiver ocupada, libere a porta antes de testar o OAuth, porque o callback do backend redireciona para `http://localhost:5173/configuracoes?bling=ok`.

## 10. Endpoints úteis para teste

```text
GET  /api/health
GET  /api/bling/auth/status
GET  /api/bling/auth/url
POST /api/bling/auth/token-manual
GET  /api/bling/produtos
POST /api/bling/sincronizar/:id
POST /api/bling/importar/:blingId
```