# 📋 SISTEMA DE CONTRATOS COM PROTEÇÃO JURÍDICA - ENTERFIX

## ⚖️ AVISO LEGAL IMPORTANTE

**⚠️ ATENÇÃO: Este sistema contém cláusulas contratuais baseadas na legislação brasileira, mas DEVE ser revisado por um advogado especializado antes do uso em produção com clientes reais.**

### Por que a revisão jurídica é obrigatória?

1. **Responsabilidade Legal**: Contratos são documentos juridicamente vinculantes
2. **Especificidades do Negócio**: Cada empresa tem particularidades que devem ser refletidas nos contratos
3. **Atualização Legislativa**: Leis mudam constantemente (LGPD, normas metrológicas, etc.)
4. **Proteção Adequada**: Um advogado pode ajustar cláusulas para maximizar a proteção da Enterfix
5. **Conformidade Regulatória**: Metrologia é área regulada pelo Inmetro com requisitos específicos

### Legislação Base Utilizada

✅ **Código Civil Brasileiro** (Lei 10.406/2002)  
✅ **Código de Defesa do Consumidor** (Lei 8.078/90)  
✅ **Lei Geral de Proteção de Dados - LGPD** (Lei 13.709/2018)  
✅ **ISO/IEC 17025:2017** - Requisitos para laboratórios de calibração  
✅ **Portaria Inmetro nº 694/2022** - Regulamento Técnico Metrológico  
✅ **Princípios de Direito Contratual** (boa-fé, função social do contrato)

---

## 🚀 O QUE FOI IMPLEMENTADO

### 1. Sistema de Cláusulas Contratuais (`src/utils/clausulasContratuais.js`)

#### Cláusulas Gerais (aplicáveis a todos os contratos):
- ✅ **Cláusula 1 - Objeto**: Descrição dos serviços com referências às normas técnicas (ISO 17025, Inmetro)
- ✅ **Cláusula 2 - Vigência**: Prazos determinados e indeterminados, renovação automática
- ✅ **Cláusula 3 - Valor e Pagamento**: Valores, condições, multas por atraso, reajustes pelo IPCA
- ✅ **Cláusula 4 - Obrigações da Contratada**: Qualidade, rastreabilidade, sigilo, seguros
- ✅ **Cláusula 5 - Obrigações da Contratante**: Pagamentos, disponibilização de equipamentos, informações técnicas
- ✅ **Cláusula 6 - Limitação de Responsabilidade**: Limites de indenização, exclusões, casos fortuitos
- ✅ **Cláusula 7 - Confidencialidade e LGPD**: Sigilo absoluto, proteção de dados pessoais, conformidade LGPD
- ✅ **Cláusula 8 - Garantia**: Período de garantia, o que cobre, o que não cobre
- ✅ **Cláusula 9 - Rescisão**: Rescisão imotivada e motivada, multas, prazos
- ✅ **Cláusula 10 - Disposições Gerais**: Foro competente, lei aplicável, sucessores

#### Cláusulas Específicas (para cada tipo de contrato):

1. **Prestação de Serviço**: Escopo, periodicidade, prazos, rastreabilidade RBC
2. **Comodato**: Equipamentos cedidos, valores, condições de uso, responsabilidade por danos
3. **Manutenção**: Preventiva/corretiva, cronograma, peças incluídas, exclusões
4. **SLA**: Tempos de resposta e resolução, classificação de chamados, matriz de escalação, penalidades
5. **Consultoria**: Objetivos, banco de horas, entregáveis, propriedade intelectual
6. **Gestão de Parque**: Cadastro de instrumentos, software, KPIs, indicadores
7. **Suporte Técnico**: Níveis de suporte, canais de atendimento, escopo, exclusões
8. **Validação**: IQ/OQ/PQ, protocolos, critérios de aceitação, revalidação
9. **NDA/Confidencialidade**: Tipos de informação confidencial, multas, prazo de vigência

### 2. Gerador de PDF Profissional (`src/utils/contratosPDF.js`)

