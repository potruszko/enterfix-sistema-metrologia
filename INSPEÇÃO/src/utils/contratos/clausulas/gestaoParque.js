/**
 * CLÁUSULAS ESPECÍFICAS - Gestão de Parque de Instrumentos
 * 
 * Tipo: COMPOSTO / ORGANIZACIONAL
 * Finalidade: Gerenciamento completo do ciclo de vida de instrumentos (GESTÃO, não execução)
 * 
 * IMPORTANTE: Este contrato NÃO executa calibrações ou manutenções diretamente.
 * Ele GERENCIA, COORDENA e CONTROLA o parque de instrumentos, delegando
 * serviços técnicos aos contratos específicos.
 * 
 * Contratos referenciados (serviços técnicos executados externamente):
 * - calibracao.js: Execução de calibrações dos instrumentos
 * - manutencao.js: Execução de manutenções preventivas/corretivas
 * - plano_manutencao.js: Planos recorrentes (se aplicável)
 * - validacao.js: Qualificações  (QI/QO/QD) quando necessário
 * 
 * Serviços INCLUSOS neste contrato (gestão):
 * - Cadastramento e identificação de instrumentos (etiquetas, TAGs)
 * - Planejamento de calibrações e manutenções (cronograma)
 * - Alertas automáticos de vencimento (30/60 dias)
 * - Coleta e entrega de instrumentos (logística)
 * - Gestão documental (certificados, relatórios, histórico)
 * - Relatórios gerenciais e indicadores (MTBF, MTTR, custos)
 * - Sistema web com dashboard e rastreabilidade
 * - Visitas técnicas periódicas (acompanhamento, não execução)
 * 
 * Base: ISO 10012 (Sistemas de Gestão de Medição), ISO/IEC 17025
 * 
 * @module contratos/clausulas/gestaoParque
 * @category Composto
 * @version 2.0.0 (atualizado para referenciar contratos atômicos)
 * @lastUpdate 26/02/2026
 */

