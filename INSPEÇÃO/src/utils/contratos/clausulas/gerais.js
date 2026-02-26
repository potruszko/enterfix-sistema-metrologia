/**
 * CLÁUSULAS GERAIS - Contratos Enterfix
 * 
 * Cláusulas aplicáveis a TODOS os tipos de contrato.
 * 
 * Base legal:
 * - Código Civil Brasileiro (Lei 10.406/2002)
 * - Código de Defesa do Consumidor (Lei 8.078/90)
 * - LGPD (Lei 13.709/2018)
 * - ISO/IEC 17025:2017
 * - Portaria Inmetro 694/2022
 */

/**
 * Foro competente padrão para todos os contratos
 */
export const FORO_COMPETENTE = 'São Bernardo do Campo/SP';

/**
 * Títulos amigáveis para cada tipo de contrato
 */
export const TITULOS_CONTRATOS = {
    prestacao_servico: 'PRESTAÇÃO DE SERVIÇOS DE CALIBRAÇÃO',
    comodato: 'COMODATO DE EQUIPAMENTOS',
    manutencao: 'MANUTENÇÃO DE INSTRUMENTOS',
    sla: 'ACORDO DE NÍVEL DE SERVIÇO (SLA)',
    consultoria: 'CONSULTORIA EM METROLOGIA',
    gestao_parque: 'GESTÃO DE PARQUE DE INSTRUMENTOS',
    suporte: 'SUPORTE TÉCNICO ESPECIALIZADO',
    validacao: 'VALIDAÇÃO DE EQUIPAMENTOS',
    nda: 'ACORDO DE CONFIDENCIALIDADE (NDA)',
};

/**
 * CLÁUSULAS GERAIS
 * Objeto com funções que retornam o texto de cada cláusula
 */
