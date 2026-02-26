# 📋 REESTRUTURAÇÃO COMPLETA - CONTRATOS ENTERFIX

## 🎯 Objetivo da Reestruturação

Eliminar mistura de propósitos nos contratos, seguindo o **Princípio de Responsabilidade Única**:
- ✅ **Contratos Atômicos**: Uma finalidade única, bem definida
- ✅ **Contratos Compostos**: Referenciam múltiplos atômicos (não duplicam conteúdo)
- ✅ **Contratos Legais**: Acordos sobre serviços (SLA, NDA, Comodato)

---

## 📊 Arquitetura Final

### 🔵 Contratos ATÔMICOS (Finalidade Única)

| Arquivo | Finalidade | Cláusulas | Status |
|---------|-----------|-----------|---------|
| **calibracao.js** | Calibração RBC (rastreabilidade, certificados) | 10 | ✅ Completo |
| **fabricacao.js** | Fabricação de componentes sob medida | 8 | ✅ Completo |
| **engenharia_reversa.js** | Engenharia reversa + CAD modeling | 8 | ✅ Completo |
| **manutencao.js v2.0** | Manutenção preventiva/corretiva APENAS | 9 | ✅ Refatorado |
| **consultoria.js** | Consultoria em metrologia | 7 | ✅ Atômico (já estava OK) |
| **validacao.js** | Qualificação QI/QO/QD (indústria regulada) | 10 | ✅ Atômico (já estava OK) |
| **suporte.js** | Suporte técnico continuado (help desk) | 8 | ✅ Atômico (já estava OK) |

### 🟣 Contratos COMPOSTOS (Referenciam Atômicos)

| Arquivo | Finalidade | Referencia | Status |
|---------|-----------|-----------|---------|
| **plano_manutencao.js** | Planos recorrentes (Bronze/Prata/Ouro) | manutencao + calibracao + fabricacao | ✅ Criado |
| **gestaoParque.js v2.0** | Gestão de parque (COORDENAÇÃO, não execução) | calibracao + manutencao + validacao | ✅ Refatorado |

### 🟡 Contratos LEGAIS (Acordos sobre Serviços)

| Arquivo | Finalidade | Referencia | Status |
|---------|-----------|-----------|---------|
| **sla.js v2.0** | SLA - Métricas e penalidades SOBRE serviços | calibracao + manutencao + suporte + gestaoParque | ✅ Refatorado |
| **comodato.js** | Empréstimo de equipamentos | - | ✅ Legal (já estava OK) |
| **nda.js** | Acordo de confidencialidade | - | ✅ Legal (já estava OK) |

### ⛔ Contratos DESCONTINUADOS

| Arquivo | Motivo | Substituir por | Status |
|---------|--------|----------------|---------|
| **prestacaoServico.js** | Redundante com calibracao.js | **calibracao.js** | ⚠️ Descontinuado (mantido para compatibilidade retroativa) |

---

## 🔄 Mudanças Detalhadas

### 1. **calibracao.js** (NOVO - 10 cláusulas)

**Finalidade:** PURA calibração com rastreabilidade RBC

**Cláusulas:**
1. Escopo dos Serviços de Calibração
2. Prazos de Execução  
3. Coleta, Devolução e Logística
4. Periodicidade e Alertas de Vencimento
5. Acreditação e Rastreabilidade (ISO/IEC 17025)
6. Condições Especiais e Restrições
7. Garantia Específica de Calibração
8. **Não Conformidades e Tratamento** (etiquetagem verde/amarela/vermelha)
9. **Sistema de Gestão da Qualidade** (auditorias, ensaios de proficiência)
10. **Certificado Digital e Segurança da Informação** (PDF com assinatura eletrônica, QR code, LGPD)

**Diferenciais:**
- Rastreabilidade RBC obrigatória
- Sistema de etiquetagem por cores
- Portal web para verificação de autenticidade (QR code)
- Armazenamento 10 anos (acima do legal)
- Criptografia AES-256 e backup redundante

---

### 2. **fabricacao.js** (NOVO - 8 cláusulas)

**Finalidade:** PURA fabricação de componentes mecânicos de precisão

