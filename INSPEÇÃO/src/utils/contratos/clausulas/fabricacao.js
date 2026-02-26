/**
 * CLÁUSULAS ESPECÍFICAS - Fabricação de Componentes sob Medida
 * 
 * Finalidade: Fabricação de peças, componentes e dispositivos metrológicos personalizados
 * Aplicável a: Empresas que necessitam peças especiais ou descontinuadas
 * 
 * Base legal/normativa:
 * - Código Civil Brasileiro (Lei 10.406/2002) - Contrato de Empreitada
 * - ABNT NBR ISO 9001:2015 - Gestão da Qualidade em Manufatura
 * - ABNT NBR ISO 2768-1 - Tolerâncias gerais para dimensões lineares e angulares
 * - ABNT NBR 6158 - Sistema de tolerâncias e ajustes
 * 
 * Serviços complementares (contratos separados):
 * - engenharia_reversa.js: Projeto reverso para peças sem documentação
 * - calibracao.js: Calibração dimensional pós-fabricação
 * - consultoria.js: Consultoria em materiais e processos de fabricação
 * 
 * @module contratos/clausulas/fabricacao
 * @category Atômico
 * @version 1.0.0
 * @lastUpdate 26/02/2026
 * @author Paulo Enterfix
 */

export const CLAUSULAS_FABRICACAO = {
    /**
     * Escopo do Serviço de Fabricação
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DOS SERVIÇOS DE FABRICAÇÃO
1.1. O presente contrato tem por objeto a fabricação de componentes mecânicos sob medida:
    a) Usinagem de precisão (torneamento, fresamento, retificação);
    b) Fabricação conforme desenho técnico 2D/3D fornecido ou desenvolvido;
    c) Seleção de materiais adequados (aços, alumínio, latão, polímeros de engenharia);
    d) Tratamentos térmicos e superficiais quando especificados;
    e) Inspeção dimensional e relatório de conformidade;
    f) Embalagem adequada para transporte e armazenamento.

1.2. Especificações técnicas:
    a) Tolerâncias dimensionais conforme ABNT NBR ISO 2768-1 (classes: média, fina, muito fina);
    b) Rugosidade superficial conforme ABNT NBR ISO 1302 (Ra, Rz);
    c) Tolerâncias geométricas conforme ABNT NBR ISO 1101 (paralelismo, perpendicularidade, concentricidade);
    d) Materiais certificados com certificado de qualidade 3.1 (quando aplicável);
    e) Processo de fabricação rastreável e documentado.

1.3. Documentação técnica fornecida pela CONTRATADA:
    a) Relatório de Inspeção Dimensional (medições críticas com paquímetro/micrômetro);
    b) Certificado de Qualidade do Material (quando exigido);
    c) Fotos das peças fabricadas;
    d) Certificado de tratamento térmico/superficial (quando aplicável);
    e) Desenho "como fabricado" (as-built) se houver alterações aprovadas.

1.4. NÃO estão inclusos no escopo de fabricação:
    a) Engenharia reversa de peças existentes (vide "Contrato de Engenharia Reversa");
    b) Desenvolvimento de projeto conceitual ou otimização de design;
    c) Calibração dimensional pós-fabricação (vide "Contrato de Calibração");
    d) Montagem de conjuntos complexos ou submontagens;
    e) Pintura, cromagem ou revestimentos decorativos (exceto se especificado);
    f) Estoque ou armazenamento de peças fabricadas por prazo prolongado;
    g) Garantia de desempenho funcional da peça em aplicação específica (responsabilidade do projeto).

1.5. Serviços complementares disponíveis mediante contratação adicional:
    a) Engenharia reversa completa de peça original → "Contrato de Engenharia Reversa";
    b) Desenvolvimento de projeto conceitual e otimização → "Contrato de Consultoria";
    c) Inspeção dimensional com certificado de calibração → "Contrato de Calibração";
    d) Consultoria em seleção de materiais e processos → "Contrato de Consultoria".
`,

    /**
     * Especificações e Documentação Técnica
     */
    especificacoes: () => `
CLÁUSULA ESPECÍFICA 2 - DAS ESPECIFICAÇÕES E DOCUMENTAÇÃO TÉCNICA
2.1. Documentação técnica obrigatória fornecida pela CONTRATANTE:
    a) DESENHO TÉCNICO 2D (formato PDF, DWG ou DXF):
       → Vistas principais (frontal, lateral, superior);
       → Cotas dimensionais completas;
       → Tolerâncias especificadas (ou indicação de classe de tolerância);
       → Rugosidade superficial (quando aplicável);
       → Tolerâncias geométricas (quando aplicável);
       → Material especificado e tratamento térmico (se houver).
    
    b) MODELO 3D (opcional, mas recomendado):
       → Formatos aceitos: STEP, IGES, Parasolid, STL;
       → Facilita interpretação e reduz riscos de erro;
       → Permite simulação de fabricação e otimização de processo.
    
    c) AMOSTRA FÍSICA (para engenharia reversa):
       → Se não houver desenho técnico completo;
       → Estado de conservação: bom (sem desgaste excessivo);
       → Será realizado levantamento dimensional completo (serviço adicional).

2.2. Análise crítica de projeto:
    a) A CONTRATADA realizará análise crítica do desenho técnico antes da fabricação;
    b) Serão identificados: impossibilidades técnicas, tolerâncias incompatíveis, falta de informações;
    c) Prazo para análise: 2 (dois) dias úteis após recebimento da documentação;
    d) CONTRATANTE será notificada de quaisquer inconsistências para aprovação de alterações.

2.3. Alterações de projeto durante fabricação:
    a) Alterações solicitadas pela CONTRATANTE após início da fabricação:
       → Serão avaliadas quanto à viabilidade técnica;
       → Podem gerar custo adicional proporcional ao retrabalho;
       → Prazo de entrega será recalculado.
    
    b) Alterações sugeridas pela CONTRATADA (para viabilização técnica):
       → Serão submetidas à aprovação da CONTRATANTE;
       → Não gerarão custo adicional se comprovadamente necessárias;
       → Serão documentadas em desenho "como fabricado" (as-built).

2.4. Confidencialidade de projetos:
    a) Desenhos técnicos e especificações são confidenciais;
    b) Não serão divulgados, replicados ou utilizados para terceiros sem autorização;
    c) Vedada fabricação de peças idênticas para outros clientes sem consentimento expresso;
    d) Vigência do sigilo: PERMANENTE (conforme cláusula de Propriedade Intelectual).
`,

    /**
     * Materiais e Processos de Fabricação
     */
    materiais: () => `
CLÁUSULA ESPECÍFICA 3 - DOS MATERIAIS E PROCESSOS DE FABRICAÇÃO
3.1. Materiais disponíveis para fabricação:
    a) AÇOS:
       → Aço carbono: SAE 1020, SAE 1045, SAE 1060;
       → Aço inoxidável: AISI 304, AISI 316, AISI 420;
       → Aço ferramenta: AISI D2, AISI H13, AISI P20.
    
    b) ALUMÍNIO E LIGAS:
       → Alumínio 6061-T6, 7075-T6 (aeronáutico);
       → Alumínio 2024 (alta resistência mecânica).
    
    c) LATÃO E BRONZE:
       → Latão 360 (livre corte), Bronze SAE 65.
    
    d) POLÍMEROS DE ENGENHARIA:
       → Nylon PA6, PA66;
       → Poliacetal (POM) - Delrin;
       → PEEK (aplicações de alta temperatura);
       → PTFE - Teflon (baixo coeficiente de atrito).

3.2. Certificação de materiais:
    a) Materiais com certificado de qualidade 3.1 (conforme EN 10204):
       → Custo adicional de 10% sobre valor do material;
       → Prazo adicional de 5 dias úteis para aquisição;
       → Obrigatório para indústrias reguladas (aeronáutica, petroquímica, farmacêutica).
    
    b) Materiais sem certificação:
       → Origem: Distribuidores homologados pela CONTRATADA;
       → Garantia de conformidade dimensional e mecânica básica;
       → Adequado para maioria das aplicações industriais padrão.

3.3. CLASSES DE PRECISÃO E PROCESSOS DE FABRICAÇÃO MODULARES:

    ATENÇÃO: A escolha da classe de precisão impacta diretamente o PREÇO, PRAZO e MÉTODO DE INSPEÇÃO.
    O sistema Enterfix vincula automaticamente o processo ao custo de inspeção dimensional.

    a) CLASSE PADRÃO - USINAGEM CONVENCIONAL (±0,05 mm):
       → Torno mecânico, fresadora, furadeira de coluna;
       → Tolerância: ISO 2768-m (média);
       → Rugosidade típica: Ra 3,2 a 6,3 μm;
       → Inspeção: Paquímetro digital (0,01mm) + micrômetro (0,001mm);
       → PREÇO: Base (100%);
       → PRAZO: Padrão (100%);
       → APLICAÇÃO: Peças estruturais, suportes, espaçadores, componentes sem ajuste crítico.
    
    b) CLASSE INTERMEDIÁRIA - USINAGEM CNC (±0,02 mm):
       → Torno CNC, centro de usinagem 3 eixos;
       → Tolerância: ISO 2768-f (fina);
       → Rugosidade típica: Ra 1,6 a 3,2 μm;
       → Inspeção: Micrômetro (0,001mm) + relógio comparador + 50% das cotas com MMC;
       → PREÇO: Base + 30% (custo de programação CNC, setup e inspeção rigorosa);
       → PRAZO: Padrão + 20% (tempo de programação e validação);
       → APLICAÇÃO: Eixos com ajuste H7/h6, buchas de precisão, componentes de montagem.
    
    c) CLASSE ALTA - RETIFICAÇÃO (±0,005 mm):
       → Retífica plana ou cilíndrica;
       → Tolerância: ISO 2768-v (muito fina) ou ISO 286 (IT5 a IT7);
       → Rugosidade: Ra 0,4 a 0,8 μm;
       → Inspeção: 100% das cotas críticas com MMC (Máquina de Medir por Coordenadas) + certificado dimensional;
       → PREÇO: Base + 80% a 120% (processo lento, inspeção meticulosa, custo MMC);
       → PRAZO: Padrão + 50% (múltiplos passes, resfriamento, inspeção 100%);
       → APLICAÇÃO: Eixos de precisão, pinos calibradores, fusos, componentes metrológicos.
    
    d) VÍNCULO AUTOMÁTICO NO SISTEMA ENTERFIX:
       → Se cliente selecionar ±0,02mm: Sistema marca OBRIGATORIAMENTE "CNC" e adiciona 30% ao preço;
       → Se cliente selecionar ±0,005mm: Sistema marca OBRIGATORIAMENTE "Retificação + MMC" e adiciona 80-120%;
       → TRAVA DE SEGURANÇA: Impede oferta de alta precisão com processo inadequado (protege contra reclamações).

3.4. Tratamentos térmicos e superficiais (BLINDAGEM CONTRA ERROS DE TERCEIROS):
    a) TRATAMENTOS TÉRMICOS:
       → Recozimento, normalização, têmpera, revenimento;
       → Cementação, nitretação;
       → Executados por terceiros especializados homologados pela CONTRATADA;
       → ALERTA AUTOMÁTICO NO SISTEMA: Prazo adicional de 7 a 15 dias úteis será informado ao cliente automaticamente.
    
    b) TRATAMENTOS SUPERFICIAIS:
       → Zincagem eletrolítica;
       → Anodização (alumínio);
       → Fosfatização;
       → Executados por terceiros especializados homologados pela CONTRATADA.
    
    c) Prazo adicional: 7 a 15 dias úteis (VARIÁVEL conforme carga do fornecedor);
    d) Custo adicional: Valor do terceiro + 15% administrativo (gestão, transporte, inspeção pós-tratamento).
    
    e) RESPONSABILIDADE POR ERROS DE TERCEIROS (FORÇA MAIOR / FATO DE TERCEIRO):
       → A CONTRATADA seleciona fornecedores homologados e inspeciona peças pós-tratamento;
       → CONTRATADA refará a peça SEM CUSTO se erro de tratamento for detectado na inspeção final;
       → ATRASOS do fornecedor de tratamento: Considerados FORÇA MAIOR (não geram multas contra Enterfix), mas cliente será notificado imediatamente;
       → EMPENAMENTO ou DISTORÇÃO excessiva (acima de 0,3mm): CONTRATADA refará usinagem pós-tratamento sem custo adicional (já incluso no orçamento quando há tratamento térmico);
       → CAMADA INADEQUADA (espessura fora da norma): CONTRATADA enviará novamente para retrabalho do terceiro sem custo ao cliente;
       → BLINDAGEM JURÍDICA: A responsabilidade da CONTRATADA limita-se à escolha criteriosa do fornecedor e inspeção final; eventos imprevisíveis do terceiro (greve, quebra de forno, contaminação de banho) são considerados fato de terceiro, não gerando responsabilidade civil contra a CONTRATADA além da reexecução do serviço.
`,

    /**
     * Prazo de Execução e Etapas
     */
    prazo: () => `
CLÁUSULA ESPECÍFICA 4 - DOS PRAZOS DE EXECUÇÃO E ETAPAS
4.1. Prazo padrão para fabricação (complexidade média):
    a) Peças simples (até 5 operações): 7 a 10 dias úteis;
    b) Peças médias (6 a 15 operações): 15 a 20 dias úteis;
    c) Peças complexas (acima de 15 operações): 20 a 30 dias úteis;
    d) Lotes de produção (acima de 10 unidades): prazo sob consulta.

4.2. Fatores que influenciam o prazo:
    a) Disponibilidade de material em estoque (pode adicionar 5 a 10 dias);
    b) Necessidade de tratamento térmico/superficial (adicionar 7 a 15 dias);
    c) Necessidade de ferramentas especiais (adicionar 5 a 10 dias);
    d) Complexidade geométrica e tolerâncias apertadas;
    e) Fila de produção (capacidade do parque fabril).

4.3. Etapas do processo de fabricação:
    a) ANÁLISE CRÍTICA (2 dias úteis):
       → Revisão do desenho técnico;
       → Identificação de inconsistências;
       → Aprovação ou solicitação de ajustes.
    
    b) AQUISIÇÃO DE MATERIAL (0 a 10 dias úteis):
       → Material em estoque: imediato;
       → Material sob encomenda: 5 a 10 dias úteis;
       → Material com certificação 3.1: 7 a 15 dias úteis.
    
    c) FABRICAÇÃO PROPRIAMENTE DITA (5 a 25 dias úteis):
       → Usinagem, furação, rosqueamento;
       → Tratamento térmico/superficial (se aplicável);
       → Inspeção dimensional em processo.
    
    d) INSPEÇÃO FINAL (1 a 2 dias úteis):
       → Medição de cotas críticas;
       → Verificação de rugosidade e tolerâncias geométricas;
       → Emissão de relatório de inspeção.
    
    e) EMBALAGEM E DISPONIBILIZAÇÃO (1 dia útil):
       → Embalagem adequada para transporte;
       → Notificação ao cliente para retirada/envio.

4.4. Serviço expresso (urgente):
    a) Prazo reduzido em até 50% mediante:
       → Acréscimo de 50% sobre valor normal;
       → Disponibilidade de material em estoque;
       → Sem tratamentos térmicos externos (apenas usinagem).
    
    b) Não aplicável a peças extremamente complexas ou com tratamentos especiais.

4.5. Comunicação de atrasos:
    a) Cliente será notificado com 3 dias úteis de antecedência sobre qualquer atraso;
    b) Será fornecido novo prazo estimado e justificativa técnica;
    c) Cliente poderá: aguardar, cancelar (reembolso proporcional) ou aceitar entrega parcial.
`,

    /**
     * Inspeção, Qualidade e Conformidade
     */
    qualidade: () => `
CLÁUSULA ESPECÍFICA 5 - DA INSPEÇÃO, QUALIDADE E CONFORMIDADE
5.1. Inspeção dimensional obrigatória:
    a) 100% das cotas críticas especificadas no desenho;
    b) Amostragem de cotas secundárias (mínimo 30% das cotas);
    c) Rugosidade superficial (quando especificada);
    d) Tolerâncias geométricas (paralelismo, perpendicularidade, concentricidade).

5.2. Instrumentos de medição utilizados:
    a) Paquímetro digital (resolução 0,01 mm) - calibrado com validade vigente;
    b) Micrômetro externo (resolução 0,001 mm) - calibrado com validade vigente;
    c) Relógio comparador (resolução 0,001 mm) - verificado;
    d) Rugosímetro portátil (quando aplicável);
    e) Máquina de medir tridimensional (quando disponível e aplicável).

5.3. Relatório de Inspeção Dimensional (INTEGRAÇÃO COM SISTEMA DE RASTREABILIDADE):
    a) Identificação da peça (desenho, revisão, número de série único Enterfix);
    b) Tabela com cotas medidas x cotas especificadas;
    c) Status de conformidade (OK / NOK / COM DESVIO APROVADO);
    d) Observações sobre desvios ou não conformidades;
    e) Data de inspeção e responsável técnico;
    f) Instrumentos utilizados e certificados de calibração (rastreáveis RBC);
    
    g) QR CODE DE RASTREABILIDADE (Integração Portal Enterfix):
       → Cada peça fabricada recebe QR Code único gravado (laser) ou etiqueta adesiva;
       → Ao escanear: Cliente acessa INSTANTANEAMENTE via portal Enterfix:
          • Relatório de Inspeção Dimensional completo (PDF);
          • Certificado de Qualidade do Material 3.1 (se aplicável);
          • Certificado de Tratamento Térmico/Superficial (se aplicável);
          • Fotos da peça antes do envio;
          • Histórico de rastreabilidade (data de fabricação, inspetor, lote de material).
       → BENEFÍCIO ESTRATÉGICO: Gera confiança absurda no cliente (ele sabe que a peça instalada foi validada pela Enterfix Metrologia);
       → DIFERENCIAÇÃO COMPETITIVA: Nenhum fabricante artesanal oferece rastreabilidade digital em tempo real;
       → Armazenamento: Supabase Storage com retenção de 10 anos (conforme ISO 9001).

5.4. Critérios de aceitação:
    a) Peça APROVADA: Todas as cotas críticas dentro da tolerância especificada;
    b) Peça COM DESVIO: Cotas fora de tolerância, mas funcionalmente aceitáveis (mediante aprovação do cliente);
    c) Peça REPROVADA: Cotas fora de tolerância que inviabilizam uso (será refugada ou refeita).

5.5. Não conformidades, retrabalho e força maior:
    a) Peças reprovadas por erro da CONTRATADA: Refará SEM CUSTO ADICIONAL (até 2 tentativas);
    b) Peças com desvio aprovado pelo cliente: Será documentado em relatório "COM DESVIO APROVADO" + assinatura do cliente;
    c) Após 2 tentativas sem êxito: Contrato poderá ser cancelado com reembolso integral;
    
    d) RESPONSABILIDADE DA CONTRATADA (refaz sem custo):
       → Erro de interpretação do desenho técnico;
       → Usinagem fora de tolerância por falha de operação;
       → Material fornecido diferente do especificado;
       → Erro de inspeção (cota incorreta aprovada indevidamente).
    
    e) RESPONSABILIDADE DA CONTRATANTE (custo adicional para refazer):
       → Desenho técnico incorreto ou incompleto fornecido pelo cliente;
       → Alteração de especificação após início da fabricação;
       → Material especificado inadequado para a aplicação (cliente escolheu errado).
    
    f) FORÇA MAIOR / FATO DE TERCEIRO (não gera multa contra CONTRATADA):
       → Atrasos de fornecedores de tratamento térmico/superficial (greve, quebra de equipamento, contaminação de banho);
       → Empenamento excessivo ou distorção de peça durante tratamento térmico executado por terceiro HOMOLOGADO (CONTRATADA refará a usinagem, mas prazo será prorrogado sem penalidade);
       → Falta de material no mercado (cliente será notificado para aprovação de material equivalente);
       → Eventos imprevisíveis: Enchentes, incêndios, falta de energia prolongada, pandemias, greves gerais;
       → PROTEÇÃO JURÍDICA: Estes eventos NÃO geram indenização por lucros cessantes contra a CONTRATADA, limitando-se ao reembolso proporcional ou reexecução do serviço sem custos adicionais ao cliente.
`,

    /**
     * Valores, Pagamento e Condições Comerciais
     */
    valores: () => `
CLÁUSULA ESPECÍFICA 6 - DOS VALORES, PAGAMENTO E CONDIÇÕES COMERCIAIS
6.1. Composição do preço de fabricação:
    a) CUSTO DE MATERIAL:
       → Valor do material bruto (barra, chapa, tarugo);
       → Certificação 3.1 (se aplicável): +10%;
       → Perdas de processo (corte, refugo): já incluídas.
    
    b) CUSTO DE MÃO DE OBRA:
       → Tempo de usinagem estimado (hora/máquina);
       → Complexidade das operações;
       → Setup e preparação de ferramentas;
       → Inspeção dimensional.
    
    c) TRATAMENTOS (se aplicável):
       → Tratamento térmico: valor de terceiro + 15% administrativo;
       → Tratamento superficial: valor de terceiro + 15% administrativo.
    
    d) MARGEM E IMPOSTOS:
       → Margem de lucro, despesas administrativas, impostos.

6.2. Orçamento e aprovação:
    a) Orçamento detalhado fornecido em até 3 dias úteis após análise crítica;
    b) Validade do orçamento: 15 (quinze) dias corridos;
    c) Início da fabricação: Apenas após aprovação FORMAL do orçamento (e-mail ou assinatura);
    d) Alterações após aprovação: Novo orçamento será emitido para aprovação.

6.3. Forma de pagamento:
    a) PEÇAS UNITÁRIAS OU LOTES PEQUENOS (até R$ 5.000):
       → 50% de sinal no ato da aprovação do orçamento;
       → 50% na entrega/retirada da peça.
    
    b) LOTES MAIORES OU PROJETOS COMPLEXOS (acima de R$ 5.000):
       → 30% de sinal no ato da aprovação do orçamento;
       → 40% no meio do processo (após usinagem, antes de tratamentos);
       → 30% na entrega final.
    
    c) CONTRATOS RECORRENTES (clientes com plano de manutenção):
       → Pagamento em até 30 dias após entrega (faturamento mensal);
       → Desconto de 10% a 25% conforme plano contratado.

6.4. Descontos e condições especiais:
    a) Lotes de produção (acima de 10 unidades idênticas): desconto progressivo de 5% a 20%;
    b) Projetos recorrentes (reposição periódica): desconto de 10%;
    c) Pagamento à vista (antecipado 100%): desconto de 5%;
    d) Clientes com "Contrato de Plano de Manutenção": 10% a 25% de desconto (conforme plano).

6.5. Cancelamento e reembolso:
    a) Cancelamento antes do início da fabricação: reembolso de 90% do sinal (10% administrativo);
    b) Cancelamento com material já adquirido: dedução do custo do material + 10% administrativo;
    c) Cancelamento após início da usinagem: sem reembolso (serviço já prestado);
    d) Cancelamento por impossibilidade técnica da CONTRATADA: reembolso integral de valores pagos.
`,

    /**
     * Garantia Específica de Fabricação
     */
    garantia: () => `
CLÁUSULA ESPECÍFICA 7 - DA GARANTIA ESPECÍFICA DE FABRICAÇÃO
7.1. A CONTRATADA garante que a peça fabricada:
    a) Atende às especificações dimensionais do desenho técnico (dentro das tolerâncias);
    b) Foi fabricada com material conforme especificado (certificado disponível se solicitado);
    c) Foi inspecionada conforme procedimentos da qualidade;
    d) Está livre de defeitos de fabricação (trincas, porosidade, inclusões).

7.2. Garantia de 90 (noventa) dias contra defeitos de fabricação:
    a) Defeitos dimensionais: Cotas fora de tolerância não identificadas na inspeção;
    b) Defeitos de material: Trincas, porosidade ou inclusões não visíveis antes da entrega;
    c) Defeitos de tratamento térmico: Dureza fora da especificação, distorção excessiva;
    d) Defeitos de acabamento: Rugosidade acima do especificado, rebarbas excessivas.

7.3. Reposição ou correção SEM CUSTO em caso de:
    a) Erro dimensional comprovado da CONTRATADA (medição incorreta ou usinagem errada);
    b) Material impróprio fornecido pela CONTRATADA (diferente do especificado);
    c) Tratamento térmico/superficial executado incorretamente;
    d) Defeitos não visíveis na inspeção inicial (trincas internas, inclusões).

7.4. A garantia NÃO cobre:
    a) Desgaste natural por uso normal ou abrasivo;
    b) Danos causados por instalação, montagem ou uso inadequados;
    c) Modificações, usinagens ou tratamentos realizados por terceiros após entrega;
    d) Corrosão ou oxidação por armazenamento inadequado;
    e) Falha funcional da peça em aplicação específica (responsabilidade do projeto);
    f) Quebra por sobrecarga acima das especificações do material;
    g) Danos estéticos que não afetem a funcionalidade.

7.5. REGRA DE OURO DA RESPONSABILIDADE DE PROJETO (BLINDAGEM MÁXIMA):

    ATENÇÃO: Esta é a cláusula mais importante para proteção patrimonial da CONTRATADA.

    a) ESCOPO DA RESPONSABILIDADE DA CONTRATADA:
       → GARANTE: Conformidade dimensional (cotas dentro de tolerância);
       → GARANTE: Qualidade de fabricação (sem defeitos de usinagem, material conforme especificado);
       → GARANTE: Processo rastreável e documentado (relatórios, certificados, QR Code);
       → NÃO GARANTE: Desempenho funcional da peça em aplicação específica;
       → NÃO GARANTE: Adequação do material escolhido para a função pretendida;
       → NÃO GARANTE: Resistência mecânica suficiente para cargas específicas da aplicação.
    
    b) PROJETOS FORNECIDOS PELO CLIENTE (Desenho técnico do cliente):
       → Responsabilidade INTEGRAL do cliente sobre: Dimensões, tolerâncias, materiais, tratamentos;
       → EXEMPLO DE BLINDAGEM: Se cliente especifica Aço SAE 1020 e o eixo quebra porque a aplicação exigia Aço SAE 4340 temperado, a responsabilidade é EXCLUSIVAMENTE do cliente (erro de projeto);
       → A CONTRATADA executou corretamente a fabricação conforme especificado, mas o PROJETO DO CLIENTE estava subdimensionado;
       → PROTEÇÃO CONTRA LUCROS CESSANTES: A CONTRATADA não responde por paradas de fábrica, perdas de produção ou danos consequenciais decorrentes de falha de projeto fornecido pelo cliente.
    
    c) PROJETOS DESENVOLVIDOS PELA CONTRATADA (Engenharia Reversa ou Consultoria):
       → Responsabilidade COMPARTILHADA conforme "Contrato de Engenharia Reversa" ou "Contrato de Consultoria";
       → CONTRATADA responde pela fidelidade dimensional da engenharia reversa;
       → Cliente deve validar FUNCIONALMENTE um protótipo antes de encomendar lote de produção;
       → Recomendação: Fabricar 1 peça protótipo → Cliente testa em aplicação real → Aprovar lote somente após validação funcional.
    
    d) ANÁLISE CRÍTICA E RESSALVAS TÉCNICAS:
       → A CONTRATADA realizará análise crítica do desenho (Cláusula 2.2) e informará IMPOSSIBILIDADES TÉCNICAS;
       → Se cliente INSISTIR em especificação tecnicamente inadequada (ex: tolerância impossível, material frágil demais), a CONTRATADA exigirá TERMO DE CIÊNCIA E RESPONSABILIDADE assinado;
       → Este termo ISENTA a CONTRATADA de responsabilidade por quebra, falha funcional ou não conformidade dimensional resultante da especificação inadequada do cliente.
    
    e) EXEMPLO PRÁTICO DE APLICAÇÃO DA REGRA DE OURO:
       → Cliente: "Fabricar eixo Ø50mm x 200mm em Aço 1020";
       → Enterfix: Fabrica conforme desenho, dimensões OK, material OK;
       → Cliente: Instala o eixo em redução de 500:1 com torque de 2000 Nm;
       → Resultado: Eixo quebra em 1 semana (fadiga);
       → RESPONSABILIDADE: 100% do cliente (projeto subdimensionado - deveria usar Aço 4340 temperado com Ø60mm e tratamento térmico);
       → Enterfix: Isenta de indenização (cumpriu o contrato - fabricou conforme especificado).

7.6. Suporte pós-entrega:
    a) Esclarecimentos sobre relatório de inspeção: até 30 dias após entrega (gratuito);
    b) Reemissão de documentação por perda: R$ 100 por conjunto;
    c) Inspeção dimensional adicional com certificado de calibração: vide "Contrato de Calibração";
    d) Análise de falha ou quebra: Vide "Contrato de Consultoria" (primeira análise: desconto de 50%).
`,

    /**
     * Propriedade Intelectual e Sigilo
     */
    propriedade_intelectual: () => `
CLÁUSULA ESPECÍFICA 8 - DA PROPRIEDADE INTELECTUAL E SIGILO
8.1. Titularidade do projeto:
    a) Desenhos técnicos fornecidos pela CONTRATANTE: Propriedade integral da CONTRATANTE;
    b) Desenhos desenvolvidos pela CONTRATADA (engenharia reversa): Propriedade da CONTRATADA (licença de uso para CONTRATANTE);
    c) Alterações de projeto para viabilização técnica: Propriedade compartilhada.

8.2. Uso e reprodução:
    a) CONTRATANTE adquire apenas o direito de USO das peças fabricadas;
    b) NÃO adquire direito de reprodução dos desenhos para fabricação por terceiros;
    c) Reprodução por terceiros: Requer autorização expressa da CONTRATADA (royalties aplicáveis);
    d) Exceção: Desenhos fornecidos originalmente pela CONTRATANTE (reprodução livre).

8.3. PROIBIÇÃO DE USO COMO MOLDE OU MODELO (BLINDAGEM DE IP):
    a) Vedado utilizar peças fabricadas pela CONTRATADA como base para engenharia reversa por terceiros;
    b) Vedado fornecer peças a concorrentes diretos da CONTRATADA para replicação;
    c) Vedado utilizar a peça como "MOLDE" ou "MODELO" para que outro fabricante copie as dimensões;
    
    d) ESTRATÉGIA DE PROTEÇÃO - "DNA DA PEÇA":
       → Se a Enterfix realizou Engenharia Reversa + Fabricação, a empresa possui o "DNA completo" da peça (nuvem de pontos, modelo matemático, compensação de desgaste ISO 286);
       → Desenho técnico gerado pela Enterfix: PROPRIEDADE INTELECTUAL da Enterfix (cliente tem LICENÇA DE USO);
       → Se cliente levar o desenho Enterfix para outro fabricante sem autorização: VIOLAÇÃO DE IP + cobrança retroativa dos 200% de licença exclusiva (Cláusula 6.4 do Contrato de Engenharia Reversa).
    
    e) Violação comprovada:
       → Multa de 200% do valor do projeto (aumentada de 50% para 200% para igualar à licença de IP);
       → Perdas e danos comprovados (lucro cessante da Enterfix por perda de cliente recorrente);
       → Medidas judiciais cabíveis (busca e apreensão de peças, interdição de fábrica);
       → Notificação ao INPI (Instituto Nacional de Propriedade Industrial) se desenho for registrado.

8.4. Sigilo e confidencialidade (PERMANENTE):
    a) Desenhos técnicos, especificações e processos de fabricação são CONFIDENCIAIS;
    b) Não serão divulgados, replicados ou utilizados para outros clientes sem autorização;
    c) Vigência do sigilo: PERMANENTE (não expira com término do contrato);
    d) Vedada divulgação comercial ou uso em portfólio sem autorização expressa.

8.5. PROTEÇÃO CONTRA CÓPIA E RASTREABILIDADE DIGITAL:
    a) CONTRATANTE se compromete a não utilizar peças como molde ou modelo para terceiros;
    b) CONTRATANTE se compromete a não realizar engenharia reversa das peças para reprodução comercial;
    c) CONTRATANTE se compromete a não fornecer as peças a concorrentes diretos da CONTRATADA;
    d) CONTRATANTE se compromete a não remover ou alterar o QR Code de rastreabilidade gravado/etiquetado na peça;
    
    e) RASTREABILIDADE COMO PROTEÇÃO DE IP:
       → Cada peça fabricada possui QR Code único vinculado ao cliente no sistema Enterfix (Supabase);
       → Se peça for encontrada em posse de terceiro não autorizado: EVIDÊNCIA DIGITAL de violação de IP;
       → Sistema registra: Data de fabricação, cliente original, projeto vinculado, relatórios acessados;
       → Em caso de litígio: Enterfix apresenta logs do Supabase como prova de cadeia de custódia intelectual.
    
    f) Violação comprovada:
       → Multa de 200% do valor total do contrato (aumentada para equiparar à licença exclusiva de IP);
       → Perdas e danos comprovados (lucro cessante por perda de reposição futura);
       → Se violação envolver Engenharia Reversa prévia da Enterfix: Cobrança RETROATIVA dos 200% de licença exclusiva não paga;
       → Medidas judiciais: Busca e apreensão de peças copiadas, interdição de uso, notificação INPI.
`,
};