#### Recursos do PDF:
- 📄 **Formatação Profissional**: Fonte Times New Roman, margens adequadas, espaçamento correto
- 🏢 **Cabeçalho Corporativo**: Logo da Enterfix, número do contrato em todas as páginas
- 📝 **Rodapé Informativo**: Dados da empresa, contatos, numeração de páginas
- 💧 **Marca d'água "MINUTA"**: Para contratos ainda não assinados
- 🔏 **Blocos de Assinatura**: CONTRATADA, CONTRATANTE e duas TESTEMUNHAS
- 📋 **Qualificação das Partes**: Dados completos (CNPJ/CPF, endereços, representantes)
- 📑 **Todas as Cláusulas**: Inserção automática de todas as cláusulas gerais e específicas
- ➕ **Cláusulas Adicionais**: Campo customizável adicionado no wizard

#### Funções Disponíveis:
```javascript
// Gerar PDF e retornar blob
gerarPDFContrato(dadosContrato) -> { blob, base64, filename }

// Upload para Supabase Storage
uploadPDFContrato(supabase, pdfBlob, filename, contratoId) -> { path, publicUrl }

// Gerar + Upload + Atualizar Registro (tudo em um)
gerarEUploadPDFContrato(supabase, dadosContrato) -> { success, url, filename }
```

### 3. Integração com NovoContrato

✅ **Geração Automática**: Ao salvar contrato, PDF é gerado automaticamente  
✅ **Não Bloqueante**: Se PDF falhar, contrato é salvo mesmo assim (graceful degradation)  
✅ **Feedback Visual**: Alertas informam o progresso da geração

### 4. Botão de Download em ListaContratos

✅ **Download Instantâneo**: Clique em "Download" para baixar o PDF  
✅ **Regeneração Sob Demanda**: PDF pode ser gerado novamente a qualquer momento  
✅ **Nome do Arquivo**: `Contrato_CT-2026-001_Nome_do_Cliente.pdf`

---

## ⚙️ CONFIGURAÇÃO NECESSÁRIA

### 📝 Passo 1: Atualizar Dados da Empresa

Abra o arquivo `src/utils/clausulasContratuais.js` e atualize as informações:

```javascript
export const DADOS_ENTERFIX = {
  razaoSocial: 'ENTERFIX METROLOGIA LTDA',  // ✏️ Atualizar
  cnpj: '00.000.000/0001-00',                // ✏️ Atualizar com CNPJ real
  endereco: 'Rua Exemplo, 123, Centro',      // ✏️ Atualizar
  cidade: 'Caxias do Sul',                   // ✏️ Confirmar
  estado: 'RS',                              // ✏️ Confirmar
  cep: '95000-000',                          // ✏️ Atualizar
  telefone: '(54) 0000-0000',                // ✏️ Atualizar
  email: 'contato@enterfix.com.br',          // ✏️ Atualizar
  website: 'www.enterfix.com.br',            // ✏️ Confirmar
  inscricaoEstadual: '000.0000000',          // ✏️ Atualizar
  acreditacaoInmetro: 'RBC-XXXX',            // ✏️ Atualizar (se acreditado)
};

export const FORO_COMPETENTE = 'Caxias do Sul/RS';  // ✏️ Confirmar foro
```

### 🗄️ Passo 2: Executar SQL no Supabase

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo `docs/supabase-contratos-pdf-storage.sql`
4. Copie todo o conteúdo e execute no SQL Editor
5. Aguarde mensagem de sucesso

O SQL irá:
- ✅ Adicionar coluna `pdf_url` na tabela `contratos`
- ✅ Criar políticas RLS para o bucket de contratos
- ✅ Criar índices para performance

### 📦 Passo 3: Criar Bucket no Supabase Storage

**Após executar o SQL**, crie o bucket manualmente:

1. Vá em **Storage** no Supabase Dashboard
2. Clique em **"Create bucket"**
3. Preencha:
   - **Name**: `contratos` (exatamente assim)
   - **Public**: ✅ **SIM** (para clientes baixarem)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: `application/pdf`
4. Clique em **"Create bucket"**

---

## 🧪 COMO TESTAR

### Teste 1: Criar Contrato com PDF

1. Acesse **Contratos** → **Novo Contrato**
2. Preencha todas as 5 etapas do wizard
3. Na **Etapa 5**, adicione uma cláusula adicional customizada (ex: "O cliente deve fornecer acesso ao sistema X")
4. Clique em **"Salvar Contrato"**
5. Aguarde:
   - ✅ "Contrato CT-2026-XXX criado com sucesso!"
   - ℹ️ "Gerando PDF do contrato..."
   - ✅ "PDF gerado com sucesso!"
