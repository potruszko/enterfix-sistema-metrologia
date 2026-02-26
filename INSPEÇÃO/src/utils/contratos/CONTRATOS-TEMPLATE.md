# 📋 Template e Padrões para Contratos Enterfix

## 🎯 Princípios Fundamentais

### 1. **Separação de Responsabilidades (Single Responsibility)**
- Cada contrato deve ter **UMA ÚNICA FINALIDADE**
- Contratos atômicos = serviços específicos
- Contratos compostos = combinam referências aos atômicos

### 2. **Hierarquia de Contratos**

```
CONTRATOS ENTERFIX
│
├── 📦 ATÔMICOS (Finalidade Única)
│   ├── calibracao.js              → Calibração de instrumentos
│   ├── manutencao.js              → Manutenção preventiva/corretiva
│   ├── fabricacao.js              → Fabricação de peças sob medida
│   ├── engenharia_reversa.js      → Projeto reverso e documentação técnica
│   ├── validacao.js               → IQ/OQ/PQ (qualificação de equipamentos)
│   ├── consultoria.js             → Consultoria técnica especializada
│   ├── comodato.js                → Empréstimo de equipamentos
│   └── treinamento.js             → Capacitação técnica
│
├── 🔗 COMPOSTOS (Referenciam Múltiplos Serviços)
│   ├── plano_manutencao.js        → Bronze/Prata/Ouro (manutenção + calibração + descontos)
│   ├── sla.js                     → SLA com KPIs (referencia serviços base)
│   ├── gestao_parque.js           → Gestão completa de instrumentos
│   └── outsourcing_metrologia.js  → Terceirização completa do setor
│
└── 📄 JURÍDICOS (Apenas aspectos legais)
    ├── nda.js                     → Acordo de confidencialidade
    └── termo_responsabilidade.js  → Termo de manuseio/custody
```

---

## 📐 Estrutura Padrão de Arquivo

Todo arquivo de contrato **ATÔMICO** deve seguir este template:

