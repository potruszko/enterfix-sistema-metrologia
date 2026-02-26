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
    d) Atividades correlatas previamente autorizadas;
    e) **Equipamento de backup (reserva técnica)** durante período de manutenção do ativo fixo da COMODATÁRIA nas dependências da COMODANTE.

1.3. A COMODATÁRIA NÃO poderá:
    a) Ceder, transferir, emprestar ou sublocar os equipamentos a terceiros;
    b) Alterar as características ou configurações originais;
    c) Utilizar os equipamentos para finalidade diversa da acordada;
    d) Transportar os equipamentos para fora das instalações sem autorização prévia;
    e) **Realizar qualquer tipo de engenharia reversa, desmontagem técnica ou cópia de componentes e softwares integrados ao equipamento**;
    f) Abrir lacres de garantia, acessar componentes internos ou firmware sem autorização expressa por escrito da COMODANTE.

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
    a) **Solicitar a devolução antecipada por conveniência ou necessidade da COMODANTE (inclusive para venda, locação a terceiros ou projeto prioritário), mediante aviso prévio de 30 (trinta) dias, independentemente de justificativa técnica**;
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

3.3. Em caso de dano ou perda:
    a) A COMODATÁRIA ressarcirá a COMODANTE pelo **Valor de Reposição Novo** indicado no Anexo I (lista de equipamentos);
    b) Na ausência de valor pré-acordado no Anexo I: valor de mercado de um equipamento equivalente **zero quilômetro** (novo);
    c) **NÃO será aplicada depreciação** sobre o valor de reposição, pois o comodato pressupõe devolução em perfeito estado;
    d) Ressarcimento deve ser efetuado em até 30 (trinta) dias após notificação formal;
    e) A COMODANTE pode exigir garantia (caucão ou seguro-garantia) para equipamentos de valor superior a R$ 100.000,00.
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
    d) **Utilizar apenas laboratórios acreditados pela RBC para calibração, sendo OBRIGATÓRIA a aprovação prévia da COMODANTE (Enterfix) sobre o laboratório escolhido, visando garantir a integridade técnica do ativo**;
    e) Enviar cópia de todos os certificados de calibração à COMODANTE em até 5 (cinco) dias após emissão.

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

    /**
     * Regras de Ouro para Proteção do Ativo
     */
    goldRules: () => `
CLÁUSULA ESPECÍFICA 10 - DAS REGRAS DE OURO DE PROTEÇÃO AO ATIVO
10.1. **Lacres e Componentes Internos**:
    a) É VEDADA a abertura de lacres de garantia ou acesso a componentes internos sem autorização expressa por escrito da ENTERFIX;
    b) Qualquer violação de lacre será considerada quebra contratual grave;
    c) Custos de reparo ou substituição decorrentes de abertura não autorizada: 100% da COMODATÁRIA;
    d) Multa adicional de 30% do valor do equipamento por violação de lacre.

10.2. **Fiel Depositário (Código Penal, Art. 168)**:
    a) A COMODATÁRIA é **FIEL DEPOSITÁRIA** do bem, respondendo civil e criminalmente por qualquer embaraço à sua retomada;
    b) A não devolução após notificação extrajudicial caracteriza:
       → Apropriação indébita (se superior a 30 dias sem justificativa);
       → Crime de Depositário Infiel (Código Penal, Art. 168);
       → Registro em Cartório de Títulos e Documentos para efeitos legais.
    
    c) A COMODANTE poderá solicitar busca e apreensão liminar em caso de recusa de devolução;
    d) A COMODATÁRIA autoriza expressamente a entrada da COMODANTE em suas instalações para retomada do bem em caso de urgência (sempre acompanhada de oficial de justiça ou autoridade policial).

10.3. **Falência, Recuperação Judicial ou Extinção da COMODATÁRIA**:
    a) Em caso de falência, recuperação judicial, extinção, liquidação ou dissolução da COMODATÁRIA:
       → Os bens em comodato deverão ser IMEDIATAMENTE segregados e devolvidos;
       → **NÃO compõem a massa falida** (Lei 11.101/2005, Art. 49, § 3º);
       → Administrador judicial ou síndico será notificado para devolução em até 5 (cinco) dias;
       → A retenção indevida gera multa diária de 2% do valor do equipamento.
    
    b) A COMODATÁRIA compromete-se a comunicar à COMODANTE, em até 24 (vinte e quatro) horas:
       → Pedido de recuperação judicial ou extrajudicial;
       → Penhora, arrest ou qualquer constrição judicial sobre o patrimônio;
       → Mudança de controle acionário ou fusão/cisão da empresa.

10.4. **Propriedade Intelectual e Engenharia Reversa**:
    a) Equipamentos podem conter tecnologia proprietária, software embarcado e design mecânico exclusivo da ENTERFIX;
    b) **PROIBIDO**:
       → Desmontar, escanear (3D scanning) ou fotografar componentes internos;
       → Extrair firmware, software ou parâmetros de programação;
       → Copiar desenhos técnicos, códigos-fonte ou algoritmos;
       → Utilizar equipamento como referência para fabricação de similar.
    
    c) Violação de propriedade intelectual:
       → Multa de 200% do valor do equipamento;
       → Ação de indenização por danos morais e materiais;
       → Comunicação ao INPI e órgãos de defesa da propriedade industrial.

10.5. **Anexo I - Lista de Equipamentos (campos obrigatórios)**:
    a) Descrição completa: marca, modelo, número de série;
    b) **Valor de Reposição Novo (acordado entre as partes)**;
    c) Estado de conservação no momento da entrega (vistoria fotográfica);
    d) Acessórios inclusos (cabos, software, manuais, maletas);
    e) Número de lacres de garantia aplicados;
    f) Data de entrega e assinatura de ambas as partes (termo de recebimento).

10.6. **Cláusula Penal (Código Civil, Art. 408 a 416)**:
    a) O descumprimento de qualquer obrigação deste contrato enseja cláusula penal de **20% do valor total dos equipamentos em comodato**;
    b) A cláusula penal é CUMULATIVA com perdas e danos comprovados;
    c) Em caso de dolo ou culpa grave: cláusula penal elevada a 50%.

10.7. **Jurisdição e Competência**:
    a) Fica eleito o foro da comarca de São Bernardo do Campo/SP para dirimir questões deste contrato;
    b) A COMODATÁRIA renuncia expressamente a qualquer outro foro, por mais privilegiado que seja.
`,
};