**Cláusulas:**
1. Escopo (usinagem, seleção de materiais, inspeção dimensional)
2. Especificações Técnicas (drawing 2D/3D)
3. Materiais e Tratamentos (aços, alumínio, brass, polímeros, heat treatment)
4. Prazo (7-30 dias conforme complexidade)
5. Qualidade (100% dimensões críticas, NOK handling)
6. Valores e Forma de Pagamento (50% entrada)
7. Garantia (90 dias defeitos fabricação)
8. **Propriedade Intelectual** (CONTRATADA detém IP, licença para CONTRATANTE)

**Proteções:**
- Proibido usar peças como molde para terceiros (multa 50% contrato)
- IP exclusiva da CONTRATADA (200% para licença exclusiva)
- Certificado de materiais 3.1 disponível

---

### 3. **engenharia_reversa.js** (NOVO - 8 cláusulas)

**Finalidade:** PURA engenharia reversa (medição + CAD + documentação)

**Cláusulas:**
1. Escopo (medição dimensional, 3D CAD, 2D drawing)
2. Amostra Física (condições, análise destrutiva)
3. Processo (5 etapas: recepção → medição → 3D → 2D → entrega)
4. Materiais (identificação visual, metalografia)
5. Prazo (5-20 dias conforme complexidade)
6. Valores e Propriedade Intelectual (R$ 800-R$ 6000)
7. Garantia (90 dias, 2 revisões gratuitas)
8. **Confidencialidade Permanente** (segredo perpétuo, restrições uso comercial)

**Proteções:**
- Confidencialidade PERMANENTE (não expira com término do contrato)
- IP exclusiva DA CONTRATADA (200% para licença exclusiva)
- Proibido uso para fabricação por terceiros sem autorização
- Base legal: Lei 9.609/98 (Software), Lei 9.279/96 (Propriedade Industrial)

---

### 4. **manutencao.js v2.0** (REFATORADO - 9 cláusulas)

**O que foi REMOVIDO:**
- ❌ Cláusulas 10-13 (~200 linhas): Planos recorrentes (Bronze/Prata/Ouro)
  - Mencionavam "calibração básica"
  - Mencionavam "15% desconto fabricação"
  - Mencionavam "engenharia reversa com desconto"

**O que PERMANECEU:**
- ✅ Escopo (preventiva/corretiva/preditiva/emergencial)
- ✅ Plano de Manutenção Preventiva (PMP anual)
- ✅ Manutenção Corretiva (SLA 24h/48h/5dias)
- ✅ Peças e Componentes (consumíveis inclusos, principais à parte)
- ✅ Relatórios (histórico 5 anos, MTBF/MTTR)
- ✅ Indicadores (disponibilidade ≥95%, SLA ≥90%)
- ✅ Equipe Técnica (certificados, 2+ anos experiência)
- ✅ Garantia (90 dias serviços)
- ✅ Suspensão (referencia plano_manutencao.js)

**Versão:** 2.0.0 (BREAKING CHANGE - separation of concerns)

**Referências adicionadas:**
- "Vide Contrato de Plano de Manutenção para planos recorrentes"
- "Vide Contrato de Calibração para calibração pós-manutenção"
- "Vide Contrato de Fabricação para peças de reposição"

---

### 5. **plano_manutencao.js** (NOVO COMPOSTO - 7 cláusulas, 600+ linhas)

**Finalidade:** Planos recorrentes que REFERENCIAM contratos atômicos

**Estrutura:**
```
Plano Bronze/Prata/Ouro
├─ Anexo A: Contrato de Manutenção (manutencao.js - cláusulas 1-9)
├─ Anexo B: Contrato de Calibração (calibracao.js - conforme plano)
└─ Anexo C: Descontos em Fabricação/Eng. Reversa (fabricacao.js, engenharia_reversa.js)
```

**Cláusulas:**
1. **Estrutura e Composição** (hierarquia contratual, anexos)
2. **Níveis de Serviço** (Bronze/Prata/Ouro detalhados)
3. **Upgrade, Downgrade e Migração**
4. **Valores, Reajuste e Forma de Pagamento**
5. **Fidelidade, Carência e Rescisão** (6/12/24 meses)
6. **Gestão do Plano e Benefícios Operacionais**
7. **Suspensão Temporária dos Serviços**

**Comparativo de Planos:**

