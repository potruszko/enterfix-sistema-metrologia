/**
 * CLÁUSULAS CONTRATUAIS PADRÃO - ENTERFIX METROLOGIA
 * 
 * Base legal:
 * - Código Civil Brasileiro (Lei 10.406/2002)
 * - Código de Defesa do Consumidor (Lei 8.078/90)
 * - LGPD (Lei 13.709/2018)
 * - ISO/IEC 17025:2017
 * - Portaria Inmetro 694/2022
 * 
 * IMPORTANTE: Este arquivo contém cláusulas base que devem ser revisadas
 * por um advogado especializado antes do uso em produção.
 */

// Dados da empresa (centralizado para fácil manutenção)
export const DADOS_ENTERFIX = {
  razaoSocial: 'ENTERFIX METROLOGIA LTDA',
  cnpj: '00.000.000/0001-00', // ATUALIZAR COM CNPJ REAL
  endereco: 'Rua Exemplo, 123, Centro',
  cidade: 'Caxias do Sul',
  estado: 'RS',
  cep: '95000-000',
  telefone: '(54) 0000-0000',
  email: 'contato@enterfix.com.br',
  website: 'www.enterfix.com.br',
  inscricaoEstadual: '000.0000000',
  acreditacaoInmetro: 'RBC-XXXX', // Número da acreditação RBC se houver
};

// Foro competente padrão
export const FORO_COMPETENTE = 'Caxias do Sul/RS';

/**
 * CLÁUSULAS GERAIS - Aplicáveis a todos os contratos
 */