6. Volte para **Lista de Contratos**

### Teste 2: Baixar PDF

1. Localize o contrato criado
2. Clique no botão **"Download"** (ícone de download roxo)
3. Aguarde mensagem "Gerando PDF do contrato..."
4. PDF será baixado automaticamente
5. **Abra o PDF** e verifique:
   - ✅ Marca d'água "MINUTA" (se status for minuta)
   - ✅ Cabeçalho com logo e número do contrato
   - ✅ Qualificação completa das partes
   - ✅ Todas as cláusulas gerais
   - ✅ Cláusulas específicas do tipo escolhido
   - ✅ Sua cláusula adicional no final
   - ✅ Blocos de assinatura (CONTRATADA, CONTRATANTE, TESTEMUNHAS)
   - ✅ Rodapé com dados da empresa
   - ✅ Numeração de páginas (Página X de Y)

### Teste 3: Contrato de Diferentes Tipos

Teste criar contratos de tipos diferentes para ver as cláusulas específicas:

- **SLA**: Veja níveis de serviço, tempos de resposta, penalidades
- **Manutenção**: Veja periodicidade, manutenção preventiva/corretiva
- **Comodato**: Veja responsabilidades sobre equipamentos
- **NDA**: Veja cláusulas de confidencialidade e multa por quebra

---

## 📚 ESTRUTURA DAS CLÁUSULAS

### Proteções Jurídicas Implementadas:

| Cláusula | Proteção para Enterfix |
|----------|------------------------|
| **Limitação de Responsabilidade** | Limita indenizações ao valor anual do contrato |
| **Exclusões de Responsabilidade** | Protege contra má utilização, lucros cessantes, força maior |
| **Garantia Limitada** | Define escopo claro (90 dias), lista exclusões |
| **Rescisão** | Permite rescisão imotivada (30 dias), define multas recíprocas (10%) |
| **Confidencialidade** | Vigência de 5 anos após término, multas por violação |
| **Foro Competente** | Define Caxias do Sul/RS como foro (evita litígios distantes) |
| **LGPD** | Protege ambas as partes, define responsabilidades de operador |
| **Obrigações Mútuas** | Equilibra deveres (evita abusividade CDC) |
| **Renovação Automática** | Permite continuidade dos serviços (se checkbox marcado) |
| **Rastreabilidade** | Garante qualidade metrológica (ISO 17025, RBC) |

### Riscos Mitigados:

✅ **Reclamação judicial** → Foro competente definido  
✅ **Danos a equipamentos** → Limitação de responsabilidade  
✅ **Vazamento de informações** → Cláusula de confidencialidade + LGPD  
✅ **Interpretação dúbia** → Cláusulas claras e objetivas  
✅ **Rescisões abusivas** → Prazos e penalidades equilibradas  
✅ **Inadimplência** → Multas, juros e suspensão de serviços  
✅ **Uso indevido de certificados** → Cláusula de limitação de uso  
✅ **Problemas técnicos fora do escopo** → Exclusões bem definidas  

---

## 🔄 PRÓXIMOS PASSOS (Após Revisão Jurídica)

### Imediato (Antes de Usar com Clientes):

1. **📋 Contratar Advogado**: Buscar escritório especializado em Direito Empresarial/Contratos
2. **✏️ Revisar Cláusulas**: Advogado deve revisar TODAS as cláusulas
3. **📝 Ajustar Texto**: Fazer modificações sugeridas pelo advogado
4. **🔏 Validar Legalmente**: Certificar que está tudo conforme legislação atualizada
5. **✅ Aprovar para Uso**: Somente após aprovação jurídica, usar com clientes reais

### Melhorias Futuras (Opcional):

- **Assinatura Digital**: Integrar com DocuSign, ClickSign ou Autentique
- **Versionamento**: Manter histórico de alterações em contratos
- **Campos Variáveis**: Permitir mais customizações sem editar código
- **Modelos Pré-aprovados**: Salvar templates já revisados pelo jurídico
- **Auditoria**: Registrar quem gerou, quando, quais alterações foram feitas
- **Notificações**: Alertar sobre vencimentos próximos por e-mail/WhatsApp

---

