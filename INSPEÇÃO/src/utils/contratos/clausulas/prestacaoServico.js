/**
 * CLÁUSULAS ESPECÍFICAS - Prestação de Serviços de Calibração
 * 
 * ⚠️ **CONTRATO DESCONTINUADO** ⚠️
 * 
 * Este contrato foi SUBSTITUÍDO por: calibracao.js (v1.0.0)
 * Motivo: Redundância - ambos tratavam de calibração RBC
 * Data de descontinuação: 26/02/2026
 * 
 * AÇÃO RECOMENDADA:
 * - Novos contratos: Utilizar calibracao.js (mais completo, 10 cláusulas)
 * - Contratos existentes: Podem continuar usando este arquivo (compatibilidade mantida)
 * - Migração: Substituir referências de prestacao_servico → calibracao no código
 * 
 * DIFERENÇAS: calibracao.js possui 3 cláusulas adicionais:
 * - Não Conformidades e Tratamento (etiquetagem, classificação)
 * - Sistema de Gestão da Qualidade (auditorias, ISO/IEC 17025)
 * - Certificado Digital (assinatura eletrônica, QR code, LGPD)
 * 
 * @deprecated Use calibracao.js em vez deste arquivo
 * @see calibracao.js - Contrato de Calibração completo e atualizado
 * @version 1.0.0 (FINAL - sem atualizações futuras)
 * @lastUpdate 26/02/2026 (marcado como descontinuado)
 */

/**
 * MANTIDO APENAS PARA COMPATIBILIDADE RETROATIVA
 * NÃO ADICIONAR NOVAS FUNCIONALIDADES AQUI
 */

