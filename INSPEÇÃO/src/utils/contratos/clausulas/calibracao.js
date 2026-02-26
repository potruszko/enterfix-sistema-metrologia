/**
 * CLÁUSULAS ESPECÍFICAS - Calibração de Instrumentos
 * 
 * Finalidade: Calibração de instrumentos de medição com rastreabilidade RBC
 * Aplicável a: Empresas que necessitam calibração conforme ISO/IEC 17025
 * 
 * Base legal/normativa:
 * - ISO/IEC 17025:2017: Requisitos para laboratórios de calibração
 * - Portaria Inmetro 694/2022: Regulamento Técnico Metrológico
 * - VIM (Vocabulário Internacional de Metrologia)
 * - NBR ISO 10012: Sistemas de gestão de medição
 * 
 * Serviços complementares (contratos separados):
 * - manutencao.js: Manutenção do instrumento pós-calibração
 * - validacao.js: IQ/OQ/PQ para indústrias reguladas
 * - consultoria.js: Consultoria em sistema de gestão metrológica
 * 
 * @module contratos/clausulas/calibracao
 * @category Atômico
 * @version 1.0.0
 * @lastUpdate 26/02/2026
 * @author Paulo Enterfix
 */

export const CLAUSULAS_CALIBRACAO = {
    /**
     * Escopo do Serviço de Calibração
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DOS SERVIÇOS DE CALIBRAÇÃO
1.1. O presente contrato tem por objeto a calibração de instrumentos de medição:
    a) Calibração conforme normas técnicas específicas de cada grandeza;
    b) Emissão de certificado de calibração rastreável à RBC (Rede Brasileira de Calibração);
    c) Identificação e registro de não conformidades encontradas;
    d) Etiqueta de identificação com data de calibração e próximo vencimento;
    e) Recomendações técnicas para uso adequado dos instrumentos.

1.2. Especificações técnicas:
    a) Rastreabilidade metrológica conforme VIM (Vocabulário Internacional de Metrologia);
    b) Incerteza de medição calculada conforme ABNT NBR ISO/IEC Guide 98-3 (GUM);
    c) Padrões de referência calibrados com validade vigente;
    d) Condições ambientais controladas e monitoradas (temperatura, umidade);
    e) Procedimentos técnicos conforme ISO/IEC 17025:2017.

1.3. O certificado de calibração conterá obrigatoriamente:
    a) Identificação única do certificado (número sequencial);
    b) Dados completos do cliente e do instrumento calibrado;
    c) Resultados de medição com incerteza expandida (k=2, nível de confiança 95,45%);
    d) Condições ambientais durante a calibração (temperatura, umidade, pressão);
    e) Rastreabilidade dos padrões utilizados (certificado RBC);
    f) Data de emissão e validade sugerida;
    g) Observações técnicas e restrições de uso (se aplicável);
    h) Assinatura digital ou física de responsável técnico habilitado (engenheiro ou tecnólogo).

1.4. NÃO estão inclusos no escopo da calibração:
    a) Manutenção preventiva ou corretiva do instrumento (vide "Contrato de Manutenção");
    b) Ajustes, regulagens ou reprogramação do equipamento;
    c) Substituição de peças, baterias ou componentes;
    d) Limpeza técnica ou descontaminação;
    e) Treinamento de operadores ou usuários;
    f) Validação de processos ou qualificação de equipamentos (vide "Contrato de Validação");
    g) Certificação internacional (FDA, CE, etc.) - apenas calibração rastreável nacional.

1.5. Serviços complementares disponíveis mediante contratação adicional:
    a) Manutenção completa pós-calibração → "Contrato de Manutenção";
    b) Ajuste e regulagem dentro das especificações → "Contrato de Manutenção";
    c) Validação IQ/OQ/PQ para indústrias reguladas → "Contrato de Validação";
    d) Consultoria em gestão metrológica → "Contrato de Consultoria".
`,

    /**
     * Prazo de Execução
     */
    prazo: () => `
CLÁUSULA ESPECÍFICA 2 - DOS PRAZOS DE EXECUÇÃO
2.1. O prazo padrão para execução é de 10 (dez) dias úteis, contados a partir do recebimento do instrumento no laboratório da CONTRATADA, em condições adequadas para calibração.

2.2. Prazos diferenciados conforme modalidade:
    a) SERVIÇO EXPRESSO (3 a 5 dias úteis): acréscimo de 30% sobre valor padrão;
    b) GRANDE VOLUME (acima de 50 instrumentos): prazo de até 20 dias úteis com desconto progressivo;
    c) CALIBRAÇÃO ESPECIAL (grandezas complexas ou instrumentos raros): prazo de até 30 dias úteis;
    d) CALIBRAÇÃO IN LOCO (nas instalações do cliente): prazo conforme agendamento (mínimo 48h de antecedência).

2.3. O prazo será suspenso nas seguintes situações:
    a) Instrumento apresentar defeito que impeça a calibração (será notificada necessidade de manutenção);
    b) Falta de informações técnicas essenciais (manual, certificado anterior, especificações);
    c) Equipamento sujo, contaminado ou sem condições de manuseio seguro;
    d) Inadimplência da CONTRATANTE superior a 15 (quinze) dias;
    e) Indisponibilidade de padrão de referência (calibração vencida ou em manutenção externa).

2.4. Comunicação de atrasos:
    a) A CONTRATADA compromete-se a comunicar qualquer atraso com antecedência mínima de 2 (dois) dias úteis;
    b) Será fornecido novo prazo estimado e justificativa técnica;
    c) Cliente poderá optar por: aguardar, cancelar (sem ônus) ou solicitar serviço parcial.
`,

    /**
     * Coleta, Devolução e Logística
     */
    logistica: () => `
CLÁUSULA ESPECÍFICA 3 - DA COLETA, DEVOLUÇÃO E LOGÍSTICA
3.1. Modalidades de logística disponíveis:
    a) COLETA E DEVOLUÇÃO PELA CONTRATADA:
       → Agendamento com 48 (quarenta e oito) horas de antecedência;
       → Taxa de logística conforme tabela vigente (varia por região e volume);
       → Raio de cobertura: Grande São Paulo e ABC Paulista;
       → Equipamento de proteção e embalagem adequados fornecidos pela CONTRATADA.
    
    b) ENVIO PELO CLIENTE:
       → Cliente responsável por embalar adequadamente (embalagem original recomendada);
       → Seguro de transporte obrigatório (valor declarado = valor do instrumento);
       → Envio para: Enterfix Metrologia, Rua [Endereço], São Bernardo do Campo/SP;
       → CONTRATADA não se responsabiliza por danos durante transporte contratado pelo cliente.
    
    c) CALIBRAÇÃO IN LOCO:
       → Disponível para instrumentos de grande porte ou em linha de produção;
       → Agendamento com 5 (cinco) dias úteis de antecedência;
       → Taxa de deslocamento + tempo de técnico conforme tabela;
       → Cliente deve fornecer condições adequadas (ambiente limpo, energia, acesso).

3.2. Seguro e responsabilidade durante transporte:
    a) Transporte contratado pela CONTRATADA: seguro incluso até R$ 50.000 por instrumento;
    b) Valores superiores: seguro adicional mediante pagamento de prêmio (0,5% do valor declarado);
    c) Transporte contratado pelo CLIENTE: responsabilidade e risco exclusivos do cliente;
    d) Instrumentos danificados no transporte sem seguro: calibração será cancelada sem reembolso.

3.3. Identificação e rastreamento:
    a) Cada instrumento recebe número de OS (Ordem de Serviço) único;
    b) Protocolo de recebimento com descrição do estado físico e acessórios;
    c) Rastreamento disponível via WhatsApp ou portal web;
    d) Notificação automática: recebimento, início da calibração, emissão de certificado, disponível para retirada.

3.4. Armazenamento e prazo de retirada:
    a) Instrumentos calibrados armazenados por até 30 (trinta) dias sem custo;
    b) Após 30 dias: taxa de armazenagem de R$ 50/instrumento/mês;
    c) Após 90 dias sem retirada: considerado abandonado (Lei 10.406/2002, Art. 1.275, V);
    d) Abandono: CONTRATADA poderá destinar conforme legislação vigente.
`,

    /**
     * Periodicidade e Calibração Recorrente
     */
    periodicidade: () => `
CLÁUSULA ESPECÍFICA 4 - DA PERIODICIDADE E ALERTAS DE VENCIMENTO
4.1. Periodicidade recomendada:
    a) PADRÃO GERAL: 12 (doze) meses para maioria dos instrumentos;
    b) INSTRUMENTOS CRÍTICOS: 6 (seis) meses ou conforme especificação do fabricante;
    c) INSTRUMENTOS DE REFERÊNCIA: 6 (seis) a 12 (doze) meses, conforme requisitos RBC;
    d) CONDIÇÕES SEVERAS DE USO: periodicidade reduzida mediante avaliação técnica;
    e) BAIXA FREQUÊNCIA DE USO: periodicidade pode ser estendida mediante justificativa técnica.

4.2. Fatores que influenciam a periodicidade:
    a) Recomendações do fabricante do equipamento;
    b) Frequência e condições de uso (intensivo, moderado, esporádico);
    c) Requisitos de sistema de gestão da qualidade (ISO 9001, ISO 17025, BPF);
    d) Exigências de órgãos reguladores (ANVISA, INMETRO, auditores externos);
    e) Histórico de deriva ou instabilidade do instrumento;
    f) Criticidade do instrumento para segurança ou qualidade do produto final.

4.3. Sistema de alertas de vencimento:
    a) A CONTRATADA enviará avisos automáticos com antecedência de:
       → 1º aviso: 60 (sessenta) dias antes do vencimento;
       → 2º aviso: 30 (trinta) dias antes do vencimento;
       → 3º aviso: 7 (sete) dias antes do vencimento;
       → Aviso final: No dia do vencimento.
    
    b) Canais de comunicação: e-mail, WhatsApp e portal web;
    c) Cliente pode configurar alertas personalizados no portal;
    d) Instrumentos vencidos: sinalizados em vermelho no sistema.

4.4. Condições comerciais para calibração recorrente:
    a) Contratos anuais ou planos recorrentes possuem desconto de 10% a 25%;
    b) Prioridade no atendimento (fila preferencial);
    c) Agendamento programado (cliente escolhe datas ao longo do ano);
    d) Vide "Contrato de Plano de Manutenção" para condições completas.

4.5. Calibração extraordinária fora da periodicidade:
    a) Pode ser solicitada sempre que houver:
       → Suspeita de descalibração ou leitura inconsistente;
       → Após queda, impacto, mau funcionamento ou reparo;
       → Por exigência de auditoria, fiscalização ou reclamação de cliente;
       → Mudança de condições de uso ou aplicação crítica.
    
    b) Calibração extraordinária não altera a data de vencimento da calibração anual;
    c) Será emitido certificado adicional com validade até a próxima calibração programada.
`,

    /**
     * Acreditação, Rastreabilidade e Conformidade
     */
    acreditacao: () => `
CLÁUSULA ESPECÍFICA 5 - DA ACREDITAÇÃO E RASTREABILIDADE
5.1. Conformidade com normas e requisitos:
    a) Laboratório operado em conformidade com ISO/IEC 17025:2017;
    b) Procedimentos técnicos documentados e validados;
    c) Equipe técnica treinada e com competência comprovada;
    d) Equipamentos e padrões calibrados com rastreabilidade nacional;
    e) Participação em ensaios de proficiência e intercomparações.

5.2. Rastreabilidade metrológica:
    a) RASTREABILIDADE NACIONAL (padrão):
       → Padrões de referência rastreáveis à RBC (Rede Brasileira de Calibração);
       → Cadeia de rastreabilidade até padrões nacionais do INMETRO;
       → Certificados de calibração dos padrões disponíveis para auditoria;
       → Aceito pela maioria dos sistemas de gestão da qualidade no Brasil.
    
    b) RASTREABILIDADE INTERNACIONAL (sob consulta):
       → Rastreabilidade a laboratórios ILAC-MRA (International Laboratory Accreditation Cooperation);
       → Aceito para exportação e auditorias internacionais;
       → Custo adicional devido à necessidade de padrões certificados internacionalmente.

5.3. Incerteza de medição e Regra de Decisão:
    a) Calculada conforme GUM (Guide to the Expression of Uncertainty in Measurement);
    b) Incerteza expandida com fator de abrangência k=2 (95,45% de confiança);
    c) Relação TUR (Test Uncertainty Ratio) ≥ 4:1 sempre que possível;
    d) Quando TUR < 4:1: será informado no certificado com justificativa técnica.
    
    e) **REGRA DE DECISÃO** (ISO/IEC 17025:2017, item 7.8.6):
       → A regra de decisão padrão adotada pela ENTERFIX é: **Compartilhamento de Risco (Simples Pass/Fail)**;
       → Significado: Instrumento é considerado CONFORME se o valor medido estiver dentro da tolerância especificada;
       → Incerteza de medição é informada, mas não é aplicada математicamente à zona de guarda;
       → **Regra alternativa**: Cliente pode solicitar "Zona de Guarda" no ato da contratação (conservadora);
       → Regra de decisão aplicada constará explicitamente no certificado de calibração.

5.4. Garantia de qualidade:
    a) Controle de qualidade interno: verificação de padrões intermediários;
    b) Auditorias internas quadrimestrais;
    c) Análise crítica de certificados por responsável técnico independente;
    d) Registros de não conformidades e ações corretivas mantidos por 5 anos.

5.5. Reconhecimento e aceitação:
    a) Certificados aceitos por: ISO 9001, ISO 14001, IATF 16949, ISO 17025;
    b) Atende requisitos da ANVISA para indústria farmacêutica e dispositivos médicos;
    c) Atende requisitos do INMETRO para instrumentos legais (quando aplicável);
    d) Aceito por principais certificadores: Bureau Veritas, TÜV, DNV, SGS, etc.
`,

    /**
     * Condições Especiais e Restrições
     */
    condicoes_especiais: () => `
CLÁUSULA ESPECÍFICA 6 - DE CONDIÇÕES ESPECIAIS E RESTRIÇÕES
6.1. Impossibilidade de calibração:
    a) Instrumento sem condições técnicas mínimas de funcionamento;
    b) Falta de especificações técnicas ou limites de tolerância;
    c) Equipamento obsoleto ou sem padrões de referência adequados;
    d) Contaminação química, biológica ou radioativa sem descontaminação prévia;
    e) Risco à segurança dos técnicos ou do laboratório.

6.2. Calibração com restrições:
    a) Será informada no campo "Observações" do certificado;
    b) Exemplos: calibração parcial (apenas alguns pontos), faixa de trabalho reduzida;
    c) Cliente será consultado antes da emissão do certificado;
    d) Valor proporcional será cobrado conforme pontos calibrados.

6.3. Instrumentos reprovados (fora de tolerância):
    a) Certificado será emitido normalmente indicando "NÃO CONFORME";
    b) Recomendação: manutenção, ajuste ou substituição do instrumento;
    c) Cliente pode solicitar nova calibração após manutenção (50% de desconto);
    d) Etiqueta de identificação: cor laranja ou vermelha (indicando não conformidade).

6.4. Sigilo e confidencialidade:
    a) Resultados de calibração são confidenciais (apenas cliente e CONTRATADA têm acesso);
    b) Não serão divulgados a terceiros sem autorização expressa;
    c) Certificados sem validade jurídica para defesa do consumidor ou processos judiciais sem perícia complementar;
    d) Vedada utilização comercial dos certificados pela CONTRATANTE (revenda ou sublicenciamento).

6.5. Validade e interpretação dos certificados:
    a) Validade SUGERIDA: 12 meses (exceto se especificado diferente);
    b) Validade é uma RECOMENDAÇÃO técnica, não uma garantia de conformidade;
    c) Instrumento pode sair de calibração antes do vencimento devido a:
       → Queda, impacto ou uso inadequado;
       → Manutenção ou reparo não autorizado;
       → Alteração de condições ambientais;
       → Desgaste natural acelerado.
    
    d) Responsabilidade de manter instrumento dentro da calibração é da CONTRATANTE;
    e) Verificações intermediárias são recomendadas conforme criticidade.
`,

    /**
     * Garantia Específica de Calibração
     */
    garantia: () => `
CLÁUSULA ESPECÍFICA 7 - DA GARANTIA ESPECÍFICA DE CALIBRAÇÃO
7.1. A CONTRATADA garante que os serviços de calibração:
    a) Foram executados conforme procedimentos técnicos validados;
    b) Utilizaram equipamentos e padrões calibrados com rastreabilidade vigente;
    c) Foram realizados por profissionais qualificados e treinados;
    d) Atenderam requisitos da ISO/IEC 17025:2017;
    e) Possuem rastreabilidade metrológica nacional ou internacional (conforme contratado).

7.2. Garantia técnica de 90 (noventa) dias para:
    a) Erros de cálculo ou transcrição no certificado (reemissão sem custo);
    b) Perda de rastreabilidade dos padrões utilizados (recalibração sem custo);
    c) Não conformidade com norma técnica aplicável (recalibração sem custo);
    d) Dúvidas técnicas sobre resultados (consultoria técnica gratuita).

7.3. Recalibração sem custo em caso de:
    a) Erro comprovado da CONTRATADA na execução da calibração;
    b) Instrumento retornar imediatamente com mesma não conformidade (até 7 dias);
    c) Padrão utilizado for reprovado em calibração subsequente (retroatividade);
    d) Certificado contestado em auditoria por falha técnica da CONTRATADA.

7.4. A garantia NÃO cobre:
    a) Instrumento utilizado fora das especificações do fabricante;
    b) Danos causados por transporte, queda ou mau uso após calibração;
    c) Intervenções de terceiros ou manutenção não autorizada;
    d) Deriva natural do instrumento devido ao uso normal;
    e) Condições ambientais inadequadas (temperatura, umidade, vibração);
    f) Descalibração intencional ou adulteração do equipamento.

7.5. Suporte pós-calibração:
    a) Esclarecimentos sobre certificado: até 30 dias após emissão (gratuito);
    b) Reemissão de certificado por perda: R$ 150 por unidade;
    c) Cópia de certificado para auditoria: gratuito (até 2 cópias);
    d) Histórico completo de calibrações: disponível no portal web;
    e) Consultoria técnica sobre interpretação: primeira consulta gratuita, demais vide "Contrato de Consultoria".
`,

    /**
     * Não Conformidades e Tratamento
     */
    naoConformidades: () => `
CLÁUSULA ESPECÍFICA 8 - DAS NÃO CONFORMIDADES E TRATAMENTO
8.1. Quando identificada não conformidade metrológica, a CONTRATADA:
    a) Registrará a ocorrência no certificado de calibração com destaque;
    b) Comunicará a CONTRATANTE imediatamente por e-mail e telefone;
    c) Recomendará ajuste, reparo, substituição ou descontinuação do instrumento;
    d) Aplicará etiqueta indicativa "FORA DE TOLERÂNCIA" (se autorizado);
    e) Documentará comparação: tolerância especificada vs. erro encontrado.

8.2. Classificação de não conformidades:
    a) **LEVE**: Desvio de 1x a 2x a incerteza de medição (avaliar criticidade);
    b) **MODERADA**: Desvio de 2x a 5x a incerteza (ajuste recomendado);
    c) **GRAVE**: Desvio superior a 5x a incerteza (substituição recomendada);
    d) **CRÍTICA**: Instrumento inutilizado, sem condições de ajuste.

8.3. Instrumento APROVADO (dentro de tolerância):
    a) Etiqueta VERDE: "APROVADO - Calibrado até DD/MM/AAAA";
    b) Certificado emitido normalmente com todos os pontos medidos;
    c) Recomendação: Manter calibração periódica na data prevista.

8.4. Instrumento APROVADO COM RESTRIÇÃO:
    a) Etiqueta AMARELA: "APROVADO c/ restrição - Ver certificado";
    b) Certificado indicará faixas aprovadas e faixas restritas;
    c) Recomendação: Utilizar apenas na faixa aprovada OU ajustar e recalibrar.

8.5. Instrumento REPROVADO:
    a) Etiqueta VERMELHA: "REPROVADO - NÃO UTILIZAR";
    b) Certificado indicará todos os desvios encontrados;
    c) Recomendações: Ajuste técnico + nova calibração OU substituição;
    d) Cliente pode autorizar uso "COMO ESTÁ" (assumindo risco documentado).
    
    e) **SOLUÇÕES ENTERFIX PARA INSTRUMENTOS REPROVADOS**:
       → Se ajuste não for possível por falta de peças no mercado;
       → A ENTERFIX pode oferecer **Engenharia Reversa + Fabricação Customizada** da peça;
       → Vide "Contrato de Engenharia Reversa" e "Contrato de Fabricação";
       → Orçamento suplementar mediante análise técnica de viabilidade;
       → Prazo típico: 15-30 dias (medição + fabricação + nova calibração).

8.6. Não conformidades no certificado emitido pela CONTRATADA:
    a) Emissão de certificado retificado sem custo adicional (prazo 48h);
    b) Recalibração gratuita se erro técnico da CONTRATADA for comprovado;
    c) Comunicação formal a todos os afetados, se impacto em série;
    d) Análise de causa raiz e ação corretiva documentada.

8.7. Registro de não conformidades:
    a) Sistema informatizado com histórico de cada instrumento;
    b) Análise de tendências e taxa de reprovação por cliente;
    c) Relatório trimestral de não conformidades (disponível a clientes Prata/Ouro).
`,

    /**
     * Sistema de Gestão da Qualidade
     */
    gestaoQualidade: () => `
CLÁUSULA ESPECÍFICA 9 - DO SISTEMA DE GESTÃO DA QUALIDADE
9.1. A CONTRATADA mantém Sistema de Gestão da Qualidade em conformidade com:
    a) ISO/IEC 17025:2017 - Requisitos gerais para laboratórios;
    b) Portaria Inmetro 694/2022 - Regulamento Técnico Metrológico;
    c) Requisitos da RBC - Rede Brasileira de Calibração;
    d) VIM (Vocabulário Internacional de Metrologia);
    e) GUM (Guide to the expression of Uncertainty in Measurement).

9.2. Acreditação e renovação periódica:
    a) Acreditação RBC renovada a cada 2 anos (auditorias de manutenção anuais);
    b) Escopo acreditado disponível no site da RBC/Cgcre (www.inmetro.gov.br);
    c) Suspensões ou restrições de escopo: Comunicadas em até 24h;
    d) Certificados acreditados: Emitidos apenas dentro do escopo vigente.

9.3. Auditorias pela CONTRATANTE:
    a) Agendamento prévio de 15 (quinze) dias úteis obrigatório;
    b) Escopo e objetivo da auditoria devem ser apresentados com antecedência;
    c) Assinatura de Termo de Confidencialidade (NDA) antes da visita;
    d) Duração típica: 4 horas (meio período) - sem impacto operacional.

9.4. Durante auditoria, a CONTRATADA disponibilizará:
    a) Certificados de acreditação e rastreabilidade vigentes;
    b) Procedimentos técnicos aplicáveis aos serviços do cliente;
    c) Registros de calibração de padrões utilizados;
    d) Certificados de competência de técnicos (quando aplicável);
    e) Plano de manutenção preventiva de equipamentos críticos.

9.5. Comprometimento com melhoria contínua:
    a) Análise crítica periódica de resultados e não conformidades;
    b) Participação em ensaios de proficiência (intercomparações);
    c) Treinamento contínuo de equipe técnica (mínimo 40h/ano por técnico);
    d) Atualização de normas e procedimentos conforme revisões publicadas.

9.6. Implementação de ações corretivas:
    a) Não conformidades identificadas em auditoria: Prazo 30 dias para AC;
    b) Plano de ação documentado e acompanhável pela CONTRATANTE;
    c) Evidências de implementação compartilhadas ao final do prazo;
    d) Reauditoria (se solicitada): Sem custo para a CONTRATANTE.

9.7. Auditorias não interferem em:
    a) Atividades operacionais normais do laboratório;
    b) Atendimento a outros clientes (confidencialidade preservada);
    c) Cronograma de calibrações já agendadas (prioridade mantida).
`,

    /**
     * Certificado Digital e Segurança da Informação
     */
    certificadoDigital: () => `
CLÁUSULA ESPECÍFICA 10 - DO CERTIFICADO DIGITAL E SEGURANÇA DA INFORMAÇÃO
10.1. Emissão de certificados de calibração:
    a) **FORMATO DIGITAL (PDF)**: Padrão, com assinatura eletrônica qualificada;
    b) **FORMATO FÍSICO (Papel)**: Sob demanda, com assinatura física + carimbo;
    c) Ambos os formatos têm mesma validade legal e metrológica.

10.2. Certificado digital possui as seguintes características:
    a) Assinatura digital qualificada ICP-Brasil (certificação A1 ou A3);
    b) **Carimbo de Tempo (Timestamp)** obrigatório - RFC 3161:
       → Garantia jurídica de data/hora de emissão (prova não-retroativa);
       → Emitido por Autoridade Certificadora do Tempo (ACT) credenciada ITI;
       → Previne alteração de data para "cobrir" auditorias retroativas;
       → Validade jurídica: 10 anos ou mais (conforme algoritmo criptográfico).
    
    c) Código QR para verificação de autenticidade no site da CONTRATADA;
    d) Hash SHA-256 para garantia de integridade do documento;
    e) Numeração sequencial única e rastreável no sistema;
    f) Metadados imutáveis: Data de calibração, técnico responsável, padrões utilizados.

10.3. Verificação de autenticidade:
    a) Acesse: **https://enterfix.com.br/certificados**;
    b) Escaneie o QR Code ou insira o número do certificado;
    c) Sistema exibirá: Status, data de emissão, hash e PDF original;
    d) Disponível 24/7 para clientes, auditores e autoridades.

10.4. Armazenamento e backup (LGPD e ISO/IEC 17025):
    a) Armazenamento em nuvem (AWS S3 ou Supabase Storage) com criptografia AES-256;
    b) Backup redundante em 3 localizações geográficas distintas (multi-region);
    c) Período de guarda: **10 (dez) anos** mínimo (acima do legal de 5 anos);
    d) Após 10 anos: Migração para arquivo morto (acesso sob demanda).
    
    e) **CONFORMIDADE TÉCNICA GARANTIDA**:
       → Infraestrutura configurada conforme cláusulas contratuais;
       → Backups automáticos diários (retenção 30 dias) + mensais (retenção 12 meses);
       → Logs de acesso auditáveis (quem, quando, qual certificado);
       → Disaster Recovery Plan (RTO: 4h, RPO: 24h) - tempo máximo de recuperação;
       → Política de retenção alinhada com ISO/IEC 17025:2017 (item 7.5.2).

10.5. Acesso e segunda via:
    a) **Portal Web**: Login da CONTRATANTE acessa todos os certificados históricos;
    b) **Segunda via digital**: Gratuita, download ilimitado pelo portal;
    c) **Segunda via física (papel)**: R$ 150 por certificado (impressão + correio);
    d) **Cópia autenticada**: R$ 200 (reconhecimento de firma em cartório).

10.6. Privacidade e LGPD:
    a) Dados tratados conforme Lei 13.709/2018 (LGPD);
    b) Informações pessoais: Criptografadas em repouso e em trânsito;
    c) Acesso restrito: Apenas técnicos autorizados e cliente proprietário;
    d) Compartilhamento com terceiros: Somente com autorização expressa;
    e) Exclusão de dados: Mediante solicitação formal (após prazo legal).

10.7. Certificado físico (quando solicitado):
    a) Impresso em papel offset 90g com marca d'água "ENTERFIX";
    b) Assinatura física + carimbo do responsável técnico;
    c) Selo holográfico de segurança (opcional, +R$ 50);
    d) Envio por correio com tracking (rastreamento);
    e) Prazo de entrega: Até 5 dias úteis após emissão do certificado digital.

10.8. Perda ou comprometimento de certificado:
    a) Comunicação imediata à CONTRATADA (e-mail ou telefone);
    b) Certificado pode ser **REVOGADO** se houver suspeita de fraude;
    c) Emissão de segunda via com marcação "SEGUNDA VIA" (sem custo);
    d) Certificado original perde validade após revogação registrada.

10.9. Interoperabilidade:
    a) PDF/A-2b (ISO 19005-2): Garantia de preservação de longo prazo;
    b) Compatível com Adobe Reader, Foxit, navegadores web;
    c) Metadados Dublin Core para indexação e arquivo;
    d) API disponível para integração com sistemas ERP/QMS (Enterprise/customizado).
`,
};