```javascript
/**
 * CLÁUSULAS ESPECÍFICAS - [Nome do Contrato]
 * 
 * Finalidade: [Descrever objetivo único e específico]
 * Aplicável a: [Tipo de cliente ou situação]
 * 
 * Base legal/normativa:
 * - [Norma 1]: [Descrição]
 * - [Norma 2]: [Descrição]
 * 
 * @module contratos/clausulas/[nome_arquivo]
 * @category Atômico | Composto | Jurídico
 * @version 1.0.0
 * @lastUpdate 26/02/2026
 */

/**
 * Cláusulas específicas para [tipo de contrato]
 * 
 * Estrutura recomendada (adaptar conforme necessidade):
 * - escopo: Define o que ESTÁ e o que NÃO ESTÁ incluído
 * - prazo: Prazos de execução e entregas
 * - responsabilidades: Obrigações específicas de cada parte
 * - qualidade: Padrões técnicos e conformidade
 * - garantia: Garantias específicas deste serviço
 */
export const CLAUSULAS_[NOME_CONTRATO] = {
    /**
     * Escopo do Serviço (O QUE está incluído)
     * MANDATÓRIO: Sempre começar definindo claramente o escopo
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DO SERVIÇO
1.1. O presente contrato tem por objeto [descrever especificamente]:
    a) [Item específico 1];
    b) [Item específico 2];
    c) [Item específico 3].

1.2. Especificações técnicas:
    a) [Norma ou padrão aplicável];
    b) [Método ou procedimento técnico];
    c) [Instrumentos ou equipamentos utilizados].

1.3. NÃO estão inclusos no escopo:
    a) [O que claramente NÃO faz parte];
    b) [Serviços que requerem contrato separado];
    c) [Exclusões importantes].

1.4. [Se aplicável] Serviços complementares disponíveis mediante contratação adicional:
    a) [Serviço complementar 1] - Vide "Contrato [Nome]";
    b) [Serviço complementar 2] - Vide "Contrato [Nome]".
`,

    /**
     * Prazo de Execução
     */
    prazo: () => `
CLÁUSULA ESPECÍFICA 2 - DOS PRAZOS DE EXECUÇÃO
2.1. O prazo padrão para execução é de [X] dias úteis, contados a partir de [marco inicial].

2.2. Condições que alteram o prazo:
    a) [Condição 1]: Prazo de [X] dias;
    b) [Condição 2]: Prazo de [Y] dias.

2.3. O prazo será suspenso nas seguintes situações:
    a) [Situação 1];
    b) [Situação 2];
    c) Falta de informações essenciais pela CONTRATANTE.

2.4. A CONTRATADA compromete-se a comunicar atrasos com antecedência mínima de [X] dias.
`,

    /**
     * Responsabilidades Específicas
     */
    responsabilidades: () => `
CLÁUSULA ESPECÍFICA 3 - DAS RESPONSABILIDADES ESPECÍFICAS
3.1. A CONTRATADA obriga-se especificamente a:
    a) [Obrigação técnica específica 1];
    b) [Obrigação técnica específica 2];
    c) [Obrigação técnica específica 3].

3.2. A CONTRATANTE obriga-se a:
    a) [Fornecer acesso/informações necessárias];
    b) [Disponibilizar condições adequadas];
    c) [Cumprir requisitos específicos].

3.3. Responsabilidades compartilhadas:
    a) [Responsabilidade conjunta 1];
    b) [Responsabilidade conjunta 2].
`,

    /**
     * Qualidade e Conformidade
     */
    qualidade: () => `
CLÁUSULA ESPECÍFICA 4 - DA QUALIDADE E CONFORMIDADE
4.1. Os serviços serão executados em conformidade com:
    a) [Norma técnica principal];
    b) [Procedimentos internos certificados];
    c) [Requisitos regulatórios aplicáveis].

4.2. Critérios de aceitação:
    a) [Critério mensurável 1];
    b) [Critério mensurável 2];
    c) [Critério mensurável 3].

4.3. Documentação técnica entregue:
    a) [Documento 1]: [Conteúdo e finalidade];
    b) [Documento 2]: [Conteúdo e finalidade];
    c) [Documento 3]: [Conteúdo e finalidade].

4.4. Rastreabilidade e auditorias:
    a) Registros mantidos por [X] anos;
    b) Acesso para auditorias mediante agendamento;
    c) Cópias de documentos fornecidas sem custo adicional.
`,

    /**
     * Garantia Específica deste Serviço
     */
    garantia: () => `
CLÁUSULA ESPECÍFICA 5 - DA GARANTIA ESPECÍFICA
5.1. A CONTRATADA garante que os serviços:
    a) Serão executados conforme normas técnicas aplicáveis;
    b) Utilizarão equipamentos calibrados e rastreáveis;
    c) Serão realizados por profissionais qualificados.

5.2. Garantia de [X] dias para:
    a) [Item coberto 1];
    b) [Item coberto 2];
    c) [Item coberto 3].

5.3. A garantia NÃO cobre:
    a) Danos causados por [exclusão 1];
    b) Uso inadequado ou fora das especificações;
    c) Intervenções de terceiros não autorizados.

5.4. Durante o período de garantia:
    a) Atendimento prioritário para correções;
    b) Sem custo adicional de mão de obra;
    c) [Outras condições específicas].
`,

    /**
     * [OPCIONAL] Cláusulas adicionais conforme necessidade específica
     * Exemplos: logística, periodicidade, documentação, etc.
     */
};
```

---

## 🔗 Contratos COMPOSTOS (Template)

Contratos compostos **REFERENCIAM** contratos atômicos em vez de duplicar conteúdo:

```javascript
/**
 * CLÁUSULAS ESPECÍFICAS - Plano de Manutenção Recorrente
 * 
 * Finalidade: Planos recorrentes que COMBINAM múltiplos serviços
 * Tipo: COMPOSTO (referencia contratos atômicos)
 * 
 * Contratos referenciados:
 * - manutencao.js (Manutenção Preventiva/Corretiva)
 * - calibracao.js (Calibração de Instrumentos)
 * - fabricacao.js (Fabricação de Peças - desconto)
 * 
 * @category Composto
 */

