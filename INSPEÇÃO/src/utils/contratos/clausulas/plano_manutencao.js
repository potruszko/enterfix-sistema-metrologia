/**
 * CLÁUSULAS ESPECÍFICAS - Plano de Manutenção Recorrente (Bronze/Prata/Ouro)
 * 
 * Finalidade: Planos recorrentes que COMBINAM múltiplos serviços com descontos e benefícios
 * Tipo: COMPOSTO (referencia contratos atômicos)
 * Aplicável a: Empresas que necessitam manutenção regular com previsibilidade financeira
 * 
 * Contratos referenciados:
 * - manutencao.js: Manutenção Preventiva e Corretiva (base do plano)
 * - calibracao.js: Calibração de Instrumentos (incluída ou com desconto)
 * - fabricacao.js: Fabricação de Peças (desconto sobre tabela)
 * - engenharia_reversa.js: Engenharia Reversa (desconto sobre tabela)
 * - consultoria.js: Consultoria Técnica (incluída no Ouro)
 * 
 * Base legal/normativa:
 * - Código Civil Brasileiro (Lei 10.406/2002) - Contratos de Prestação de Serviços
 * - Código de Defesa do Consumidor (Lei 8.078/90) - Contratos por Adesão
 * - ABNT NBR 15467:2007 - Sistemas de gestão da manutenção
 * 
 * @module contratos/clausulas/plano_manutencao
 * @category Composto
 * @version 1.0.0
 * @lastUpdate 26/02/2026
 * @author Paulo Enterfix
 */

/**
 * CONFIGURAÇÃO DOS PLANOS (Legos Jurídicos - Clean Code aplicado ao Direito)
 * 
 * Uso: No gerador de contratos React, importar e usar para renderizar cláusulas dinamicamente
 * Vantagem: Alterar preço/benefício de plano SEM mexer nas regras técnicas dos anexos
 * 
 * Exemplo de uso:
 * ```javascript
 * import { CONFIG_PLANOS } from './plano_manutencao.js';
 * 
 * const planoSelecionado = 'prata';
 * const config = CONFIG_PLANOS[planoSelecionado];
 * 
 * // Renderizar tabela de preços
 * <PricingCard 
 *   visitas={config.visitas} 
 *   descontoFabricacao={config.descontoFabricacao}
 *   prioridade={config.prioridadeSLA}
 * />
 * 
 * // Calcular multa rescisão
 * const multa = (config.carenciaMeses - mesesDecorridos) * valorMensal * config.multaRescisao;
 * ```
 */
export const CONFIG_PLANOS = {
    bronze: {
        nome: 'Bronze - Preventivo Básico',
        visitas: 2,
        periodicidade: 'Semestral',
        calibracaoInclusa: false,
        calibracaoTipo: 'Básica (dimensional)',
        prioridadeSLA: '5 dias úteis',
        emergenciasInclusas: 0,
        descontoFabricacao: 0,
        descontoEngenhariaReversa: 0,
        descontoConsultoria: 0,
        consultoriaInclusa: false,
        tecnicoExclusivo: false,
        suporte24x7: false,
        carenciaMeses: 6,
        multaRescisao: 0.50, // 50% das mensalidades restantes
        equipamentoSubstituto: false,
        pecasInclusasAte: 0, // R$ 0 (orçamento separado sempre)
        treinamentoAnual: false,
        dashboardOnline: false,
        analisePreditiva: false,
        cor: '#CD7F32', // Bronze
        ideal: 'Equipamentos uso eventual, orçamento restrito',
        valorBaseReferencia: 1500 // R$ 1.500/mês (referência)
    },
    prata: {
        nome: 'Prata - Prioritário',
        visitas: 4,
        periodicidade: 'Trimestral',
        calibracaoInclusa: true,
        calibracaoTipo: 'Completa RBC',
        prioridadeSLA: '48 horas',
        emergenciasInclusas: 1,
        descontoFabricacao: 15,
        descontoEngenhariaReversa: 15,
        descontoConsultoria: 10,
        consultoriaInclusa: false,
        tecnicoExclusivo: false,
        suporte24x7: true,
        carenciaMeses: 12,
        multaRescisao: 0.70, // 70% das mensalidades restantes
        equipamentoSubstituto: false,
        pecasInclusasAte: 0, // R$ 0 (orçamento separado)
        treinamentoAnual: false,
        dashboardOnline: true,
        analisePreditiva: true,
        cor: '#C0C0C0', // Prata
        ideal: 'Equipamentos críticos, ISO 9001/17025',
        valorBaseReferencia: 2500 // R$ 2.500/mês (referência)
    },
    ouro: {
        nome: 'Ouro - Full Service Premium',
        visitas: 12,
        periodicidade: 'Mensal',
        calibracaoInclusa: true,
        calibracaoTipo: 'Premium + Padrões',
        prioridadeSLA: '24 horas',
        emergenciasInclusas: 999, // Ilimitadas
        descontoFabricacao: 25,
        descontoEngenhariaReversa: 25,
        descontoConsultoria: 100, // 100% = inclusa
        consultoriaInclusa: true,
        consultoriaHorasAno: 20,
        tecnicoExclusivo: true,
        suporte24x7: true,
        carenciaMeses: 24,
        multaRescisao: 1.00, // 100% das mensalidades restantes
        equipamentoSubstituto: true, // 🎯 MAIOR REDUTOR DE ANSIEDADE
        equipamentoSubstitutoPrazo: 5, // dias
        pecasInclusasAte: 10000, // R$ 10.000/ano
        treinamentoAnual: true,
        treinamentoHoras: 4,
        dashboardOnline: true,
        analisePreditiva: true,
        relatorioExecutivo: true,
        eventosEnterfix: true,
        cor: '#FFD700', // Ouro
        ideal: 'Parques críticos 24/7, ANVISA, alta disponibilidade',
        valorBaseReferencia: 5000 // R$ 5.000/mês (referência)
    }
};

/**
 * HELPER: Calcular benefícios que faltam (para gerar desejo de upgrade)
 * 
 * Uso no React (Dashboard do Cliente):
 * ```javascript
 * const beneficiosPerdidos = calcularBeneficiosFaltando('bronze', 'ouro');
 * // Retorna: ['Calibração inclusa', 'Técnico exclusivo', 'Equipamento substituto', ...]
 * 
 * beneficiosPerdidos.map(b => <Badge color="gray">{b} ❌</Badge>)
 * ```
 */
