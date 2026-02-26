/**
 * CLÁUSULAS ESPECÍFICAS - Validação de Equipamentos
 * 
 * Serviços de qualificação e validação conforme Boas Práticas de Fabricação.
 * Base: RDC 301/2019 ANVISA, FDA 21 CFR Part 11, ISO/IEC 17025, GAMP 5
 */

export const CLAUSULAS_VALIDACAO = {
    /**
     * Escopo da Validação
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DA VALIDAÇÃO
1.1. Os serviços de validação/qualificação compreendem:
    a) Qualificação de Instalação (QI / IQ);
    b) Qualificação de Operação (QO / OQ);
    c) Qualificação de Desempenho (QD / PQ);
    d) Validação de Processos;
    e) Validação de Limpeza;
    f) Validação de Sistemas Computadorizados;
    g) Requalificação Periódica;
    h) Mapeamento Térmico.

1.2. Aplicável a:
    a) Indústria Farmacêutica (ANVISA RDC 301/2019);
    b) Indústria de Dispositivos Médicos (ISO 13485);
    c) Indústria Alimentícia (MAPA, FSSC 22000);
    d) Laboratórios Acreditados (ISO/IEC 17025);
    e) Indústrias reguladas que exijam validação.

1.3. Entregáveis:
    a) Protocolos de Validação (Plano Mestre, Protocolos Específicos);
    b) Relatórios de Execução com evidências;
    c) Certificados de Qualificação;
    d) Análise de Risco (FMEA, HACCP conforme aplicável);
    e) Matriz de Rastreabilidade de Requisitos;
    f) Procedimentos Operacionais Padrão (POPs) revisados/criados.
`,

    /**
     * Qualificação de Instalação (QI/IQ)
     */
    qualificacaoInstalacao: () => `
CLÁUSULA ESPECÍFICA 2 - DA QUALIFICAÇÃO DE INSTALAÇÃO (QI/IQ)
2.1. Objetivo:
    Verificar se o equipamento foi instalado conforme especificações, 
    documentação do fabricante e requisitos de projeto.

2.2. Atividades típicas:
    a) Verificação de documentação (manuais, certificados, notas fiscais);
    b) Inspeção física do equipamento (integridade, identificação);
    c) Verificação das condições ambientais (temperatura, umidade, vibração);
    d) Verificação de instalações de apoio (elétrica, água, gases, HVAC);
    e) Conferência de calibração de instrumentos e sensores;
    f) Verificação de segurança (aterramento, dispositivos de proteção);
    g) Registro fotográfico completo;
    h) Testes de alarmes e dispositivos de segurança.

2.3. Critérios de aceitação:
    a) 100% conforme especificações técnicas;
    b) Todas as verificações com resultado "Conforme";
    c) Documentação completa e rastreável;
    d) Não conformidades tratadas e aprovadas antes de prosseguir.

2.4. Duração típica:
    a) Equipamentos simples: 1-2 dias;
    b) Equipamentos médios: 3-5 dias;
    c) Sistemas complexos: 1-2 semanas.

2.5. Entregáveis:
    a) Protocolo de QI aprovado previamente;
    b) Relatório de Execução com evidências (fotos, prints, certificados);
    c) Certificado de Qualificação de Instalação.
`,

    /**
     * Qualificação de Operação (QO/OQ)
     */
    qualificacaoOperacao: () => `
CLÁUSULA ESPECÍFICA 3 - DA QUALIFICAÇÃO DE OPERAÇÃO (QO/OQ)
3.1. Objetivo:
    Demonstrar que o equipamento opera conforme especificações em toda 
    sua faixa de operação prevista.

3.2. Atividades típicas:
    a) Verificação de funções e controles operacionais;
    b) Testes de alarmes, limites e intertravamentos;
    c) Testes de ciclos (aquecimento, resfriamento, variações);
    d) Verificação de setpoints e tolerâncias;
    e) Testes de precisão e repetibilidade;
    f) Verificação de uniformidade (quando aplicável);
    g) Simulação de condições extremas (worst case);
    h) Verificação de registros e rastreabilidade.

3.3. Testes obrigatórios (exemplos conforme equipamento):
    a) ESTUFAS: Uniformidade térmica, estabilidade, precisão;
    b) AUTOCLAVES: Penetração de calor, letalidade (F0), ciclos vazios;
    c) CÂMARAS CLIMÁTICAS: Uniformidade T e UR, estabilidade, recuperação;
    d) BALANÇAS: Excentricidade, linearidade, repetibilidade;
    e) pHMETROS: Calibração multi-pontos, estabilidade, resposta;
    f) SISTEMAS COMPUTADORIZADOS: Funcionalidades, cálculos, relatórios, backup.

3.4. Critérios de aceitação:
    a) Resultados dentro das especificações ±tolerâncias;
    b) 100% dos testes realizados e aprovados;
    c) Desvios justificados e aprovados;
    d) Rastreabilidade de padrões utilizados (certificados RBC).

3.5. Duração típica:
    a) Equipamentos simples: 2-3 dias;
    b) Equipamentos médios: 5-10 dias;
    c) Sistemas complexos: 2-4 semanas.

3.6. Entregáveis:
    a) Protocolo de QO aprovado previamente;
    b) Relatório de Execução com dados brutos e gráficos;
    c) Certificado de Qualificação de Operação.
`,

    /**
     * Qualificação de Desempenho (QD/PQ)
     */
    qualificacaoDesempenho: () => `
CLÁUSULA ESPECÍFICA 4 - DA QUALIFICAÇÃO DE DESEMPENHO (QD/PQ)
4.1. Objetivo:
    Demonstrar que o equipamento, operado por pessoal treinado, atende 
    consistentemente aos requisitos do processo em condições reais de uso.

4.2. Atividades típicas:
    a) Execução de lotes/ciclos reais ou simulados;
    b) Monitoramento de variáveis críticas do processo;
    c) Amostragem e análise de produtos/resultados;
    d) Verificação de reprodutibilidade entre lotes/ciclos;
    e) Testes com carga máxima e mínima;
    f) Simulação de condições adversas;
    g) Envolvimento da equipe operacional real;
    h) Validação de POPs gerados/revisados.

4.3. Número de ciclos/lotes requeridos:
    a) Mínimo: 3 ciclos/lotes consecutivos bem-sucedidos;
    b) Recomendado: 5-10 ciclos para processos críticos;
    c) Critério estatístico: Demonstrar consistência e tendência central.

4.4. Critérios de aceitação:
    a) 100% dos lotes/ciclos aprovados conforme especificação;
    b) Variabilidade dentro dos limites aceitáveis (Cpk ≥ 1,33 quando aplicável);
    c) Reprodutibilidade demonstrada;
    d) Equipe operacional aprovada em avaliação prática.

4.5. Duração típica:
    a) Processos rápidos: 1-2 semanas;
    b) Processos longos (fermentação, cura): Semanas a meses;
    c) Dependente do tempo de ciclo do processo real.

4.6. Entregáveis:
    a) Protocolo de QD aprovado previamente;
    b) Relatório de Execução com análise estatística;
    c) Certificado de Qualificação de Desempenho;
    d) Liberação formal para uso em produção rotineira.
`,

    /**
     * Requalificação Periódica
     */
    requalificacao: () => `
CLÁUSULA ESPECÍFICA 5 - DA REQUALIFICAÇÃO PERIÓDICA
5.1. Periodicidade:
    a) ANUAL: Equipamentos críticos de controle de qualidade;
    b) BIENAL: Equipamentos de produção com bom histórico;
    c) TRIENAL: Equipamentos auxiliares de baixa criticidade;
    d) AD-HOC: Após manutenções significativas, mudanças de processo, desvios recorrentes.

5.2. Escopo da requalificação:
    a) COMPLETA: Repete QI + QO + QD (para mudanças maiores);
    b) PARCIAL: Apenas QO + QD (manutenção do status qualificado);
    c) SIMPLIFICADA: Testes críticos (quando histórico é excelente).

5.3. Gatilhos para requalificação antecipada:
    a) Manutenção corretiva em componentes críticos;
    b) Mudança de localização do equipamento;
    c) Modificação de processo ou parâmetros operacionais;
    d) Substituição de componentes principais (sensores, controladores);
    e) Desvios de qualidade relacionados ao equipamento;
    f) Auditorias regulatórias com exigência.

5.4. Simplificações permitidas:
    a) Histórico de 3 anos sem desvios: Requalificação simplificada ok;
    b) Justificativa baseada em risco documentada;
    c) Aprovação do Controle de Qualidade/Garantia da Qualidade.

5.5. Revisão do status de qualificação:
    a) Verde: Qualificado e dentro da validade;
    b) Amarelo: Próximo ao vencimento (30 dias);
    c) Vermelho: Vencido - BLOQUEADO para uso em produção.
`,

    /**
     * Mapeamento Térmico
     */
    mapeamentoTermico: () => `
CLÁUSULA ESPECÍFICA 6 - DO MAPEAMENTO TÉRMICO
6.1. Aplicável a:
    a) Câmaras climáticas, estufas, incubadoras;
    b) Autoclaves e esterilizadores;
    c) Túneis de lavagem e despirogenização;
    d) Armazéns e áreas climatizadas (farmacêutico, alimentos);
    e) Freezers, refrigeradores e câmaras frias.

6.2. Metodologia:
    a) Posicionamento estratégico de sensores (9 a 27 pontos conforme tamanho);
    b) Dataloggers calibrados e rastreáveis à RBC;
    c) Período de monitoramento: 24-72 horas (mínimo de 3 ciclos completos);
    d) Testes em vazio (empty) e com carga (loaded);
    e) Simulação de pior caso (porta aberta, carga máxima, etc.);
    f) Análise estatística de homogeneidade e estabilidade.

6.3. Parâmetros avaliados:
    a) Uniformidade: Variação máxima entre pontos simultâneos;
    b) Estabilidade: Variação em cada ponto ao longo do tempo;
    c) Tempo de estabilização: Após startup ou abertura de porta;
    d) Identificação de pontos frios e quentes;
    e) Adequação às especificações de processo.

6.4. Critérios de aceitação:
    a) Todos os pontos dentro da faixa especificada ± tolerância;
    b) Uniformidade típica: ± 2°C para câmaras, ± 0,5°C para estufas de precisão;
    c) 100% do tempo dentro da faixa após estabilização.

6.5. Entregáveis:
    a) Protocolo de Mapeamento Térmico;
    b) Relatório com gráficos de tempo x temperatura de todos os pontos;
    c) Análise estatística e mapa 2D/3D da distribuição térmica;
    d) Definição de 1 ponto de monitoramento de rotina (mais crítico);
    e) Certificado de Mapeamento Térmico.

6.6. Frequência:
    a) Inicial: Após instalação e qualificação;
    b) Revalidação: Anual ou bienal conforme criticidade;
    c) Após mudanças no HVAC ou relocação do equipamento.
`,

    /**
     * Validação de Sistemas Computadorizados
     */
    validacaoSistemas: () => `
CLÁUSULA ESPECÍFICA 7 - DA VALIDAÇÃO DE SISTEMAS COMPUTADORIZADOS
7.1. Aplicável a:
    a) LIMS (Laboratory Information Management System);
    b) SCADA e sistemas de controle industrial;
    c) Balanças e equipamentos com software embarcado;
    d) Sistemas de monitoramento contínuo (temperatura, umidade);
    e) Softwares de gestão metrológica/qualidade.

7.2. Abordagem conforme GAMP 5:
    a) CATEGORIA 1 (Infraestrutura): Windows, Linux - Validação indireta;
    b) CATEGORIA 3 (Não configurável): Software pronto - Validação simplificada;
    c) CATEGORIA 4 (Configurável): ERP, LIMS - Validação de configuração;
    d) CATEGORIA 5 (Customizado): Software desenvolvido sob medida - Validação completa.

7.3. Atividades típicas:
    a) Especificação de Requisitos de Usuário (URS);
    b) Avaliação de fornecedor (Vendor Assessment);
    c) Análise de riscos (FMEA);
    d) Validação de instalação (software + hardware);
    e) Testes funcionais (casos de uso);
    f) Testes de integridade de dados (Data Integrity - ALCOA+);
    g) Teste de segurança e controle de acesso (21 CFR Part 11);
    h) Teste de backup e recuperação de desastres;
    i) Treinamento de usuários e documentação.

7.4. Casos de Teste obrigatórios:
    a) Cálculos matemáticos e fórmulas;
    b) Limites, alarmes e intertravamentos;
    c) Rastreabilidade (audit trail) - Quem, O quê, Quando;
    d) Assinatura eletrônica (quando aplicável);
    e) Relatórios (geração, impressão, exportação);
    f) Backup automático e restauração;
    g) Controle de mudanças (change control);
    h) Segurança (senhas, níveis de acesso, timeout).

7.5. Conformidade regulatória:
    a) 21 CFR Part 11 (FDA - EUA);
    b) Anexo 11 EU GMP (EMA - Europa);
    c) RDC 301/2019 ANVISA (Brasil);
    d) LGPD (proteção de dados pessoais).

7.6. Entregáveis:
    a) Plano de Validação (VP);
    b) Especificação de Requisitos de Usuário (URS);
    c) Matriz de Rastreabilidade de Requisitos (RTM);
    d) Protocolos e Relatórios de Qualificação (IQ, OQ, PQ);
    e) Resumo de Validação (Validation Summary Report);
    f) POPs de operação, backup, change control.
`,

    /**
     * Análise de Risco
     */
    analiseRisco: () => `
CLÁUSULA ESPECÍFICA 8 - DA ANÁLISE DE RISCO
8.1. Metodologias aplicadas:
    a) FMEA (Failure Mode and Effects Analysis);
    b) HACCP (Hazard Analysis and Critical Control Points) - Alimentos/Farmacêutico;
    c) Matriz de Risco (Probabilidade x Impacto);
    d) Árvore de Falhas (FTA) para sistemas complexos.

8.2. Processo de análise de risco:
    a) Identificação de funções críticas do equipamento/processo;
    b) Identificação de modos de falha potenciais;
    c) Avaliação de severidade (impacto na qualidade/segurança);
    d) Avaliação de probabilidade de ocorrência;
    e) Avaliação de detectabilidade (capacidade de detectar falha);
    f) Cálculo de Número de Prioridade de Risco (NPR = S x O x D);
    g) Definição de ações de mitigação para riscos altos;
    h) Reavaliação após implementação de controles.

8.3. Classificação de riscos:
    a) CRÍTICO (NPR > 100): Controles obrigatórios antes de liberar;
    b) ALTO (NPR 50-100): Controles recomendados, monitoramento intensivo;
    c) MÉDIO (NPR 20-50): Controles básicos, monitoramento de rotina;
    d) BAIXO (NPR < 20): Aceito, revisão periódica.

8.4. Use na validação:
    a) Priorização de testes (riscos altos = mais testes);
    b) Definição de frequência de requalificação;
    c) Justificativa para simplificações (riscos baixos);
    d) Definição de pontos críticos de monitoramento.

8.5. Revisão da análise de risco:
    a) Anualmente ou quando houver mudanças significativas;
    b) Após desvios ou falhas não previstas;
    c) Documentação de decisões tomadas com base no risco.
`,

    /**
     * Treinamento de Operadores
     */
    treinamentoOperadores: () => `
CLÁUSULA ESPECÍFICA 9 - DO TREINAMENTO DE OPERADORES
9.1. Obrigatório para liberação final (PQ):
    a) Todos os operadores treinados e aprovados antes de uso em produção;
    b) Treinamento teórico + prático "hands-on";
    c) Avaliação de aprendizado (teórica + prática);
    d) Certificado de habilitação individual;
    e) Revalidação anual ou conforme procedimento interno.

9.2. Conteúdo do treinamento:
    a) Princípios de funcionamento do equipamento;
    b) POPs de operação, limpeza e sanitização;
    c) Procedimentos de emergência e segurança;
    d) Identificação e comunicação de desvios;
    e) Registros e rastreabilidade;
    f) Boas Práticas de Fabricação (GMP) aplicáveis.

9.3. Avaliação prática:
    a) Operação completa supervisionada (ciclo/lote);
    b) Simulação de situação de alarme/emergência;
    c) Verificação de preenchimento correto de registros;
    d) Nota mínima: 70% (teórica) + Aprovado (prática).

9.4. Registro de treinamentos:
    a) Lista de presença assinada;
    b) Conteúdo programático e material fornecido;
    c) Resultados de avaliações individuais;
    d) Certificados individuais com validade;
    e) Matriz de habilitações atualizada.
`,

    /**
     * Documentação e Relatórios
     */
    documentacaoValidacao: () => `
CLÁUSULA ESPECÍFICA 10 - DA DOCUMENTAÇÃO E RELATÓRIOS
10.1. Documentação gerada conforme hierarquia:
    a) NÍVEL 1 - Plano Mestre de Validação (PMV): Estratégia geral da empresa;
    b) NÍVEL 2 - Planos de Validação Específicos (PV): Por equipamento/sistema;
    c) NÍVEL 3 - Protocolos de Qualificação (QI, QO, QD): Passo a passo dos testes;
    d) NÍVEL 4 - Relatórios de Execução: Evidências, dados brutos, desvios;
    e) NÍVEL 5 - Certificados: Liberação formal para uso.

10.2. Conteúdo obrigatório dos protocolos:
    a) Objetivo, escopo e referências normativas;
    b) Descrição do equipamento/sistema;
    c) Critérios de aceitação claramente definidos;
    d) Procedimentos de teste passo a passo;
    e) Tabelas para registro de dados e evidências;
    f) Espaço para assinaturas (Executante, Revisor, Aprovador);
    g) Anexos (certificados de padrões, fotos, prints).

10.3. Tratamento de desvios:
    a) Todos os desvios devem ser registrados e investigados;
    b) Análise de impacto (afeta a qualificação?);
    c) Ações corretivas implementadas e verificadas;
    d) Aprovação formal do desvio pela Garantia da Qualidade;
    e) Reteste quando necessário.

10.4. Aprovações necessárias:
    a) Protocolos: Aprovados ANTES da execução;
       - Autor/Responsável do Projeto;
       - Garantia da Qualidade (QA);
       - Controle de Qualidade (QC) quando aplicável;
    b) Relatórios: Aprovados APÓS execução e análise;
       - Executor;
       - Revisor Técnico;
       - Garantia da Qualidade (QA);
       - Gerente de Produção/Laboratório.

10.5. Controle de documentos:
    a) Numeração única e rastreável;
    b) Controle de versões e revisões;
    c) Distribuição controlada (lista de distribuição);
    d) Armazenamento seguro por no mínimo 5 anos (ou conforme regulação);
    e) Backup digital em nuvem segura.

10.6. Prazos de entrega:
    a) Protocolos: 10 dias úteis após kick-off;
    b) Relatórios preliminares: 10 dias após execução;
    c) Relatórios finais: 5 dias após aprovação de desvios/retestes;
    d) Certificados: Junto com relatório final.
`,
};