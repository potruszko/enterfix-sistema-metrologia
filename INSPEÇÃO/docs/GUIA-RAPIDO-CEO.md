# 📘 Guia Rápido - Sistema Enterfix Metrologia

## 🎯 Para o CEO: Como Usar o Sistema Completo

---

## 1️⃣ CRIAR NOVO RELATÓRIO

### Passo a Passo:
1. Clique em **"Novo Relatório"** no menu lateral
2. Escolha o tipo:
   - 🔧 **Relatório de Fabricação** (peças produzidas)
   - 🎯 **Relatório de Calibração** (esferas de calibração)

3. Preencha os dados do cliente:
   - Cliente *
   - Nº da OP / OS
   - Código da Peça / Modelo da Esfera
   - Revisão / Nº de Série
   - (Se Fabricação): Material, Lote, Dureza
   - (Se Calibração): Temperatura, Umidade

4. Preencha condições de medição:
   - Equipamento Utilizado *
   - Técnico Responsável *
   - Data *

5. Adicione as medições:
   - Clique **"+ Adicionar Linha"** para cada cota
   - Preencha: Descrição, Nominal, Tol. (+), Tol. (-), Medido
   - ✅ Status (OK/NOK) é calculado automaticamente!

6. **NOVO!** Adicione fotos (opcional):
   - Clique na área de upload ou arraste fotos
   - Formatos: PNG, JPG, JPEG
   - Múltiplas fotos permitidas

7. Adicione observações (opcional)

8. Verifique o **Parecer Final**:
   - 🟢 **APROVADO** - Todas as medições OK
   - 🔴 **REPROVADO** - Pelo menos uma medição NOK

9. Clique em:
   - **"Salvar Relatório"** → Salva no banco de dados
   - **"Exportar PDF"** → Baixa o PDF clean e profissional

---

## 2️⃣ EDITAR RELATÓRIO (NOVA VERSÃO)

### Por que Criar Versões?
- ✅ Nunca perde dados anteriores
- ✅ Rastreabilidade total para auditorias ISO
- ✅ Histórico completo de alterações
- ✅ Compliance com normas de qualidade

### Como Editar:
1. Vá para **"Histórico"**
2. Localize o relatório (use os filtros se necessário)
3. Clique no botão **✏️ Editar** (amarelo)
4. O formulário será preenchido automaticamente
5. Faça as alterações necessárias
6. Clique **"Salvar Relatório"**
7. ✨ Uma **nova versão** é criada automaticamente!

### O que acontece:
```
Relatório Original: REL-20260224-001 (v1)
Após edição: REL-20260224-001 (v2) ← Nova entrada no banco
Após outra edição: REL-20260224-001 (v3) ← Mais uma entrada

Todas as versões são preservadas! 🎯
```

---

## 3️⃣ BUSCAR E VISUALIZAR RELATÓRIOS

### No Histórico:
1. Clique em **"Histórico"** no menu
2. Use os filtros:
   - 🔍 **Buscar**: Digite nome do cliente ou nº do desenho
   - 📊 **Tipo**: Fabricação, Calibração ou Todos
   - ✅ **Status**: Aprovado, Reprovado ou Todos

3. Ações disponíveis:
   - 👁️ **Visualizar** (azul): Ver detalhes completos
   - ✏️ **Editar** (amarelo): Criar nova versão
   - ⬇️ **Download PDF** (verde): Baixar relatório

### Modal de Visualização:
- Informações gerais do relatório
- Tabela completa de medições
- Observações (se houver)
- Botão de download direto

---

## 4️⃣ PDF PROFISSIONAL

### Características do Novo PDF:
- 📄 **Fundo Branco** - Economia de toner
- 🎨 **Design Clean** - Minimalista e elegante
- 📸 **Fotos Integradas** - Fotos anexadas aparecem no PDF
- 🏢 **Logo Enterfix** - Branding profissional
- ✅ **Parecer Visual** - Borda colorida (verde/vermelho)
- 📊 **Tabelas Grid** - Linhas finas e legíveis
- 📄 **Paginação** - Rodapé com número de páginas

### O PDF Inclui:
1. **Cabeçalho**:
   - Logo Enterfix
   - Tipo do relatório
   - Número e data

2. **Identificação do Cliente**:
   - Todos os dados preenchidos

3. **Condições de Medição**:
   - Equipamento e técnico

4. **Resultados das Medições**:
   - Tabela completa
   - Status colorido (OK verde, NOK vermelho)

5. **Fotos Anexadas** (se houver):
   - Grid 2x2 de fotos

6. **Observações** (se houver)

7. **Parecer Final**:
   - Box com borda colorida
   - APROVADO (verde) ou REPROVADO (vermelho)

