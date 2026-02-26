/**
 * CLÁUSULAS ESPECÍFICAS - Engenharia Reversa e Documentação Técnica
 * 
 * Finalidade: Levantamento dimensional, modelagem 3D e documentação técnica de peças existentes
 * Aplicável a: Empresas com peças descontinuadas, sem documentação ou obsoletas
 * 
 * Base legal/normativa:
 * - Lei 9.609/1998 - Propriedade Intelectual de Software (aplicável a modelos CAD)
 * - Lei 9.279/1996 - Propriedade Industrial
 * - Código Civil Brasileiro (Lei 10.406/2002) - Contrato de Prestação de Serviços
 * - ABNT NBR ISO 128-1 - Desenho técnico
 * - ABNT NBR 8402 - Execução de caracteres para escrita em desenhos técnicos
 * 
 * Serviços complementares (contratos separados):
 * - fabricacao.js: Fabricação da peça após eng. reversa
 * - calibracao.js: Calibração dimensional de alta precisão
 * - consultoria.js: Consultoria em otimização de projeto
 * 
 * @module contratos/clausulas/engenharia_reversa
 * @category Atômico
 * @version 1.0.0
 * @lastUpdate 26/02/2026
 * @author Paulo Enterfix
 */

export const CLAUSULAS_ENGENHARIA_REVERSA = {
    /**
     * Escopo do Serviço de Engenharia Reversa
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DOS SERVIÇOS DE ENGENHARIA REVERSA
1.1. O presente contrato tem por objeto a engenharia reversa de componentes:
    a) Levantamento dimensional completo da peça física;
    b) Modelagem 3D (CAD) em software profissional (SolidWorks, Inventor ou AutoCAD);
    c) Geração de desenho técnico 2D conforme ABNT NBR ISO 128-1;
    d) Especificação de materiais e tratamentos térmicos/superficiais (análise visual);
    e) Documentação técnica completa para replicação;
    f) Entrega de arquivos editáveis (STEP, DWG, DXF, PDF).

1.2. Especificações técnicas do processo:
    a) MEDIÇÃO DIMENSIONAL:
       → Instrumentos calibrados: paquímetro (0,01mm), micrômetro (0,001mm), goniômetro;
       → Método padrão: Medição ponto a ponto com registro fotográfico;
       → Precisão padrão: ±0,05mm para dimensões lineares, ±0,5° para ângulos;
       → Precisão alta: ±0,01mm EXCLUSIVAMENTE com MMC (Máquina de Medir por Coordenadas) - custo adicional 50%.
    
    b) MODELAGEM 3D (AS-DESIGNED - Compensação Técnica):
       → Software: SolidWorks (preferencial), Inventor ou AutoCAD 3D;
       → Formato de entrega: STEP (.stp), Parasolid (.x_t), IGES (.igs), arquivo nativo (.sldprt);
       → Recursos modelados: geometria completa, furos, roscas, rasgos de chaveta;
       → COMPENSAÇÃO DE DESGASTE (ISO 286): O modelo matemático gerado seguirá a intenção de projeto original (nominal), aplicando-se correções geométricas para neutralizar desgastes, oxidações ou deformações presentes na amostra física. Entrega-se o "projeto ideal", não a cópia da peça gasta.
    
    c) DESENHO TÉCNICO 2D:
       → Vistas principais (frontal, superior, lateral) conforme ABNT;
       → Cotas funcionais e de fabricação;
       → Tolerâncias dimensionais (geral médio conforme ISO 2768-m, ou ISO 286 para ajustes);
       → Especificação de material (estimado visualmente ou fornecido pelo cliente);
       → Rugosidade superficial (quando identificável);
       → Notas técnicas e observações;
       → INTEGRAÇÃO METROLÓGICA: Relatório de desvios (amostra física vs. modelo matemático corrigido) para rastreabilidade do processo de compensação.

1.3. ENTREGÁVEIS MODULARES CONFORME NÍVEL DE SERVIÇO CONTRATADO:

    ATENÇÃO: O serviço contratado limita-se EXCLUSIVAMENTE ao nível selecionado abaixo.
    Cada nível possui ESCOPO, RESPONSABILIDADE e PREÇO distintos.

    a) NÍVEL 1 - CAPTURA DE DADOS (AS-IS - "Como Está"):
       → Nuvem de pontos bruta (formato STL ou OBJ);
       → Relatório de inspeção visual (condições da amostra, desgastes identificados);
       → Fotos da peça original (mínimo 6 ângulos diferentes);
       → Planilha de medições brutas (cotas "como medido" na peça física);
       → ESTE NÍVEL NÃO INCLUI: Modelo sólido editável CAD, desenho técnico 2D, compensação de desgaste.
       → APLICAÇÃO: Conferência dimensional, escaneamento para arquivo, réplica artesanal.
       → RESPONSABILIDADE: Baixa (cliente recebe apenas dados, não projeto).

    b) NÍVEL 2 - MODELAGEM MATEMÁTICA (AS-DESIGNED - "Como Projetado"):
       → TODOS os itens do Nível 1 +
       → Modelo 3D sólido editável (STEP, IGES, Parasolid, arquivo nativo .sldprt);
       → Desenho técnico 2D completo (PDF, DWG, DXF) conforme ABNT NBR ISO 128-1;
       → COMPENSAÇÃO TÉCNICA DE DESGASTE (ISO 286): Correções geométricas aplicadas para resgatar dimensões originais de projeto;
       → Especificação técnica (material estimado, tratamentos, tolerâncias);
       → Relatório de desvios metrológicos (amostra física vs. modelo matemático corrigido - "DNA da peça");
       → APLICAÇÃO: Fabricação de peças novas, reposição, manutenção de parque.
       → RESPONSABILIDADE: Alta (entrega de projeto funcional para fabricação).

    c) NÍVEL 3 - PROJETO DE FERRAMENTAL (TOOLING DESIGN):
       → TODOS os itens do Nível 2 +
       → Projeto de molde de injeção, fundição ou conformação;
       → Projeto de punção/matriz para estampagem;
       → Análise de linha de partição e ângulos de extração;
       → Simulação básica de esforços (se aplicável);
       → Desenho técnico do ferramental (molde/punção) em formato 2D;
       → APLICAÇÃO: Produção seriada, injeção plástica, estampagem metálica.
       → RESPONSABILIDADE: Altíssima (projeto completo do processo de fabricação).

    1.3.1. ESCOLHA DO NÍVEL:
           → O cliente deve especificar explicitamente no pedido qual nível deseja contratar;
           → Pagamento do Nível 1 NÃO confere direito aos entregáveis do Nível 2 ou 3;
           → Upgrade entre níveis: Custo adicional conforme tabela (Cláusula 6).

    1.3.2. RESSALVA CRÍTICA - DIFERENÇA ENTRE "CÓPIA" E "ENGENHARIA":
           → CAPTURA (Nível 1): Reproduz a peça "como está", com desgastes e defeitos;
           → MODELAGEM (Nível 2): Aplica inteligência de engenharia para entregar o "projeto original";
           → FERRAMENTAL (Nível 3): Cria novo projeto de fabricação baseado na geometria recuperada.
           → A Enterfix não é uma "copiadora 3D" - é uma empresa de ENGENHARIA METROLÓGICA.

1.4. NÃO estão inclusos no escopo de engenharia reversa:
    a) Fabricação da peça replicada (vide "Contrato de Fabricação");
    b) Análise metalográfica ou ensaios destrutivos para identificação de material;
    c) Medição dimensional de alta precisão com MMC (vide "Contrato de Calibração");
    d) Otimização de projeto ou redesign (vide "Contrato de Consultoria");
    e) Engenharia reversa de montagens complexas (acima de 10 componentes);
    f) Análise de funcionalidade ou simulação (MEF, CFD);
    g) Certificações ou homologações técnicas.

1.5. Serviços complementares disponíveis mediante contratação adicional:
    a) Fabricação imediata da peça após eng. reversa → "Contrato de Fabricação" (desconto de 15%);
    b) Inspeção dimensional de alta precisão (MMC) → "Contrato de Calibração";
    c) Análise metalográfica para identificação de material → Laboratório terceirizado (orçamento sob consulta);
    d) Otimização de projeto (redução de custo, melhoria de desempenho) → "Contrato de Consultoria";
    e) Engenharia reversa de montagens (acima de 10 componentes) → Orçamento específico.
`,

    /**
     * Amostra Física e Condições da Peça
     */
    amostra: () => `
CLÁUSULA ESPECÍFICA 2 - DA AMOSTRA FÍSICA E CONDIÇÕES DA PEÇA
2.1. Condições obrigatórias da amostra física:
    a) ESTADO DE CONSERVAÇÃO:
       → Peça em bom estado (sem desgaste excessivo, trincas ou deformações);
       → Dimensões originais preservadas (tolerância de até 5% de desgaste aceitável);
       → Sem corrosão severa que impeça medição precisa.
    
    b) QUANTIDADE:
       → Mínimo: 1 (uma) amostra em bom estado;
       → Recomendado: 2 (duas) amostras (uma para referência, outra para análise destrutiva - se necessário);
       → Para peças simétricas ou com desgaste: 2 amostras OBRIGATÓRIAS.
    
    c) LIMPEZA:
       → Peça deve estar limpa (sem graxa, óleo, tinta ou resíduos);
       → Cliente deve fornecer em condições adequadas para manuseio;
       → Limpeza técnica pode ser solicitada (custo adicional: R$ 100/peça).

2.2. Análise destrutiva (quando necessário):
    a) Pode ser necessário realizar cortes, furos ou seccionamento para medições internas;
    b) CONTRATADA solicitará autorização prévia antes de qualquer intervenção destrutiva;
    c) Se autorizado: Amostra será inutilizada (cliente deve fornecer amostra adicional se necessário preservar original);
    d) Se NÃO autorizado: Eng. reversa pode ter limitações (geometrias internas não medidas);
    e) Sem custo adicional para análise destrutiva (já incluso no serviço de eng. reversa).

2.3. Responsabilidade sobre a amostra:
    a) CONTRATADA compromete-se a:
       → Manusear com cuidado e profissionalismo;
       → Armazenar em local seguro durante o processo;
       → Seguro contra roubo ou incêndio até R$ 10.000 por peça.
    
    b) CONTRATADA NÃO se responsabiliza por:
       → Danos decorrentes de análise destrutiva AUTORIZADA;
       → Quebra de peça frágil durante medição (mesmo com cuidado extremo);
       → Perda de características dimensionais de peça já desgastada ou danificada.
    
    c) Devolução da amostra:
       → Prazo: Até 5 dias úteis após entrega da documentação técnica;
       → Armazenamento gratuito por até 30 dias;
       → Após 30 dias: Taxa de R$ 50/mês por peça armazenada;
       → Após 90 dias sem retirada: Considerada abandonada (poderá ser descartada).

2.4. Peças de terceiros ou com propriedade intelectual protegida:
    a) CONTRATANTE declara que possui direito legal de realizar engenharia reversa da peça;
    b) CONTRATANTE isenta a CONTRATADA de qualquer responsabilidade por violação de patentes ou propriedade intelectual;
    c) CONTRATADA poderá recusar serviço se houver suspeita de violação de direitos de terceiros;
    d) Violação comprovada: Contrato anulado sem direito a reembolso + responsabilização civil/criminal do CONTRATANTE.
`,

    /**
     * Processo de Levantamento Dimensional
     */
    processo: () => `
CLÁUSULA ESPECÍFICA 3 - DO PROCESSO DE LEVANTAMENTO DIMENSIONAL
3.1. Etapas do processo de engenharia reversa:
    a) ETAPA 1 - RECEBIMENTO E ANÁLISE INICIAL (1 dia útil):
       → Inspeção visual da amostra;
       → Identificação de complexidade (simples, média, alta);
       → Definição de estratégia de medição;
       → Solicitação de autorizações (se necessário análise destrutiva).
    
    b) ETAPA 2 - LEVANTAMENTO DIMENSIONAL (3 a 7 dias úteis):
       → Medição ponto a ponto com instrumentos calibrados;
       → Registro fotográfico detalhado (mínimo 20 fotos);
       → Identificação de tolerâncias críticas funcionais;
       → Preenchimento de planilha de medições.
    
    c) ETAPA 3 - MODELAGEM 3D (2 a 5 dias úteis):
       → Criação do modelo sólido 3D em CAD;
       → Aplicação das medições coletadas;
       → Validação dimensional (comparação modelo x amostra física);
       → Revisões e ajustes (até 2 rodadas de revisão sem custo).
    
    d) ETAPA 4 - DESENHO TÉCNICO 2D (1 a 2 dias úteis):
       → Geração de vistas principais conforme ABNT;
       → Cotagem funcional e de fabricação;
       → Aplicação de tolerâncias e especific ações;
       → Notas técnicas e observações.
    
    e) ETAPA 5 - DOCUMENTAÇÃO E ENTREGA (1 dia útil):
       → Compilação de todos os arquivos;
       → Emissão de relatório técnico;
       → Entrega via e-mail, nuvem ou mídia física.

3.2. Complexidade e prazo:
    a) PEÇA SIMPLES (até 10 elementos geométricos): 5 a 7 dias úteis;
       → Exemplos: Eixos, buchas, pinos, espaçadores, flanges simples.
    
    b) PEÇA MÉDIA (11 a 30 elementos geométricos): 7 a 10 dias úteis;
       → Exemplos: Suportes, conexões, adaptadores, corpos de válvulas.
    
    c) PEÇA COMPLEXA (acima de 30 elementos): 10 a 20 dias úteis;
       → Exemplos: Blocos hidráulicos, corpos de bombas, carcaças usinadas.
    
    d) MONTAGEM (múltiplos componentes): Orçamento específico;
       → Prazo: 10 a 30 dias úteis (conforme quantidade de peças).

3.3. Precisão metrológica e instrumentação:
    a) PRECISÃO PADRÃO: ±0,05mm (instrumentos manuais calibrados - paquímetro, micrômetro);
    
    b) PRECISÃO ALTA: ±0,01mm (custo adicional 50%):
       → OBRIGATÓRIO uso de MMC (Máquina de Medir por Coordenadas) com rastreabilidade RBC;
       → Instrumentos manuais NÃO atingem repetibilidade de ±0,01mm conforme GUM/VIM;
       → Certificado de calibração da MMC anexado ao relatório;
       → TRAVA TÉCNICA: O sistema Enterfix não permite oferta de ±0,01mm sem MMC (proteção contra reclamações judiciais por falta de repetibilidade).
    
    c) Tolerâncias aplicadas ao desenho:
       → Geral médio (ISO 2768-m) para cotas não críticas;
       → ISO 286 (ajustes e tolerâncias ISO) para eixos/furos com função de montagem;
       → Cliente pode solicitar alteração de tolerâncias após revisão (sem custo se dentro do escopo).

3.4. Validação dimensional e integração metrológica:
    a) Modelo 3D é sobreposto à amostra física para verificação visual;
    b) Inspeção de pelo menos 80% das cotas críticas (validação dimensional);
    c) Desvios acima de ±0,1mm: Refeição da medição sem custo;
    
    d) RELATÓRIO DE DESVIOS METROLÓGICOS ("DNA da Peça" - exclusivo Nível 2 e 3):
       → Gráfico comparativo: Dimensões medidas na amostra gasta vs. Modelo matemático corrigido;
       → Rastreabilidade do processo de compensação técnica (ISO 286);
       → Evidência de que a Enterfix ENCONTROU o erro (desgaste) e o CORRIGIU matematicamente;
       → Integração com Sistema de Gestão de Relatórios Enterfix (portal do cliente);
       → BLINDAGEM TÉCNICA: Prova documental de que a engenharia reversa aplicou inteligência, não apenas copiou.
    
    e) Cliente pode solicitar validação dimensional completa em laboratório terceirizado (custo adicional: R$ 500 a R$ 1.500).
`,

    /**
     * Identificação de Materiais e Tratamentos
     */
    materiais: () => `
CLÁUSULA ESPECÍFICA 4 - DA IDENTIFICAÇÃO DE MATERIAIS E TRATAMENTOS
4.1. Identificação de material (ESTIMATIVA VISUAL):
    a) Método: Análise visual, magnética, teste de faísca (quando aplicável);
    b) Materiais identificáveis:
       → Aços (carbono, inoxidável) - estimativa com 70% de confiança;
       → Alumínio e ligas - identificação com 80% de confiança;
       → Latão, bronze, cobre - identificação com 90% de confiança;
       → Polímeros comuns (Nylon, POM, PEEK) - identificação visual.
    
    c) ATENÇÃO: Identificação é ESTIMATIVA (não substitui análise metalográfica);
    d) Para aplicações críticas: Recomenda-se análise metalográfica laboratorial (serviço adicional).

4.2. Análise metalográfica (serviço complementar):
    a) Executado por laboratório terceirizado especializado;
    b) Método: Espectrometria, microscopia, ensaio de dureza;
    c) Resulta gera: Composição química exata, classificação SAE/AISI/ASTM;
    d) Prazo adicional: 7 a 10 dias úteis;
    e) Custo adicional: R$ 800 a R$ 1.500 (conforme complexidade);
    f) Requer amostra destrutiva (pequena porção será removida).

4.3. Identificação de tratamentos térmicos:
    a) Método: Teste de dureza Rockwell ou Brinell (não destrutivo);
    b) Identificação de:
       → Têmpera (dureza elevada);
       → Cementação (dureza superficial);
       → Recozimento (baixa dureza).
    
    c) Especificação no desenho técnico:
       → Nota técnica: "Material estimado: AISI 1045, temperado e revenido (HRC 45-50)";
       → Cliente deve validar especificação antes de fabricação.

4.4. Identificação de tratamentos superficiais:
    a) Identificação visual de:
       → Zincagem (cor acinzentada brilhante);
       → Anodização (alumínio com camada de óxido colorida);
       → Fosfatização (cor escura fosca);
       → Pintura, cromagem, niquelagem.
    
    b) Espessura de camada: NÃO é medida (requer equipamento especializado);
    c) Especificação no desenho: Nota técnica descritiva (não normativa).
`,

    /**
     * Prazo de Execução e Etapas
     */
    prazo: () => `
CLÁUSULA ESPECÍFICA 5 - DOS PRAZOS DE EXECUÇÃO E URGÊNCIA
5.1. Prazo padrão conforme complexidade:
    a) SIMPLES (até 10 elementos): 5 a 7 dias úteis;
    b) MÉDIA (11 a 30 elementos): 7 a 10 dias úteis;
    c) COMPLEXA (acima de 30 elementos): 10 a 20 dias úteis;
    d) MONTAGEM (múltiplos componentes): 15 a 30 dias úteis.

5.2. Prazo conta a partir de:
    a) Recebimento da amostra física em condições adequadas;
    b) Aprovação do orçamento pelo cliente;
    c) Recebimento de sinal (se aplicável).

5.3. Serviço expresso (urgente):
    a) Prazo reduzido em até 50% mediante:
       → Acréscimo de 40% sobre valor normal;
       → Disponibilidade de equipe técnica;
       → Peça de complexidade simples ou média (não aplicável a complexas).
    
    b) Prazo mínimo: 3 dias úteis (mesmo com serviço expresso).

5.4. Suspensão do prazo:
    a) Amostra inadequada (necessita limpeza, está danificada);
    b) Aguardando autorização para análise destrutiva;
    c) Aguardando aprovação de revisão do modelo 3D;
    d) Inadimplência do cliente (suspensão após 15 dias de atraso).

5.5. Comunicação de atrasos:
    a) Cliente será notificado com 2 dias úteis de antecedência;
    b) Novo prazo estimado será fornecido com justificativa;
    c) Cliente pode: aguardar, cancelar (reembolso proporcional) ou aceitar entrega parcial.
`,

    /**
     * Valores, Pagamento e Propriedade Intelectual
     */
    valores: () => `
CLÁUSULA ESPECÍFICA 6 - DOS VALORES, PAGAMENTO E PROPRIEDADE INTELECTUAL
6.1. Composição do preço de engenharia reversa:
    a) CUSTO DE MEDIÇÃO E LEVANTAMENTO:
       → Tempo técnico de medição dimensional (2 a 10 horas conforme complexidade);
       → Uso de instrumentos calibrados;
       → Registro fotográfico e documentação.
    
    b) CUSTO DE MODELAGEM 3D:
       → Tempo de modelagem CAD (3 a 20 horas conforme complexidade);
       → Software profissional (SolidWorks, Inventor);
       → Validação dimensional.
    
    c) CUSTO DE DESENHO TÉCNICO 2D:
       → Geração de vistas e cotagem (1 a 4 horas);
       → Aplicação de tolerâncias e especificações.
    
    d) CUSTO ADMINISTRATIVO:
       → Relatório técnico, compilação de arquivos, entrega.

6.2. Tabela de preços modulares por nível de serviço:

    a) NÍVEL 1 - CAPTURA DE DADOS (AS-IS):
       → Peça simples: R$ 500 a R$ 800;
       → Peça média: R$ 800 a R$ 1.500;
       → Peça complexa: R$ 1.500 a R$ 2.500;
       → RAPIDEZ: 2 a 5 dias úteis (processo mais simples).
    
    b) NÍVEL 2 - MODELAGEM MATEMÁTICA (AS-DESIGNED):
       → Peça simples: R$ 1.500 a R$ 2.500 (ou R$ 800 upgrade do Nível 1);
       → Peça média: R$ 2.500 a R$ 4.500 (ou R$ 1.500 upgrade do Nível 1);
       → Peça complexa: R$ 4.500 a R$ 8.000 (ou R$ 2.500 upgrade do Nível 1);
       → INCLUI: Compensação técnica (ISO 286), relatório de desvios, desenho 2D completo;
       → TEMPO: 5 a 15 dias úteis (engenharia de modelamento + compensação).
    
    c) NÍVEL 3 - PROJETO DE FERRAMENTAL (TOOLING):
       → Molde de injeção: R$ 5.000 a R$ 15.000 (conforme complexidade);
       → Punção/Matriz de estampagem: R$ 4.000 a R$ 12.000;
       → INCLUI: TODOS os itens do Nível 2 + projeto do ferramental;
       → TEMPO: 15 a 30 dias úteis (engenharia de ferramentaria).
    
    d) MONTAGEM (múltiplos componentes):
       → Desconto progressivo: 10% (5-10 peças), 20% (11-20 peças), 25% (acima de 20);
       → Aplicável a qualquer nível.

6.3. Forma de pagamento:
    a) PEÇAS SIMPLES/MÉDIAS (até R$ 3.000):
       → 50% de sinal no ato da aprovação do orçamento;
       → 50% na entrega dos arquivos finais.
    
    b) PEÇAS COMPLEXAS OU MONTAGENS (acima de R$ 3.000):
       → 40% de sinal no ato da aprovação;
       → 30% após entrega do modelo 3D para revisão;
       → 30% após entrega final (desenho 2D e documentação).

6.4. PROPRIEDADE INTELECTUAL E BLINDAGEM DE IP (CRÍTICO):
    a) TITULARIDADE:
       → Modelo 3D e desenho técnico são de PROPRIEDADE EXCLUSIVA da CONTRATADA;
       → CONTRATANTE adquire LICENÇA DE USO não exclusiva e intransferível;
       → Uso permitido: Fabricação de peças para uso próprio da CONTRATANTE (parque interno).
    
    b) RESTRIÇÕES DE USO:
       → PROIBIDO: Revenda, sublicenciamento ou comercialização dos arquivos CAD;
       → PROIBIDO: Fornecimento dos arquivos para terceiros (exceto fabricantes autorizados para produzir peças para a CONTRATANTE);
       → PROIBIDO: Reprodução para comercialização de produtos baseados no desenho;
       → PROIBIDO: Uso do modelo como base para comercialização de peças no mercado (revenda de produtos).
    
    c) LICENÇA EXCLUSIVA COM TRANSFERÊNCIA DE IP (opcional - adicional de 200%):
       → Cliente pode adquirir propriedade intelectual total mediante pagamento adicional de 200% do valor do serviço de engenharia reversa;
       → Transferência de propriedade intelectual formalizada por termo aditivo assinado;
       → Necessário para: Comercialização de produtos baseados no desenho, licenciamento a terceiros, venda de peças no mercado;
       → Com transferência: Cliente passa a ser titular do projeto, podendo usar comercialmente sem restrições.
    
    d) MARCA D'ÁGUA E RASTREABILIDADE:
       → Desenhos técnicos em PDF incluem marca d'água "Enterfix - Licença de Uso Restrito" (exceto se adquirida licença exclusiva);
       → Sistema Enterfix registra no Supabase o status da licença (Restrita ou Exclusiva);
       → Arquivos CAD (STEP/IGES) incluem metadados de propriedade intelectual;
       → Violação detectada: Medidas judiciais + multa de 300% do valor do contrato.
    
    e) DIFERENCIAÇÃO CRÍTICA - "ESCANEAMENTO" vs. "ENGENHARIA":
       → O valor cobrado NÃO é apenas pela captura de pontos (commoditizado), mas pela INTELIGÊNCIA DE ENGENHARIA aplicada (compensação de desgaste, análise de tolerâncias ISO 286, validação metrológica);
       → A propriedade intelectual protege o MÉTODO e o RESULTADO (modelo matemático corrigido, não a nuvem de pontos bruta);
       → Cliente que paga Nível 1 (Captura) recebe apenas dados; Nível 2 (Modelagem) recebe projeto de engenharia com valor IP agregado.

6.5. Descontos e condições especiais:
    a) Contratação simultânea de fabricação: 15% de desconto na eng. reversa;
    b) Múltiplas peças (acima de 5): desconto progressivo de 10% a 25%;
    c) Projetos recorrentes (cliente com plano de manutenção): 10% a 20%;
    d) Pagamento à vista (100% antecipado): 5% de desconto.
`,

    /**
     * Garantia e Suporte Técnico
     */
    garantia: () => `
CLÁUSULA ESPECÍFICA 7 - DA GARANTIA E SUPORTE TÉCNICO
7.1. A CONTRATADA garante que a eng. reversa:
    a) Foi executada com instrumentos calibrados e rastreáveis;
    b) Possui precisão dimensional de ±0,05mm (ou ±0,01mm se contratado);
    c) Modelo 3D reflete fielmente a geometria da amostra física;
    d) Desenho técnico 2D está conforme ABNT NBR ISO 128-1;
    e) Arquivos são editáveis e compatíveis com software padrão do mercado.

7.2. Garantia técnica de 90 (noventa) dias para:
    a) Erros de medição ou cotagem (correção sem custo);
    b) Erros de modelagem 3D (incompatível com amostra - correção sem custo);
    c) Arquivo corrompido ou incompatível (reenvio sem custo);
    d) Falta de informações técnicas essenciais no desenho (complementação sem custo).

7.3. Revisões incluídas (sem custo adicional):
    a) Até 2 (duas) rodadas de revisão do modelo 3D após entrega;
    b) Alterações permitidas: Ajustes dimensionais, correção de cotas, mudanças menores;
    c) Alterações NÃO permitidas (custo adicional): Adição de novos elementos, redesign completo;
    d) Prazo para solicitar revisão: Até 15 dias após entrega.

7.4. A garantia NÃO cobre:
    a) Impossibilidade de fabricação por limitações da amostra física (desgaste, deformação);
    b) Falha funcional da peça fabricada baseada no desenho (responsabilidade do projeto original);
    c) Incompatibilidade dimensional devido a desgaste da amostra fornecida;
    d) Alterações solicitadas pelo cliente após aprovação final (serão orçadas separadamente).

7.5. Suporte técnico pós-entrega:
    a) Esclarecimentos sobre desenho ou modelo: Até 30 dias após entrega (gratuito);
    b) Consultorias para fabricação: Primeira consulta gratuita, demais vide "Contrato de Consultoria";
    c) Reenvio de arquivos por perda: Gratuito (até 2 reenvios);
    d) Conversão para outros formatos CAD: R$ 200 por formato adicional;
    e) Atualização de desenho após fabricação (as-built): R$ 300 a R$ 800 (conforme alterações).

7.6. Responsabilidade sobre fabricação:
    a) CONTRATADA é responsável APENAS pela fidelidade dimensional do modelo;
    b) NÃO é responsável pela funcionalidade da peça fabricada;
    c) NÃO é responsável por incompatibilidades de montagem (se peça faz parte de conjunto);
    d) Cliente deve validar desenho ANTES de encaminhar para fabricação;
    e) Recomenda-se fabricar protótipo para validação funcional antes de lote de produção.
`,

    /**
     * Sigilo, Confidencialidade e Uso Comercial
     */
    confidencialidade: () => `
CLÁUSULA ESPECÍFICA 8 - DO SIGILO, CONFIDENCIALIDADE E USO COMERCIAL
8.1. Sigilo PERMANENTE sobre projetos:
    a) Modelos 3D, desenhos técnicos e especificações são estritamente CONFIDENCIAIS;
    b) CONTRATADA não divulgará, replicará ou utilizará para outros clientes;
    c) Vedada utilização comercial, portfólio ou marketing sem autorização expressa do cliente;
    d) Vigência: PERMANENTE (não expira com término do contrato).

8.2. Proteção de know-how:
    a) Métodos, processos e técnicas de engenharia reversa são ativos exclusivos da CONTRATADA;
    b) Know-how desenvolvido para resolver desafios específicos pertence à CONTRATADA;
    c) Cliente adquire apenas o RESULTADO (modelo 3D e desenho), não o MÉTODO.

8.3. Uso comercial pelo cliente:
    a) LICENÇA PADRÃO (incluída no serviço):
       → Uso interno: Fabricação para uso próprio (PERMITIDO);
       → Venda de peças avulsas: NÃO PERMITIDO sem licença exclusiva;
       → Incorporação em produto comercializado: NÃO PERMITIDO sem licença exclusiva;
       → Fornecimento de arquivos para terceiros: NÃO PERMITIDO.
    
    b) LICENÇA EXCLUSIVA (contratação adicional - 200% do valor):
       → Uso comercial irrestrito (venda, sublicenciamento);
       → Propriedade intelectual transferida para o cliente;
       → Formalização por termo aditivo assinado.

8.4. Proteção contra cópia e reprodução:
    a) CONTRATANTE compromete-se a:
       → Não utilizar os desenhos como base para fabricação não autorizada por terceiros;
       → Não fornecer arquivos para concorrentes da CONTRATADA;
       → Não realizar nova eng. reversa baseada no modelo fornecido (para terceiros).
    
    b) Violação:
       → Multa de 100% do valor do contrato + perdas e danos comprovados;
       → Medidas judiciais cabíveis (ação de indenização, busca e apreensão).

8.5. Autorização para uso em portfólio:
    a) CONTRATADA pode solicitar autorização para divulgar projeto em portfólio técnico;
    b) Divulgação incluirá apenas: Foto da peça, imagem do modelo 3D (sem cotas), descrição genérica;
    c) NÃO incluirá: Desenho técnico com cotas, especificações detalhadas, nome do cliente (se solicitado sigilo);
    d) Cliente pode RECUSAR autorização a qualquer momento (prevalece sigilo total).
`,
};