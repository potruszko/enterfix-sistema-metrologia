/**
 * CLÁUSULAS ESPECÍFICAS - NDA (Non-Disclosure Agreement)
 * 
 * Acordo de Confidencialidade e Sigilo para proteção de informações sensíveis.
 * Base legal: Código Civil (Arts. 422, 187), Lei 9.609/98 (Software), Lei 9.279/96 (Propriedade Industrial), LGPD
 */

export const CLAUSULAS_NDA = {
    /**
     * Objeto da Confidencialidade
     */
    objeto: () => `
CLÁUSULA ESPECÍFICA 1 - DO OBJETO DA CONFIDENCIALIDADE
1.1. As partes reconhecem que, em razão de suas atividades comerciais, terão acesso a informações confidenciais e proprietárias da outra parte.

1.2. O presente Acordo de Confidencialidade (NDA) visa proteger:
    a) Informações técnicas e científicas;
    b) Segredos industriais e comerciais;
    c) Processos, métodos e know-how;
    d) Dados de clientes e fornecedores;
    e) Estratégias de negócio e planejamento;
    f) Informações financeiras e comerciais;
    g) Propriedade intelectual (patentes, marcas, direitos autorais);
    h) Dados pessoais (LGPD - Lei 13.709/2018).

1.3. Classificação de informações:
    a) PÚBLICAS: Informações de domínio público ou já divulgadas;
    b) INTERNAS: Informações para uso interno geral;
    c) CONFIDENCIAIS: Informações sensíveis de acesso restrito;
    d) SECRETAS: Informações críticas com máxima restrição.

1.4. Identificação de informações confidenciais:
    a) Marcadas como "CONFIDENCIAL", "SECRETO" ou similar;
    b) Identificadas verbalmente como confidenciais (confirmação escrita em 5 dias);
    c) Razoavelmente entendidas como confidenciais pela natureza;
    d) Transmitidas em reuniões fechadas ou comunicações privadas.
`,

    /**
     * Definição de Informações Confidenciais
     */
    definicao: () => `
CLÁUSULA ESPECÍFICA 2 - DA DEFINIÇÃO DE INFORMAÇÕES CONFIDENCIAIS
2.1. São consideradas Informações Confidenciais, sem limitação:
    a) TÉCNICAS: Especificações, desenhos, fórmulas, composições, processos de fabricação, metodologias de calibração e medição;
    b) COMERCIAIS: Listas de clientes, preços, condições comerciais, estratégias de vendas, margens de lucro;
    c) FINANCEIRAS: Balanços, demonstrativos, custos, investimentos, projeções;
    d) OPERACIONAIS: Fluxos de processo, layouts, capacidades produtivas, fornecedores;
    e) RECURSOS HUMANOS: Informações de colaboradores, salários, organogramas;
    f) JURÍDICAS: Contratos, processos, pareceres, litígios;
    g) PROPRIEDADE INTELECTUAL: Patentes em desenvolvimento, marcas não registradas, softwares proprietários;
    h) DADOS PESSOAIS: Informações de clientes, colaboradores e terceiros (LGPD).

2.2. NÃO são consideradas confidenciais as informações que:
    a) Já eram de conhecimento público antes da divulgação pela parte reveladora;
    b) Tornaram-se públicas sem violação deste acordo;
    c) Já eram conhecidas pela parte receptora antes da divulgação (comprovadamente);
    d) Foram legalmente obtidas de terceiros sem obrigação de confidencialidade;
    e) Foram desenvolvidas independentemente pela parte receptora sem uso das informações reveladas.

2.3. Ônus da prova:
    A parte receptora tem o ônus de provar que a informação se enquadra em uma das exceções acima.
`,

    /**
     * Obrigações das Partes
     */
    obrigacoes: () => `
CLÁUSULA ESPECÍFICA 3 - DAS OBRIGAÇÕES DAS PARTES
3.1. As partes obrigam-se a:
    a) Manter absoluto sigilo sobre todas as Informações Confidenciais recebidas;
    b) NÃO divulgar, publicar, revelar ou transmitir a terceiros sem prévia autorização escrita;
    c) NÃO utilizar as informações para fins diversos daqueles do relacionamento comercial;
    d) Proteger as informações com o mesmo grau de cuidado aplicado às suas próprias informações confidenciais (mínimo: cuidado razoável);
    e) Limitar o acesso apenas a empregados, consultores e prestadores com necessidade de conhecimento (need-to-know);
    f) Assegurar que todas as pessoas com acesso assinem termos de confidencialidade equivalentes;
    g) Notificar imediatamente a parte reveladora em caso de violação ou suspeita de violação.

3.2. Medidas de proteção obrigatórias:
    a) Armazenamento seguro de documentos físicos (armários trancados);
    b) Proteção digital com senhas, criptografia e controle de acesso;
    c) Transmissão apenas por canais seguros (e-mail criptografado, VPN);
    d) Destruição segura ao término do acordo (trituração, exclusão definitiva);
    e) Proibição de cópias não autorizadas;
    f) Registro de acessos e transmissões (audit trail);
    g) Conformidade com LGPD para dados pessoais.

3.3. Uso permitido:
    As informações podem ser utilizadas EXCLUSIVAMENTE para:
    a) Avaliar oportunidades de negócio entre as partes;
    b) Executar contratos firmados entre as partes;
    c) Prestar serviços contratados com qualidade e conformidade;
    d) Cumprir obrigações legais e regulatórias.

3.4. Uso proibido:
    É VEDADO:
    a) Copiar, reproduzir ou duplicar sem autorização;
    b) Realizar engenharia reversa de produtos ou processos;
    c) Utilizar para desenvolvimento de produtos competitivos;
    d) Comercializar ou licenciar a terceiros;
    e) Publicar em qualquer meio (artigos, redes sociais, etc.);
    f) Utilizar após término do relacionamento comercial.
`,

    /**
     * Divulgação a Terceiros
     */
    divulgacao: () => `
CLÁUSULA ESPECÍFICA 4 - DA DIVULGAÇÃO A TERCEIROS
4.1. Divulgação permitida com autorização prévia:
    a) Solicitação formal por escrito identificando:
       - O terceiro que terá acesso;
       - Justificativa da necessidade;
       - Informações específicas a serem reveladas;
       - Prazo de aprovação: 5 dias úteis;
    b) Se autorizado, o terceiro deverá assinar NDA equivalente antes do acesso.

4.2. Divulgação a empregados e consultores:
    a) Permitida sem autorização prévia se houver necessidade de conhecimento (need-to-know);
    b) Obrigatoriedade de termo de confidencialidade assinado;
    c) Treinamento sobre obrigações de sigilo;
    d) Responsabilidade da parte receptora por violações de sua equipe.

4.3. Divulgação legal obrigatória:
    a) Quando exigido por lei, decisão judicial ou autoridade governamental;
    b) A parte receptora deverá:
       - Notificar imediatamente a parte reveladora (quando legalmente possível);
       - Cooperar para limitar a extensão da divulgação;
       - Obter ordem de confidencialidade (protective order) sempre que viável;
       - Divulgar apenas o estritamente necessário para cumprir a obrigação legal.

4.4. Subcontratados e parceiros:
    a) Divulgação permitida apenas com aprovação prévia;
    b) Contrato de subcontratação deve incluir cláusulas de confidencialidade back-to-back;
    c) Parte receptora permanece integralmente responsável.
`,

    /**
     * Propriedade das Informações
     */
    propriedade: () => `
CLÁUSULA ESPECÍFICA 5 - DA PROPRIEDADE DAS INFORMAÇÕES
5.1. Todas as Informações Confidenciais permanecem de propriedade exclusiva da parte reveladora.

5.2. Nenhuma licença, direito ou título é concedido:
    a) O acesso às informações NÃO concede direito de uso, exploração ou propriedade;
    b) Direitos de Propriedade Intelectual permanecem integralmente com a parte reveladora;
    c) Eventual uso comercial requer licenciamento formal separado.

5.3. Materiais e documentos:
    a) Todos os materiais fornecidos (físicos e digitais) permanecem propriedade da parte reveladora;
    b) Devem ser devolvidos ou destruídos ao término do acordo;
    c) Cópias não autorizadas devem ser destruídas.

5.4. Criações conjuntas (joint inventions):
    a) Informações criadas conjuntamente pelas partes durante a colaboração serão objeto de acordo separado;
    b) Cada parte retém propriedade integral de suas contribuições individuais;
    c) Direitos de exploração conjunta devem ser negociados especificamente.
`,

    /**
     * Prazo de Vigência
     */
    prazo: () => `
CLÁUSULA ESPECÍFICA 6 - DO PRAZO DE VIGÊNCIA
6.1. Vigência do acordo:
    a) INÍCIO: Data da assinatura do presente contrato;
    b) TÉRMINO: [PRAZO] anos a partir da data de assinatura;
    c) RENOVAÇÃO: Automática por períodos iguais, salvo manifestação contrária com 60 dias de antecedência.

6.2. Prazo de confidencialidade:
    a) As obrigações de sigilo permanecem vigentes por [PRAZO CONFIDENCIALIDADE] anos após o término do acordo;
    b) Para segredos industriais: INDEFINIDAMENTE, enquanto mantiver caráter confidencial;
    c) Para dados pessoais (LGPD): Conforme legislação aplicável.

6.3. Término do relacionamento comercial:
    a) O término de contratos comerciais NÃO encerra as obrigações deste NDA;
    b) Obrigações de confidencialidade sobrevivem ao término de qualquer contrato;
    c) Devolução ou destruição de materiais conforme Cláusula 7.

6.4. Informações recebidas após término:
    Após o término formal do acordo, nenhuma nova informação será considerada confidencial, 
    salvo novo acordo firmado entre as partes.
`,

    /**
     * Devolução e Destruição
     */
    devolucao: () => `
CLÁUSULA ESPECÍFICA 7 - DA DEVOLUÇÃO E DESTRUIÇÃO DE INFORMAÇÕES
7.1. Ao término do acordo ou a qualquer momento mediante solicitação da parte reveladora:
    a) Todos os documentos físicos devem ser devolvidos ou destruídos;
    b) Todos os arquivos digitais devem ser permanentemente excluídos;
    c) Cópias, rascunhos, anotações e extratos também devem ser destruídos;
    d) Certificado de Destruição deve ser emitido em até 15 dias.

7.2. Certificado de Destruição deve conter:
    a) Descrição dos materiais devolvidos ou destruídos;
    b) Método de destruição (trituração, exclusão segura, etc.);
    c) Data da destruição;
    d) Nome e assinatura do responsável;
    e) Declaração de inexistência de cópias remanescentes.

7.3. Exceções à destruição:
    a) Cópias de backup automático podem ser retidas se:
       - Segregadas e inacessíveis;
       - Sujeitas às mesmas obrigações de confidencialidade;
       - Destruídas conforme política de retenção de backup (máx. 90 dias);
    b) Cópias requeridas por lei ou regulação podem ser retidas:
       - Apenas pelo período legalmente exigido;
       - Com proteção adequada e acesso restrito.

7.4. A parte reveladora pode auditar a devolução/destruição mediante aviso prévio de 5 dias.
`,

    /**
     * Penalidades e Indenizações
     */
    penalidades: () => `
CLÁUSULA ESPECÍFICA 8 - DAS PENALIDADES E INDENIZAÇÕES
8.1. Violação das obrigações de confidencialidade:
    a) Constitui infração contratual grave;
    b) Autoriza rescisão imediata de todos os contratos comerciais;
    c) Sujeita a parte infratora a:
       - Multa de R$ [VALOR] ou [X]% do valor dos contratos (o que for maior);
       - Indenização por perdas e danos comprovados;
       - Indenização por danos morais (se aplicável);
       - Lucros cessantes decorrentes da violação.

8.2. Cálculo de danos:
    a) Danos materiais: Custos de desenvolvimento da informação + prejuízos decorrentes da divulgação;
    b) Lucros cessantes: Perda de vantagem competitiva, perda de clientes, redução de receitas;
    c) Danos morais: Perda de reputação, abalo de imagem, perda de confiança de clientes;
    d) Custos de mitigação: Ações para reduzir impacto da violação.

8.3. Medidas judiciais cabíveis:
    a) Liminar de busca e apreensão de documentos;
    b) Ordem judicial de cessação imediata (cease and desist);
    c) Sequestro de produto desenvolvido com uso indevido das informações;
    d) Ação de indenização por perdas e danos;
    e) Ação criminal por violação de segredo industrial (art. 195 da Lei 9.279/96).

8.4. A multa NÃO exclui o direito a indenizações adicionais por danos comprovados.

8.5. Inversão do ônus da prova:
    Em caso de suspeita fundamentada de violação, a parte suspeita deve provar que NÃO houve uso indevido.
`,

    /**
     * Medidas Cautelares
     */
    medidasCautelares: () => `
CLÁUSULA ESPECÍFICA 9 - DAS MEDIDAS CAUTELARES
9.1. As partes reconhecem que violação de confidencialidade pode causar dano irreparável.

9.2. Em caso de violação ou ameaça de violação:
    a) A parte prejudicada pode buscar medida cautelar/liminar SEM necessidade de caução;
    b) Obtenção de liminar NÃO impede busca de indenização posteriormente;
    c) Parte infratora renuncia a alegar que dinheiro seria compensação adequada.

9.3. Medidas cautelares típicas:
    a) Busca e apreensão de documentos físicos e digitais;
    b) Ordem de cessação imediata de uso ou divulgação;
    c) Bloqueio de acesso a sistemas e arquivos;
    d) Sequestro de produtos fabricados com uso indevido;
    e) Ordem de remoção de publicações (sites, redes sociais);
    f) Nomeação de perito para auditoria forense digital.

9.4. Cooperação obrigatória:
    A parte suspeita deve cooperar plenamente com investigações e auditorias, 
    sob pena de presunção de culpabilidade.
`,

    /**
     * Conformidade com LGPD
     */
    lgpd: () => `
CLÁUSULA ESPECÍFICA 10 - DA CONFORMIDADE COM LGPD
10.1. Quando as Informações Confidenciais incluírem dados pessoais:
    a) As partes atuarão como Controladora e Operadora (conforme caso);
    b) Tratamento estritamente dentro das finalidades contratuais;
    c) Implementação das medidas de segurança previstas na LGPD (Art. 46);
    d) Notificação de incidentes de segurança em até 72 horas;
    e) Eliminação dos dados ao término do tratamento.

10.2. Bases legais para tratamento:
    a) Execução de contrato (Art. 7º, V da LGPD);
    b) Legítimo interesse das partes (Art. 7º, IX);
    c) Consentimento específico quando necessário.

10.3. Direitos dos titulares:
    As partes cooperarão para garantir exercício de direitos:
    a) Acesso, correção, exclusão de dados pessoais;
    b) Portabilidade de dados;
    c) Informação sobre tratamento;
    d) Revogação de consentimento.

10.4. Transferência internacional:
    Se houver transferência de dados para outros países:
    a) Apenas para países com nível adequado de proteção ou cláusulas contratuais padrão;
    b) Notificação prévia obrigatória;
    c) Garantias adicionais conforme Arts. 33-36 da LGPD.

10.5. Incidentes de segurança:
    a) Notificação mútua em 72 horas;
    b) Cooperação para investigação e mitigação;
    c) Notificação à ANPD conforme gravidade (Art. 48);
    d) Comunicação a titulares se houver risco relevante.

10.6. Responsabilidade solidária:
    As partes respondem solidariamente por danos decorrentes de violação da LGPD, 
    com direito de regresso contra a parte culpada.
`,

    /**
     * Disposições Gerais do NDA
     */
    disposicoesGerais: () => `
CLÁUSULA ESPECÍFICA 11 - DAS DISPOSIÇÕES GERAIS
11.1. Natureza do acordo:
    a) Este NDA NÃO cria qualquer tipo de sociedade, joint venture ou parceria;
    b) NÃO cria obrigação de concluir negócios ou firmar contratos;
    c) NÃO concede direitos de exclusividade;
    d) Cada parte age de forma independente.

11.2. Não garantia:
    a) As informações são fornecidas "como estão" (as is);
    b) A parte reveladora NÃO garante precisão, completude ou adequação para qualquer fim;
    c) A parte receptora deve fazer sua própria avaliação independente.

11.3. Modificações:
    a) Qualquer alteração neste NDA deve ser feita por escrito e assinada por ambas as partes;
    b) Modificações verbais não têm validade.

11.4. Renúncia:
    a) A tolerância ou não exercício de direitos NÃO constitui renúncia;
    b) Renúncia deve ser expressa e por escrito.

11.5. Invalidade parcial:
    Se qualquer cláusula for considerada inválida, as demais permanecem em pleno vigor.

11.6. Cessão:
    a) Nenhuma parte pode ceder este NDA sem consentimento prévio da outra;
    b) Exceção: Cessão a empresas do mesmo grupo econômico (notificação em 15 dias).

11.7. Idioma e comunicações:
    a) Idioma oficial: Português (Brasil);
    b) Comunicações formais: Por escrito via e-mail com confirmação de leitura ou correio com AR.

11.8. Sobrevivência:
    As cláusulas 2, 3, 5, 6.2, 7, 8, 9 e 10 sobrevivem ao término deste acordo.
`,
};