8. **Assinatura**:
   - Campo para técnico responsável

9. **Rodapé**:
   - Informações da Enterfix
   - Número da página
   - Data de emissão

---

## 5️⃣ DASHBOARD (VISÃO GERAL)

### Métricas Exibidas:
- 📊 **Total de Relatórios**: Quantidade total
- ✅ **Relatórios Aprovados**: Contagem de aprovados
- ❌ **Relatórios Reprovados**: Contagem de reprovados
- 📅 **Relatórios Hoje**: Gerados no dia

### Relatórios Recentes:
- Lista dos 5 últimos relatórios
- Acesso rápido a visualização e download

---

## 6️⃣ BANCO DE DADOS (SUPABASE)

### Setup Inicial:
1. Acesse: https://app.supabase.com/project/udxdjmqfzdldrjsiauka/sql
2. Abra o arquivo `supabase-setup.sql`
3. Copie todo o conteúdo
4. Cole no SQL Editor do Supabase
5. Clique **"Run"**
6. ✅ Tabela e índices criados!

### O que é Salvo:
```javascript
{
  tipo: "FABRICACAO" ou "CALIBRACAO",
  cliente: "Nome do Cliente",
  projeto_os: "OP-001",
  status_final: "APROVADO" ou "REPROVADO",
  tecnico_nome: "Nome do Técnico",
  created_at: "2026-02-24T10:30:00Z",
  dados: {
    numeroRelatorio: "REL-20260224-001",
    versao: 1,
    relatorioOriginal: null,
    numeroDesenho: "DES-123",
    revisao: "A",
    medicoes: [
      {
        id: 1,
        descricao: "Diâmetro externo",
        nominal: "25.0000",
        tolPos: "0.0100",
        tolNeg: "0.0100",
        medido: "25.0050",
        status: "OK"
      }
    ],
    fotos: [
      "data:image/jpeg;base64,/9j/4AAQSkZ...",
      "data:image/png;base64,iVBORw0KGgo..."
    ],
    observacoes: "Peça dentro das especificações",
    ...outrosCampos
  }
}
```

---

## 7️⃣ DICAS IMPORTANTES

### ⚡ Performance:
- As fotos são armazenadas em Base64 no banco
- Limite: Evite fotos muito grandes (redimensione para 1920x1080)
- Cada relatório pode ter múltiplas fotos

### 🔒 Segurança:
- Use RLS (Row Level Security) do Supabase para produção
- Configure políticas de acesso por usuário
- Implemente autenticação (Supabase Auth)

### 📊 Rastreabilidade:
- Nunca delete relatórios, sempre crie versões
- Use o campo `relatorioOriginal` para rastrear versões
- Exporte relatórios periodicamente para backup

### ✅ Boas Práticas:
- Preencha sempre as observações
- Anexe fotos de detalhes importantes
- Revise medições antes de salvar
- Use o botão "Exportar PDF" antes de "Salvar" para revisar

---

## 8️⃣ TROUBLESHOOTING

### PDF não aparece logo:
- Verifique se os arquivos estão em `public/assets/images/`
- Logo necessário: `LOGO_ENTERFIX_LIGHT.png`

### Fotos não aparecem:
- Verifique o formato (PNG, JPG, JPEG)
- Reduza o tamanho da imagem se for muito grande

### Status não calcula automaticamente:
- Preencha primeiro: Nominal, Tol. (+), Tol. (-)
- Digite o valor Medido por último
- Status aparece automaticamente após digitar

### Relatório não salva:
- Verifique se executou o `supabase-setup.sql`
- Confirme as credenciais no arquivo `.env`
- Veja o console do navegador (F12) para erros

---

## 🎯 RESUMO RÁPIDO

| Ação | Onde Clicar | Resultado |
|------|-------------|-----------|
| Criar Novo | **Novo Relatório** → Preencher → **Salvar** | Relatório v1 no banco |
| Editar | **Histórico** → **✏️ Editar** → **Salvar** | Nova versão (v2, v3...) |
| Visualizar | **Histórico** → **👁️ Visualizar** | Modal com detalhes |
| Download PDF | **Histórico** → **⬇️ Download** | PDF clean e profissional |
| Adicionar Fotos | **Novo Relatório** → Área de Upload | Fotos no relatório e PDF |

---

## 📞 Contato

**Enterfix Metrologia Industrial**
- 🌐 www.enterfix.com.br
- 📧 contato@enterfix.com.br

---

**Sistema desenvolvido em:** Fevereiro 2026  
**Versão:** 2.0 (Clean PDF + Upload + Versionamento)  
**Stack:** React + Vite + Tailwind + Supabase + jsPDF