export const CLAUSULAS_GERAIS = {
    /**
     * Cláusula do Objeto do Contrato
     */
    objeto: (tipoServico) => `
CLÁUSULA PRIMEIRA - DO OBJETO
1.1. O presente contrato tem por objeto a ${tipoServico} pela CONTRATADA à CONTRATANTE, nas condições, prazos e especificações técnicas previstas neste instrumento e seus anexos.

1.2. Os serviços serão executados em estrita conformidade com as normas técnicas aplicáveis, especialmente:
    a) ISO/IEC 17025:2017 - Requisitos gerais para competência de laboratórios de ensaio e calibração;
    b) Portaria Inmetro nº 694/2022 - Regulamento Técnico Metrológico;
    c) Vocabulário Internacional de Metrologia (VIM);
    d) Normas específicas dos equipamentos e grandezas calibradas.

1.3. A CONTRATADA garante que possui estrutura técnica, equipamentos e profissionais qualificados para a execução dos serviços contratados.
`,

    /**
     * Cláusula de Vigência
     */
    vigencia: (dataInicio, dataFim, prazoIndeterminado) => `
CLÁUSULA SEGUNDA - DA VIGÊNCIA
2.1. O presente contrato terá vigência de ${dataInicio} até ${prazoIndeterminado ? 'prazo indeterminado' : dataFim}, podendo ser prorrogado mediante acordo entre as partes, formalizado por termo aditivo.

2.2. ${prazoIndeterminado ? 
    'Por ser de prazo indeterminado, qualquer das partes poderá rescindir o contrato mediante notificação prévia de 30 (trinta) dias.' : 
    'O contrato poderá ser renovado automaticamente por períodos iguais e sucessivos, salvo manifestação em contrário de qualquer das partes com antecedência mínima de 30 (trinta) dias do término da vigência.'}

2.3. O término da vigência não exime as partes do cumprimento das obrigações vencidas durante a vigência do contrato.
`,

    /**
     * Cláusula de Preço e Condições de Pagamento
     */
    pagamento: (valorTotal, formaPagamento, condicoesPagamento) => `
CLÁUSULA TERCEIRA - DO PREÇO E CONDIÇÕES DE PAGAMENTO
3.1. Pelos serviços objeto deste contrato, a CONTRATANTE pagará à CONTRATADA o valor ${valorTotal ? `total de ${valorTotal}` : 'conforme proposta comercial anexa'}.

3.2. Forma de pagamento: ${formaPagamento || 'conforme acordado entre as partes'}.

3.3. ${condicoesPagamento || 'O pagamento será efetuado mediante apresentação de nota fiscal, em até 30 (trinta) dias após a prestação dos serviços.'}</ 3.4. Os valores serão reajustados anualmente pelo IPCA/IBGE ou outro índice que venha a substituí-lo, na data de aniversário do contrato.

3.5. O atraso no pagamento ensejará a incidência de multa de 2% (dois por cento) sobre o valor devido, acrescida de juros de mora de 1% (um por cento) ao mês, calculados pro rata die.
`,

    /**
     * Cláusula de Obrigações da Contratada
     */
    obrigacoesContratada: () => `
CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA
4.1. A CONTRATADA obriga-se a:
    a) Executar os serviços com zelo, diligência e em conformidade com as normas técnicas aplicáveis;
    b) Manter rastreabilidade dos padrões de medição à Rede Brasileira de Calibração (RBC);
    c) Emitir certificados de calibração com identificação única, resultados de medição e incerteza associada;
    d) Manter atualizados os procedimentos técnicos e registros da qualidade;
    e) Garantir a confidencialidade das informações da CONTRATANTE;
    f) Comunicar imediatamente qualquer impossibilidade ou limitação técnica na execução dos serviços;
    g) Manter seguro de responsabilidade civil profissional durante toda a vigência do contrato;
    h) Respeitar as normas de segurança e conduta nas dependências da CONTRATANTE, quando aplicável.

4.2. A CONTRATADA responde civilmente pelos danos causados por culpa ou dolo de seus empregados, prepostos ou contratados na execução dos serviços.
`,

    /**
     * Cláusula de Obrigações da Contratante
     */
    obrigacoesContratante: () => `
CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATANTE
5.1. A CONTRATANTE obriga-se a:
    a) Efetuar os pagamentos nas condições e prazos estabelecidos neste contrato;
    b) Fornecer informações técnicas necessárias para a execução dos serviços;
    c) Disponibilizar os equipamentos para calibração nas condições acordadas;
    d) Comunicar previamente qualquer alteração na demanda ou especificações técnicas;
    e) Prestar esclarecimentos e informações solicitadas pela CONTRATADA para execução dos serviços;
    f) Notificar formalmente qualquer não conformidade nos serviços prestados, no prazo de 10 (dez) dias úteis após o recebimento.

5.2. A CONTRATANTE é responsável pela guarda, transporte e seguro dos equipamentos, quando estes estiverem sob sua custódia.
`,

    /**
     * Cláusula de Confidencialidade e LGPD
     */
    confidencialidade: () => `
CLÁUSULA SEXTA - DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS
6.1. As partes comprometem-se a manter sigilo absoluto sobre todas as informações técnicas, comerciais, operacionais e estratégicas que vierem a ter conhecimento em decorrência deste contrato.

6.2. A obrigação de confidencialidade permanece válida por 5 (cinco) anos após o término do contrato, independentemente do motivo da rescisão.

6.3. Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018 - LGPD):
    a) As partes tratarão dados pessoais apenas para as finalidades previstas neste contrato;
    b) Serão adotadas medidas técnicas e administrativas de segurança da informação;
    c) O titular dos dados pode exercer seus direitos (acesso, correção, eliminação) mediante solicitação formal;
    d) Eventual vazamento ou incidente de segurança será comunicado em até 72 (setenta e duas) horas;
    e) Ao término do contrato, os dados pessoais serão eliminados ou devolvidos, exceto quando houver obrigação legal de retenção.

6.4. A violação da confidencialidade sujeitará a parte infratora ao pagamento de indenização por perdas e danos, sem prejuízo de outras sanções legais.
`,

    /**
     * Cláusula de Garantias e Responsabilidades
     */
    garantias: () => `
CLÁUSULA SÉTIMA - DAS GARANTIAS E RESPONSABILIDADES
7.1. A CONTRATADA garante a exatidão técnica e rastreabilidade dos serviços prestados, em conformidade com os requisitos da ISO/IEC 17025:2017.

7.2. Em caso de erro ou não conformidade nos serviços, a CONTRATADA compromete-se a:
    a) Refazer o serviço sem ônus adicional, no prazo de 10 (dez) dias úteis;
    b) Emitir novo certificado corrigido, cancelando o anterior;
    c) Comunicar formalmente todos os clientes que possam ter sido afetados.

7.3. A responsabilidade da CONTRATADA está limitada ao valor dos serviços prestados, exceto em casos de dolo ou culpa grave.

7.4. A CONTRATADA não se responsabiliza por:
    a) Danos pré-existentes nos equipamentos recebidos para calibração;
    b) Inadequação do equipamento para a aplicação pretendida pela CONTRATANTE;
    c) Eventos de força maior ou caso fortuito que impeçam a execução dos serviços.
`,

    /**
     * Cláusula de Rescisão
     */
    rescisao: () => `
CLÁUSULA OITAVA - DA RESCISÃO
8.1. O presente contrato poderá ser rescindido nas seguintes hipóteses:
    a) Por acordo mútuo entre as partes, mediante termo de distrato;
    b) Unilateralmente, por qualquer das partes, mediante notificação prévia de 30 (trinta) dias;
    c) Imediatamente, por justa causa, em caso de descumprimento de cláusula contratual essencial.

8.2. Consideram-se motivos para rescisão por justa causa:
    a) Inadimplência superior a 30 (trinta) dias;
    b) Violação de confidencialidade;
    c) Prestação de serviços com grave não conformidade técnica;
    d) Falência, recuperação judicial ou extinção de qualquer das partes;
    e) Prática de atos que comprometam a reputação ou a execução do contrato.

8.3. A rescisão não exime as partes do cumprimento das obrigações vencidas até a data da rescisão, nem do pagamento de multa rescisória, quando aplicável.

8.4. Na rescisão unilateral sem justa causa, a parte denunciante pagará à outra multa correspondente a 10% (dez por cento) do valor remanescente do contrato, limitada a 3 (três) parcelas mensais.
`,

    /**
     * Cláusula de Propriedade Intelectual
     */
    propriedadeIntelectual: () => `
CLÁUSULA NONA - DA PROPRIEDADE INTELECTUAL
9.1. Todos os certificados, relatórios, procedimentos e documentos técnicos produzidos pela CONTRATADA permanecem de sua propriedade intelectual.

9.2. A CONTRATANTE é autorizada a utilizar os certificados emitidos exclusivamente para:
    a) Comprovação de conformidade metrológica perante órgãos reguladores;
    b) Auditores de sistemas de gestão da qualidade;
    c) Atendimento a requisitos de clientes e partes interessadas.

9.3. É vedada a reprodução, alteração ou distribuição não autorizada dos documentos técnicos emitidos pela CONTRATADA.

9.4. Qualquer desenvolvimento ou inovação técnica conjunta terá sua titularidade e exploração definidas em instrumento específico.
`,

    /**
     * Cláusula de Disposições Gerais
     */
    disposicoesGerais: (foroCompetente) => `
CLÁUSULA DÉCIMA - DAS DISPOSIÇÕES GERAIS
10.1. Este contrato representa o acordo integral entre as partes, substituindo quaisquer entendimentos, propostas ou contratos anteriores, verbais ou escritos.

10.2. Qualquer alteração, aditamento ou modificação deste contrato deverá ser formalizada por escrito e assinada por ambas as partes.

10.3. A tolerância de uma parte quanto ao descumprimento de qualquer cláusula não constituirá novação ou renúncia de direitos, podendo ser exigido o cumprimento a qualquer tempo.

10.4. Se qualquer disposição deste contrato for considerada inválida ou inexequível, as demais cláusulas permanecerão em pleno vigor e efeito.

10.5. As notificações entre as partes deverão ser feitas por escrito, mediante:
    a) Carta registrada com aviso de recebimento;
    b) E-mail com confirmação de leitura;
    c) Correio eletrônico para os endereços indicados no preâmbulo.

10.6. As partes elegem o foro da comarca de ${foroCompetente} para dirimir quaisquer controvérsias oriundas deste contrato, renunciando a qualquer outro, por mais privilegiado que seja.
`,
};