export const CLAUSULAS_GESTAO_PARQUE = {
    /**
     * Escopo da Gestão
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DA GESTÃO DE PARQUE
1.1. A gestão de parque de instrumentos compreende SERVIÇOS DE COORDENAÇÃO E CONTROLE:
    a) Cadastramento completo de todos os instrumentos (identificação, TAG, foto);
    b) Planejamento e controle de calibrações periódicas (cronograma, não execução);
    c) Gestão de manutenções preventivas e corretivas (agendamento, não execução);
    d) Rastreabilidade de certificados e documentação (arquivo digital 10 anos);
    e) Controle de locais, responsáveis e status operacional (sistema web);
    f) Alertas automáticos de vencimentos (e-mail, WhatsApp, painel);
    g) Relatórios gerenciais e indicadores de desempenho (MTBF, MTTR, disponibilidade);
    h) Gestão de não conformidades e ações corretivas (registro, não resolução técnica);
    i) Logística de coleta e entrega (transporte, não serviços técnicos).

1.2. SERVIÇOS TÉCNICOS VINCULADOS (executados conforme contratos específicos):
    a) **Calibração de Instrumentos** → Vide "Contrato de Calibração" (calibracao.js);
    b) **Manutenção Preventiva/Corretiva** → Vide "Contrato de Manutenção" (manutencao.js);
    c) **Validação/Qualificação (QI/QO/QD)** → Vide "Contrato de Validação" (validacao.js);
    d) **Planos Recorrentes** → Vide "Contrato de Plano de Manutenção" (plano_manutencao.js).
    
    → Estas atividades são COORDENADAS por este contrato, mas EXECUTADAS pelos contratos vinculados.
    → Prazos técnicos, qualidade e garantias: Regidos pelos contratos específicos.
    → Valores: Conforme tabelas dos contratos vinculados (ou com desconto se previsto).

1.3. Instrumentos abrangidos pela gestão:
    a) Instrumentos de medição dimensional (paquímetros, micrômetros, etc.);
    b) Equipamentos de medição (balanças, manômetros, termômetros, etc.);
    c) Sistemas de medição complexos (máquinas de medir, CMMs, etc.);
    d) Padrões de referência e de trabalho;
    e) Sistemas de monitoramento contínuo;
    f) Instrumentos regulatórios (farma, alimentício, dispositivos médicos).

1.4. Modalidades de gestão:
    a) **COMPLETA**: Gestão total + software dedicado + suporte presencial mensal;
    b) **CONSULTIVA**: Orientações + suporte + controle pela CONTRATANTE;
    c) **HÍBRIDA**: Gestão compartilhada com responsabilidades definidas.

1.5. HIERARQUIA CONTRATUAL E SEPARAÇÃO JURÍDICA (BLINDAGEM FUNDAMENTAL):

    ATENÇÃO: Este contrato é de GESTÃO (software/coordenação), NÃO de EXECUÇÃO (serviços técnicos).

    a) ESCOPO DESTE CONTRATO (Gestão de Parque):
       → Software/sistema de gestão;
       → Coordenação de prazos e alertas;
       → Logística de coleta/entrega;
       → Relatórios gerenciais e KPIs;
       → NÃO INCLUI: Calibrações, manutenções, reparos, peças de reposição.
    
    b) ESCOPO DOS CONTRATOS VINCULADOS (Execução Técnica):
       → Contrato de Calibração: Execução técnica de calibrações, certificados, garantias;
       → Contrato de Manutenção: Execução de reparos, peças, garantias técnicas;
       → Contrato de Validação: Qualificações (QI/QO/QD), protocolos, garantias;
       → RESPONSABILIDADE TÉCNICA: Estes contratos respondem por qualidade, prazos técnicos, garantias.
    
    c) HIERARQUIA DE PREVALÊNCIA:
       → Conflito de prazos: SLA (se existir) > Gestão > Contrato técnico específico;
       → Conflito de escopo técnico: SEMPRE prevalece contrato técnico específico;
       → Garantias técnicas: Regidas EXCLUSIVAMENTE pelo contrato de execução (calibração/manutenção).
    
    d) EXEMPLO DE APLICAÇÃO DA SEPARAÇÃO JURÍDICA:
       → Cliente paga mensalidade de Gestão: R$ 2.000/mês (software + coordenação);
       → Instrumento quebra: Cliente NÃO pode usar mensalidade para cobrir peças de reposição;
       → Responsabilidade: Contrato de Manutenção (orçamento separado);
       → Gestão: Apenas coordena agendamento, não executa reparo.
    
    e) INTEGRAÇÃO NO SISTEMA ENTERFIX:
       → Botão Agendar Calibração: Abre popup com referência ao Contrato de Calibração + orçamento;
       → Botão Solicitar Manutenção: Abre popup com referência ao Contrato de Manutenção + orçamento;
       → Cliente vê claramente que gestão ≠ execução (transparência de custos).
`,

    /**
     * Cadastramento e Identificação
     */
    cadastramento: () => `
CLÁUSULA ESPECÍFICA 2 - DO CADASTRAMENTO E IDENTIFICAÇÃO
2.1. Processo de cadastramento inicial:
    a) Inventário físico completo de todos os instrumentos;
    b) Fotografia e identificação única (TAG/código);
    c) Coleta de dados técnicos (fabricante, modelo, número de série, faixa, resolução);
    d) Determinação de periodicidade de calibração;
    e) Classificação de criticidade (A, B, C conforme impacto);
    f) Definição de local de uso e responsável.

2.2. Ficha técnica completa incluirá:
    a) Dados de identificação (TAG, descrição, marca);
    b) Especificações técnicas (faixa, resolução, incerteza);
    c) Histórico de calibrações e certificados;
    d) Histórico de manutenções e intervenções;
    e) Status atual (operacional, calibrado, em manutenção, desativado);
    f) Local, setor e responsável.

2.3. Sistema de identificação física:
    a) Etiquetas com código de barras ou QR Code;
    b) Cores diferenciadas por status (verde=ok, amarelo=alerta, vermelho=vencido);
    c) Informação de validade de calibração visível;
    d) TAG permanente resistente a uso industrial.

2.4. Instrumentos novos serão cadastrados em até 5 dias úteis após aquisição.
`,

    /**
     * Planejamento de Calibrações
     */
    planejamento: () => `
CLÁUSULA ESPECÍFICA 3 - DO PLANEJAMENTO DE CALIBRAÇÕES
3.1. Periodicidade baseada em:
    a) Recomendação do fabricante;
    b) Requisitos normativos (ISO, RBC, Inmetro);
    c) Criticidade do instrumento;
    d) Histórico de deriva e desempenho;
    e) Condições de uso e ambiente.

3.2. Classificação de criticidade:
    a) CLASSE A (Críticos): Impacto direto na qualidade do produto/serviço;
       - Periodicidade: 6 meses ou conforme especificação;
       - Prioridade máxima; tolerância reduzida;
    b) CLASSE B (Importantes): Impacto indireto ou controlável;
       - Periodicidade: 12 meses;
       - Prioridade média;
    c) CLASSE C (Auxiliares): Uso esporádico ou não crítico;
       - Periodicidade: 24 meses ou conforme uso;
       - Prioridade baixa.

3.3. Cronograma anual de calibrações:
    a) Elaborado até 31 de dezembro do ano anterior;
    b) Distribuição equilibrada ao longo dos meses;
    c) Consideração de sazonalidade da produção;
    d) Reserva de 10% de capacidade para emergências.

3.4. Alertas automáticos:
    a) 60 dias antes do vencimento: Alerta amarelo (planejamento);
    b) 30 dias antes: Alerta laranja (agendamento obrigatório);
    c) 15 dias antes: Alerta vermelho (urgente);
    d) Vencido: Bloqueio automático + notificação múltipla.
`,

    /**
     * Sistema de Informação
     */
    sistema: () => `
CLÁUSULA ESPECÍFICA 4 - DO SISTEMA DE INFORMAÇÃO
4.1. Plataforma web/desktop com funcionalidades:
    a) Cadastro completo de instrumentos;
    b) Controle de calibrações e certificados;
    c) Gestão de manutenções;
    d) Alertas e notificações automáticas;
    e) Rastreabilidade e auditoria completa;
    f) Relatórios e dashboards gerenciais;
    g) Gestão de não conformidades;
    h) Controle de acesso e permissões.

4.2. Acesso ao sistema:
    a) Via web (qualquer navegador);
    b) Aplicativo mobile para consultas (iOS/Android);
    c) Disponibilidade 24/7 com SLA de 99,5%;
    d) Usuários ilimitados (conforme plano contratado);
    e) Backup diário automático.

4.3. Relatórios disponíveis:
    a) Instrumentos vencidos e a vencer;
    b) Custos de calibração por período;
    c) Indicadores de desempenho do parque;
    d) Histórico de instrumentos;
    e) Certificados consolidados;
    f) Não conformidades e ações;
    g) Relatórios personalizados sob demanda.

4.4. Integração:
    a) Importação/exportação via Excel;
    b) API para integração com ERP (sob consulta);
    c) Código de barras/QR Code para leitura mobile;
    d) E-mail automático para notificações.
`,

    /**
     * Acompanhamento Presencial
     */
    acompanhamento: () => `
CLÁUSULA ESPECÍFICA 5 - DO ACOMPANHAMENTO PRESENCIAL
5.1. Visitas técnicas periódicas:
    a) MENSAL (Plano Completo): Verificação in loco do parque;
    b) TRIMESTRAL (Plano Básico): Auditoria de conformidade;
    c) SEM ESTRAL (Plano Consultivo): Reunião de análise crítica;
    d) AD-HOC: Conforme necessidade ou solicitação.

5.2. Atividades durante visitas:
    a) Verificação física de instrumentos vs. sistema;
    b) Conferência de etiquetas e identificação;
    c) Atualização de status e localização;
    d) Coleta de instrumentos para calibração;
    e) Entrega de instrumentos calibrados;
    f) Treinamento pontual da equipe;
    g) Reunião de alinhamento com gestor.

5.3. Relatório de visita:
    a) Situação do parque (instrumentos ok, alerta, vencidos);
    b) Ações realizadas durante a visita;
    c) Não conformidades identificadas;
    d) Recomendações técnicas;
    e) Próximos passos e cronograma.

5.4. Coleta e entrega de instrumentos:
    a) Agendamento prévio de 48 horas;
    b) Protocolo de retirada com estado do instrumento;
    c) Prazo de retorno: Conforme SLA de calibração;
    d) Notificação automática quando pronto;
    e) Entrega com novo certificado e etiqueta atualizada.
`,

    /**
     * Gestão documental
     */
    gestaoDocumental: () => `
CLÁUSULA ESPECÍFICA 6 - DA GESTÃO DOCUMENTAL
6.1. Certificados de calibração:
    a) Armazenamento digital em nuvem segura;
    b) Acesso via sistema a qualquer momento;
    c) Download em PDF de alta qualidade;
    d) Organização por instrumento e por período;
    e) Retenção por no mínimo 10 anos.

6.2. Documentação técnica:
    a) Manuais dos instrumentos em PDF;
    b) Procedimentos de uso e conservação;
    c) Histórico de manutenções e intervenções;
    d) Registros de treinamento de operadores;
    e) Termos de responsabilidade e custódia.

6.3. Rastreabilidade completa:
    a) Histórico de todas as alterações no cadastro;
    b) Log de movimentações (transferências, empréstimos);
    c) Auditoria de acessos ao sistema;
    d) Versionamento de documentos;
    e) Trilha de aprovações e assinaturas digitais.

6.4. Backup e segurança:
    a) Backup diário incremental automático;
    b) Backup semanal completo;
    c) Retenção de 30 gerações;
    d) Armazenamento redundante em múltiplos datacenters;
    e) Criptografia de dados sensíveis (LGPD).
`,

    /**
     * Indicadores e Melhoria Contínua
     */
    indicadores: () => `
CLÁUSULA ESPECÍFICA 7 - DOS INDICADORES E MELHORIA CONTÍNUA
7.1. KPIs monitorados:
    a) Taxa de conformidade (% instrumentos válidos);
    b) Prazo médio entre vencimento e calibração;
    c) Taxa de reprovação em calibrações;
    d) Custo médio de calibração por instrumento;
    e) MTBF (tempo médio entre falhas);
    f) Taxa de instrumentos inativos/obsoletos;
    g) Aderência ao cronograma planejado.

7.2. Metas esperadas:
    a) Conformidade: ≥ 98% (menos de 2% vencidos);
    b) Reprovação: ≤ 5% (instrumentos com deriva excessiva);
    c) Aderência ao cronograma: ≥ 95%;
    d) Instrumentos inativos: ≤ 5% do parque.

7.3. Análise crítica mensal:
    a) Revisão de indicadores vs. metas;
    b) Identificação de desvios e causas;
    c) Plano de ação para melhorias;
    d) Ajustes no cronograma ou periodicidades;
    e) Recomendações de otimização de custos.

7.4. Reunião trimestral estratégica:
    a) Apresentação de resultados consolidados;
    b) Análise de tendências e projeções;
    c) Validação de investimentos necessários;
    d) Alinhamento de expectativas;
    e) Ajustes contratuais se necessário.
`,

    /**
     * Treinamentos e Capacitação
     */
    treinamentos: () => `
CLÁUSULA ESPECÍFICA 8 - DOS TREINAMENTOS E CAPACITAÇÃO
8.1. Treinamentos inclusos:
    a) Utilização do sistema de gestão (4h iniciais);
    b) Boas práticas de conservação de instrumentos (2h);
    c) Interpretação de certificados de calibração (2h);
    d) Reciclagem anual (2h online).

8.2. Público-alvo:
    a) Gestores do parque de instrumentos;
    b) Técnicos responsáveis por setores;
    c) Operadores de instrumentos críticos;
    d) Auditores internos da qualidade.

8.3. Certificação de operadores (opcional):
    a) Treinamento prático específico por instrumento;
    b) Avaliação teórica e prática;
    c) Certificado de habilitação com validade de 12 meses;
    d) Renovação mediante reciclagem.

8.4. Material didático:
    a) Apostilas digitais;
    b) Vídeos tutoriais do sistema;
    c) Manuais de referência rápida;
    d) FAQs e base de conhecimento online.
`,

    /**
     * Não Conformidades e Ações Corretivas
     */
    naoConformidades: () => `
CLÁUSULA ESPECÍFICA 9 - DAS NÃO CONFORMIDADES E AÇÕES CORRETIVAS
9.1. Registro de não conformidades:
    a) Instrumento reprovado em calibração;
    b) Uso de instrumento vencido;
    c) Dano ou perda de instrumento;
    d) Desvio de procedimento operacional;
    e) Falha de identificação ou rastreabilidade.

9.2. Tratamento de NC:
    a) Registro formal no sistema com evidências;
    b) Avaliação de impacto (produtos/serviços afetados);
    c) Ação imediata (bloqueio, segregação, recall);
    d) Análise de causa raiz (5 Porquês, Ishikawa);
    e) Plano de ação corretiva e preventiva;
    f) Verificação de eficácia em 30 dias.

9.3. Instrumento reprovado em calibração:
    a) Bloqueio automático no sistema;
    b) Etiqueta vermelha "REPROVADO - NÃO USAR";
    c) Análise de rastreabilidade (medições anteriores);
    d) Decisão: Ajustar, reparar, descartar ou aceitar com restrição;
    e) Registro detalhado da decisão e justificativa.

9.4. Prevenção de recorrências:
    a) Revisão de periodicidade (reduzir intervalo);
    b) Melhorias nas condições de uso/armazenamento;
    c) Treinamento adicional de operadores;
    d) Substituição de instrumentos inadequados.
`,

    /**
     * Remuneração e Valor
     */
    remuneracaoGestao: () => `
CLÁUSULA ESPECÍFICA 10 - DA REMUNERAÇÃO E VALOR DA GESTÃO
10.1. Modalidades de cobrança:
    a) MENSALIDADE FIXA: Valor fixo independente do número de instrumentos (até limite acordado);
    b) POR INSTRUMENTO: R$ [VALOR] por instrumento cadastrado/mês;
    c) PACOTE: Quantidade fixa de instrumentos com valor fechado.

10.2. Serviços inclusos na mensalidade:
    a) Acesso ilimitado ao sistema de gestão;
    b) Cadastramento e atualização de instrumentos;
    c) Alertas e notificações automáticas;
    d) Suporte técnico via telefone/e-mail;
    e) Relatórios mensais padrão;
    f) Armazenamento de certificados;
    g) Treinamentos básicos (conforme cláusula 8);
    h) Visitas conforme periodicidade do plano.

10.3. Serviços NÃO inclusos (cobrança à parte):
    a) Calibrações dos instrumentos (valores conforme tabela);
    b) Manutenções corretivas;
    c) Treinamentos avançados ou personalizados;
    d) Consultoria especializada;
    e) Desenvolvimento de integrações customizadas;
    f) Relatórios personalizados complexos.

10.4. Revisão anual de valores:
    a) Reajuste conforme IPCA acumulado;
    b) Renegociação se variação > 20% no parque de instrumentos;
    c) Descontos progressivos para parques maiores.

10.5. Forma de pagamento:
    a) Faturamento até dia 25 do mês anterior;
    b) Vencimento até dia 10 do mês de competência;
    c) Desconto de 5% para pagamento antecipado (anual);
    d) Inadimplência > 15 dias: Suspensão de acesso ao sistema;
    e) Inadimplência > 30 dias: Rescisão automática.
`,
};