| Benefício | Bronze | Prata | Ouro |
|-----------|--------|-------|------|
| Visitas/ano | 2x | 4x | 12x |
| Calibração inclusa | Básica | Completa | Premium |
| Prioridade SLA | 5 dias | 48h | 24h |
| Emergências/ano | 0 | 1 | Ilimitadas |
| Desc. Fabricação | 0% | 15% | 25% |
| Desc. Eng. Reversa | 0% | 15% | 25% |
| Consultoria | Avulso | 10% desc | 20h inclusa |
| Técnico exclusivo | Não | Não | Sim |
| Carência mínima | 6 meses | 12 meses | 24 meses |

---

### 6. **sla.js v2.0** (REFATORADO LEGAL)

**Mudança principal:** Deixar claro que é um contrato SOBRE serviços, não dos serviços

**Header atualizado:**
```
Tipo: LEGAL / META-ORGANIZACIONAL
Finalidade: Estabelecer métricas, prazos e penalidades SOBRE serviços já contratados

IMPORTANTE: Este contrato NÃO oferece serviços diretamente.
Ele estabelece níveis de serviço (SLA) para contratos existentes.
```

**Cláusula 1.3 - Contratos Regidos:**
- Agora lista explicitamente os contratos vinculados:
  - Contrato de Calibração (calibracao.js)
  - Contrato de Manutenção (manutencao.js)
  - Plano de Manutenção Recorrente (plano_manutencao.js)
  - Suporte Técnico (suporte.js)
  - Gestão de Parque (gestaoParque.js)

**Hierarquia contratual definida:**
- SLA estabelece: Métricas, prazos, penalidades
- Contratos vinculados estabelecem: Condições técnicas, escopo, preços
- Conflito de prazo: Prevalece SLA (mais restritivo)
- Conflito de escopo: Prevalece contrato de serviço

---

### 7. **gestaoParque.js v2.0** (REFATORADO COMPOSTO)

**Mudança principal:** Separar GESTÃO (incluída) de EXECUÇÃO TÉCNICA (contratos vinculados)

**Header atualizado:**
```
Tipo: COMPOSTO / ORGANIZACIONAL
Finalidade: Gerenciamento completo do ciclo de vida (GESTÃO, não execução)

IMPORTANTE: Este contrato NÃO executa calibrações ou manutenções diretamente.
Ele GERENCIA, COORDENA e CONTROLA o parque, delegando serviços técnicos
aos contratos específicos.
```

**Serviços INCLUSOS (gestão):**
- Cadastramento e identificação (etiquetas, TAGs)
- Planejamento de calibrações e manutenções (cronograma)
- Alertas automáticos de vencimento (30/60 dias)
- Coleta e entrega de instrumentos (logística)
- Gestão documental (certificados, relatórios, histórico)
- Sistema web com dashboard
- Visitas técnicas (acompanhamento, NÃO execução)

**Serviços VINCULADOS (executados por contratos específicos):**
- Calibração → vide calibracao.js
- Manutenção → vide manutencao.js
- Validação → vide validacao.js
- Planos Recorrentes → vide plano_manutencao.js

---

### 8. **prestacaoServico.js** (DESCONTINUADO)

**Motivo:** Redundante com calibracao.js (ambos tratavam de calibração RBC)

**Header atualizado:**
```
⚠️ **CONTRATO DESCONTINUADO** ⚠️

Este contrato foi SUBSTITUÍDO por: calibracao.js (v1.0.0)
Data de descontinuação: 26/02/2026

AÇÃO RECOMENDADA:
- Novos contratos: Utilizar calibracao.js (mais completo, 10 cláusulas)
- Contratos existentes: Podem continuar usando (compatibilidade mantida)
- Migração: Substituir referências de prestacao_servico → calibracao
```

**Diferenças:** calibracao.js possui 3 cláusulas adicionais:
- Não Conformidades e Tratamento
- Sistema de Gestão da Qualidade
- Certificado Digital e Segurança da Informação

**Status:** Mantido APENAS para compatibilidade retroativa (sem atualizações futuras)

---

## 📝 Padrão Estabelecido (CONTRATOS-TEMPLATE.md)

### Categorias de Contratos

**1. ATÔMICO** (Finalidade única)
- Uma responsabilidade clara e bem definida
- NÃO referencia outros contratos de serviços
- Exemplos: calibracao.js, fabricacao.js, engenharia_reversa.js

