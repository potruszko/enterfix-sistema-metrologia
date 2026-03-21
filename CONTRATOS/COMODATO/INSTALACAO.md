# 🚀 GUIA RÁPIDO DE INSTALAÇÃO - Enterfix Comodato

## ⚡ Instalação Expressa (5 minutos)

### 1️⃣ Instalar Node.js
- Baixe: https://nodejs.org/
- Instale com configurações padrão
- Reinicie o computador

### 2️⃣ Configurar o Sistema

```powershell
# Abra PowerShell na pasta do projeto

# Instalar tudo de uma vez
npm run install:all

# Edite o arquivo .env com os dados da Enterfix
notepad .env
```

### 3️⃣ Iniciar o Sistema

```powershell
# Modo mais fácil (desenvolvimento)
npm run dev:full
```

**Pronto! Acesse:** http://localhost:3001

---

## 🌐 Colocar na Rede Local

### No computador SERVIDOR:

```powershell
# 1. Descubra o IP da máquina
ipconfig
# Anote o "Endereço IPv4", exemplo: 192.168.1.100

# 2. Inicie o sistema
npm run dev:full
```

### Nos outros computadores:

Abra o navegador e acesse:
```
http://192.168.1.100:3001
```

---

## 📋 Checklist Pré-Deploy

Antes de colocar em produção:

- [ ] Node.js instalado (versão 14+)
- [ ] Arquivo `.env` configurado com dados reais da Enterfix
- [ ] Firewall permite conexões na porta 3000
- [ ] IP do servidor é fixo ou reservado no roteador
- [ ] Todos os PCs da rede conseguem acessar o servidor

---

## 🆘 Problemas Comuns

### "npm não é reconhecido"
→ Node.js não foi instalado ou não está no PATH  
→ Solução: Reinstale o Node.js e reinicie o computador

### "Port 3000 already in use"
→ Porta já está em uso  
→ Solução: Altere PORT no `.env` para 3001

### "Cannot find module"
→ Dependências não instaladas  
→ Solução: `npm run install:all`

### Outros computadores não acessam
→ Firewall bloqueando  
→ Solução: Libere a porta no Firewall do Windows

---

## 📞 Contato

Sistema desenvolvido para **Enterfix Metrologia**  
Versão 1.0.0 - Novembro 2025