export const CLAUSULAS_GERAIS = {
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

  vigencia: (dataInicio, dataFim, prazoIndeterminado) => `
CLÁUSULA SEGUNDA - DA VIGÊNCIA
2.1. O presente contrato terá vigência de ${dataInicio} ${prazoIndeterminado ? 'por prazo indeterminado' : `até ${dataFim}`}, podendo ser prorrogado mediante aditivo, desde que haja interesse mútuo das partes.

2.2. ${prazoIndeterminado ? 
  'Qualquer das partes poderá rescindir o contrato mediante notificação prévia de 30 (trinta) dias, sem ônus ou penalidades.' :
  'O prazo contratual poderá ser prorrogado mediante solicitação por escrito, com antecedência mínima de 30 (trinta) dias do término da vigência.'
}

2.3. A não manifestação das partes quanto à prorrogação implicará no encerramento automático do contrato ao final do prazo estipulado.
  `,

  valorPagamento: (valorTotal, valorMensal, formaPagamento) => `
CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO
3.1. Pelos serviços ora contratados, a CONTRATANTE pagará à CONTRATADA o valor ${valorMensal ? `mensal de R$ ${valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, totalizando` : 'total de'} R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${extenso(valorTotal)}).

3.2. O pagamento será efetuado mediante ${formaPagamento || 'condições a definir'}, após a emissão da Nota Fiscal de Serviços pela CONTRATADA.

3.3. Os valores poderão ser reajustados anualmente pelo IPCA/IBGE ou índice que vier a substituí-lo, mediante acordo entre as partes.

3.4. O atraso no pagamento superior a 15 (quinze) dias sujeitará a CONTRATANTE:
    a) À multa de 2% (dois por cento) sobre o valor em atraso;
    b) Aos juros de mora de 1% (um por cento) ao mês, pro rata die;
    c) À atualização monetária pelo IPCA/IBGE;
    d) À suspensão dos serviços até a regularização do débito.

3.5. A CONTRATADA emitirá Nota Fiscal de Serviços em conformidade com a legislação tributária vigente.
  `,

  obrigacoesContratada: () => `
CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA
4.1. Executar os serviços com qualidade, pontualidade e em conformidade com as normas técnicas aplicáveis.

4.2. Disponibilizar profissionais qualificados e capacitados para a execução dos serviços.

4.3. Manter os equipamentos padrão devidamente calibrados e rastreados à Rede Brasileira de Calibração (RBC) ou equivalente internacional.

4.4. Emitir certificados de calibração contendo todas as informações exigidas pela ISO/IEC 17025 e Portaria Inmetro 694/2022.

4.5. Manter sigilo absoluto sobre todas as informações da CONTRATANTE obtidas durante a execução dos serviços.

4.6. Informar imediatamente à CONTRATANTE qualquer não conformidade ou limitação técnica encontrada durante a execução dos serviços.

4.7. Manter registro atualizado de todos os serviços executados, conforme requisitos de rastreabilidade metrológica.

4.8. Responder por danos causados aos equipamentos da CONTRATANTE durante a execução dos serviços, quando comprovada culpa ou negligência.

4.9. Cumprir toda a legislação trabalhista, previdenciária e tributária referente aos seus empregados, eximindo a CONTRATANTE de qualquer responsabilidade solidária ou subsidiária.

4.10. Manter apólice de seguro de responsabilidade civil profissional em valor compatível com os serviços prestados.
  `,

  obrigacoesContratante: () => `
CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATANTE
5.1. Efetuar o pagamento nos prazos e condições estabelecidos neste contrato.

5.2. Disponibilizar os equipamentos para calibração/manutenção em condições adequadas de limpeza, segurança e acesso.

5.3. Fornecer todas as informações técnicas necessárias sobre os equipamentos, incluindo manuais, históricos e especificações.

5.4. Designar responsável técnico para acompanhamento dos serviços e aprovação de procedimentos.

5.5. Comunicar à CONTRATADA, com antecedência mínima de 48 (quarenta e oito) horas, qualquer alteração de cronograma ou necessidade de serviços adicionais.

5.6. Manter ambiente adequado para execução dos serviços in loco, quando aplicável, incluindo condições ambientais conforme especificações técnicas.

5.7. Informar à CONTRATADA sobre riscos específicos do ambiente de trabalho, fornecendo os EPIs necessários quando aplicável.

5.8. Utilizar os certificados de calibração exclusivamente para fins técnicos e metrológicos, não os alterando ou reproduzindo sem autorização.
  `,

  limitacaoResponsabilidade: () => `
CLÁUSULA SEXTA - DA LIMITAÇÃO DE RESPONSABILIDADE
6.1. A CONTRATADA responde pelos serviços executados nos limites das incertezas de medição declaradas nos certificados, em conformidade com as normas técnicas aplicáveis.

6.2. A responsabilidade da CONTRATADA está limitada aos danos diretos comprovadamente causados por sua culpa ou negligência, até o limite do valor anual do contrato.

6.3. A CONTRATADA não se responsabiliza por:
    a) Danos decorrentes do uso inadequado dos equipamentos pela CONTRATANTE;
    b) Perdas ou lucros cessantes da CONTRATANTE;
    c) Defeitos ou limitações inerentes aos equipamentos calibrados;
    d) Decisões técnicas ou comerciais tomadas pela CONTRATANTE com base nos certificados emitidos;
    e) Danos causados por caso fortuito ou força maior.

6.4. Os certificados de calibração não constituem laudo de aprovação ou reprovação dos equipamentos, servindo exclusivamente para comprovação metrológica.

6.5. A CONTRATANTE é responsável por determinar os critérios de aceitação dos equipamentos com base nas tolerâncias dos processos onde são utilizados.
  `,

  confidencialidade: () => `
CLÁUSULA SÉTIMA - DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS
7.1. As partes obrigam-se a manter sigilo sobre todas as informações confidenciais obtidas em decorrência deste contrato.

7.2. Consideram-se informações confidenciais:
    a) Dados técnicos dos equipamentos e processos;
    b) Resultados de calibrações e medições;
    c) Informações comerciais e estratégicas;
    d) Documentos, relatórios e registros técnicos;
    e) Dados pessoais de funcionários e colaboradores.

7.3. O dever de confidencialidade permanecerá válido por 5 (cinco) anos após o término do contrato.

7.4. As partes comprometem-se a observar a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) no tratamento de dados pessoais.

7.5. A CONTRATADA atuará como operadora de dados pessoais, tratando-os exclusivamente conforme instruções da CONTRATANTE (controladora).

7.6. Cada parte responderá individualmente por violações à LGPD sob sua responsabilidade, sem solidariedade.

7.7. Em caso de incidente de segurança envolvendo dados pessoais, a parte responsável deverá comunicar imediatamente a outra parte e à ANPD, quando aplicável.
  `,

  garantia: (periodoGarantia = '90 dias') => `
CLÁUSULA OITAVA - DA GARANTIA
8.1. A CONTRATADA garante a qualidade dos serviços prestados pelo período de ${periodoGarantia} a partir da emissão do certificado.

8.2. A garantia cobre:
    a) Correção de erros nos certificados de calibração;
    b) Refazer serviços executados inadequadamente;
    c) Atendimento a dúvidas técnicas sobre os resultados apresentados.

8.3. A garantia não cobre:
    a) Alterações nas características dos equipamentos após a calibração;
    b) Danos causados por manuseio inadequado;
    c) Desgaste natural dos equipamentos;
    d) Modificações ou ajustes realizados por terceiros.

8.4. Para acionamento da garantia, a CONTRATANTE deverá comunicar por escrito no prazo máximo de 15 (quinze) dias após a identificação do problema.
  `,

  rescisao: () => `
CLÁUSULA NONA - DA RESCISÃO
9.1. O presente contrato poderá ser rescindido nas seguintes hipóteses:

9.2. RESCISÃO IMOTIVADA:
    a) Por qualquer das partes, mediante notificação prévia de 30 (trinta) dias;
    b) Sem aplicação de multas ou penalidades;
    c) Com liquidação dos serviços já executados até a data da rescisão.

9.3. RESCISÃO MOTIVADA (com justa causa):
    a) Inadimplemento de obrigações contratuais;
    b) Falência, recuperação judicial ou insolvência civil de qualquer das partes;
    c) Descumprimento de normas técnicas ou requisitos regulatórios;
    d) Violação de confidencialidade;
    e) Caso fortuito ou força maior que impossibilite a continuidade do contrato.

9.4. Na rescisão motivada por culpa da CONTRATANTE:
    a) Multa de 10% sobre o valor remanescente do contrato;
    b) Pagamento integral pelos serviços já executados;
    c) Ressarcimento de despesas incorridas.

9.5. Na rescisão motivada por culpa da CONTRATADA:
    a) Multa de 10% sobre o valor remanescente do contrato;
    b) Devolução de valores recebidos por serviços não executados;
    c) Indenização por perdas e danos comprovados.

9.6. Em caso de rescisão, a CONTRATADA deverá entregar à CONTRATANTE todos os documentos, registros e materiais relacionados aos serviços, no prazo de 10 (dez) dias.
  `,

  disposicoesGerais: () => `
CLÁUSULA DÉCIMA - DAS DISPOSIÇÕES GERAIS
10.1. Este contrato é regido pelas leis da República Federativa do Brasil.

10.2. Qualquer alteração deste contrato somente será válida se formalizada por meio de termo aditivo assinado por ambas as partes.

10.3. A tolerância de qualquer das partes quanto ao descumprimento de cláusulas não constituirá novação ou renúncia de direitos.

10.4. As comunicações entre as partes serão realizadas por escrito (e-mail ou carta registrada) nos endereços constantes no preâmbulo do contrato.

10.5. As partes declaram estar cientes das normas técnicas e regulamentares aplicáveis aos serviços contratados.

10.6. Este contrato vincula as partes e seus sucessores a qualquer título.

10.7. A invalidade ou ineficácia de qualquer cláusula não prejudicará a validade e eficácia das demais.

10.8. Os casos omissos serão resolvidos de comum acordo entre as partes ou, na impossibilidade, conforme legislação aplicável.

10.9. Fica eleito o Foro da Comarca de ${FORO_COMPETENTE} para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
  `,
};

/**
 * CLÁUSULAS ESPECÍFICAS POR TIPO DE CONTRATO
 */
export const CLAUSULAS_ESPECIFICAS = {
  prestacao_servico: (dados) => `
CLÁUSULA ESPECIAL - PRESTAÇÃO DE SERVIÇOS DE CALIBRAÇÃO
A. DOS SERVIÇOS:
A.1. Os serviços de calibração incluem:
    - Recebimento, identificação e inspeção visual dos equipamentos;
    - Execução das calibrações conforme procedimentos acreditados;
    - Emissão de certificado de calibração rastreado ao SI;
    - Aplicação de etiquetas de identificação (quando aplicável);
    - Orientações técnicas sobre resultados e interpretação.

A.2. Escopo dos serviços: ${dados.escopo_servicos || 'conforme anexo técnico'}

A.3. Periodicidade: ${dados.periodicidade || 'conforme demanda'}

A.4. Local de execução: ${dados.local_execucao || 'Laboratório da CONTRATADA ou in loco'}

B. DOS PRAZOS:
B.1. Prazo padrão de execução: ${dados.prazo_execucao || '10 dias úteis'} após recebimento do equipamento.

B.2. Prazos expressos poderão ser negociados, sujeitando-se a acréscimo no valor.

C. DO TRANSPORTE:
C.1. O transporte dos equipamentos é de responsabilidade da ${dados.responsavel_transporte || 'CONTRATANTE'}.

C.2. A CONTRATADA deverá embalar adequadamente os equipamentos para devolução, sem responsabilidade por danos durante transporte de terceiros.

D. RASTREABILIDADE:
D.1. Todos os padrões utilizados são rastreados à Rede Brasileira de Calibração (RBC), conforme ISO/IEC 17025.

D.2. Os certificados de calibração dos padrões estarão disponíveis para consulta mediante solicitação.
  `,

  comodato: (dados) => `
CLÁUSULA ESPECIAL - COMODATO DE EQUIPAMENTOS
A. DOS EQUIPAMENTOS:
A.1. Equipamentos em comodato: ${dados.equipamentos || 'conforme relação anexa'}

A.2. Valor estimado dos equipamentos: R$ ${(dados.valor_equipamentos || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

A.3. Os equipamentos permanecem em propriedade da COMODANTE (CONTRATADA), sendo cedidos em empréstimo gratuito.

B. DAS CONDIÇÕES DE USO:
B.1. A COMODATÁRIA (CONTRATANTE) obriga-se a:
    - Utilizar os equipamentos exclusivamente para os fins contratados;
    - Manter os equipamentos em bom estado de conservação;
    - Não emprestar, alugar ou ceder os equipamentos a terceiros;
    - Arcar com custos de manutenção preventiva conforme manual do fabricante;
    - Manter seguro contra danos, furto e roubo.

B.2. Responsável pela manutenção: ${dados.responsavel_manutencao || 'CONTRATANTE'}

C. DA DEVOLUÇÃO:
C.1. Os equipamentos deverão ser devolvidos ao término do contrato em perfeitas condições de uso, ressalvado desgaste natural.

C.2. Equipamentos danificados ou perdidos serão cobrados pelo valor de mercado atualizado.

C.3. A COMODATÁRIA responde por danos causados aos equipamentos por uso inadequado, negligência ou imperícia.
  `,

  manutencao: (dados) => `
CLÁUSULA ESPECIAL - CONTRATO DE MANUTENÇÃO
A. ESCOPO DA MANUTENÇÃO:
A.1. Tipo de manutenção: ${dados.tipo_manutencao || 'Preventiva e Corretiva'}

A.2. Equipamentos cobertos: ${dados.equipamentos_cobertos || 'conforme relação anexa'}

B. MANUTENÇÃO PREVENTIVA:
B.1. Periodicidade: ${dados.periodicidade_preventiva || 'Conforme cronograma'}

B.2. Atividades incluídas:
    - Inspeção visual e funcional;
    - Limpeza e lubrificação;
    - Verificação dimensional;
    - Ajustes e regulagens;
    - Substituição de peças de desgaste (conforme anexo);
    - Relatório técnico de manutenção.

B.3. A manutenção preventiva será agendada com antecedência mínima de 7 (sete) dias.

C. MANUTENÇÃO CORRETIVA:
C.1. Chamados inclusos no contrato: ${dados.chamados_inclusos || 'Ilimitados'} por período.

C.2. Tempo de resposta: ${dados.tempo_resposta || '24 horas úteis'}

C.3. Peças de reposição:
    - Peças de desgaste normal: incluídas no contrato
    - Peças por dano acidental: cotação adicional
    - Peças descontinuadas: substituição por similares equivalentes

D. EXCLUSÕES:
D.1. Não estão cobertas:
    - Danos causados por uso inadequado, negligência ou imperícia;
    - Má utilização contrária ao manual do fabricante;
    - Acidentes, quedas ou choques mecânicos;
    - Danos elétricos por variação de tensão;
    - Serviços realizados por terceiros não autorizados;
    - Casos de força maior.
  `,

  sla: (dados) => `
CLÁUSULA ESPECIAL - ACORDO DE NÍVEL DE SERVIÇO (SLA)
A. NÍVEIS DE SERVIÇO GARANTIDOS:
A.1. Tempo de Resposta: ${dados.tempo_resposta_horas || '4'} horas
    - Definição: Confirmação de recebimento e início do atendimento ao chamado
    - Contabilização: Horário comercial (segunda a sexta, 8h às 18h)

A.2. Tempo de Resolução: ${dados.tempo_resolucao_horas || '24'} horas
    - Definição: Conclusão do serviço ou fornecimento de solução de contorno
    - Contabilização: Horário comercial (segunda a sexta, 8h às 18h)

A.3. Disponibilidade Garantida: ${dados.disponibilidade_percentual || '99'}%
    - Base de cálculo: Mensal
    - Paradas programadas: Excluídas do cálculo (mediante aviso prévio de 48h)

B. CLASSIFICAÇÃO DE CHAMADOS:
B.1. CRÍTICO (Prioridade 1):
    - Resposta: 2 horas
    - Resolução: 8 horas
    - Definição: Parada total de produção

B.2. ALTO (Prioridade 2):
    - Resposta: 4 horas
    - Resolução: 24 horas
    - Definição: Impacto significativo na operação

B.3. MÉDIO (Prioridade 3):
    - Resposta: 8 horas
    - Resolução: 48 horas
    - Definição: Impacto moderado, há alternativa

B.4. BAIXO (Prioridade 4):
    - Resposta: 24 horas
    - Resolução: 5 dias úteis
    - Definição: Impacto mínimo, não urgente

C. MATRIZ DE ESCALAÇÃO:
${dados.niveis_escalacao || `
Nível 1: Suporte Técnico (0-4h)
Nível 2: Coordenação Técnica (4-8h)
Nível 3: Gerência Técnica (8-24h)
Nível 4: Diretoria Técnica (24h+)
`}

D. PENALIDADES POR DESCUMPRIMENTO:
D.1. Por violação do SLA, a CONTRATADA concederá:
    - 1ª ocorrência no mês: Desconto de 5% no valor mensal
    - 2ª ocorrência no mês: Desconto de 10% no valor mensal
    - 3ª ocorrência no mês: Desconto de 20% no valor mensal + direito de rescisão

D.2. Penalidades específicas: ${dados.penalidades || 'Conforme item D.1'}

E. EXCLUSÕES DO SLA:
E.1. Os SLAs não se aplicam em casos de:
    - Força maior ou caso fortuito;
    - Indisponibilidade de acesso aos equipamentos pela CONTRATANTE;
    - Problemas causados por terceiros não autorizados;
    - Manutenções preventivas agendadas;
    - Ações ou omissões da CONTRATANTE.

F. RELATÓRIOS:
F.1. Relatórios mensais de desempenho serão fornecidos, incluindo:
    - Quantidade de chamados por prioridade;
    - Tempo médio de resposta e resolução;
    - Percentual de disponibilidade alcançado;
    - Incidentes críticos e ações corretivas.
  `,

  consultoria: (dados) => `
CLÁUSULA ESPECIAL - CONSULTORIA EM METROLOGIA
A. OBJETIVOS DO PROJETO:
${dados.objetivos || 'Conforme definido em proposta técnica'}

B. HORAS CONTRATADAS:
B.1. Banco de horas: ${dados.horas_contratadas || '40'} horas
B.2. Valor da hora técnica: R$ ${(dados.valor_hora || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
B.3. Validade do banco de horas: Vigência do contrato
B.4. Horas excedentes: Mediante aprovação prévia e aditivo contratual

C. ALOCAÇÃO DE PROFISSIONAIS:
C.1. Consultores especializados serão alocados conforme demanda e especialização técnica.
C.2. Currículo dos consultores estará disponível mediante solicitação.

D. LOCAL DE EXECUÇÃO:
D.1. Serviços remotos: Videoconferência, e-mail, telefone
D.2. Serviços presenciais: Instalações da CONTRATANTE
D.3. Despesas de deslocamento: ${dados.despesas_incluidas ? 'Incluídas no valor' : 'Por conta da CONTRATANTE'}

E. ENTREGÁVEIS:
${dados.entregaveis || `
- Relatório de diagnóstico;
- Plano de ação e cronograma;
- Procedimentos técnicos;
- Treinamento de equipe;
- Relatório final do projeto.
`}

F. PROPRIEDADE INTELECTUAL:
F.1. Conhecimentos pré-existentes: Permanecem com seus titulares originais
F.2. Conhecimentos desenvolvidos no projeto: Propriedade da CONTRATANTE
F.3. Metodologias gerais: Permanecem com a CONTRATADA
F.4. Direito de uso: CONTRATANTE possui direito perpétuo de uso dos entregáveis

G. RESPONSABILIDADES:
G.1. A CONSULTORIA não se responsabiliza por:
    - Decisões gerenciais ou estratégicas da CONTRATANTE;
    - Implementação deficiente das recomendações;
    - Resultados financeiros futuros;
    - Ações de terceiros ou órgãos reguladores.
  `,

  gestao_parque: (dados) => `
CLÁUSULA ESPECIAL - GESTÃO DE PARQUE DE INSTRUMENTOS
A. ESCOPO DA GESTÃO:
A.1. Quantidade estimada de instrumentos: ${dados.quantidade_instrumentos || 'Conforme levantamento inicial'}

A.2. Software de gestão: ${dados.software_gestao || 'Sistema Enterfix'}

B. SERVIÇOS INCLUSOS:
${dados.servicos_inclusos?.map(s => `    - ${s}`).join('\n') || `
    - Cadastro completo de instrumentos;
    - Plano de calibração anualizado;
    - Agendamento automático de calibrações;
    - Controle de vencimentos com alertas;
    - Rastreabilidade metrológica;
    - Relatórios gerenciais (mensais);
    - Indicadores de desempenho (KPIs);
    - Histórico completo de intervenções;
    - Suporte técnico ao sistema.
`}

C. IMPLANTAÇÃO:
C.1. Fase 1 - Levantamento (${dados.prazo_levantamento || '15 dias'}):
    - Inventário físico dos instrumentos;
    - Coleta de dados técnicos;
    - Análise de criticidade.

C.2. Fase 2 - Cadastro (${dados.prazo_cadastro || '30 dias'}):
    - Cadastro no sistema;
    - Definição de periodicidades;
    - Configuração de alertas.

C.3. Fase 3 - Operação (datas definidas):
    - Início das calibrações programadas;
    - Emissão de relatórios;
    - Reuniões de acompanhamento.

D. INDICADORES (KPIs):
D.1. Indicadores mínimos mensais:
    - Taxa de calibrações em dia (meta: >95%);
    - Taxa de aprovação de instrumentos (>85%);
    - Tempo médio de atendimento;
    - Custo médio por instrumento;
    - Instrumentos críticos vencidos (meta: 0).

E. REUNIÕES:
E.1. Reuniões mensais de acompanhamento para apresentação de indicadores e ajustes no plano.

F. RESPONSABILIDADES DA CONTRATANTE:
F.1. Designar responsável técnico pela gestão;
F.2. Informar inclusões/exclusões de instrumentos;
F.3. Disponibilizar instrumentos conforme cronograma;
F.4. Aprovar planos e procedimentos propostos.
  `,

  suporte: (dados) => `
CLÁUSULA ESPECIAL - SUPORTE TÉCNICO
A. NÍVEL DE SUPORTE: ${dados.nivel_suporte || 'Básico (horário comercial)'}

B. HORÁRIO DE ATENDIMENTO:
${dados.nivel_suporte === 'avancado' ? 
  'B.1. 24 horas por dia, 7 dias por semana (24x7)' :
  dados.nivel_suporte === 'intermediario' ?
  'B.1. Segunda a sexta, 8h às 18h (8x5)' :
  'B.1. Segunda a sexta, horário comercial (8h às 17h)'
}

C. CANAIS DE ATENDIMENTO:
${dados.canais_atendimento || `
    - E-mail: suporte@enterfix.com.br
    - Telefone: (54) 0000-0000
    - WhatsApp: (54) 00000-0000
    - Portal Web: suporte.enterfix.com.br
`}

D. ESCOPO DO SUPORTE:
${dados.escopo_suporte || `
    - Dúvidas técnicas sobre equipamentos;
    - Orientações de uso e operação;
    - Interpretação de certificados;
    - Diagnóstico remoto de problemas;
    - Suporte à documentação metrológica;
    - Orientações sobre normas e regulamentos.
`}

E. EXCLUSÕES:
E.1. Não fazem parte do suporte:
    - Treinamento formal de equipes;
    - Consultoria estratégica ou gerencial;
    - Desenvolvimento de procedimentos customizados;
    - Serviços de calibração ou manutenção (contratar separadamente);
    - Suporte a software/hardware de terceiros.

F. PRIORIZAÇÃO:
F.1. Atendimentos seguem ordem de chegada, exceto emergências técnicas.
F.2. Clientes sob contrato de manutenção têm prioridade.
  `,

  validacao: (dados) => `
CLÁUSULA ESPECIAL - VALIDAÇÃO DE EQUIPAMENTOS/PROCESSOS
A. OBJETO DA VALIDAÇÃO:
A.1. Item a validar: ${dados.item_validacao || 'Conforme anexo técnico'}

A.2. Normas aplicáveis: ${dados.normas_aplicaveis || 'ISO/IEC 17025, RDC 301/2019, USP, EP'}

B. FASES DA VALIDAÇÃO:
${dados.fases_validacao?.map(fase => `    ✓ ${fase}`).join('\n') || `
    ✓ DQ - Qualificação de Projeto (Design Qualification)
    ✓ IQ - Qualificação de Instalação (Installation Qualification)
    ✓ OQ - Qualificação Operacional (Operational Qualification)
    ✓ PQ - Qualificação de Performance (Performance Qualification)
`}

C. ENTREGÁVEIS:
C.1. Protocolo de Validação aprovado pela CONTRATANTE antes da execução

C.2. Relatórios de execução de cada fase:
    - Procedimentos e métodos utilizados;
    - Resultados obtidos e análises;
    - Não conformidades identificadas (se houver);
    - Conclusões e recomendações;
    - Certificado de Validação (ao final).

D. CRITÉRIOS DE ACEITAÇÃO:
D.1. Critérios serão definidos em protocolo específico, baseados em:
    - Especificações do fabricante;
    - Requisitos regulatórios aplicáveis;
    - Necessidades do processo produtivo da CONTRATANTE.

E. REVALIDAÇÃO:
E.1. Periodicidade: ${dados.periodicidade_revalidacao || 'Anual ou conforme criticidade'}
E.2. Gatilhos para revalidação extraordinária:
    - Mudança de localização do equipamento;
    - Manutenção corretiva significativa;
    - Alteração de processo crítico;
    - Desvios de qualidade relacionados ao equipamento;
    - Exigência de órgãos reguladores.

F. RESPONSABILIDADES:
F.1. CONTRATADA:
    - Elaborar protocolos técnicos;
    - Executar testes conforme protocolos;
    - Emitir relatórios e certificados;
    - Manter rastreabilidade metrológica.

F.2. CONTRATANTE:
    - Aprovar protocolos antes da execução;
    - Disponibilizar equipamento e insumos;
    - Designar responsável técnico;
    - Manter documentação conforme BPF/GMP.
  `,

  nda: (dados) => `
CLÁUSULA ESPECIAL - ACORDO DE NÃO DIVULGAÇÃO (NDA)
A. INFORMAÇÕES CONFIDENCIAIS:
A.1. São consideradas informações confidenciais:
${dados.tipos_informacao || `
    - Processos técnicos e know-how;
    - Dados de produção e fórmulas;
    - Estratégias comerciais e de mercado;
    - Informações de clientes e fornecedores;
    - Resultados de testes e calibrações;
    - Documentação técnica e procedimentos;
    - Dados pessoais de funcionários e colaboradores;
    - Quaisquer informações marcadas como "confidencial".
`}

B. FINALIDADE: ${dados.finalidade || 'Viabilizar a prestação de serviços metrológicos'}

C. OBRIGAÇÕES DAS PARTES:
C.1. As partes obrigam-se a:
    - Manter sigilo absoluto sobre informações confidenciais;
    - Utilizá-las exclusivamente para a finalidade acordada;
    - Não divulgar a terceiros sem autorização prévia por escrito;
    - Proteger com o mesmo cuidado dado às próprias informações;
    - Restringir acesso apenas a funcionários com necessidade de conhecimento;
    - Devolver ou destruir informações ao término do contrato.

D. EXCEÇÕES:
D.1. Não se aplicam às informações que:
    - Eram de domínio público antes da divulgação;
    - Tornaram-se públicas sem culpa da parte receptora;
    - Eram previamente conhecidas pela parte receptora;
    - Foram legitimamente obtidas de terceiros;
    - São exigidas por ordem judicial ou órgão regulador.

E. PRAZO:
E.1. Vigência: ${dados.prazo_nda || '5 anos contados da última divulgação de informação confidencial'}

F. PENALIDADES:
F.1. Multa por violação: ${dados.multa_descumprimento ? 
  `R$ ${parseFloat(dados.multa_descumprimento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
  '10% do valor total do contrato principal'
}

F.2. Sem prejuízo de:
    - Indenização por perdas e danos comprovados;
    - Rescisão imediata do contrato principal;
    - Medidas judiciais cabíveis (tutela inibitória, busca e apreensão).

G. PROTEÇÃO DE DADOS PESSOAIS (LGPD):
G.1. Este NDA engloba proteção aos dados pessoais conforme LGPD.
G.2. As partes são responsáveis pelo tratamento adequado de dados pessoais a que tiverem acesso.
G.3. Violações à LGPD sujeitam-se às penalidades previstas na Lei 13.709/2018.
  `,
};

/**
 * Função auxiliar para converter número em extenso (simplificada)
 */
function extenso(valor) {
  // Implementação simplificada - em produção, usar biblioteca especializada
  return `${Math.floor(valor / 1000)} mil e ${(valor % 1000).toFixed(2)} reais`;
}

/**
 * Gerador de contrato completo
 */
export function gerarContratoCompleto(dadosContrato) {
  const {
    tipo_contrato,
    numero_contrato,
    cliente,
    data_inicio,
    data_fim,
    prazo_indeterminado,
    valor_total,
    valor_mensal,
    forma_pagamento,
    dados_especificos,
    clausulas_adicionais,
  } = dadosContrato;

  // Descrição do tipo de contrato
  const descricaoTipo = {
    'prestacao_servico': 'prestação de serviços de calibração e ensaios metrológicos',
    'comodato': 'comodato de equipamentos de medição',
    'manutencao': 'manutenção preventiva e corretiva de instrumentos',
    'sla': 'acordo de nível de serviço (SLA)',
    'consultoria': 'consultoria técnica em metrologia',
    'gestao_parque': 'gestão de parque de instrumentos de medição',
    'suporte': 'suporte técnico especializado',
    'validacao': 'validação de equipamentos e processos metrológicos',
    'nda': 'confidencialidade e não divulgação de informações',
  };

  // Montar o contrato
  let contrato = `
═══════════════════════════════════════════════════════════════════
                        CONTRATO DE ${descricaoTipo[tipo_contrato]?.toUpperCase()}
                             Nº ${numero_contrato}
═══════════════════════════════════════════════════════════════════

Pelo presente instrumento particular de contrato de ${descricaoTipo[tipo_contrato]}, as partes abaixo qualificadas:

CONTRATADA: ${DADOS_ENTERFIX.razaoSocial}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${DADOS_ENTERFIX.cnpj}, com sede em ${DADOS_ENTERFIX.endereco}, ${DADOS_ENTERFIX.cidade}/${DADOS_ENTERFIX.estado}, CEP ${DADOS_ENTERFIX.cep}, neste ato representada na forma de seu contrato social.

CONTRATANTE: ${cliente.razao_social}, ${cliente.tipo_pessoa === 'juridica' ? 
  `pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${cliente.cnpj}` :
  `pessoa física, inscrita no CPF sob nº ${cliente.cpf}`
}, com endereço em ${cliente.logradouro || ''} ${cliente.numero || ''}, ${cliente.bairro || ''}, ${cliente.cidade || ''}/${cliente.estado || ''}, CEP ${cliente.cep || ''}.

Têm entre si justo e contratado o seguinte:

${CLAUSULAS_GERAIS.objeto(descricaoTipo[tipo_contrato])}

${CLAUSULAS_GERAIS.vigencia(data_inicio, data_fim, prazo_indeterminado)}

${CLAUSULAS_GERAIS.valorPagamento(valor_total, valor_mensal, forma_pagamento)}

${CLAUSULAS_GERAIS.obrigacoesContratada()}

${CLAUSULAS_GERAIS.obrigacoesContratante()}

${CLAUSULAS_GERAIS.limitacaoResponsabilidade()}

${CLAUSULAS_GERAIS.confidencialidade()}

${CLAUSULAS_GERAIS.garantia()}

${CLAUSULAS_GERAIS.rescisao()}

${CLAUSULAS_ESPECIFICAS[tipo_contrato]?.(dados_especificos) || ''}

${clausulas_adicionais ? `
CLÁUSULA ADICIONAL - DISPOSIÇÕES ESPECÍFICAS
${clausulas_adicionais}
` : ''}

${CLAUSULAS_GERAIS.disposicoesGerais()}

E por estarem assim justas e contratadas, as partes assinam o presente contrato em 2 (duas) vias de igual teor e forma, na presença das testemunhas abaixo.

${DADOS_ENTERFIX.cidade}/${DADOS_ENTERFIX.estado}, ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.

___________________________________
${DADOS_ENTERFIX.razaoSocial}
CNPJ: ${DADOS_ENTERFIX.cnpj}
CONTRATADA

___________________________________
${cliente.razao_social}
${cliente.tipo_pessoa === 'juridica' ? `CNPJ: ${cliente.cnpj}` : `CPF: ${cliente.cpf}`}
CONTRATANTE

TESTEMUNHAS:

___________________________________          ___________________________________
Nome:                                       Nome:
CPF:                                        CPF:
`;

  return contrato;
}

export default {
  DADOS_ENTERFIX,
  FORO_COMPETENTE,
  CLAUSULAS_GERAIS,
  CLAUSULAS_ESPECIFICAS,
  gerarContratoCompleto,
};
