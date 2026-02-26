/**
 * CLÁUSULAS ESPECÍFICAS - Comodato de Equipamentos
 * 
 * Cláusulas aplicáveis a contratos de empréstimo gratuito de equipamentos.
 * Base legal: Código Civil Brasileiro, Arts. 579 a 585
 */

export const CLAUSULAS_COMODATO = {
    /**
     * Objeto do Comodato
     */
    objeto: () => `
CLÁUSULA ESPECÍFICA 1 - DO OBJETO DO COMODATO
1.1. A COMODANTE cede à COMODATÁRIA, em regime de comodato (empréstimo gratuito), os equipamentos discriminados no Anexo I deste contrato.

1.2. Os equipamentos são cedidos para uso exclusivo nas atividades da COMODATÁRIA relacionadas a:
    a) Medições e ensaios metrológicos;
    b) Calibrações internas;
    c) Controle de qualidade de processos produtivos;
    d) Atividades correlatas previamente autorizadas.

1.3. A COMODATÁRIA NÃO poderá:
    a) Ceder, transferir, emprestar ou sublocar os equipamentos a terceiros;
    b) Alterar as características ou configurações originais;
    c) Utilizar os equipamentos para finalidade diversa da acordada;
    d) Transportar os equipamentos para fora das instalações sem autorização prévia.

1.4. Os equipamentos permanecem como propriedade exclusiva da COMODANTE, devendo ser devolvidos ao término do contrato.
`,

    /**
     * Prazo e Renovação
     */
    prazo: () => `
CLÁUSULA ESPECÍFICA 2 - DO PRAZO E RENOVAÇÃO
2.1. O presente comodato vigorará pelo prazo de 12 (doze) meses, contados da data de entrega dos equipamentos.

2.2. O contrato poderá ser renovado automaticamente por períodos sucessivos de 12 (doze) meses, salvo manifestação contrária de qualquer das partes com 60 (sessenta) dias de antecedência.

2.3. A COMODANTE reserva-se o direito de:
    a) Solicitar a devolução antecipada mediante aviso prévio de 30 (trinta) dias;
    b) Substituir equipamentos por modelos equivalentes ou superiores;
    c) Realizar visitas técnicas para inspeção do estado dos equipamentos.

2.4. A COMODATÁRIA poderá devolver os equipamentos a qualquer tempo, mediante aviso prévio de 15 (quinze) dias.
`,

    /**
     * Responsabilidades da Comodatária
     */
    responsabilidades: () => `
CLÁUSULA ESPECÍFICA 3 - DAS RESPONSABILIDADES DA COMODATÁRIA
3.1. A COMODATÁRIA obriga-se a:
    a) Conservar os equipamentos em perfeito estado de funcionamento e limpeza;
    b) Utilizar os equipamentos conforme manuais e especificações técnicas;
    c) Manter calibração periódica dos equipamentos conforme prazos recomendados;
    d) Armazenar os equipamentos em ambiente adequado (temperatura, umidade);
    e) Contratar seguro contra roubo, furto, incêndio e danos acidentais;
    f) Comunicar imediatamente qualquer defeito, dano ou perda.

3.2. Todas as despesas decorrentes do uso são de responsabilidade da COMODATÁRIA:
    a) Manutenções preventivas e corretivas;
    b) Calibrações periódicas;
    c) Acessórios e consumíveis;
    d) Seguro dos equipamentos;
    e) Transporte e logística.

3.3. Em caso de dano ou perda, a COMODATÁRIA ressarcirá a COMODANTE pelo valor de mercado atual do equipamento.
`,

    /**
     * Manutenção e Calibração
     */
    manutencao: () => `
CLÁUSULA ESPECÍFICA 4 - DA MANUTENÇÃO E CALIBRAÇÃO
4.1. A COMODATÁRIA compromete-se a:
    a) Realizar manutenções preventivas conforme recomendações do fabricante;
    b) Calibrar os equipamentos anualmente ou conforme periodicidade especificada;
    c) Manter registro atualizado de manutenções e calibrações;
    d) Utilizar apenas laboratórios acreditados pela RBC para calibração.

4.2. A COMODANTE poderá:
    a) Realizar as calibrações diretamente (com custo para COMODATÁRIA);
    b) Indicar fornecedores qualificados para manutenção;
    c) Auditar os registros de manutenção e calibração.

4.3. Equipamentos descalibrados não devem ser utilizados, sob pena de responsabilização por danos decorrentes.
`,

    /**
     * Devolução dos Equipamentos
     */
    devolucao: () => `
CLÁUSULA ESPECÍFICA 5 - DA DEVOLUÇÃO DOS EQUIPAMENTOS
5.1. Ao término do contrato, a COMODATÁRIA deverá devolver os equipamentos:
    a) No mesmo estado de conservação (considerado desgaste natural);
    b) Limpos e acompanhados de todos os acessórios originais;
    c) Com certificado de calibração válido;
    d) Embalados adequadamente para transporte seguro.

5.2. A devolução será vistoriada pela COMODANTE, que emitirá:
    a) Termo de Devolução, se tudo estiver conforme;
    b) Notificação de Pendências, se houver não conformidades.

5.3. Caso os equipamentos não sejam devolvidos em condições adequadas:
    a) A COMODATÁRIA arcará com custos de reparo ou substituição;
    b) Poderá ser aplicada multa de até 20% do valor do equipamento;
    c) A COMODANTE poderá cobrar judicialmente valores devidos.

5.4. A devolução fora do prazo acordado enseja:
    a) Multa diária de 0,5% sobre o valor do equipamento;
    b) Cobrança de aluguel pelo período excedente (valor de mercado);
    c) Caracterização de apropriação indébita se superior a 30 dias.
`,

    /**
     * Seguro
     */
    seguro: () => `
CLÁUSULA ESPECÍFICA 6 - DO SEGURO
6.1. A COMODATÁRIA obriga-se a contratar e manter seguro dos equipamentos contra:
    a) Roubo e furto qualificado;
    b) Incêndio e danos elétricos;
    c) Danos acidentais durante uso e transporte;
    d) Outros riscos conforme apólice adequada.

6.2. A apólice deverá:
    a) Cobrir 100% do valor de reposição dos equipamentos;
    b) Indicar a COMODANTE como beneficiária;
    c) Ter validade durante todo o período do comodato;
    d) Ser apresentada à COMODANTE no prazo de 15 dias da assinatura.

6.3. A falta de seguro válido:
    a) Autoriza rescisão imediata do contrato;
    b) Responsabiliza integralmente a COMODATÁRIA por qualquer sinistro;
    c) Enseja multa de 10% do valor dos equipamentos.
`,

    /**
     * Fiscalização
     */
    fiscalizacao: () => `
CLÁUSULA ESPECÍFICA 7 - DA FISCALIZAÇÃO
7.1. A COMODANTE poderá, mediante aviso prévio de 48 horas:
    a) Realizar visitas técnicas para inspeção dos equipamentos;
    b) Verificar condições de uso e armazenamento;
    c) Auditar registros de manutenção e calibração;
    d) Colher evidências fotográficas e documentais.

7.2. A COMODATÁRIA compromete-se a:
    a) Permitir livre acesso aos locais onde estão os equipamentos;
    b) Disponibilizar toda documentação solicitada;
    c) Facilitar a inspeção por parte dos técnicos da COMODANTE.

7.3. Não conformidades constatadas deverão ser corrigidas em até 15 (quinze) dias.
`,

    /**
     * Rescisão e Penalidades
     */
    rescisao: () => `
CLÁUSULA ESPECÍFICA 8 - DA RESCISÃO E PENALIDADES
8.1. Constituem motivos para rescisão imediata:
    a) Uso inadequado ou para fins não autorizados;
    b) Cessão, empréstimo ou sublocação a terceiros;
    c) Danos intencionais ou negligência grave;
    d) Falta de seguro vigente;
    e) Não devolução após notificação;
    f) Inadimplência de obrigações contratuais por mais de 30 dias.

8.2. Penalidades aplicáveis:
    a) Multa de 20% do valor dos equipamentos pela rescisão antecipada por culpa da COMODATÁRIA;
    b) Ressarcimento integral de danos, perdas e lucros cessantes;
    c) Cobrança de aluguel retroativo se comprovado uso comercial não autorizado;
    d) Registro em cadastros de inadimplentes.

8.3. A rescisão não exime a COMODATÁRIA de devolver os equipamentos em perfeitas condições.
`,

    /**
     * Disposições Especiais
     */
    disposicoes: () => `
CLÁUSULA ESPECÍFICA 9 - DAS DISPOSIÇÕES ESPECIAIS
9.1. O presente comodato é GRATUITO, não gerando qualquer ônus para a COMODATÁRIA quanto ao uso dos equipamentos.

9.2. Custos operacionais (manutenção, calibração, seguro) são de responsabilidade da COMODATÁRIA.

9.3. Este contrato NÃO caracteriza:
    a) Vínculo empregatício entre as partes;
    b) Doação ou transferência de propriedade;
    c) Sociedade ou parceria comercial.

9.4. Equipamentos obsoletos ou em desuso poderão ser substituídos pela COMODANTE por modelos superiores, sem ônus adicional.

9.5. A COMODANTE reserva-se o direito de promover a marca da empresa em visitas técnicas e materiais promocionais, respeitando segredos da COMODATÁRIA.
`,
};