## 🆘 TROUBLESHOOTING

### ❌ Erro: "Failed to load resource: 404" ao gerar PDF

**Causa**: Bucket "contratos" não existe no Supabase Storage  
**Solução**: Criar o bucket manualmente conforme Passo 3 acima

### ❌ Erro: "Database error" ao salvar pdf_url

**Causa**: SQL não foi executado, coluna `pdf_url` não existe  
**Solução**: Executar o SQL do Passo 2

### ❌ PDF está faltando informações

**Causa**: Dados da empresa não foram atualizados  
**Solução**: Atualizar `DADOS_ENTERFIX` no arquivo `clausulasContratuais.js`

### ❌ Marca d'água não aparece

**Causa**: Status do contrato não é "minuta"  
**Solução**: Normal! Marca d'água só aparece em minutas (status='minuta')

### ❌ PDF baixa, mas está vazio ou corrompido

**Causa**: Biblioteca jsPDF não está importada corretamente  
**Solução**: Verificar se `npm install jspdf jspdf-autotable` foi executado

---

## 📞 SUPORTE

Para dúvidas sobre o código/sistema, consulte:
- **Desenvolvedor**: GitHub Copilot
- **Documentação**: Este arquivo (README-CONTRATOS.md)

Para dúvidas jurídicas, consulte:
- **Advogado Especializado**: OBRIGATÓRIO antes de usar em produção

---

## 📄 LICENÇA E RESPONSABILIDADE

Este sistema é fornecido "como está", sem garantias de adequação jurídica. 

**A Enterfix Metrologia é TOTALMENTE RESPONSÁVEL** por:
- Validar as cláusulas com advogado
- Garantir conformidade com legislação vigente
- Atualizar contratos quando leis mudarem
- Usar contratos adequados para cada situação

**O desenvolvedor NÃO se responsabiliza** por:
- Problemas jurídicos decorrentes do uso dos contratos
- Não conformidade com legislação específica
- Danos causados por cláusulas inadequadas
- Falta de revisão jurídica antes do uso

---

## ✅ CHECKLIST ANTES DE USAR EM PRODUÇÃO

- [ ] Dados da empresa atualizados em `DADOS_ENTERFIX`
- [ ] SQL executado no Supabase (coluna `pdf_url` criada)
- [ ] Bucket "contratos" criado no Storage
- [ ] Teste completo realizado (criar contrato → gerar PDF → baixar)
- [ ] PDF revisado (todas as cláusulas presentes)
- [ ] **ADVOGADO CONTRATADO E REVISÃO CONCLUÍDA** ⚠️
- [ ] Ajustes jurídicos implementados no código
- [ ] Aprovação final do departamento jurídico
- [ ] Treinamento da equipe sobre uso dos contratos
- [ ] Backup de versão aprovada (git tag)

---

## 🎯 RESUMO EXECUTIVO

| Item | Status |
|------|--------|
| **Sistema Funcional** | ✅ Pronto para teste |
| **Cláusulas Implementadas** | ✅ 10 gerais + 9 específicas |
| **Geração de PDF** | ✅ Automática ao salvar |
| **Download de PDF** | ✅ Botão na lista de contratos |
| **Base Legal** | ✅ Referências incluídas |
| **Proteção Jurídica** | ⚠️ Revisão obrigatória |
| **Pronto para Produção** | ❌ Aguardando revisão jurídica |

---

**Data de Criação**: 26/02/2026  
**Versão**: 1.0  
**Autor**: GitHub Copilot  
**Para**: Paulo - Enterfix Metrologia  

---

## 🔐 IMPORTANTE: LEIA ANTES DE USAR

**Este sistema contém contratos que, quando assinados, têm força legal e podem ser usados em processos judiciais. É SUA RESPONSABILIDADE garantir que as cláusulas estão adequadas à sua realidade empresarial e em conformidade com a legislação vigente.**

**NUNCA use estes contratos com clientes reais sem REVISÃO JURÍDICA PROFISSIONAL.**

Se tiver dúvidas, consulte um advogado especializado em:
- ✅ Direito Empresarial
- ✅ Direito Contratual
- ✅ Direito do Consumidor
- ✅ Direito Digital (LGPD)
- ✅ Área de Metrologia (se possível)

---

**Boa sorte e bons contratos! 🚀⚖️**