export const calcularBeneficiosFaltando = (planoAtual, planoComparado) => {
    const atual = CONFIG_PLANOS[planoAtual];
    const comparado = CONFIG_PLANOS[planoComparado];
    const faltando = [];

    if (!atual.calibracaoInclusa && comparado.calibracaoInclusa) {
        faltando.push('Calibração completa inclusa');
    }
    if (!atual.tecnicoExclusivo && comparado.tecnicoExclusivo) {
        faltando.push('Técnico de referência exclusivo');
    }
    if (!atual.equipamentoSubstituto && comparado.equipamentoSubstituto) {
        faltando.push('Equipamento substituto em caso de reparo longo');
    }
    if (!atual.consultoriaInclusa && comparado.consultoriaInclusa) {
        faltando.push(`Consultoria técnica inclusa (${comparado.consultoriaHorasAno}h/ano)`);
    }
    if (atual.emergenciasInclusas < comparado.emergenciasInclusas) {
        faltando.push(`Atendimentos emergenciais ${comparado.emergenciasInclusas === 999 ? 'ILIMITADOS' : comparado.emergenciasInclusas + '/ano'}`);
    }
    if (atual.descontoFabricacao < comparado.descontoFabricacao) {
        faltando.push(`${comparado.descontoFabricacao}% desconto em Fabricação (você tem ${atual.descontoFabricacao}%)`);
    }
    if (atual.prioridadeSLA !== comparado.prioridadeSLA) {
        faltando.push(`Prioridade SLA: ${comparado.prioridadeSLA} (você tem ${atual.prioridadeSLA})`);
    }

    return faltando;
};