export const CLAUSULAS_PRESTACAO_SERVICO = {
    /**
     * Escopo dos Serviços de Calibração
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DOS SERVIÇOS
1.1. Os serviços de calibração compreendem:
    a) Calibração de instrumentos de medição conforme normas técnicas específicas;
    b) Emissão de certificado de calibração rastreável à RBC (Rede Brasileira de Calibração);
    c) Identificação e registro de não conformidades encontradas;
    d) Recomendações técnicas para uso adequado dos instrumentos.

1.2. O certificado de calibração conterá:
    a) Identificação única do certificado e do laboratório;
    b) Dados do cliente e do instrumento calibrado;
    c) Resultados de medição com incerteza expandida;
    d) Condições ambientais durante a calibração;
    e) Rastreabilidade dos padrões utilizados;
    f) Assinatura digital ou física de responsável técnico habilitado.

1.3. A calibração NÃO inclui ajustes, reparos ou manutenção, salvo se expressamente contratados.
`,

    /**
     * Prazo de Execução
     */
    prazo: () => `
CLÁUSULA ESPECÍFICA 2 - DOS PRAZOS DE EXECUÇÃO
2.1. O prazo padrão para execução dos serviços é de até 10 (dez) dias úteis após o recebimento do equipamento no laboratório, salvo acordo diverso.

2.2. Prazos diferenciados podem ser acordados mediante:
    a) Serviço expresso (prazo reduzido com acréscimo de 30%);
    b) Grande volume de equipamentos (prazo estendido com desconto progressivo);
    c) Calibrações especiais que exijam preparação específica.

2.3. O prazo será suspenso nas seguintes condições:
    a) Equipamento apresentar defeito que impeça a calibração;
    b) Falta de informações técnicas essenciais fornecidas pela CONTRATANTE;
    c) Inadimplência da CONTRATANTE superior a 15 (quinze) dias.

2.4. A CONTRATADA compromete-se a comunicar any atraso com antecedência mínima de 2 (dois) dias úteis.
`,

    /**
     * Coleta e Devolução
     */
    logistica: () => `
CLÁUSULA ESPECÍFICA 3 - DA COLETA E DEVOLUÇÃO
3.1. A CONTRATADA pode oferecer serviço de coleta e devolução mediante:
    a) Agendamento prévio com 48 (quarenta e oito) horas de antecedência;
    b) Pagamento de taxa de logística conforme tabela vigente;
    c) Identificação e embalagem adequadas pela CONTRATANTE.

3.2. O transporte é de responsabilidade e risco da parte que o contratar, devendo manter seguro adequado.

3.3. Equipamentos em comodato ou locação terão coleta/devolução incluída no valor contratado.

3.4. A CONTRATANTE autoriza a CONTRATADA a contratar transportadora terceirizada para logística, respondendo esta pelos danos durante o transporte.
`,

    /**
     * Periodicidade e Calibração Recorrente
     */
    periodicidade: () => `
CLÁUSULA ESPECÍFICA 4 - DA PERIODICIDADE
4.1. A periodicidade de calibração recomendada é de 12 (doze) meses, podendo variar conforme:
    a) Recomendações do fabricante do equipamento;
    b) Frequência e condições de uso;
    c) Requisitos de sistema de gestão da qualidade da CONTRATANTE;
    d) Exigências de órgãos reguladores.

4.2. A CONTRATADA enviará avisos de vencimento da calibração com antecedência de 30 (trinta) dias.

4.3. Contratos de calibração recorrente possuem condições comerciais diferenciadas e prioridade no atendimento.

4.4. A CONTRATANTE pode solicitar calibração extraordinária sempre que:
    a) Houver suspeita de descalibração do instrumento;
    b) Após queda, impacto ou mau funcionamento;
    c) Por exigência de auditoria ou órgão fiscalizador.
`,

    /**
     * Acreditação e Rastreabilidade
     */
    acreditacao: () => `
CLÁUSULA ESPECÍFICA 5 - DA ACREDITAÇÃO E RASTREABILIDADE
5.1. A CONTRATADA mantém laboratório em conformidade com requisitos da ISO/IEC 17025:2017.

5.2. Os serviços são rastreáveis à Rede Brasileira de Calibração (RBC) e/ou padrões nacionais do Inmetro.

5.3. A CONTRATADA compromete-se a:
    a) Manter certificados de calibração dos padrões sempre válidos;
    b) Participar de ensaios de proficiência e intercomparações;
    c) Submeter-se a auditorias de acreditação periódicas;
    d) Comunicar qualquer suspensão ou restrição de escopo acreditado.

5.4. Certificados emitidos com logo de acreditação seguem requisitos adicionais da RBC/Inmetro.

5.5. A CONTRATANTE pode solicitar apresentação de certificados de acreditação e rastreabilidade a qualquer tempo.
`,

    /**
     * Não Conformidades e Retrabalho
     */
    naoConformidade: () => `
CLÁUSULA ESPECÍFICA 6 - DAS NÃO CONFORMIDADES
6.1. Quando identificada não conformidade metrológica, a CONTRATADA:
    a) Registrará a ocorrência no certificado de calibração;
    b) Comunicará a CONTRATANTE imediatamente por e-mail/telefone;
    c) Recomendará ajuste, reparo ou substituição do instrumento;
    d) Poderá aplicar etiqueta indicativa "FORA DE TOLERÂNCIA".

6.2. Não conformidades no certificado emitido ensejam: 
    a) Emissão de certificado retificado sem custo adicional;
    b) Recalibração gratuita, se erro for da CONTRATADA;
    c) Comunicação formal a todos os afetados, se aplicável.

6.3. A CONTRATADA manterá registro de não conformidades para análise de tendências e melhoria contínua.
`,

    /**
     * Sistema de Gestão e Auditoria
     */
    gestaoQualidade: () => `
CLÁUSULA ESPECÍFICA 7 - DO SISTEMA DE GESTÃO DA QUALIDADE
7.1. A CONTRATADA mantém Sistema de Gestão da Qualidade em conformidade com ISO/IEC 17025:2017.

7.2. A CONTRATANTE pode auditar as instalações e processos da CONTRATADA mediante:
    a) Agendamento prévio de 15 (quinze) dias úteis;
    b) Apresentação de escopo e objetivo da auditoria;
    c) Assinatura de termo de confidencialidade.

7.3. A CONTRATADA compromete-se a:
    a) Fornecer acesso a procedimentos técnicos relevantes;
    b) Disponibilizar profissional qualificado para acompanhamento;
    c) Implementar ações corretivas para não conformidades identificadas em até 30 (trinta) dias.

7.4. Auditorias não interferirão nas atividades operacionais normais do laboratório.
`,

    /**
     * Equipamentos Auxiliares e Condições Especiais
     */
    equipamentos: () => `
CLÁUSULA ESPECÍFICA 8 - DE EQUIPAMENTOS E CONDIÇÕES ESPECIAIS
8.1. Equipamentos que necessitem de:
    a) Alimentação elétrica especial (trifásico, alta potência);
    b) Condições ambientais controladas (sala limpa, temperatura específica);
    c) Acessórios ou softwares adicionais;
    d) Descontaminação ou limpeza prévia;

    Terão estas condições acordadas previamente e documentadas em ordem de serviço específica.

8.2. A CONTRATANTE deve informar previamente sobre:
    a) Equipamentos que contenham substâncias perigosas ou contaminantes;
    b) Instrumentos que operem com gases ou produtos químicos;
    c) Equipamentos em área classificada (ATEX, IECEx).

8.3. A CONTRATADA reserva-se ao direito de recusar serviços que apresentem risco à segurança ou ao patrimônio.
`,

    /**
     * Certificado Digital e Segurança da Informação
     */
    certificadoDigital: () => `
CLÁUSULA ESPECÍFICA 9 - DO CERTIFICADO DIGITAL
9.1. Os certificados de calibração poderão ser emitidos em formato digital (PDF) com assinatura eletrônica qualificada (ICP-Brasil).

9.2. Certificados digitais possuem:
    a) Código QR para verificação de autenticidade no site da CONTRATADA;
    b) Assinatura digital com carimbo de tempo;
    c) Hash SHA-256 para garantia de integridade;
    d) Armazenamento em nuvem com backup redundante por 10 (dez) anos.

9.3. A CONTRATANTE pode solicitar segunda via do certificado:
    a) Pela plataforma online, sem custo;
    b) Em meio físico (papel/mídia), mediante taxa administrativa.

9.4. A CONTRATADA compromete-se a manter disponível acesso online aos certificados durante todo o período de guarda legal.
`,
};