export const CLAUSULAS_PLANO_MANUTENCAO = {
    /**
     * Estrutura dos Planos
     */
    niveis_servico: () => `
CLÁUSULA ESPECÍFICA 1 - DOS NÍVEIS DE SERVIÇO
1.1. Este contrato é COMPOSTO pelos seguintes serviços base:
    a) **Manutenção Preventiva/Corretiva** - conforme "ANEXO A - Contrato de Manutenção";
    b) **Calibração de Instrumentos** - conforme "ANEXO B - Contrato de Calibração";
    c) **Descontos em Fabricação** - aplicados sobre "ANEXO C - Contrato de Fabricação".

1.2. PLANO BRONZE (serviços inclusos pela mensalidade):
    a) Manutenção Preventiva: 2 visitas/ano (Anexo A - Cláusulas 1, 2, 3);
    b) Calibração Básica: incluída nas visitas (Anexo B - Cláusula 1);
    c) Sem descontos adicionais em fabricação.

1.3. PLANO PRATA (serviços inclusos pela mensalidade):
    a) Manutenção Preventiva: 4 visitas/ano (Anexo A - Cláusulas 1, 2, 3, 4);
    b) Calibração Completa: incluída trimestralmente (Anexo B - Cláusulas 1, 2, 3);
    c) 15% desconto em Fabricação (Anexo C - aplicado sobre valores da tabela);
    d) Suporte remoto: incluso (Anexo A - Cláusula 7).

1.4. PLANO OURO (serviços inclusos pela mensalidade):
    a) Manutenção Preditiva: 12 visitas/ano (Anexo A - todas as cláusulas);
    b) Calibração Premium: mensal (Anexo B - todas as cláusulas);
    c) 25% desconto em Fabricação (Anexo C - aplicado sobre valores da tabela);
    d) Suporte ilimitado: incluso (Anexo A - Cláusula 7);
    e) Técnico de referência exclusivo.

1.5. IMPORTANTE: As condições detalhadas de cada serviço constam nos contratos anexos.
`,

    /**
     * Fidelidade e Recorrência
     */
    fidelidade: () => `
CLÁUSULA ESPECÍFICA 2 - DA FIDELIDADE E RECORRÊNCIA
2.1. Períodos de carência:
    [...]
`,
};
```

---

## ✅ Checklist para Criar Novo Contrato

### **Antes de começar:**
- [ ] Definir se é ATÔMICO, COMPOSTO ou JURÍDICO
- [ ] Verificar se já existe contrato similar (não duplicar)
- [ ] Listar normas técnicas e legais aplicáveis
- [ ] Identificar serviços complementares a referenciar

### **Durante criação:**
- [ ] Seguir template acima rigorosamente
- [ ] Começar sempre pela cláusula ESCOPO (o que está e o que NÃO está incluído)
- [ ] Usar nomenclatura consistente (CONTRATADA/CONTRATANTE)
- [ ] Incluir base legal em comentários JSDoc
- [ ] Referenciar outros contratos em vez de duplicar (se COMPOSTO)

### **Após criação:**
- [ ] Adicionar ao `CLAUSULAS_ESPECIFICAS_MAP` em `index.js`
- [ ] Adicionar título em `TITULOS_CONTRATOS` em `gerais.js`
- [ ] Rodar `npm run build` para validar
- [ ] Testar geração de PDF
- [ ] Documentar em `README.md` ou `CONTRATOS.md`

---

## 🚫 Práticas PROIBIDAS

### ❌ NÃO FAZER:
1. **Misturar finalidades** em contrato atômico
   ```javascript
   // ❌ ERRADO em manutencao.js:
   "Calibração incluída"  // Calibração é outro contrato!
   ```

2. **Duplicar trechos de outros contratos**
   ```javascript
   // ❌ ERRADO:
   // Copiar cláusula de calibração dentro de manutenção
   
   // ✅ CORRETO:
   "Calibração conforme Anexo B - Contrato de Calibração"
   ```

3. **Criar contratos "guarda-chuva" vagos**
   ```javascript
   // ❌ ERRADO:
   CLAUSULAS_SERVICOS_GERAIS  // Muito vago!
   
   // ✅ CORRETO:
   CLAUSULAS_CALIBRACAO       // Específico!
   ```

4. **Omitir o que NÃO está incluído**
   ```javascript
   // ❌ ERRADO: Só listar o que está incluído
   
   // ✅ CORRETO: Sempre ter seção "NÃO estão inclusos:"
   ```

---

## 📚 Nomenclatura Padrão

### Nomes de Arquivos:
- Minúsculas, snake_case
- Verbo no infinitivo quando aplicável
- Exemplos: `calibracao.js`, `engenharia_reversa.js`, `plano_manutencao.js`

### Constantes Exportadas:
- Maiúsculas, SNAKE_CASE
- Prefixo `CLAUSULAS_`
- Exemplo: `CLAUSULAS_CALIBRACAO`, `CLAUSULAS_PLANO_MANUTENCAO`

### Funções de Cláusulas:
- camelCase
- Nome descritivo da cláusula
- Exemplos: `escopo()`, `prazo()`, `responsabilidades()`, `garantia()`

### Títulos de Contratos:
- MAIÚSCULAS para ênfase legal
- Evitar abreviações obscuras
- Exemplo: `'CALIBRAÇÃO DE INSTRUMENTOS'` (não `'CALIB. INSTR.'`)

---

## 🔄 Versionamento de Contratos

### Sistema de Versões:
```javascript
/**
 * @version 1.0.0 - Versão inicial
 * @version 1.1.0 - Adicionada cláusula de garantia estendida
 * @version 2.0.0 - Reestruturação completa (breaking change)
 * 
 * @lastUpdate 26/02/2026
 * @author Paulo Enterfix
 */