export const CLAUSULAS_PLANO_MANUTENCAO = {
    /**
     * Estrutura e Composição do Plano
     */
    estrutura: () => `
CLÁUSULA ESPECÍFICA 1 - DA ESTRUTURA E COMPOSIÇÃO DOS PLANOS
1.1. Este contrato é COMPOSTO pelos seguintes serviços base:
    a) **MANUTENÇÃO PREVENTIVA E CORRETIVA** (Anexo A):
       → Conforme "Contrato de Manutenção" - Cláusulas 1 a 9;
       → Escopo, periodicidade, prazos, peças, indicadores, equipe, garantia;
       → Todas as condições técnicas do contrato atômico aplicam-se integralmente.
    
    b) **CALIBRAÇÃO DE INSTRUMENTOS** (Anexo B - conforme plano):
       → Conforme "Contrato de Calibração" - Cláusulas 1 a 7;
       → Inclusa ou com desconto dependendo do plano contratado;
       → Rastreabilidade RBC, certificados, incerteza de medição.
    
    c) **DESCONTOS EM SERVIÇOS ADICIONAIS** (Anexo C - conforme plano):
       → Fabricação de Peças: 10% a 25% de desconto (vide "Contrato de Fabricação");
       → Engenharia Reversa: 15% a 25% de desconto (vide "Contrato de Engenharia Reversa");
       → Consultoria Técnica: Inclusa (Ouro) ou com desconto (vide "Contrato de Consultoria").

1.2. Hierarquia contratual:
    a) Este contrato (Plano de Manutenção) estabelece: periodicidade, valores, fidelidade, descontos;
    b) Contratos anexos (A, B, C) estabelecem: condições técnicas, qualidade, garantias, prazos;
    c) Em caso de conflito: Prevalece especificação deste contrato para aspectos comerciais;
    d) Aspectos técnicos: Prevalecem especificações dos contratos atômicos anexos.

1.3. Documentação que compõe este contrato:
    a) Contrato Principal: Plano de Manutenção Recorrente (este documento);
    b) ANEXO A: Contrato de Manutenção (condições técnicas integrais);
    c) ANEXO B: Contrato de Calibração (condições técnicas integrais);
    d) ANEXO C: Tabela de Descontos conforme plano (Bronze/Prata/Ouro);
    e) ANEXO D: Proposta Comercial (valores específicos do cliente);
    f) ANEXO E: Relação de Equipamentos cobertos pelo plano.
`,

    /**
     * Níveis de Serviço (Bronze, Prata, Ouro)
     */
    niveisServico: () => `
CLÁUSULA ESPECÍFICA 2 - DOS NÍVEIS DE SERVIÇO (BRONZE, PRATA, OURO)
2.1. A CONTRATANTE deverá optar por um dos seguintes planos:

    ┌──────────────────────────────────────────────────────────────────────────┐
    │ PLANO BRONZE - Preventivo Básico                                        │
    ├──────────────────────────────────────────────────────────────────────────┤
    │ MANUTENÇÃO (Anexo A):                                                    │
    │ • Visitas SEMESTRAIS (2x ao ano)                                        │
    │ • Limpeza técnica e lubrificação                                        │
    │ • Substituição de peças consumíveis (vedações, filtros, fusíveis)      │
    │ • Ajustes mecânicos básicos                                             │
    │ • Relatório técnico simplificado                                        │
    │                                                                          │
    │ CALIBRAÇÃO (Anexo B):                                                    │
    │ • Calibração dimensional básica (paquímetro, micrômetro)               │
    │ • Certificado de calibração padrão (rastreabilidade RBC)               │
    │ • Nota: Calibração completa NÃO inclusa (orçamento separado)           │
    │                                                                          │
    │ ATENDIMENTO CORRETIVO:                                                   │
    │ • Prioridade NORMAL (até 5 dias úteis)                                 │
    │ • Peças principais: orçamento separado                                  │
    │                                                                          │
    │ DESCONTOS (Anexo C):                                                     │
    │ • Fabricação: SEM DESCONTO (tabela padrão)                              │
    │ • Engenharia Reversa: SEM DESCONTO (tabela padrão)                      │
    │                                                                          │
    │ SUPORTE:                                                                 │
    │ • Telefone/e-mail: horário comercial (seg-sex 8h-18h)                  │
    │ • Suporte remoto básico                                                 │
    │                                                                          │
    │ IDEAL PARA:                                                              │
    │ • Equipamentos de uso eventual ou controlado                            │
    │ • Empresas em fase de crescimento                                       │
    │ • Orçamento restrito com necessidades básicas                           │
    └──────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────────────────┐
    │ PLANO PRATA - Prioritário                                               │
    ├──────────────────────────────────────────────────────────────────────────┤
    │ MANUTENÇÃO (Anexo A):                                                    │
    │ • Visitas TRIMESTRAIS (4x ao ano)                                       │
    │ • Manutenção preventiva COMPLETA (todas as cláusulas do Anexo A)       │
    │ • Limpeza técnica, lubrificação, ajustes, testes de funcionalidade     │
    │ • Substituição de todas as peças consumíveis                            │
    │ • Relatório técnico DETALHADO com indicadores (MTBF, MTTR)             │
    │                                                                          │
    │ CALIBRAÇÃO (Anexo B):                                                    │
    │ • Calibração completa INCLUÍDA trimestralmente                          │
    │ • Certificado de calibração com rastreabilidade RBC                     │
    │ • Incerteza de medição calculada (k=2)                                  │
    │ • Etiquetagem e alertas de vencimento                                   │
    │                                                                          │
    │ ATENDIMENTO CORRETIVO:                                                   │
    │ • Prioridade ALTA (até 48 horas)                                        │
    │ • Peças principais: orçamento separado (aprovação em 24h)              │
    │ • 1 atendimento EMERGENCIAL por ano SEM CUSTO adicional                │
    │                                                                          │
    │ DESCONTOS (Anexo C):                                                     │
    │ • 15% DE DESCONTO em Fabricação de Peças                                │
    │ • 15% DE DESCONTO em Engenharia Reversa                                 │
    │ • 10% DE DESCONTO em Consultoria Técnica                                │
    │                                                                          │
    │ SUPORTE:                                                                 │
    │ • Telefone/e-mail/WhatsApp: 24/7 (resposta em até 2h)                  │
    │ • Suporte remoto COMPLETO (diagnóstico, orientação)                    │
    │ • Acesso ao portal web com histórico completo                          │
    │                                                                          │
    │ BENEFÍCIOS ADICIONAIS:                                                   │
    │ • Prioridade na fila de atendimento                                     │
    │ • Técnico de referência (não exclusivo)                                 │
    │ • Dashboard de indicadores online                                       │
    │                                                                          │
    │ IDEAL PARA:                                                              │
    │ • Equipamentos críticos com uso regular                                 │
    │ • Empresas com certificação ISO 9001, ISO 17025                         │
    │ • Necessidade de rastreabilidade e documentação completa                │
    └──────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────────────────┐
    │ PLANO OURO - Full Service Premium                                       │
    ├──────────────────────────────────────────────────────────────────────────┤
    │ MANUTENÇÃO (Anexo A):                                                    │
    │ • Visitas MENSAIS (12x ao ano)                                          │
    │ • Manutenção PREDITIVA com monitoramento contínuo                       │
    │ • Análise de vibração, termografia, inspeção detalhada                  │
    │ • Todas as peças consumíveis + principais INCLUÍDAS (até R$ 10k/ano)   │
    │ • Relatório EXECUTIVO mensal + dashboard gerencial                      │
    │                                                                          │
    │ CALIBRAÇÃO (Anexo B):                                                    │
    │ • Calibração PREMIUM mensal (todas as cláusulas do Anexo B)            │
    │ • Certificado RBC com incerteza expandida                               │
    │ • Calibração de padrões de referência inclusa                           │
    │ • Gestão completa de prazos e alertas                                   │
    │                                                                          │
    │ ATENDIMENTO CORRETIVO:                                                   │
    │ • Prioridade MÁXIMA (até 24 horas)                                      │
    │ • Atendimentos emergenciais ILIMITADOS                                  │
    │                                                                          │
    │ 🎯 EQUIPAMENTO SUBSTITUTO (MAIOR REDUTOR DE ANSIEDADE):                 │
    │ • Reparo estimado > 5 dias → ENTERFIX fornece equipamento equivalente  │
    │ • Modelo similar ou superior (mesma faixa de medição/função)           │
    │ • Calibrado e pronto para uso imediato (certificado RBC incluso)       │
    │ • SEM CUSTO ADICIONAL durante reparo do equipamento original            │
    │ • Prazo de entrega: Até 48h após diagnóstico de reparo longo           │
    │ • Cobertura: Instrumentos metrológicos (MMC, paquímetros digitais,     │
    │   micrômetros, relógios comparadores, blocos padrão, rugosímetros)     │
    │ • Benefício: ZERO PARADA DE PRODUÇÃO durante manutenções complexas     │
    │                                                                          │
    │ ⚠️ Exemplo Prático (Caso Real):                                          │
    │ Cliente Ouro: MMC Zeiss quebrou (reparo 15 dias p/ peça importada)     │
    │ → Enterfix entrega MMC Brown&Sharpe de backup em 24h                   │
    │ → Cliente continua produzindo normalmente (custo parada evitado: R$ 45k)│
    │ → Equipamento substituto devolvido após reparo completo do original     │
    │ → Cliente pagou: R$ 0 adicionais (já incluso no plano Ouro)            │
    │                                                                          │
    │ DESCONTOS (Anexo C):                                                     │
    │ • 25% DE DESCONTO em Fabricação de Peças                                │
    │ • 25% DE DESCONTO em Engenharia Reversa                                 │
    │ • Consultoria Técnica INCLUÍDA (até 20h/ano)                            │
    │                                                                          │
    │ SUPORTE:                                                                 │
    │ • Suporte ILIMITADO 24/7 (telefone, e-mail, WhatsApp)                  │
    │ • Técnico de referência EXCLUSIVO (com backup)                         │
    │ • Atendimento remoto prioritário em até 30 minutos                      │
   │                                                                          │
    │ BENEFÍCIOS PREMIUM:                                                      │
    │ • Treinamento anual da equipe do cliente (4h in company)                │
    │ • Consultoria em otimização de processos metrológicos                   │
    │ • Análise semestral de indicadores (MTBF, MTTR, disponibilidade)       │
    │ • Acesso a eventos técnicos e workshops da Enterfix                     │
    │ • Desconto preferencial em novos equipamentos (quando aplicável)        │
    │                                                                          │
    │ IDEAL PARA:                                                              │
    │ • Parques críticos (produção 24/7)                                      │
    │ • Indústrias reguladas (ANVISA, INMETRO, ISO 17025)                    │
    │ • Empresas com alta demanda e equipamentos estratégicos                 │
    │ • Necessidade de disponibilidade máxima (≥ 99%)                         │
    └──────────────────────────────────────────────────────────────────────────┘

2.2. COMPARATIVO RÁPIDO:
    ┌─────────────────────┬───────────┬───────────┬──────────────┐
    │ BENEFÍCIO           │ BRONZE    │ PRATA     │ OURO         │
    ├─────────────────────┼───────────┼───────────┼──────────────┤
    │ Visitas/ano         │ 2x        │ 4x        │ 12x          │
    │ Calibração inclusa  │ Básica    │ Completa  │ Premium      │
    │ Prioridade SLA      │ 5 dias    │ 48h       │ 24h          │
    │ Emergências/ano     │ 0         │ 1         │ Ilimitadas   │
    │ Desc. Fabricação    │ 0%        │ 15%       │ 25%          │
    │ Desc. Eng. Reversa  │ 0%        │ 15%       │ 25%          │
    │ Consultoria         │ Avulso    │ 10% desc  │ 20h inclusa  │
    │ Técnico exclusivo   │ Não       │ Não       │ Sim          │
    │ Carência mínima     │ 6 meses   │ 12 meses  │ 24 meses     │
    └─────────────────────┴───────────┴───────────┴──────────────┘

2.3. Todos os planos incluem (independente do nível):
    a) Gestão de histórico de manutenção por 5 anos;
    b) Garantia de 90 dias nos serviços executados (conforme Anexo A);
    c) Equipe técnica certificada e instrumentos calibrados;
    d) Seguro de responsabilidade civil da CONTRATADA;
    e) Cumprimento de normas ABNT NBR 5462 e ISO/IEC 17025.
`,

    /**
     * Upgrade, Downgrade e Migração de Planos
     */
    migracaoPlanos: () => `
CLÁUSULA ESPECÍFICA 3 - DO UPGRADE, DOWNGRADE E MIGRAÇÃO DE PLANOS
3.1. UPGRADE de plano (Bronze → Prata ou Prata → Ouro):
    a) Pode ser solicitado a qualquer momento;
    b) Diferença de valores será calculada pro-rata (proporcional ao período restante);
    c) Efeito: IMEDIATO após pagamento da diferença;
    d) Benefícios do plano superior: Aplicam-se imediatamente;
    e) Carência:  Tempo já cumprido no plano anterior é APROVEITADO;
    f) Exemplo:
       → Bronze por 3 meses → Upgrade para Prata;
       → Nova carência Prata: 12 meses - 3 já cumpridos = 9 meses restantes.

3.2. DOWNGRADE de plano (Ouro → Prata ou Prata → Bronze):
    a) Pode ser solicitado, mas com restrições;
    b) Efeito: Apenas no próximo ciclo de renovação (não é imediato);
    c) Durante período até renovação: Mantém plano atual integralmente;
    d) Carência: Mantém carência do plano original até completar período;
    e) Motivo da restrição: Evitar aproveitamento de benefícios premium sem fidelidade.

3.3. Cálculo de diferença para upgrade (exemplo prático):
    ┌──────────────────────────────────────────────────────────────┐
    │ EXEMPLO: Bronze R$ 1.500/mês → Prata R$ 2.500/mês          │
    ├──────────────────────────────────────────────────────────────┤
    │ • Contrato Bronze iniciado em 01/01/2026                    │
    │ • Solicitação de upgrade em 01/04/2026 (3 meses após)       │
    │ • Período restante até renovação: 9 meses                    │
    │ • Diferença mensal: R$ 2.500 - R$ 1.500 = R$ 1.000          │
    │ • Valor a pagar para upgrade: R$ 1.000 × 9 = R$ 9.000       │
    │ • Ou parcelado: R$ 9.000 ÷ 9 meses = R$ 1.000/mês adicional │
    │ • Nova mensalidade a partir do upgrade: R$ 2.500/mês        │
    └──────────────────────────────────────────────────────────────┘

3.4. Aprovação de upgrade:
    a) Solicitação por e-mail ou portal web;
    b) CONTRATADA emitirá termo aditivo em até 3 dias úteis;
    c) Aprovação e pagamento da diferença (ou aceite do parcelamento);
    d) Ativação dos novos benefícios: Imediata após confirmação de pagamento.

3.5. Negativa de downgrade (quando aplicável):
    a) CONTRATADA pode recusar downgrade se:
       → Cliente utilizou benefícios premium de forma intensiva;
       → Investimentos já realizados não foram amortizados;
       → Carência mínima do plano atual não foi cumprida.
    
    b) Alternativas SE downgrade negado:
       → Aguardar término da carência (downgrade automático na renovação);
       → Rescindir contrato (sujeito a multa conforme Cláusula 5).
`,

    /**
     * Valores, Reajuste e Forma de Pagamento
     */
    valores: () => `
CLÁUSULA ESPECÍFICA 4 - DOS VALORES, REAJUSTE E FORMA DE PAGAMENTO
4.1. VALORES MENSAIS dos planos (Anexo D - Proposta Comercial):
    a) Serão definidos em proposta comercial específica por cliente;
    b) Calculados com base em:
       → Quantidade de equipamentos (Anexo E);
       → Complexidade dos equipamentos (modelos, fabricantes, idade);
       → Localização geográfica (deslocamento);
       → Histórico de falhas e condição geral do parque.
    
    c) Valores FIXOS durante período de 12 meses (salvo reajuste anual previsto);
    d) Renovação automática pelo mesmo valor REAJUSTADO (salvo negociação prévia).

4.2. FORMA DE PAGAMENTO:
    a) Mensalidade vencível no dia 10 de cada mês;
    b) Boleto bancário, depósito identificado ou débito automático;
    c) DESCONTO DE 5% para pagamento anual antecipado (12 meses à vista);
    d) Primeira mensalidade: Pro-rata conforme dia de início do contrato;
    e) Juros de 1% ao mês + multa de 2% sobre valores em atraso;
    f) Inadimplência superior a 30 dias: Suspensão dos serviços.

4.3. REAJUSTE AUTOMÁTICO ANUAL:
    a) Aplicado a cada 12 meses a partir da data de assinatura;
    b) Índice utilizado: IGP-M (FGV) ou IPCA (IBGE), **O QUE FOR MENOR**;
    c) Cálculo: Variação acumulada nos 12 meses anteriores à data de reajuste;
    d) Comunicação formal com 30 dias de antecedência;
    e) Caso índice seja negativo: Valor permanece inalterado (não há redução);
    f) Reajuste extraordinário: Somente mediante acordo entre as partes.

4.4. PROTEÇÃO CONTRA INFLAÇÃO EXTREMA:
    a) Caso inflação acumulada ultrapasse 15% em 12 meses:
       → As partes se comprometem a renegociar valores;
       → Ou qualquer das partes pode rescindir SEM MULTA (cláusula de hardship);
       → Prazo para renegociação: 30 dias após comunicação.
    
    b) Exemplo prático (proteção):
       → Contrato assinado em 01/01/2026, valor R$ 2.500/mês;
       → IGP-M acumulado 01/01/26 a 01/01/27: 18%;
       → Cliente pode: aceitar reajuste de 18%, renegociar ou rescindir sem multa.

4.5. SERVIÇOS FORA DO ESCOPO (orçamento separado):
    a) Peças principais acima do limite anual (Ouro: acima de R$ 10.000/ano);
    b) Deslocamento fora da região metropolitana de São Bernardo/ABC (acima de 50km);
    c) Atendimentos em finais de semana/feriados (exceto Ouro - emergências);
    d) Modificações, upgrades ou customizações especiais;
    e) Horas de Consultoria acima do limite (Ouro: acima de 20h/ano);
    f) Horas extras técnicas acima do escopo: R$ 200/hora + 50% (extra) + impostos.

4.6. Orçamentos adicionais (serviços fora do escopo):
    a) Enviados em até 48h após diagnóstico ou solicitação;
    b) Validade do orçamento: 15 dias corridos;
    c) CONTRATANTE tem 5 dias úteis para aprovar ou recusar;
    d) Sem aprovação no prazo: Serviço automaticamente cancelado;
    e) Descontos conforme plano (Anexo C) sempre aplicados.
`,

    /**
     * Fidelidade, Carência e Rescisão
     */
    fidelidade: () => `
CLÁUSULA ESPECÍFICA 5 - DA FIDELIDADE, CARÊNCIA E RESCISÃO
5.1. PERÍODO DE CARÊNCIA (fidelidade mínima):
    a) Plano Bronze: 6 meses de carência;
    b) Plano Prata: 12 meses de carência;
    c) Plano Ouro: 24 meses de carência.

5.2. MULTA POR RESCISÃO ANTECIPADA pela CONTRATANTE:
    a) Se rescindido ANTES do término da carência:
       → Bronze: 50% das mensalidades restantes até completar 6 meses;
       → Prata: 70% das mensalidades restantes até completar 12 meses;
       → Ouro: 100% das mensalidades restantes até completar 24 meses.
    
    b) EXEMPLO PRÁTICO (Plano Prata):
       ┌───────────────────────────────────────────────────────────┐
       │ • Contrato Prata: R$ 2.500/mês (carência 12 meses)       │
       │ • Início: 01/01/2026                                      │
       │ • Rescisão solicitada em: 01/07/2026 (6 meses após)      │
       │ • Meses restantes para completar carência: 6 meses       │
       │ • Multa: 70% × (6 meses × R$ 2.500)                      │
       │ • Multa: 70% × R$ 15.000 = R$ 10.500                     │
       │                                                            │
       │ → Cliente deverá pagar R$ 10.500 para rescindir           │
       └───────────────────────────────────────────────────────────┘

5.3. JUSTIFICATIVA DA CARÊNCIA (transparência):
    a) Investimento inicial significativo da CONTRATADA:
       → Diagnóstico completo do parque de equipamentos;
       → Mapeamento de histórico e condições;
       → Cadastro detalhado no sistema de gestão;
       → Alocação de equipe técnica dedicada;
       → Técnico de referência (Ouro) treinado especificamente.
    
    b) Descontos concedidos são compensados ao longo do período:
       → Desconto de 15% a 25% em fabricação/eng. reversa;
       → Calibração inclusa (Prata/Ouro);
       → Consultoria inclusa (Ouro);
       → Amortização ocorre ao longo dos meses de fidelidade.
    
    c) Previsibilidade de receita permite melhores condições comerciais:
       → Valores mensais abaixo do mercado (média 20% menor que avulso);
       → Garantia de capacidade técnica reservada;
       → Investimento em treinamento específico da equipe.

5.4. RESCISÃO SEM MULTA pela CONTRATANTE (exceções):
    a) Descumprimento sistemático de SLA:
       → 3 meses consecutivos com prazos não cumpridos;
       → Ou 5 ocorrências em 12 meses;
       → Documentado por protocolo de chamados.
    
    b) Falha grave com dano material comprovado:
       → Dano superior a R$ 20.000 causado por negligência da CONTRATADA;
       → Laudo técnico de terceiro (se necessário);
       → Com nexo causal comprovado.
    
    c) Paralisação definitiva das atividades da CONTRATANTE:
       → Encerramento da empresa;
       → Venda de todos os equipamentos;
       → Mudança para localidade fora da área de cobertura (> 200km).
    
    d) Força maior ou caso fortuito:
       → Pandemia, guerra, catástrofe natural;
       → Impossibilidade superveniente de continuidade;
       → Conforme Código Civil Art. 393.

5.5. RESCISÃO SEM MULTA pela CONTRATADA (exceções):
    a) Inadimplência superior a 60 dias;
    b) Uso inadequado reincidente dos equipamentos:
       → Após 3 notificações formais;
       → Uso indevido, sobrecarga, falta de cuidados básicos.
    
    c) Impedimento de acesso aos equipamentos:
       → 2 meses consecutivos sem possibilidade de manutenção;
       → Recusa reiterada de agendamentos.
    
    d) Solicitação de práticas antiéticas ou ilegais:
       → Falsificação de certificados;
       → Omissão de não conformidades graves;
       → Qualquer prática contrária à ética profissional.

5.6. RENOVAÇÃO AUTOMÁTICA após cumprimento da carência:
    a) Contrato renova-se automaticamente por períodos de 12 meses;
    b) Valores serão reajustados conforme Cláusula 4.3;
    c) Qualquer das partes pode rescindir com 60 dias de aviso prévio;
    d) RESCISÃO SEM MULTA após cumprida a carência inicial;
   e) Notificação: Por e-mail ou carta registrada.

5.7. MIGRAÇÃO DE PLANO e impacto na carência:
    a) Upgrade (Bronze → Prata ou Prata → Ouro):
       → Tempo já cumprido é APROVEITADO integralmente;
       → Carência recalculada: Carência nova - tempo já cumprido;
       → Exemplo: Bronze 3 meses → Prata: faltam 9 meses (12 - 3).
    
    b) Downgrade (Ouro → Prata ou Prata → Bronze):
       → Mantém carência do plano ORIGINAL até completar período;
       → Não há benefício de carência reduzida no downgrade;
       → Exemplo: Ouro 18 meses → Downgrade para Prata: ainda faltam 6 meses de carência Ouro.
`,

    /**
     * Gestão do Plano e Benefícios Operacionais
     */
    gestao: () => `
CLÁUSULA ESPECÍFICA 6 - DA GESTÃO DO PLANO E BENEFÍCIOS OPERACIONAIS
6.1. GESTÃO PROATIVA pela CONTRATADA:
    a) Agendamento programado elimina imprevistos:
       → Calendário anual definido no início do contrato;
       → Visitas programadas (semestral, trimestral ou mensal);
       → Cliente recebe notificação 15 dias antes de cada visita.
    
    b) Histórico completo no Sistema Enterfix:
       → Portal web com login e senha exclusivos;
       → Histórico de cada equipamento (manutenções, calibrações, falhas);
       → Download de certificados e relatórios (últimos 5 anos);
       → Dashboard com indicadores em tempo real (MTBF, MTTR, disponibilidade).
    
    c) Análise preditiva (Prata e Ouro):
       → Identificação de desgaste antes da falha;
       → Alertas automáticos: peças com vida útil próxima do fim;
       → Recomendações de substituição preventiva;
       → Análise de tendências de falhas.
    
    d) Planejamento de CAPEX (todas os planos):
       → Previsão de investimentos em novos equipamentos;
       → Relatório semestral: "equipamentos em fim de vida útil";
       → Orçamento de substituição ou modernização;
       → Suporte na decisão: reparar vs. substituir.

6.2. BENEFÍCIOS TANGÍVEIS para a CONTRATANTE:
    a) Redução de custos operacionais:
       → Menos paradas emergenciais: diminui desperdício e ociosidade;
       → Aumento de vida útil dos equipamentos: até 30% (estudos internos);
       → Redução de horas extras e produção perdida.
    
    b) Previsibilidade financeira:
       → Valor fixo mensal: facilita orçamento e fluxo de caixa;
       → Sem surpresas: calibração e manutenção já inclusas;
       → Descontos pré-estabelecidos: simulação de custos anual precisa.
    
    c) Prioridade garantida:
       → Não concorre com clientes avulsos em períodos de alta demanda;
       → Capacidade técnica reservada (Ouro: técnico exclusivo);
       → Emergências atendidas com prioridade máxima.
    
    d) Expertise acumulada:
       → Técnicos conhecem profundamente os equipamentos do cliente;
       → Histórico de falhas reduz tempo de diagnóstico;
       → Soluções personalizadas baseadas em experiência acumulada.
    
    e) Conformidade regulatória:
       → Registros organizados para auditorias (ISO 9001, ISO 17025, ANVISA);
       → Rastreabilidade total: quem, quando, o que foi feito;
       → Certificados de calibração sempre à mão;
       → Menor risco jurídico: equipamentos sempre em conformidade.

6.3. CONSULTORIA INCLUSA (Plano Ouro):
    a) Até 20 horas/ano de consultoria técnica especializada;
    b) Análise semestral de indicadores de confiabilidade:
       → MTBF (Mean Time Between Failures): tempo médio entre falhas;
       → MTTR (Mean Time To Repair): tempo médio de reparo;
       → Disponibilidade: % de tempo operacional dos equipamentos;
       → Taxa de conformidade com SLA.
    
    c) Recomendações para estender vida útil dos equipamentos;
    d) Identificação de oportunidades de automação metrológica;
    e) Treinamento de colaboradores em uso correto e cuidados básicos (4h/ano in company).

6.4. PORTAL WEB ENTERFIX (Prata e Ouro):
    a) Acesso 24/7 com login e senha exclusivos;
    b) Funcionalidades:
       → Consulta de histórico completo de cada equipamento;
       → Download de certificados e relatórios;
       → Visualização de calendário de manutenções programadas;
       → Abertura de chamados online;
       → Rastreamento de chamados em tempo real (status);
       → Dashboard gerencial: MTBF, MTTR, disponibilidade, custos;
       → Alertas de vencimento de calibração (e-mail automático);
       → Exportação de dados (Excel, PDF) para auditorias.

6.5. DASHBOARD DE UPGRADE (Gerar Desejo de Plano Superior):
    ⚠️ ESTRATÉGIA COMERCIAL: Mostrar benefícios que o cliente NÃO tem no plano atual.
    
    a) IMPLEMENTAÇÃO NO PORTAL WEB:
       → Cliente Bronze vê em CINZA (desabilitado) os benefícios do Prata e Ouro;
       → Cada benefício bloqueado tem botão "Fazer Upgrade" ao lado;
       → Cálculo automático: "Upgrade para Prata por apenas +R$ 1.000/mês";
       → Tooltip explicando o benefício: "Calibração completa inclusa economiza R$ 800/visita".
    
    b) EXEMPLOS DE MENSAGENS NO DASHBOARD:
       
       Cliente BRONZE visualiza:
       ┌──────────────────────────────────────────────────────────────┐
       │ ❌ Calibração Completa Inclusa (disponível no Prata)         │
       │    Você economizaria R$ 3.200/ano em calibrações             │
       │    [Botão: Fazer Upgrade para Prata por +R$ 1.000/mês] ✨    │
       ├──────────────────────────────────────────────────────────────┤
       │ ❌ Equipamento Substituto (disponível no Ouro)               │
       │    Última parada do seu MMC custou R$ 18.000 em produção     │
       │    [Botão: Fazer Upgrade para Ouro por +R$ 3.500/mês] 🎯     │
       ├──────────────────────────────────────────────────────────────┤
       │ ❌ Prioridade 48h (disponível no Prata)                      │
       │    Seu último chamado levou 5 dias para atendimento          │
       │    [Botão: Fazer Upgrade para Prata] ⚡                      │
       └──────────────────────────────────────────────────────────────┘
       
       Cliente PRATA visualiza:
       ┌──────────────────────────────────────────────────────────────┐
       │ ❌ Técnico de Referência EXCLUSIVO (disponível no Ouro)      │
       │    Tempo médio de diagnóstico seria 40% menor                │
       │    [Botão: Fazer Upgrade para Ouro] 🚀                       │
       ├──────────────────────────────────────────────────────────────┤
       │ ❌ 25% desconto Fabricação (você tem 15%)                    │
       │    Economia anual estimada: R$ 8.500 com seu histórico       │
       │    [Botão: Simular Upgrade para Ouro] 💰                     │
       └──────────────────────────────────────────────────────────────┘
    
    c) CÁLCULO AUTOMÁTICO DE ROI DO UPGRADE:
       Sistema analisa histórico do cliente e mostra:
       → "Você gastou R$ 6.400 em calibrações avulsas nos últimos 12 meses";
       → "No Plano Prata (calibração inclusa), economia seria R$ 3.200/ano";
       → "Custo adicional Prata: +R$ 1.000/mês × 12 = R$ 12.000/ano";
       → "Payback: Não compensaria (economia < custo adicional)";
       → OU: "Payback: 8 meses (economia R$ 18.000/ano > custo R$ 12.000)".
    
    d) GATILHOS AUTOMÁTICOS DE UPGRADE (E-mail Marketing):
       → Cliente Bronze teve 3ª emergência em 6 meses → E-mail: "Plano Prata tem 1 emergência inclusa";
       → Cliente Prata teve parada > 5 dias → E-mail: "Plano Ouro tem equipamento substituto";
       → Cliente Bronze gastou > R$ 5.000 em calibrações avulsas → E-mail: "No Prata, calibração é inclusa";
       → Cliente qualquer teve chamado atendido fora do SLA → E-mail: "Upgrade garante prioridade máxima".
    
    e) COMPLIANCE: Transparência total no upgrade:
       → Cliente sempre vê valor exato adicional mensal;
       → Simulação de economia baseada em DADOS REAIS do histórico dele;
       → Termo aditivo gerado automaticamente (assinatura digital);
       → Sem práticas enganosas: se não compensar, sistema indica "não recomendado".

6.6. CÁLCULO AUTOMÁTICO DE MTBF/MTTR (Supabase + Dashboard):
    🎯 TRANSFORMAR SERVIÇO EM PARCERIA DE ENGENHARIA (não apenas manutenção).
    
    a) DEFINIÇÕES DOS INDICADORES:
       → MTBF (Mean Time Between Failures): Tempo médio entre falhas consecutivas;
         Fórmula: MTBF = (Tempo total operacional) / (Número de falhas)
         Exemplo: Equipamento operou 720h no mês, teve 3 falhas → MTBF = 720/3 = 240h
       
       → MTTR (Mean Time To Repair): Tempo médio de reparo;
         Fórmula: MTTR = (Soma dos tempos de reparo) / (Número de falhas)
         Exemplo: 3 falhas com reparos de 2h, 4h, 6h → MTTR = (2+4+6)/3 = 4h
       
       → Disponibilidade: % do tempo que equipamento está operacional;
         Fórmula: Disponibilidade = MTBF / (MTBF + MTTR) × 100
         Exemplo: MTBF 240h, MTTR 4h → Disponibilidade = 240/(240+4) × 100 = 98,36%
    
    b) REGISTRO AUTOMÁTICO NO SUPABASE (a cada chamado fechado):
       Tabela: chamados_manutencao
       ┌──────────────────┬─────────────┬──────────────────────────────────┐
       │ Campo            │ Tipo        │ Uso                              │
       ├──────────────────┼─────────────┼──────────────────────────────────┤
       │ equipamento_id   │ UUID        │ FK para equipamentos             │
       │ tipo_chamado     │ TEXT        │ 'preventiva' ou 'corretiva'      │
       │ data_abertura    │ TIMESTAMP   │ Quando falha foi detectada       │
       │ data_inicio      │ TIMESTAMP   │ Quando técnico iniciou reparo    │
       │ data_conclusao   │ TIMESTAMP   │ Quando equipamento voltou operar │
       │ tempo_reparo_min │ INTEGER     │ (data_conclusao - data_inicio)   │
       │ descricao_falha  │ TEXT        │ O que quebrou                    │
       │ pecas_trocadas   │ JSONB       │ Lista de peças substituídas      │
       │ custo_total      │ DECIMAL     │ Valor do chamado                 │
       └──────────────────┴─────────────┴──────────────────────────────────┘
       
       → Campo calculado automaticamente: tempo_reparo_min
       → Trigger atualiza dashboard em tempo real ao fechar chamado.
    
    c) QUERY SQL PARA CÁLCULO (executada mensalmente):
       
       -- MTBF: Tempo entre falhas (em horas)
       WITH falhas AS (
           SELECT equipamento_id, data_abertura,
           LAG(data_abertura) OVER (PARTITION BY equipamento_id ORDER BY data_abertura) as falha_anterior 
           FROM chamados_manutencao WHERE tipo_chamado = 'corretiva'
       )
       SELECT equipamento_id,
       AVG(EXTRACT(EPOCH FROM (data_abertura - falha_anterior)) / 3600) as mtbf_horas
       FROM falhas
       WHERE falha_anterior IS NOT NULL
       GROUP BY equipamento_id;

       -- MTTR: Tempo médio de reparo (em horas)
       SELECT equipamento_id,
       AVG(tempo_reparo_min / 60.0) as mttr_horas
       FROM chamados_manutencao
       WHERE tipo_chamado = 'corretiva'
       GROUP BY equipamento_id;

       -- Disponibilidade (%)
       SELECT e.id,
       e.nome,
       (mtbf.mtbf_horas / (mtbf.mtbf_horas + mttr.mttr_horas)) * 100 as disponibilidade_pct
       FROM equipamentos e
       LEFT JOIN (SELECT equipamento_id, AVG(...) as mtbf_horas FROM...) mtbf ON e.id = mtbf.equipamento_id
       LEFT JOIN (SELECT equipamento_id, AVG(...) as mttr_horas FROM...) mttr ON e.id = mttr.equipamento_id;
    
    
    d) VISUALIZAÇÃO NO DASHBOARD (Gráficos React):
       → Gráfico de linha: MTBF ao longo do tempo (tendência crescente = bom);
       → Gráfico de barra: MTTR por tipo de equipamento (comparar desempenho);
       → Gauge (velocímetro): Disponibilidade atual (meta: ≥ 99% para Ouro);
       → Tabela ranking: Equipamentos com MTBF mais baixo (priorizar manutenção preventiva).
    
    e) ALERTAS AUTOMÁTICOS (Sistema Enterfix envia e-mail):
       → MTBF caindo 20% em 3 meses → "Equipamento X precisa atenção: falhas aumentando";
       → MTTR acima de 8 horas → "Considere manter peças de reposição em estoque";
       → Disponibilidade < 95% → "Equipamento Y abaixo da meta: agende manutenção preditiva";
       → Comparação com benchmark: "Seu MTBF (180h) está 30% abaixo da média do setor (260h)".
    
    f) PARCERIA DE ENGENHARIA (não apenas serviço):
       → Cliente recebe relatório mensal com análise dos indicadores;
       → Enterfix ANTECIPA problemas (não apenas reage a falhas);
       → Recomendações estratégicas: "Substitua equipamento Z (MTBF caindo 40% em 6 meses)";
       → Dashboard público: Cliente pode compartilhar com diretoria para justificar CAPEX.

6.7. RELATÓRIO DE CAPEX ESTRATÉGICO (Consultoria de Investimentos):
    🎯 OBJETIVO: Transformar Enterfix em consultora de decisões estratégicas (não apenas prestadora de serviço).
    
    a) PERIODICIDADE:
       → Bronze: Relatório ANUAL simples (lista equipamentos em fim de vida);
       → Prata: Relatório SEMESTRAL detalhado (análise custo-benefício reparar vs. substituir);
       → Ouro: Relatório TRIMESTRAL executivo + reunião presencial com diretoria.
    
    b) CONTEÚDO DO RELATÓRIO CAPEX:
       → Seção 1: Equipamentos em Fim de Vida Útil
         • Lista equipamentos com > 15 anos ou MTBF caindo > 40% em 12 meses;
         • Estimativa de custo de manutenção nos próximos 3 anos vs. custo de substituição;
         • Exemplo: "MMC Mitutoyo (2008, 18 anos) → Custo manutenção 3 anos: R$ 85.000 vs. MMC novo: R$ 120.000";
         • Recomendação: "Substituir em 2027 (break-even em 4 anos considerando produtividade 30% maior)".
       
       → Seção 2: Oportunidades de Automação
         • Identifica processos manuais repetitivos que poderiam ser automatizados;
         • Exemplo: "Cliente faz 200 medições/mês com paquímetro → Sistema de visão 3D reduziria tempo 70%";
         • ROI estimado: "Investimento R$ 45.000, economia 120h/mês × R$ 80/h = payback 5 meses".
       
       → Seção 3: Conformidade Normativa
         • Alertas: "ISO 9001:2015 exige rastreabilidade → 3 equipamentos sem sistema digital";
         • Recomendação: "Software de gestão metrológica R$ 12.000 (conformidade + eficiência)".
       
       → Seção 4: Benchmark do Setor
         • "Seu parque tem MTBF médio 180h vs. 260h setor automotivo";
         • "Empresas similares renovam equipamentos a cada 10 anos (você: 15 anos)";
         • "Custo de manutenção/faturamento: Você 2,8% vs. benchmark 1,5% (oportunidade melhoria)".
    
    c) FERRAMENTAS DE DECISÃO (Planilha Excel anexa):
       → Simulador Reparar vs. Substituir (cliente insere valores e vê resultado);
       → Calculadora de Payback (investimento vs. economia de tempo/custo);
       → Projeção de Fluxo de Caixa 5 anos (considerar depreciação, juros, inflação).
    
    d) REUNIÃO ESTRATÉGICA (Plano Ouro - trimestral):
       → Apresentação presencial na sede do cliente (1h com diretor);
       → Slides executivos: Análise SWOT do parque metrológico;
       → Priorização de investimentos: "Top 5 ações para 2027 (ordenado por ROI)";
       → Facilitação de financiamento: "Enterfix tem parceria com Banco X (taxa 0,8% a.m.)".
    
    e) VANTAGEM COMPETITIVA ENTERFIX:
       → Cliente vê Enterfix como PARCEIRA (não fornecedora);
       → Diretoria do cliente usa relatório para justificar CAPEX na matriz;
       → Enterfix posicionada para vender equipamentos novos (comissão + fidelização);
       → Concorrente oferece OU manutenção OU consultoria → Enterfix oferece AMBOS integrados.
`,

    /**
     * Suspensão Temporária dos Serviços
     */
    suspensao: () => `
CLÁUSULA ESPECÍFICA 7 - DA SUSPENSÃO TEMPORÁRIA DOS SERVIÇOS
7.1. Situações que permitem suspensão:
    a) A pedido da CONTRATANTE:
       → Férias coletivas programadas;
       → Parada de produção programada (manutenção geral da fábrica);
       → Mudança temporária de local (sem equipamentos);
       → Situações excepcionais (força maior).
    
    b) Por inadimplência:
       → Atraso superior a 30 dias;
       → Suspensão automática após notificação de 15 dias.

7.2. Condições durante suspensão a pedido da CONTRATANTE:
    a) Prazo máximo de suspensão: 90 dias corridos por ano;
    b) Mensalidade durante suspensão: 30% do valor normal (para manter vínculo);
    c) Justificativa dos 30%:
       → Manutenção de cadastro ativo no sistema;
       → Reserva de capacidade técnica;
       → Equipe de referência mantida;
       → Prioridade garantida na retomada.
    
    d) Atendimentos emergenciais durante suspensão:
       → Disponíveis conforme disponibilidade da CONTRATADA;
       → Cobrança: Tabela padrão avulsa (sem desconto do plano);
       → Prioridade normal (não prioritária).

7.3. Retomada dos serviços:
    a) Aviso prévio de 15 dias antes da data de retomada;
    b) Inspeção geral dos equipamentos (INCLUSA, sem custo adicional);
    c) Atualização do Plano de Manutenção Preventiva:
       → Novo cronograma de visitas programadas;
       → Ajuste de periodicidade se necessário.
    
    d) Mensalidade volta ao valor integral a partir da data de retomada.

7.4. Suspensão por inadimplência:
    a) Após 30 dias de atraso: Notificação de suspensão (15 dias de prazo para regularização);
    b) Sem regularização: Suspensão efetiva dos serviços;
    c) Durante suspensão:
       → Sem atendimento de chamados;
       → Sem visitas programadas;
       → Sem acesso ao portal web (bloqueado);
       → Cobrança de multa e juros conforme Cláusula 4.2.
    
    d) Retomada após pagamento:
       → Quitação de débitos + multa + juros;
       → Taxa de reativação: R$ 500 (custos administrativos);
       → Inspeção geral (cobrada separadamente);
       → Prazo para retomada: Até 5 dias úteis após quitação.

7.5. Suspensão superior a 90 dias:
    a) Considerado rescisão tácita do contrato;
    b) Sujeito a multa de rescisão antecipada (se dentro da carência);
    c) Reativação após 90 dias: Requer novo contrato (sem aproveitamento de carência).
`,
};