**2. COMPOSTO** (Combina múltiplos serviços)
- REFERENCIA contratos atômicos (não duplica conteúdo)
- Usa padrão "Anexo A/B/C - Contrato de X"
- Exemplos: plano_manutencao.js, gestaoParque.js

**3. LEGAL** (Acordos sobre serviços)
- Estabelece regras sobre contratos existentes
- Não oferece serviços diretamente
- Exemplos: sla.js, nda.js, comodato.js

### Naming Conventions

- **Arquivos:** snake_case (calibracao.js, plano_manutencao.js)
- **Exports:** UPPER_SNAKE_CASE (CLAUSULAS_CALIBRACAO)
- **Funções:** camelCase (escopo(), prazo(), garantia())

### Versioning

- **Semantic:** MAJOR.MINOR.PATCH
- **MAJOR:** Breaking changes (ex: manutencao.js 1.x → 2.0.0)
- **MINOR:** Novas funcionalidades (ex: 1.2.0 → 1.3.0)
- **PATCH:** Correções de bugs (ex: 1.2.3 → 1.2.4)

### Estrutura de Cláusula

```javascript
export const CLAUSULAS_CALIBRACAO = {
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DOS SERVIÇOS
1.1. Descrição geral do serviço
1.2. O que está INCLUÍDO
1.3. O que NÃO está incluído
1.4. Referências a outros contratos (se aplicável)
`,
    // ... demais cláusulas
};
```

---

## ✅ Validação

### Build Status
- ✅ **npm run build**: 4.21s (sem erros)
- ✅ **Linting**: Nenhum erro JavaScript
- ✅ **Syntax**: Todos os contratos validados

### Arquivos Criados/Modificados

**Criados (5 arquivos):**
- `CONTRATOS-TEMPLATE.md` (400+ linhas - padrões e guidelines)
- `calibracao.js` (10 cláusulas, 500+ linhas)
- `fabricacao.js` (8 cláusulas, 400+ linhas)
- `engenharia_reversa.js` (8 cláusulas, 450+ linhas)
- `plano_manutencao.js` (7 cláusulas, 600+ linhas)

**Modificados (5 arquivos):**
- `manutencao.js`: v1.x → v2.0.0 (removido cláusulas 10-13)
- `sla.js`: v1.x → v2.0.0 (referencia contratos atômicos)
- `gestaoParque.js`: v1.x → v2.0.0 (separa gestão de execução)
- `prestacaoServico.js`: Marcado como descontinuado
- `index.js` + `gerais.js`: Registrados 4 novos contratos

---

## 🚀 Próximos Passos

### Para Desenvolvedores

1. **Novos contratos:** Usar `calibracao.js`, `fabricacao.js`, `engenharia_reversa.js`, `plano_manutencao.js`
2. **Migração:** Substituir referências de `prestacao_servico` → `calibracao` no código
3. **Consultar:** `CONTRATOS-TEMPLATE.md` antes de criar novos contratos
4. **Versioning:** Atualizar `@version` ao modificar contratos existentes

### Para Testes

1. Gerar PDF de cada novo contrato e validar formatação
2. Testar referências cruzadas (Anexo A, B, C funcionando)
3. Validar QR codes e assinaturas digitais (calibracao.js)
4. Testar hierarquia contratual (SLA prevalece sobre contratos técnicos)

### Para Documentação

1. Atualizar README.md principal com nova arquitetura
2. Criar exemplos de uso dos contratos compostos
3. Documentar processo de migração de contratos antigos
4. Criar glossário de termos (Atômico, Composto, Legal)

---

## 📞 Suporte

**Dúvidas sobre arquitetura de contratos:**
- Consultar: `CONTRATOS-TEMPLATE.md`
- Exemplos: `calibracao.js`, `plano_manutencao.js`

**Padrão Enterfix:**
- Naming: snake_case (arquivos), UPPER_SNAKE (exports), camelCase (funções)
- Versioning: Semantic (MAJOR.MINOR.PATCH)
- Base legal: Sempre citada no header

---

**Data da Reestruturação:** 26/02/2026  
**Versão deste documento:** 1.0.0  
**Autor:** Paulo Enterfix
