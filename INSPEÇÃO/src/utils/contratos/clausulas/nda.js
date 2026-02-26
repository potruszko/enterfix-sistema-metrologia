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

4.4. TERCEIROS FABRICANTES (Usinagens, Tratamentos, Caldeirarias):
    ⚠️ CENÁRIO CRÍTICO: ENTERFIX contrata terceiro para executar projeto confidencial de Cliente Final.
    
    a) NDA BACK-TO-BACK OBRIGATÓRIO:
       - Terceiro fabricante DEVE assinar NDA com regras equivalentes ANTES de receber qualquer arquivo técnico;
       - Modelo fornecido pela ENTERFIX (disponível no Sistema Enterfix - Módulo Fornecedores);
       - Sistema BLOQUEIA envio de arquivos STEP/DXF sem NDA assinado registrado;
       - Prazo: NDA assinado em até 48h ou pedido cancelado.
    
    b) RESPONSABILIDADE DUAL (Proteção da ENTERFIX):
       - PERANTE O CLIENTE FINAL: ENTERFIX é integralmente responsável por vazamento (Art. 932, III do CC);
       - DIREITO DE REGRESSO: ENTERFIX pode processar terceiro fabricante por TODOS os danos pagos ao cliente final + custos legais + multa contratual;
       - Exemplo prático: Cliente processa Enterfix por R$ 200.000 → Enterfix paga → Enterfix processa terceiro por R$ 200.000 + multa NDA R$ 50.000 = R$ 250.000.
    
    c) RASTREABILIDADE DE ARQUIVOS TÉCNICOS:
       - Arquivos STEP/IGES/DXF enviados COM marca d'água digital (metadata: ID pedido, data, destinatário);
       - E-mail de envio SEMPRE menciona: "Arquivo enviado sob condições NDA nº [X] assinado em [DATA]";
       - Portal Enterfix registra: Data/hora download, IP, nome arquivo, hash SHA-256;
       - Log mantido 10 anos (prova em litígio).
    
    d) PROIBIÇÕES ESPECÍFICAS PARA TERCEIRO FABRICANTE:
       - VEDADO subcontratar sem autorização escrita prévia da ENTERFIX;
       - VEDADO usar máquinas de medir (MMC, escâner 3D) para mapear geometria além do necessário para inspeção de qualidade;
       - VEDADO manter arquivo técnico após conclusão do trabalho (prazo destruição: 30 dias após entrega ou cancelamento);
       - VEDADO fabricar peça similar para outro cliente (mesmo que geometria seja ligeiramente diferente).
    
    e) AUDITORIA DE SEGURANÇA:
       - ENTERFIX pode visitar instalações do terceiro fabricante com aviso prévio de 5 dias úteis;
       - Verificação: Armazenamento de arquivos, controle de acesso, cópias não autorizadas, treinamento de equipe;
       - Custo auditoria: ENTERFIX (auditoria preventiva) ou TERCEIRO (se motivada por suspeita de violação).
    
    f) CERTIFICADO DE DESTRUIÇÃO:
       - Após conclusão do trabalho, terceiro emite Certificado de Destruição em até 15 dias;
       - Conteúdo: Lista arquivos recebidos, data destruição, método (exclusão segura com 7 passagens DOD 5220.22-M), declaração inexistência de cópias;
       - Ausência do certificado = presunção de uso indevido (inversão ônus da prova).
    
    g) MULTA ESPECÍFICA PARA TERCEIROS FABRICANTES:
       - Vazamento de arquivo técnico: R$ 50.000,00 (cinquenta mil reais) OU 100% do valor do pedido (o que for MAIOR);
       - Fabricação não autorizada para terceiro: R$ 100.000,00 (cem mil reais) OU 200% do lucro obtido (o que for MAIOR);
       - Recusa de auditoria ou Certificado de Destruição: R$ 10.000,00 + R$ 500,00/dia de atraso.
    
    h) INTEGRAÇÃO COM SISTEMA ENTERFIX:
       - Módulo "Fornecedores" exibe status NDA: ✅ Assinado | ⚠️ Vencido | ❌ Não assinado;
       - Botão "Enviar Arquivo Técnico" só ativa se NDA válido (verde);
       - Ao clicar, sistema gera e-mail automático com texto: "Arquivo [NOME] enviado sob NDA nº [X]. Destruição obrigatória em 30 dias após conclusão trabalho. Violação sujeita a multa R$ 50.000 ou 100% pedido.";
       - Dashboard: Relatório de arquivos enviados, status Certificados de Destruição (pendente/recebido), alertas vencimento.
    
    i) EXEMPLO PRÁTICO (Caso Real):
       📧 E-mail da Enterfix para Usinagem XYZ Ltda:
       "Assunto: Envio de arquivo STEP - Pedido #2347 - NDA vigente
       
       Prezados,
       
       Segue arquivo STEP 'flange_medicao_cliente_ABC.step' para usinagem conforme Pedido #2347.
       
       ⚠️ INFORMAÇÃO CONFIDENCIAL protegida por NDA assinado em 15/01/2026 (válido até 15/01/2031).
       
       Obrigações:
       - Uso EXCLUSIVO para fabricação Pedido #2347;
       - PROIBIDO subcontratar, copiar ou usar para outros clientes;
       - DESTRUIÇÃO OBRIGATÓRIA em até 30 dias após entrega da peça (prazo: até 15/03/2026);
       - Certificado de Destruição deve ser enviado para contratos@enterfix.com.br;
       - Violação sujeita a multa de R$ 50.000,00 + indenização por danos comprovados.
       
       Arquivo rastreado sob ID: STEP-2347-20260215-XYZLTDA (hash SHA-256: a3f5...).
       
       Att,
       Sistema Enterfix - Gestão de Fornecedores"
    
    j) CLÁUSULA DE SOBREVIVÊNCIA:
       - Obrigações desta Cláusula 4.4 sobrevivem INDEFINIDAMENTE (enquanto informação mantiver caráter confidencial);
       - Término de relação comercial NÃO encerra obrigação de sigilo do terceiro fabricante;
       - Segredos industriais (geometrias, tolerâncias, materiais específicos) protegidos PERPETUAMENTE.