```

### Quando incrementar:
- **MAJOR** (2.0.0): Mudança que quebra compatibilidade (reestruturação)
- **MINOR** (1.1.0): Nova cláusula ou funcionalidade (compatível)
- **PATCH** (1.0.1): Correção de texto ou typo (sem impacto)

---

## 📖 Documentação Obrigatória

Todo arquivo deve ter JSDoc completo:

```javascript
/**
 * CLÁUSULAS ESPECÍFICAS - Calibração de Instrumentos
 * 
 * Finalidade: Calibração de instrumentos de medição com rastreabilidade RBC
 * Aplicável a: Empresas que necessitam calibração conforme ISO/IEC 17025
 * 
 * Base legal/normativa:
 * - ISO/IEC 17025:2017: Requisitos para laboratórios de calibração
 * - Portaria Inmetro 694/2022: Regulamento Técnico Metrológico
 * - VIM (Vocabulário Internacional de Metrologia)
 * - NBR ISO 10012: Sistemas de gestão de medição
 * 
 * Serviços complementares (contratos separados):
 * - manutencao.js: Manutenção do instrumento pós-calibração
 * - validacao.js: IQ/OQ/PQ para indústrias reguladas
 * - consultoria.js: Consultoria em sistema de gestão metrológica
 * 
 * @module contratos/clausulas/calibracao
 * @category Atômico
 * @version 1.0.0
 * @lastUpdate 26/02/2026
 * @author Paulo Enterfix
 * 
 * @example
 * import { CLAUSULAS_CALIBRACAO } from './clausulas/calibracao.js';
 * const escopo = CLAUSULAS_CALIBRACAO.escopo();
 */
```

---

## 🎯 Objetivos da Padronização

1. ✅ **Manutenibilidade**: Fácil localizar e atualizar cláusulas específicas
2. ✅ **Escalabilidade**: Adicionar novos contratos sem impactar existentes
3. ✅ **Reutilização**: Contratos compostos referenciam atômicos (DRY)
4. ✅ **Clareza Jurídica**: Cliente sabe exatamente o que contratou
5. ✅ **Compliance**: Base legal documentada e rastreável
6. ✅ **Versionamento**: Histórico de alterações contratuais

---

**Desenvolvido com ❤️ para Enterfix Metrologia**
**Padrão definido em: 26/02/2026**
