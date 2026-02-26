/**
 * CLÁUSULAS ESPECÍFICAS - Consultoria Técnica Metrológica
 * 
 * Cláusulas para serviços de consultoria especializada em metrologia.
 * Base: ISO/IEC 17025, ISO 9001, VIM (Vocabulário Internacional de Metrologia)
 */

export const CLAUSULAS_CONSULTORIA = {
    /**
     * Escopo da Consultoria
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DA CONSULTORIA
1.1. Os serviços de consultoria técnica metrológica compreendem:
    a) Diagnóstico do sistema de gestão metrológica;
    b) Elaboração de planos de calibração e verificação;
    c) Seleção e especificação de instrumentos de medição;
    d) Análise de incerteza e cálculos metrológicos;
    e) Treinamento de equipes técnicas;
    f) Preparação para auditorias e acreditação;
    g) Implementação de procedimentos conforme ISO/IEC 17025;
    h) Otimização de processos de medição.

1.2. Modalidades de consultoria:
    a) DIAGNÓSTICO: Avaliação inicial do estado atual (5-10 dias);
    b) IMPLEMENTAÇÃO: Execução de melhorias identificadas (30-90 dias);
    c) ACOMPANHAMENTO: Suporte contínuo e auditorias internas (mensal);
    d) PROJETO ESPECÍFICO: Demandas pontuais (prazo conforme projeto).

1.3. Entregáveis típicos:
    a) Relatórios técnicos detalhados;
    b) Procedimentos operacionais padrão (POPs);
    c) Planilhas e ferramentas de cálculo;
    d) Apresentações executivas;
    e) Certificados de treinamento;
    f) Planos de ação com cronograma.
`,

    /**
     * Metodologia de Trabalho
     */
    metodologia: () => `
CLÁUSULA ESPECÍFICA 2 - DA METODOLOGIA DE TRABALHO
2.1. FASE 1 - Diagnóstico (Duração: 5-10 dias):
    a) Visita técnica às instalações;
    b) Entrevistas com equipe técnica e gestores;
    c) Análise de documentação existente;
    d) Mapeamento de processos de medição;
    e) Identificação de gaps e não conformidades;
    f) Relatório de diagnóstico com priorização de ações.

2.2. FASE 2 - Planejamento (Duração: 3-5 dias):
    a) Elaboração de plano de trabalho detalhado;
    b) Definição de cronograma e marcos de entrega;
    c) Alocação de recursos necessários;
    d) Aprovação formal do plano pela CONTRATANTE.

2.3. FASE 3 - Implementação (Duração: variável):
    a) Execução das ações planejadas;
    b) Desenvolvimento de documentação técnica;
    c) Treinamento de equipes;
    d) Acompanhamento de implantação;
    e) Ajustes conforme necessário.

2.4. FASE 4 - Validação e Encerramento (Duração: 3-5 dias):
    a) Auditoria interna de verificação;
    b) Validação de procedimentos implementados;
    c) Entrega de documentação final;
    d) Apresentação de resultados;
    e) Emissão de certificado de conclusão.

2.5. Reuniões de acompanhamento:
    a) QUINZENAIS: Durante fase de implementação;
    b) MENSAIS: Durante fase de acompanhamento contínuo;
    c) AD-HOC: Conforme necessidade ou solicitação.
`,

    /**
     * Obrigações da Consultora
     */
    obrigacoesConsultora: () => `
CLÁUSULA ESPECÍFICA 3 - DAS OBRIGAÇÕES DA CONSULTORA
3.1. A CONTRATADA (Consultora) compromete-se a:
    a) Disponibilizar consultores com qualificação comprovada:
       - Formação superior em áreas técnicas;
       - Experiência mínima de 5 anos em metrologia;
       - Certificações relevantes (CRQ, CREA, auditor líder, etc.);
    b) Manter confidencialidade absoluta sobre informações da CONTRATANTE;
    c) Produzir trabalhos técnicos com rigor científico e embasamento normativo;
    d) Cumprir prazos acordados ou comunicar impedimentos com antecedência;
    e) Fornecer suporte pós-consultoria por 90 dias (dúvidas e esclarecimentos).

3.2. Ferramentas e recursos fornecidos:
    a) Templates de documentos metrológicos;
    b) Planilhas de cálculo de incerteza;
    c) Checklists de auditoria;
    d) Material didático para treinamentos;
    e) Acesso a biblioteca técnica de normas (quando aplicável).

3.3. A Consultora NÃO se responsabiliza por:
    a) Aprovação em auditorias externas de terceiros;
    b) Implementação executada incorretamente pela CONTRATANTE;
    c) Mudanças normativas posteriores à conclusão do projeto;
    d) Resultados dependentes exclusivamente da atuação da CONTRATANTE.
`,

    /**
     * Obrigações da Contratante
     */
    obrigacoesContratante: () => `
CLÁUSULA ESPECÍFICA 4 - DAS OBRIGAÇÕES DA CONTRATANTE
4.1. A CONTRATANTE compromete-se a:
    a) Disponibilizar informações completas e precisas;
    b) Prover acesso às instalações, documentos e sistemas;
    c) Designar interlocutor técnico com poder de decisão;
    d) Liberar colaboradores para reuniões e treinamentos;
    e) Implementar recomendações conforme cronograma acordado;
    f) Fornecer feedback sobre os trabalhos em até 5 dias úteis.

4.2. Recursos a serem disponibilizados:
    a) Sala ou espaço para trabalho dos consultores;
    b) Acesso à internet e infraestrutura de TI;
    c) Impressão de documentos quando necessário;
    d) Equipamentos de medição para avaliação (quando aplicável).

4.3. Prazos de resposta:
    a) Dúvidas técnicas: 2 dias úteis;
    b) Aprovação de entregáveis: 5 dias úteis;
    c) Fornecimento de informações solicitadas: 3 dias úteis;
    d) Atraso da CONTRATANTE não prorroga prazo da CONTRATADA.
`,

    /**
     * Entregáveis e Propriedade Intelectual
     */
    entregaveis: () => `
CLÁUSULA ESPECÍFICA 5 - DOS ENTREGÁVEIS E PROPRIEDADE INTELECTUAL
5.1. Entregáveis formais:
    a) Relatórios técnicos em formato PDF e Word editável;
    b) Procedimentos em formato editável (Word/Excel);
    c) Apresentações em PowerPoint;
    d) Planilhas de cálculo com fórmulas desbloqueadas;
    e) Certificados de treinamento nominais.

5.2. Prazos de entrega:
    a) Relatório de diagnóstico: 10 dias após visita;
    b) Plano de trabalho: 5 dias após aprovação do diagnóstico;
    c) Entregáveis intermediários: Conforme cronograma;
    d) Relatório final: 10 dias após conclusão das atividades.

5.3. Propriedade intelectual:
    a) Documentos produzidos especificamente para o projeto: Propriedade da CONTRATANTE;
    b) Templates, metodologias e ferramentas genéricas: Propriedade da CONTRATADA;
    c) A CONTRATANTE pode usar e adaptar documentos internamente;
    d) A CONTRATANTE NÃO pode comercializar ou distribuir externamente;
    e) A CONTRATADA pode usar o projeto como referência (anonimizada).

5.4. Revisões de entregáveis:
    a) 1ª revisão: Incluída no escopo;
    b) 2ª revisão: Incluída se solicitada em até 15 dias;
    c) Revisões adicionais: Cobrança de 20% do valor por revisão.
`,

    /**
     * Treinamentos
     */
    treinamentos: () => `
CLÁUSULA ESPECÍFICA 6 - DOS TREINAMENTOS
6.1. Modalidades de treinamento:
    a) IN-COMPANY: Nas instalações da CONTRATANTE;
    b) EaD: Via plataforma online síncrona (ao vivo);
    c) HÍBRIDO: Combinação de presencial e online;
    d) WORKSHOP: Prático com exercícios e casos reais.

6.2. Treinamentos típicos oferecidos:
    a) Fundamentos de metrologia e gestão metrológica;
    b) Cálculo de incerteza de medição;
    c) Interpretação de certificados de calibração;
    d) Auditor interno ISO/IEC 17025;
    e) Sistema de gestão da qualidade aplicado a laboratórios;
    f) Treinamentos personalizados conforme demanda.

6.3. Estrutura dos treinamentos:
    a) Material didático digital (apostila PDF);
    b) Exercícios práticos e casos;
    c) Certificado de participação (presença ≥ 75%);
    d) Avaliação de aprendizado (opcional);
    e) Gravação disponibilizada por 30 dias (EaD).

6.4. Turmas:
    a) Mínimo: 5 participantes;
    b) Máximo: 20 participantes (presencial) ou 50 (EaD);
    c) Acima do máximo: Turmas adicionais ou cobrança suplementar.
`,

    /**
     * Remuneração e Forma de Cobrança
     */
    remuneracao: () => `
CLÁUSULA ESPECÍFICA 7 - DA REMUNERAÇÃO E FORMA DE COBRANÇA
7.1. Modalidades de cobrança:
    a) PREÇO FECHADO: Valor total acordado independente de horas;
    b) HORA TÉCNICA: R$ [VALOR] por hora de consultoria;
    c) MENSALIDADE: Valor fixo mensal com pacote de horas incluídas;
    d) PROJETO: Preço por projeto específico (diagnóstico, implementação, etc.).

7.2. Composição do valor (projeto):
    a) Horas de consultoria técnica (principal);
    b) Treinamentos inclusos;
    c) Elaboração de documentação;
    d) Deslocamentos e hospedagem (quando aplicável);
    e) Ferramentas e materiais fornecidos.

7.3. Despesas adicionais (quando aplicável):
    a) Viagens superiores a 100 km: Passagens e hospedagem reembolsáveis;
    b) Materiais específicos solicitados: Custo + 15%;
    c) Horas extras além do acordado: Valor da hora técnica;
    d) Treinamentos adicionais: Conforme tabela específica.

7.4. Faturamento:
    a) Projetos curtos (< 30 dias): 50% início + 50% entrega;
    b) Projetos médios (30-90 dias): 30% início + 40% meio + 30% final;
    c) Projetos longos (> 90 dias): Mensalidades conforme avanço;
    d) Mensal: Faturamento até dia 25 do mês anterior.

7.5. Horas não utilizadas:
    a) Pacotes mensais: Expiram ao final do mês (sem acúmulo);
    b) Projetos fechados: Não há reembolso de horas "economizadas";
    c) Horas excedentes: Cobrança extra conforme tabela.
`,

    /**
     * Garantia e Suporte Pós-Projeto
     */
    garantia: () => `
CLÁUSULA ESPECÍFICA 8 - DA GARANTIA E SUPORTE PÓS-PROJETO
8.1. Garantia de qualidade:
    a) Trabalhos realizados conforme melhores práticas metrológicas;
    b) Conformidade com normas técnicas aplicáveis;
    c) Correção de erros técnicos sem custo adicional (90 dias);
    d) Atualização de documentos por mudanças normativas (12 meses, com custo reduzido).

8.2. Suporte pós-implementação (90 dias):
    a) Esclarecimento de dúvidas via e-mail (resposta em 48h);
    b) 1 visita de acompanhamento inclusa (até 4 horas);
    c) Ajustes pontuais em documentos (máx 4 horas);
    d) Suporte telefônico/videochamada (até 2h/mês).

8.3. Suporte estendido (opcional):
    a) Contratação de pacote mensal de horas;
    b) Auditorias internas semestrais;
    c) Atualização contínua de documentação;
    d) Acesso prioritário para novas demandas.

8.4. A garantia NÃO cobre:
    a) Mudanças regulatórias posteriores à entrega;
    b) Alterações na estrutura organizacional da CONTRATANTE;
    c) Implementação incorreta pela CONTRATANTE após entrega;
    d) Novos projetos ou expansões de escopo.
`,

    /**
     * Confidencialidade e Sigilo
     */
    confidencialidade: () => `
CLÁUSULA ESPECÍFICA 9 - DA CONFIDENCIALIDADE E SIGILO
9.1. A CONTRATADA obriga-se a:
    a) Manter sigilo absoluto sobre todas as informações da CONTRATANTE;
    b) Não divulgar dados técnicos, comerciais ou estratégicos;
    c) Não utilizar informações para benefício próprio ou de terceiros;
    d) Assinar Acordo de Confidencialidade (NDA) específico se solicitado.

9.2. Informações confidenciais incluem:
    a) Processos produtivos e métodos de medição;
    b) Resultados de calibração e ensaios;
    c) Estratégias comerciais e de mercado;
    d) Dados de clientes e fornecedores;
    e) Qualquer informação marcada como "confidencial".

9.3. Exceções ao sigilo (divulgação permitida):
    a) Informações já públicas ou de domínio público;
    b) Exigências legais ou judiciais;
    c) Autorização prévia e por escrito da CONTRATANTE;
    d) Informações genéricas para fins de referência profissional (anonimizadas).

9.4. Consultores e subcontratados:
    a) Assinarão termos de confidencialidade individuais;
    b) Limitação de acesso ao "need to know";
    c) CONTRATADA responsável por vazamentos de sua equipe.

9.5. Vigência do sigilo: 5 anos após término do contrato.
`,

    /**
     * Rescisão e Suspensão
     */
    rescisaoConsultoria: () => `
CLÁUSULA ESPECÍFICA 10 - DA RESCISÃO E SUSPENSÃO
10.1. Rescisão por qualquer das partes:
    a) Aviso prévio de 30 dias;
    b) Pagamento proporcional aos serviços executados;
    c) Entrega de todo material produzido até a data;
    d) Devolução de documentos e informações da CONTRATANTE.

10.2. Rescisão imediata (justa causa):
    a) Quebra de confidencialidade;
    b) Negligência grave ou erro técnico doloso;
    c) Inadimplência superior a 30 dias;
    d) Impossibilidade de continuidade por motivos técnicos.

10.3. Penalidades por rescisão antecipada:
    a) Pela CONTRATANTE sem justa causa: 20% do saldo remanescente;
    b) Pela CONTRATADA sem justa causa: Devolução de 50% dos valores recebidos;
    c) Por inadimplência: Sem penalidade adicional para CONTRATADA.

10.4. Suspensão temporária do projeto:
    a) Máximo de 60 dias;
    b) Manutenção de 30% do valor mensal (se aplicável);
    c) Retomada mediante aviso prévio de 15 dias;
    d) Prazos do projeto prorrogados proporcionalmente.
`,
};
