# 📚 Documentação do Sistema de Inspeção

Este diretório contém toda a documentação técnica do sistema de gestão de inspeções da Enterfix.

## 📖 Índice

### 🚀 Deploy e Produção
- **[GUIA-DEPLOY-PRODUCAO.md](GUIA-DEPLOY-PRODUCAO.md)** - Guia completo de deploy em produção com autenticação corporativa (@enterfix.com.br)
- **[azure-ad-configuracao.md](azure-ad-configuracao.md)** - ⭐ Checklist rápido para configurar Azure AD/Microsoft 365 SSO

### ⚙️ Configuração e Setup
- **[CORRIGIR-API-KEY.md](CORRIGIR-API-KEY.md)** - Como configurar as chaves de API do Supabase
- **[SOLUCAO-SALVAMENTO.md](SOLUCAO-SALVAMENTO.md)** - Solução para problemas de salvamento de dados

### ✨ Funcionalidades
- **[NOVAS-FUNCIONALIDADES.md](NOVAS-FUNCIONALIDADES.md)** - Documentação de novas funcionalidades implementadas
- **[CERTIFICADO-REPARO-APALPADORES.md](CERTIFICADO-REPARO-APALPADORES.md)** - Sistema de certificados de reparo de apalpadores
- **[GESTAO-EQUIPAMENTOS.md](GESTAO-EQUIPAMENTOS.md)** - Gestão e cadastro de equipamentos
- **[ALERTAS-CUSTOMIZADOS.md](ALERTAS-CUSTOMIZADOS.md)** - Sistema de alertas customizados

### 📝 Guias Rápidos
- **[GUIA-RAPIDO.md](GUIA-RAPIDO.md)** - Guia rápido técnico para desenvolvedores
- **[GUIA-RAPIDO-CEO.md](GUIA-RAPIDO-CEO.md)** - Guia executivo para gestores
- **[O-QUE-FAZER-AGORA.md](O-QUE-FAZER-AGORA.md)** - Próximos passos e roadmap

### 🔧 Troubleshooting
- **[CORRECOES-APLICADAS.md](CORRECOES-APLICADAS.md)** - Histórico de correções aplicadas
- **[CORRECAO-EMPRESA-PDF.md](CORRECAO-EMPRESA-PDF.md)** - Correções relacionadas à geração de PDFs
- **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** - Resumo executivo das alterações

---

## 🎯 Para Começar

Se você é novo no projeto, recomendamos começar por:

1. **[GUIA-RAPIDO.md](GUIA-RAPIDO.md)** - Para entender a estrutura do projeto
2. **[CORRIGIR-API-KEY.md](CORRIGIR-API-KEY.md)** - Para configurar o ambiente local
3. **[azure-ad-configuracao.md](azure-ad-configuracao.md)** - ⭐ Para configurar SSO com Microsoft 365
4. **[GUIA-DEPLOY-PRODUCAO.md](GUIA-DEPLOY-PRODUCAO.md)** - Para fazer deploy

## 🚀 Deploy em Produção

Para publicar a aplicação no domínio da Enterfix com restrição de acesso apenas para emails @enterfix.com.br, siga o **[GUIA-DEPLOY-PRODUCAO.md](GUIA-DEPLOY-PRODUCAO.md)**.

**🔑 Recomendação para Microsoft 365:**
Como a Enterfix utiliza Microsoft 365, siga o checklist rápido **[azure-ad-configuracao.md](azure-ad-configuracao.md)** para configurar Single Sign-On (SSO) com Azure AD.

Este guia inclui:
- ✅ Autenticação corporativa (@enterfix.com.br)
- ✅ **SSO com Microsoft 365/Azure AD** (recomendado)
- ✅ Deploy no Vercel (gratuito, SSL automático)
- ✅ Configuração do Supabase com RLS
- ✅ Domínio customizado (sistema.enterfix.com.br)
- ✅ Segurança e melhores práticas

---

**Última atualização:** Dezembro 2024
