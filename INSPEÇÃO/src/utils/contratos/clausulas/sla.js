/**
 * CLÁUSULAS ESPECÍFICAS - SLA (Service Level Agreement)
 * 
 * Tipo: LEGAL / META-ORGANIZACIONAL
 * Finalidade: Estabelecer métricas, prazos e penalidades SOBRE serviços já contratados
 * 
 * IMPORTANTE: Este contrato NÃO oferece serviços diretamente.
 * Ele estabelece níveis de serviço (SLA) para contratos de serviços existentes.
 * 
 * Contratos que podem ser regidos por este SLA:
 * - calibracao.js: Calibração de Instrumentos
 * - manutencao.js: Manutenção Preventiva e Corretiva
 * - plano_manutencao.js: Planos Recorrentes (Bronze/Prata/Ouro)
 * - suporte.js: Suporte Técnico Continuado
 * - gestaoParque.js: Gestão de Parque de Instrumentos
 * 
 * Base: ITIL v4, ISO/IEC 20000 (Gestão de Serviços)
 * 
 * @module contratos/clausulas/sla
 * @category Legal
 * @version 2.0.0 (atualizado para referenciar contratos atômicos)
 * @lastUpdate 26/02/2026
 */

export const CLAUSULAS_SLA = {
    /**
     * Definição e Objetivos do SLA
     */
    definicao: () => `
CLÁUSULA ESPECÍFICA 1 - DA DEFINIÇÃO E OBJETIVOS DO SLA
1.1. O presente SLA (Service Level Agreement) estabelece:
    a) Níveis de serviço mensuráveis e verificáveis;
    b) Métricas de desempenho (KPIs) acordadas entre as partes;
    c) Procedimentos de monitoramento e reporte;
    d) Penalidades pelo não cumprimento de metas;
    e) Bonificações pelo superdesempenho.

1.2. Objetivos do SLA:
    a) Garantir qualidade e previsibilidade dos serviços;
    b) Estabelecer responsabilidades claras e mensuráveis;
    c) Criar mecanismo de melhoria contínua;
    d) Proteger interesses comerciais de ambas as partes.

1.3. Escopo do SLA - Contratos Regidos:
    Este SLA aplica-se aos seguintes contratos de serviços (conforme Anexo A - Contratos Vinculados):
    
    a) **Contrato de Calibração** (calibracao.js):
       → Prazos de execução (padrão: 10 dias úteis);
       → Qualidade dos certificados (meta: ≥ 98% sem erros);
       → Rastreabilidade RBC (meta: 100%);
       → Tempo de resposta a não conformidades.
    
    b) **Contrato de Manutenção** (manutencao.js):
       → SLA de atendimento corretivo (24h/48h/5dias conforme prioridade);
       → Disponibilidade de equipamentos (meta: ≥ 95%);
       → Indicadores MTBF e MTTR;
       → Taxa de reincidência de falhas.
    
    c) **Plano de Manutenção Recorrente** (plano_manutencao.js) - SE APLICÁVEL:
       → Cumprimento de cronograma de visitas (semestral/trimestral/mensal);
       → Prioridade de atendimento conforme plano (Bronze/Prata/Ouro);
       → Descontos garantidos em serviços adicionais.
    
    d) **Suporte Técnico** (suporte.js) - SE APLICÁVEL:
       → Tempo de resposta (2h/4h/8h/24h conforme prioridade);
       → Taxa de resolução no primeiro contato (meta: ≥ 60%);
       → Disponibilidade de canais (telefone, e-mail, WhatsApp).
    
    e) **Gestão de Parque** (gestaoParque.js) - SE APLICÁVEL:
       → Atualização de cadastros (prazo: 5 dias úteis);
       → Alertas de vencimento (30 dias de antecedência);
       → Acurácia de indicadores (meta: ≥ 99%).

1.4. Hierarquia contratual:
    a) Este SLA estabelece: Métricas, prazos, penalidades, bonificações;
    b) Contratos vinculados estabelecem: Condições técnicas, escopo, preços;
    c) Em caso de conflito de prazos: Prevalece o SLA (mais restritivo);
    d) Em caso de conflito de escopo: Prevalece o contrato de serviço;
    e) Aspectos não cobertos pelo SLA: Regidos pelos contratos vinculados.

1.5. Documentação que compõe este SLA:
    a) Contrato Principal: SLA (este documento);
    b) ANEXO A: Lista de Contratos Vinculados e Escopos;
    c) ANEXO B: Tabela de Métricas e Metas Acordadas;
    d) ANEXO C: Contatos de Escalação (N1, N2, N3, N4);
    e) ANEXO D: Dashboard de Indicadores (acesso web);
    f) Contratos Referenciados: Calibração, Manutenção, Planos, Suporte, Gestão de Parque.
`,

    /**
     * Níveis de Serviço e Métricas
     */
    niveis: () => `
CLÁUSULA ESPECÍFICA 2 - DOS NÍVEIS DE SERVIÇO E MÉTRICAS
2.1. DISPONIBILIDADE DE SERVIÇOS:
    a) Meta: 99,5% de disponibilidade mensal;
    b) Medição: Horas operacionais vs. horas de parada;
    c) Exclusões: Manutenções programadas (notificadas 48h antes);
    d) Penalidade: 2% de desconto para cada 0,5% abaixo da meta.

2.2. TEMPO DE RESPOSTA (First Response Time):
    a) CRÍTICO: Resposta em até 2 horas (meta: 95% dos casos);
    b) ALTO: Resposta em até 4 horas (meta: 90% dos casos);
    c) MÉDIO: Resposta em até 8 horas (meta: 85% dos casos);
    d) BAIXO: Resposta em até 24 horas (meta: 80% dos casos);
    e) Penalidade: 5% de desconto se meta não atingida por 2 meses consecutivos.

2.3. TEMPO DE RESOLUÇÃO (Resolution Time):
    a) CRÍTICO: 12 horas (90% dos casos);
    b) ALTO: 24 horas (85% dos casos);
    c) MÉDIO: 72 horas (80% dos casos);
    d) BAIXO: 5 dias úteis (75% dos casos);
    e) Penalidade: 10% de desconto se meta não atingida.

2.4. QUALIDADE DOS ENTREGÁVEIS:
    a) Certificados sem erros: ≥ 98%;
    b) Calibrações conforme padrão RBC: 100%;
    c) Relatórios entregues no prazo: ≥ 95%;
    d) Satisfação do cliente (NPS): ≥ 8,0/10;
    e) Penalidade: 3% de desconto para cada ponto percentual abaixo da meta.

2.5. RETRABALHO E REINCIDÊNCIA:
    a) Taxa de retrabalho: ≤ 3%;
    b) Reincidência de falha (30 dias): ≤ 5%;
    c) Penalidade: Serviço refeito sem custo + 5% de desconto adicional.
`,

    /**
     * Classificação de Prioridades
     */
    prioridades: () => `
CLÁUSULA ESPECÍFICA 3 - DA CLASSIFICAÇÃO DE PRIORIDADES
3.1. PRIORIDADE CRÍTICA - P1:
    a) Definição: Equipamento crítico parado, impacto na produção;
    b) Exemplos: Linha de produção parada, equipamento regulatório;
    c) Resposta: 2 horas;
    d) Resolução: 12 horas;
    e) Atualizações: A cada 2 horas.

3.2. PRIORIDADE ALTA - P2:
    a) Definição: Impacto significativo, mas produção ainda viável;
    b) Exemplos: Equipamento com degradação de desempenho;
    c) Resposta: 4 horas;
    d) Resolução: 24 horas;
    e) Atualizações: A cada 4 horas.

3.3. PRIORIDADE MÉDIA - P3:
    a) Definição: Problema localizado sem impacto produtivo imediato;
    b) Exemplos: Equipamento secundário, ajustes não urgentes;
    c) Resposta: 8 horas;
    d) Resolução: 72 horas;
    e) Atualizações: Diárias.

3.4. PRIORIDADE BAIXA - P4:
    a) Definição: Melhoria, dúvida ou solicitação não urgente;
    b) Exemplos: Treinamento, documentação, consultas;
    c) Resposta: 24 horas;
    d) Resolução: 5 dias úteis;
    e) Atualizações: Sob demanda.

3.5. A CONTRATANTE define a prioridade inicial, sujeita a validação técnica da CONTRATADA dentro de 1 hora.
`,

    /**
     * Janelas de Manutenção
     */
    janelas: () => `
CLÁUSULA ESPECÍFICA 4 - DAS JANELAS DE MANUTENÇÃO
4.1. Manutenções programadas não computam na disponibilidade do SLA:
    a) Máximo de 8 horas mensais;
    b) Notificação prévia de 48 horas;
    c) Preferência: Finais de semana ou fora do horário comercial;
    d) Aprovação prévia da CONTRATANTE para manutenções > 4 horas.

4.2. Janelas de emergência:
    a) Situações de risco ou vulnerabilidade crítica;
    b) Notificação com 4 horas de antecedência (quando possível);
    c) Duração máxima de 4 horas;
    d) Máximo de 2 janelas emergenciais por mês.

4.3. Durante janelas de manutenção:
    a) Comunicação clara sobre indisponibilidade;
    b) Atendimento emergencial apenas para casos P1;
    c) Relatório pós-manutenção em 24 horas.
`,

    /**
     * Monitoramento e Reporte
     */
    monitoramento: () => `
CLÁUSULA ESPECÍFICA 5 - DO MONITORAMENTO E REPORTE
5.1. Ferramentas de monitoramento:
    a) Sistema de tickets com rastreamento em tempo real;
    b) Dashboard com indicadores atualizados diariamente;
    c) Alertas automáticos para desvios de meta;
    d) Histórico completo de atendimentos.

5.2. Relatórios mensais (até 5º dia útil do mês seguinte):
    a) Resumo executivo de desempenho;
    b) Gráficos de evolução dos KPIs;
    c) Análise de desvios e justificativas;
    d) Incidentes críticos detalhados;
    e) Ações de melhoria implementadas;
    f) Plano de ação para mês seguinte.

5.3. Reuniões de revisão:
    a) MENSAIS: Análise de indicadores e ajustes táticos;
    b) TRIMESTRAIS: Revisão estratégica e melhoria contínua;
    c) ANUAIS: Avaliação global e renegociação de metas.

5.4. Acesso online 24/7:
    a) Portal web com status dos equipamentos;
    b) Histórico de chamados e resoluções;
    c) Documentação técnica atualizada;
    d) Certificados de calibração digitais.
`,

    /**
     * Créditos e Penalidades
     */
    creditos: () => `
CLÁUSULA ESPECÍFICA 6 - DOS CRÉDITOS E PENALIDADES
6.1. Sistema de créditos por descumprimento:
    a) Cada métrica tem crédito percentual associado;
    b) Créditos acumulam durante o mês de apuração;
    c) Desconto aplicado na fatura do mês subsequente;
    d) Teto máximo de créditos: 30% do valor mensal.

6.2. Tabela de créditos:
    a) Disponibilidade < 99,5%: 2% por 0,5% de déficit;
    b) Resposta fora do SLA: 1% por incidente (máx 10%);
    c) Resolução fora do SLA: 2% por incidente (máx 15%);
    d) Qualidade < 98%: 3% por ponto percentual;
    e) Retrabalho: 5% por incidente + refação gratuita.

6.3. Créditos NÃO aplicáveis quando:
    a) Falha causada pela CONTRATANTE ou terceiros;
    b) Caso fortuito ou força maior;
    c) Equipamento fora de especificação ou mal conservado;
    d) Falta de colaboração da CONTRATANTE.

6.4. Bonificação por superdesempenho:
    a) 3 meses consecutivos 100% dentro das metas: 5% de desconto no 4º mês;
    b) NPS ≥ 9,5: Bônus de 3% no trimestre;
    c) Zero retrabalho no trimestre: 2% de desconto.
`,

    /**
     * Escalação
     */
    escalacao: () => `
CLÁUSULA ESPECÍFICA 7 - DO PROCESSO DE ESCALAÇÃO
7.1. Níveis de escalação:
    a) NÍVEL 1 (N1): Analista de suporte técnico;
    b) NÍVEL 2 (N2): Engenheiro especialista;
    c) NÍVEL 3 (N3): Gerente técnico;
    d) NÍVEL 4 (N4): Diretor de operações.

7.2. Gatilhos de escalação automática:
    a) P1 sem resposta em 2 horas: Escala para N2;
    b) P1 sem resolução em 12 horas: Escala para N3;
    c) P1 com 24 horas sem resolução: Escala para N4;
    d) Qualquer prioridade sem atualização há 24h: Escala 1 nível;
    e) Reclamação formal da CONTRATANTE: Escala para N3.

7.3. Cada nível tem prazo de 1 hora para assumir o chamado após escalação.

7.4. Contatos de escalação:
    a) Lista mantida atualizada no Anexo III;
    b) Canais: E-mail, telefone, WhatsApp, SMS;
    c) Disponibilidade 24/7 para prioridades P1 e P2.
`,

    /**
     * Revisão e Ajustes
     */
    revisao: () => `
CLÁUSULA ESPECÍFICA 8 - DA REVISÃO E AJUSTES DO SLA
8.1. Revisão trimestral:
    a) Análise de viabilidade das metas;
    b) Identificação de desvios sistemáticos;
    c) Propostas de ajuste mútuo;
    d) Aprovação por ambas as partes necessária.

8.2. Ajustes permitidos:
    a) Metas de desempenho (desde que justificado);
    b) Classificação de prioridades;
    c) Prazos de resposta e resolução;
    d) Percentuais de créditos;
    e) Inclusão/exclusão de métricas.

8.3. Situações que justificam ajustes:
    a) Mudança no volume ou complexidade dos serviços;
    b) Incorporação de novos equipamentos fora do escopo original;
    c) Alterações regulatórias ou normativas;
    d) Impossibilidade técnica comprovada de atingir meta.

8.4. Ajustes entram em vigor no mês seguinte à aprovação.
`,

    /**
     * Responsabilidades da Contratante
     */
    responsabilidadesContratante: () => `
CLÁUSULA ESPECÍFICA 9 - DAS RESPONSABILIDADES DA CONTRATANTE
9.1. Para garantir o SLA, a CONTRATANTE deve:
    a) Prover acesso aos equipamentos dentro de 2 horas (P1) ou 4 horas (P2);
    b) Disponibilizar informações técnicas completas e precisas;
    c) Designar interlocutor técnico disponível;
    d) Seguir recomendações da CONTRATADA sobre uso e conservação;
    e) Permitir manutenções preventivas conforme cronograma.

9.2. Descumprimento pela CONTRATANTE isenta penalidades:
    a) Falta de acesso aos equipamentos no prazo;
    b) Informações incorretas ou incompletas;
    c) Recusa de manutenção preventiva;
    d) Uso inadequado dos equipamentos após orientação.

9.3. A CONTRATANTE validará mensalmente os relatórios de SLA em até 5 dias úteis.
`,

    /**
     * Rescisão por Descumprimento
     */
    rescisaoSla: () => `
CLÁUSULA ESPECÍFICA 10 - DA RESCISÃO POR DESCUMPRIMENTO DO SLA
10.1. Descumprimento sistemático do SLA enseja rescisão:
    a) 3 meses consecutivos com disponibilidade < 95%;
    b) 4 meses consecutivos com créditos > 20%;
    c) 2 incidentes críticos não resolvidos em 48 horas;
    d) Recusa em implementar melhorias acordadas.

10.2. Procedimento de rescisão:
    a) Notificação formal com detalhamento dos descumprimentos;
    b) Prazo de 30 dias para apresentação de plano de ação;
    c) Se não sanado, rescisão sem multa para CONTRATANTE;
    d) Devolução proporcional de valores pagos (últimos 3 meses).

10.3. Durante período de cura (30 dias):
    a) Intensificação do monitoramento;
    b) Reuniões semanais de progresso;
    c) Plano de ação com metas quinzenais;
    d) Desconto de 15% na mensalidade do período.

10.4. Superação do descumprimento:
    a) 2 meses consecutivos 100% no SLA após plano de ação;
    b) Contrato retorna à normalidade;
    c) Bônus de fidelidade de 10% no 3º mês.
`,
};