4.5. RASTREABILIDADE DE DIVULGAÇÃO A TERCEIROS (Integração Digital):
    a) REGISTRO AUTOMÁTICO NO SISTEMA ENTERFIX:
       - Toda divulgação de arquivo técnico a terceiro gera log automático em Supabase:
         • Data/hora envio (timestamp RFC 3161);
         • Destinatário (CNPJ, razão social, e-mail, responsável técnico);
         • Arquivo(s) enviado(s) (nome, tamanho, hash SHA-256);
         • NDA vinculado (número, data assinatura, data vencimento);
         • Usuário Enterfix que autorizou envio;
         • IP origem, User Agent.
       - Retenção: 10 anos (ISO/IEC 17025 + Código Civil Art. 205).
    
    b) MARCA D'ÁGUA DIGITAL EM ARQUIVOS CAD:
       - Arquivos STEP/IGES/DXF/DWG incluem metadata XML invisível:
         <?xml version="1.0"?>
         <EnterFixConfidential>
           <PedidoID>2347</PedidoID>
           <ClienteFinal>ABC Indústrias Ltda</ClienteFinal>
           <DestinatarioAutorizado>Usinagem XYZ Ltda - CNPJ 12.345.678/0001-99</DestinatarioAutorizado>
           <DataEnvio>2026-02-15T14:32:11Z</DataEnvio>
           <ValidadeUso>2026-03-15</ValidadeUso>
           <HashRastreamento>a3f5d8c2...</HashRastreamento>
           <Aviso>USO NÃO AUTORIZADO SUJEITO A MULTA R$ 50.000 + INDENIZAÇÃO</Aviso>
         </EnterFixConfidential>
       - Metadata preservada mesmo após conversão de formato (ferramenta proprietária Enterfix);
       - Em caso de vazamento: Perícia técnica extrai metadata = PROVA IRREFUTÁVEL da origem.
    
    c) QR CODE EM PEÇAS FÍSICAS (quando aplicável):
       - Peças fabricadas por terceiros podem receber QR Code gravado a laser (se especificação permitir);
       - QR Code leva a portal Enterfix (público) mostrando:
         • "Peça fabricada sob licença Enterfix - Projeto confidencial";
         • Data fabricação, lote, certificado material;
         • ⚠️ NÃO exibe geometria, cliente final ou tolerâncias (proteção IP);
       - Objetivo: Se peça aparecer no mercado, QR Code comprova que veio de terceiro autorizado (rastreia cadeia).
    
    d) ALERTAS AUTOMÁTICOS DE VENCIMENTO:
       - Sistema Enterfix envia e-mail automático:
         • 15 dias antes prazo destruição: "Lembrete: Arquivo STEP #2347 deve ser destruído em 15 dias";
         • No dia do vencimento: "PRAZO CRÍTICO: Arquivo deve ser destruído HOJE. Envie Certificado";
         • 7 dias após vencimento: "ATRASO: Certificado de Destruição não recebido. Multa R$ 500/dia iniciada";
       - Cópia automaticamente para Jurídico Enterfix (construção de prova em caso de litígio).
    
    e) DASHBOARD DE CONFORMIDADE:
       - Gestão de Fornecedores > Aba "Sigilo e Confidencialidade":
         • Gráfico: NDAs por Status (✅ Vigente | ⚠️ Vence 30 dias | ❌ Vencido);
         • Tabela: Arquivos enviados aguardando Certificado de Destruição (ordenado por prazo);
         • KPI: Conformidade de Destruição (meta: 100% Certificados recebidos no prazo);
         • Alerta vermelho: Fornecedor com >3 Certificados atrasados = BLOQUEIO automático para novos pedidos.
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
    
    d) MULTAS ESPECÍFICAS POR TIPO DE VIOLAÇÃO:
       
       📌 TERCEIRO FABRICANTE (Usinagem, Tratamento, Caldeiraria):
          → Vazamento de arquivo técnico (STEP/DXF): R$ 50.000 OU 100% valor do pedido (o que for MAIOR);
          → Fabricação não autorizada para outro cliente: R$ 100.000 OU 200% do lucro obtido (o que for MAIOR);
          → Recusa de Certificado de Destruição: R$ 10.000 + R$ 500/dia de atraso;
          → Subcontratação não autorizada: R$ 30.000 + responsabilidade solidária por danos;
          → Engenharia reversa além do necessário: R$ 80.000 + sequestro de arquivos mapeados.
       
       📌 CLIENTE FINAL (que contratou serviço da Enterfix):
          → Uso de projeto para fabricação própria sem licença: 200% do valor da Engenharia Reversa;
          → Repasse de arquivo a terceiro não autorizado: R$ 100.000 + licença exclusiva cancelada;
          → Replicação para outras unidades/filiais: R$ 50.000 por unidade não licenciada.
       
       📌 PARCEIRO COMERCIAL (Representante, Consultor):
          → Divulgação de lista de clientes: R$ 80.000 + perda de comissões futuras;
          → Vazamento de estratégia comercial/preços: R$ 50.000;
          → Concorrência desleal usando informações: R$ 200.000 + lucros cessantes.
       
       📌 EX-COLABORADOR:
          → Uso de informações em nova empresa: R$ 100.000 + lucros cessantes + medida cautelar;
          → Vazamento de segredo industrial: Crime (Lei 9.279/96 Art. 195) + indenização ilimitada.
       
       📋 EXEMPLO PRÁTICO (Caso Terceiro Fabricante):
       Situação: Usinagem XYZ recebeu arquivo STEP de flange de medição (Pedido #2347, valor R$ 8.500).
       XYZ fabricou peça idêntica para Concorrente ABC sem autorização (lucro: R$ 12.000).
       
       Cálculo da Multa:
       • Vazamento de arquivo:
         - Opção 1: R$ 50.000 (multa base)
         - Opção 2: 100% do pedido = R$ 8.500
         - Regra: O QUE FOR MAIOR → R$ 50.000 ✓
       
       • Fabricação não autorizada:
         - Opção 1: R$ 100.000 (multa base)
         - Opção 2: 200% do lucro = R$ 12.000 × 2 = R$ 24.000
         - Regra: O QUE FOR MAIOR → R$ 100.000 ✓
       
       MULTA TOTAL = R$ 50.000 (vazamento) + R$ 100.000 (fabricação) = R$ 150.000
       
       + Indenização para Cliente Final ABC Indústrias (se processou Enterfix): valor integral pago pela Enterfix
       + Custos legais (honorários advocatícios: 20% sobre condenação)
       + Lucros cessantes (perda de vantagem competitiva da Enterfix no mercado)
       
       💡 EFEITO DISSUASÓRIO: Multa R$ 150.000 >> Lucro R$ 12.000 → Violação NÃO COMPENSA financeiramente.
       
       🎯 ESTRATÉGIA ENTERFIX: Multa alta = barreira econômica contra vazamento (terceiro pensa 10x antes de arriscar).

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