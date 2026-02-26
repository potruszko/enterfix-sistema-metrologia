/**
 * CLÁUSULAS ESPECÍFICAS - Suporte Técnico Continuado
 * 
 * Serviços de suporte técnico para instrumentos e sistemas de medição.
 * Base: ITIL v4, ISO/IEC 20000
 */

/**
 * CONFIGURAÇÃO DOS PACOTES DE SUPORTE (Padrão ITIL v4)
 * 
 * Uso: Sistema React para calcular SLA, prioridades, horas disponíveis e gatilhos de upsell
 * Vantagem: Alterar benefício/preço SEM mexer nas regras técnicas de atendimento
 * 
 * Exemplo de uso:
 * ```javascript
 * import { CONFIG_PACOTES_SUPORTE } from './suporte.js';
 * 
 * const pacoteSelecionado = 'padrao';
 * const config = CONFIG_PACOTES_SUPORTE[pacoteSelecionado];
 * 
 * // Calcular SLA tempo resposta
 * const tempoRespostaP1 = config.slaRespostaP1; // 2 horas (Padrão)
 * 
 * // Verificar se excedeu horas mensais (trigger upsell)
 * if (horasConsumidas > config.horasMensais) {
 *   notificarUpsell('Você consumiu suas horas. Upgrade para Premium (ilimitado)?');
 * }
 * ```
 */
export const CONFIG_PACOTES_SUPORTE = {
    basico: {
        nome: 'Pacote Básico',
        horarioAtendimento: 'Seg-Sex, 8h-18h',
        horasMensais: 10,
        horasCumulativas: false,
        canais: ['telefone', 'email'],
        visitasTrimestrais: 1,
        prioridadeMaxima: 'P2',
        slaRespostaP1: null, // Não atende P1
        slaRespostaP2: 4, // horas
        slaRespostaP3: 8,
        slaRespostaP4: 24,
        acessoRemoto: false,
        treinamentoAnual: 0, // horas
        engenheiroDedicado: false,
        suporte24x7: false,
        consultoriaInclusa: 0,
        valorHoraExcedente: 200, // R$ 200/hora
        taxaAcionamentoIndevidoP1: 500, // R$ 500 (se acionar P1 indevidamente)
        cor: '#6B7280', // Cinza
        ideal: 'Empresas pequenas, demanda ocasional',
        valorBaseReferencia: 800 // R$ 800/mês
    },
    padrao: {
        nome: 'Pacote Padrão',
        horarioAtendimento: 'Seg-Sex, 7h-20h + Sáb 8h-12h',
        horasMensais: 20,
        horasCumulativas: false,
        canais: ['telefone', 'email', 'whatsapp', 'portal'],
        visitasMensais: 1,
        prioridadeMaxima: 'P1',
        slaRespostaP1: 2, // horas (apenas horário comercial)
        slaRespostaP2: 4,
        slaRespostaP3: 8,
        slaRespostaP4: 24,
        acessoRemoto: true,
        treinamentoAnual: 4, // horas online
        engenheiroDedicado: false,
        suporte24x7: false,
        consultoriaInclusa: 0,
        valorHoraExcedente: 180, // R$ 180/hora (desconto 10%)
        taxaAcionamentoIndevidoP1: 300, // R$ 300
        cor: '#3B82F6', // Azul
        ideal: 'Empresas médias, ISO 9001, demanda regular',
        valorBaseReferencia: 1500 // R$ 1.500/mês
    },
    premium: {
        nome: 'Pacote Premium',
        horarioAtendimento: '24/7/365 (incluindo feriados)',
        horasMensais: 999, // Ilimitadas
        horasCumulativas: false,
        canais: ['telefone', 'email', 'whatsapp', 'portal', 'telefone_emergencia'],
        visitasMensais: 2,
        visitasSobDemanda: true,
        prioridadeMaxima: 'P1',
        slaRespostaP1: 1, // hora (24/7)
        slaRespostaP2: 2,
        slaRespostaP3: 4,
        slaRespostaP4: 8,
        acessoRemoto: true,
        treinamentoAnual: 12, // horas presenciais
        engenheiroDedicado: true,
        suporte24x7: true,
        consultoriaInclusa: 8, // horas/ano
        valorHoraExcedente: 0, // Ilimitado
        taxaAcionamentoIndevidoP1: 0, // Sem taxa (Premium tem direito)
        relatorioPersonalizado: true,
        cor: '#F59E0B', // Ouro
        ideal: 'Empresas críticas, ISO 17025, ANVISA, 24/7',
        valorBaseReferencia: 3500 // R$ 3.500/mês
    }
};

/**
 * HELPER: Calcular se cliente deve fazer upgrade (based on usage pattern)
 * 
 * Uso no Supabase (função serverless executada mensalmente):
 * ```javascript
 * const sugestaoUpgrade = calcularSugestaoUpgrade('basico', {
 *   horasConsumidas: 15, // Consumiu 15h mas plano básico tem 10h
 *   chamadosP1: 3, // Abriu 3 chamados P1 mas básico não atende
 *   horasExcedentesPagas: 5 * 200 // Pagou R$ 1.000 em horas extras
 * });
 * 
 * // Retorna: { sugerirUpgrade: true, pacoteSugerido: 'padrao', economiaEstimada: 700 }
 * ```
 */
export const calcularSugestaoUpgrade = (pacoteAtual, dadosUso) => {
    const atual = CONFIG_PACOTES_SUPORTE[pacoteAtual];
    const {
        horasConsumidas,
        chamadosP1,
        horasExcedentesPagas
    } = dadosUso;

    // Caso 1: Consumiu mais horas que o plano oferece
    if (horasConsumidas > atual.horasMensais) {
        const custoExcedente = (horasConsumidas - atual.horasMensais) * atual.valorHoraExcedente;
        const custoPadrao = CONFIG_PACOTES_SUPORTE.padrao.valorBaseReferencia;

        if (pacoteAtual === 'basico' && custoExcedente > (custoPadrao - atual.valorBaseReferencia)) {
            return {
                sugerirUpgrade: true,
                pacoteSugerido: 'padrao',
                motivo: `Você consumiu ${horasConsumidas}h (plano tem ${atual.horasMensais}h). Upgrade para Padrão (20h) economiza R$ ${custoExcedente - (custoPadrao - atual.valorBaseReferencia)}/mês`,
                economiaEstimada: custoExcedente - (custoPadrao - atual.valorBaseReferencia)
            };
        }
    }

    // Caso 2: Abriu chamados P1 mas pacote não atende
    if (chamadosP1 > 0 && !atual.slaRespostaP1) {
        return {
            sugerirUpgrade: true,
            pacoteSugerido: 'padrao',
            motivo: `Você teve ${chamadosP1} situações críticas (P1). Pacote Padrão garante resposta em 2h para emergências`,
            economiaEstimada: null
        };
    }

    // Caso 3: Gastou muito em horas excedentes
    if (horasExcedentesPagas && horasExcedentesPagas > 700) {
        return {
            sugerirUpgrade: true,
            pacoteSugerido: 'padrao',
            motivo: `Você gastou R$ ${horasExcedentesPagas} em horas extras nos últimos 3 meses. Upgrade para Padrão (20h) ou Premium (ilimitado) compensa`,
            economiaEstimada: horasExcedentesPagas - (CONFIG_PACOTES_SUPORTE.padrao.valorBaseReferencia - atual.valorBaseReferencia) * 3
        };
    }

    return {
        sugerirUpgrade: false
    };
};

export const CLAUSULAS_SUPORTE = {
/**
 * Escopo do Suporte
 */
escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DO SUPORTE TÉCNICO
1.1. O suporte técnico compreende:
    a) Atendimento a dúvidas técnicas sobre instrumentos;
    b) Diagnóstico remoto de problemas;
    c) Orientação sobre uso correto de equipamentos;
    d) Suporte para interpretação de resultados de medição;
    e) Assistência na resolução de não conformidades;
    f) Orientação sobre manutenção básica preventiva;
    g) Suporte ao sistema de gestão metrológica (software).

1.2. Canais de atendimento:
    a) Telefone: Linha direta com atendimento prioritário;
    b) E-mail: suporte@enterfix.com.br (resposta em até 4 horas úteis);
    c) WhatsApp Business: Atendimento rápido e envio de fotos/vídeos;
    d) Portal Web: Abertura de chamados com acompanhamento;
    e) Acesso remoto: Para suporte em sistemas informatizados;
    f) Presencial: Visitas agendadas conforme plano contratado.

1.3. Horário de atendimento:
    a) PADRÃO: Seg-Sex, 8h às 18h (horário comercial);
    b) ESTENDIDO: Seg-Sex, 7h às 20h + Sáb 8h às 12h;
    c) 24/7: Disponibilidade contínua para casos críticos (P1).
`,

/**
 * Níveis de Suporte
 */
niveis: () => `
CLÁUSULA ESPECÍFICA 2 - DOS NÍVEIS DE SUPORTE
2.1. NÍVEL 1 - Suporte Básico (Help Desk):
    a) Atendimento de primeiro nível;
    b) Dúvidas gerais sobre uso de equipamentos;
    c) Orientações sobre procedimentos padrão;
    d) Registro e triagem de chamados;
    e) Resolução de até 60% dos casos;
    f) Tempo médio de atendimento: 15 minutos.

2.2. NÍVEL 2 - Suporte Técnico Especializado:
    a) Problemas que exigem conhecimento técnico avançado;
    b) Diagnóstico remoto de falhas;
    c) Orientação para ajustes e regulagens;
    d) Análise de certificados de calibração;
    e) Resolução de até 90% dos casos;
    f) Tempo médio de atendimento: 2 horas.

2.3. NÍVEL 3 - Suporte com Visita Técnica:
    a) Casos que exigem presença física;
    b) Problemas complexos não resolvidos remotamente;
    c) Treinamento in loco;
    d) Inspeções técnicas e verificações;
    e) Resolução de 99% dos casos;
    f) Agendamento em até 48 horas (P2) ou 24h (P1).

2.4. Escalação automática quando:
    a) N1 não resolve em 30 minutos: Escala para N2;
    b) N2 não resolve em 4 horas: Escala para N3;
    c) Cliente solicita escalação direta: Avaliação imediata.
`,

/**
 * Classificação de Prioridades
 */
prioridadesSuporte: () => `
CLÁUSULA ESPECÍFICA 3 - DA CLASSIFICAÇÃO DE PRIORIDADES
3.1. CRÍTICO (P1) - Impacto Alto + Urgência Alta:
    a) Definição: Equipamento crítico parado, produção comprometida;
    b) Resposta: 1 hora;
    c) Resolução ou workaround: 4 horas;
    d) Disponibilidade: 24/7;
    e) Exemplo: Linha de produção parada por problema em instrumento.

3.2. ALTO (P2) - Impacto Alto + Urgência Média:
    a) Definição: Problema significativo mas com alternativa temporária;
    b) Resposta: 4 horas úteis;
    c) Resolução: 12 horas úteis;
    d) Disponibilidade: Horário comercial estendido;
    e) Exemplo: Equipamento com degradação de desempenho.

3.3. MÉDIO (P3) - Impacto Médio + Urgência Baixa:
    a) Definição: Problema localizado sem impacto produtivo;
    b) Resposta: 8 horas úteis;
    c) Resolução: 3 dias úteis;
    d) Disponibilidade: Horário comercial;
    e) Exemplo: Dúvida sobre procedimento, instrumento secundário com problema.

3.4. BAIXO (P4) - Impacto Baixo + Urgência Baixa:
    a) Definição: Dúvidas gerais, melhorias, solicitações não urgentes;
    b) Resposta: 24 horas úteis;
    c) Resolução: 5 dias úteis;
    d) Disponibilidade: Horário comercial;
    e) Exemplo: Consulta sobre documentação, treinamento não urgente.

3.5. TAXA DE ACIONAMENTO INDEVIDO (Prevenção de Abuso de P1):
    🎯 ESTRATÉGIA: Evitar que todo chamado seja marcado como "crítico" (P1).
    
    a) JUSTIFICATIVA OBRIGATÓRIA (Sistema Web - React):
       → Ao abrir chamado P1, cliente DEVE preencher formulário detalhado:
         • Descrição do impacto na produção (ex: "Linha parada, perda R$ 5.000/hora");
         • Equipamento envolvido e função crítica;
         • Tentativas de solução já realizadas;
         • Aprovação do responsável técnico (nome + cargo).
       → Sistema exibe aviso: "Acionamento P1 mobiliza equipe emergencial. Se constatado não ser crítico, taxa R$ [VALOR] será cobrada".
    
    b) VALIDAÇÃO TÉCNICA (1ª Avaliação pelo Suporte N1):
       → Ao receber chamado P1, analista N1 faz triagem em até 15 minutos;
       → Se constatar que NÃO é crítico (não há parada/risco iminente):
         • Liga para cliente explicando que situação é P2 ou P3;
         • Oferece reclassificação SEM CUSTO se cliente concordar;
         • Cliente recusa → Mantém P1 + taxa é aplicada se confirmado não ser crítico após atendimento.
    
    c) COBRANÇA DA TAXA (Após Conclusão do Chamado):
       → Taxa aplicada quando:
         • Situação descrita como "produção parada" mas equipamento estava funcionando;
         • Cliente marcou P1 por urgência pessoal/prazo (não por criticidade técnica);
         • Problema existia há dias mas cliente acionou P1 na última hora;
         • Situação resolvida com orientação simples (não exigia mobilização emergencial).
       
       → Taxa NÃO aplicada quando:
         • Cliente descreveu situação real mas problema era menor do que parecia;
         • Boa-fé comprovada (cliente não tinha como avaliar gravidade);
         • Primeira ocorrência (orientação educativa suficiente).
    
    d) VALORES DA TAXA (Conforme Pacote):
       ┌────────────────────────────────────────────────────────────┐
       │ Pacote Básico: R$ 500 (NÃO atende P1, mas se acionar...)  │
       │ Pacote Padrão: R$ 300 (atende P1, mas penaliza abuso)     │
       │ Pacote Premium: SEM TAXA (direito a mobilização ilimitada) │
       └────────────────────────────────────────────────────────────┘
    
    e) ALERTAS AUTOMÁTICOS (Sistema Enterfix):
       → Cliente com 2 P1 indevidos em 3 meses → E-mail educativo: "Como classificar prioridades corretamente";
       → Cliente com 3+ P1 indevidos em 6 meses → Notificação gerente: "Treinamento obrigatório ou upgrade Premium";
       → Dashboard mostra taxa de assertividade: "Você abriu 5 P1, 4 foram confirmados críticos (80% assertividade)".
    
    f) TRANSPARÊNCIA E COMPLIANCE:
       → Sistema sempre registra justificativa do cliente e análise técnica;
       → Cliente pode contestar taxa em até 5 dias úteis (avaliação gerencial);
       → Histórico de classificações disponível no portal (auditoria);
       → Objetivo: Educação (não punição arbitrária).
    
    g) EXEMPLO PRÁTICO (Caso Real):
       ┌───────────────────────────────────────────────────────────────┐
       │ Cliente Padrão abriu P1: "Produção parada, MMC não liga"     │
       │ Analista N1 ligou em 10 minutos, orientou:                   │
       │ → "Verifique se disjuntor não desarmou"                      │
       │ Cliente: "Ah, era isso mesmo! Obrigado!"                     │
       │                                                               │
       │ Análise: Problema simples resolvido por telefone (2 min)     │
       │ Decisão: SEM TAXA (boa-fé + orientação educativa suficiente) │
       │ Ação: E-mail enviado: "Para problemas elétricos básicos,     │
       │        classifique P2 (não mobiliza equipe emergencial)"     │
       └───────────────────────────────────────────────────────────────┘
       
       ┌───────────────────────────────────────────────────────────────┐
       │ Cliente Padrão abriu P1: "Urgente! Preciso calibrar hoje"    │
       │ Analista N1 verificou: Certificado vence daqui a 15 dias     │
       │ Cliente: "Mas auditor chega amanhã!"                          │
       │                                                               │
       │ Análise: Urgência gerencial (não criticidade técnica)        │
       │ Decisão: TAXA R$ 300 aplicada (má gestão de prazo)          │
       │ Justificativa: Certificado válido + problema evitável        │
       │ Ação: Chamado atendido (prioridade garantida) + taxa cobrada │
       └───────────────────────────────────────────────────────────────┘
`,

/**
 * Pacotes de Suporte
 */
pacotes: () => `
CLÁUSULA ESPECÍFICA 4 - DOS PACOTES DE SUPORTE
4.1. PACOTE BÁSICO:
    a) Horário: Seg-Sex, 8h às 18h;
    b) Canais: Telefone e e-mail;
    c) Horas de suporte: 10h/mês (não cumulativas);
    d) Visitas presenciais: 1 por trimestre;
    e) Prioridade máxima: P2;
    f) Resposta P2: 4 horas;
    g) Documentação: Acesso a base de conhecimento.

4.2. PACOTE PADRÃO:
    a) Horário: Seg-Sex, 7h às 20h + Sáb 8h às 12h;
    b) Canais: Todos (telefone, e-mail, WhatsApp, portal);
    c) Horas de suporte: 20h/mês (não cumulativas);
    d) Visitas presenciais: 1 por mês;
    e) Prioridade máxima: P1 (horário comercial);
    f) Resposta P1: 2 horas;
    g) Acesso remoto: Incluso;
    h) Treinamentos online: 4h/ano.

4.3. PACOTE PREMIUM:
    a) Horário: 24/7/365 (incluindo feriados);
    b) Canais: Todos + telefone direto de emergência;
    c) Horas de suporte: Ilimitadas;
    d) Visitas presenciais: 2 por mês ou sob demanda;
    e) Prioridade: Atendimento prioritário em todos os níveis;
    f) Resposta P1: 1 hora (24/7);
    g) Engenheiro dedicado: Sim (conhece bem o cliente);
    h) Treinamentos: 12h/ano presenciais;
    i) Consultoria: 8h/ano incluídas;
    j) Relatórios personalizados mensais.

4.4. Horas excedentes (Básico e Padrão):
    a) Cobrança: R$ [VALOR] por hora adicional;
    b) Aprovação prévia necessária;
    c) Faturamento no mês seguinte.
`,

/**
 * Garantias de Atendimento (SLA)
 */
garantiasSla: () => `
CLÁUSULA ESPECÍFICA 5 - DAS GARANTIAS DE ATENDIMENTO (SLA)
5.1. Tempo de Resposta garantido:
    a) P1: 1 hora (Premium) ou 2 horas (Padrão) - 95% dos casos;
    b) P2: 4 horas - 90% dos casos;
    c) P3: 8 horas - 85% dos casos;
    d) P4: 24 horas - 80% dos casos.

5.2. Taxa de Resolução no Primeiro Contato (FCR):
    a) Meta: ≥ 70% dos chamados P3 e P4;
    b) Indicador de eficiência do suporte.

5.3. Satisfação do Cliente (CSAT):
    a) Meta: ≥ 90% de satisfação;
    b) Pesquisa enviada após cada atendimento;
    c) Escala de 1 a 5 estrelas;
    d) Feedback de melhoria analisado mensalmente.

5.4. Disponibilidade do serviço:
    a) Telefone: 99% (horário contratado);
    b) Portal web: 99,5% (24/7);
    c) E-mail: 99,9%;
    d) Excluindo manutenções programadas (notificadas com 48h).

5.5. Créditos por descumprimento de SLA:
    a) Atraso na resposta (> 50% do prazo): 5% de desconto por ocorrência;
    b) Disponibilidade < 98%: 10% de desconto no mês;
    c) CSAT < 80% (2 meses consecutivos): 15% de desconto;
    d) Teto de créditos: 30% do valor mensal.
`,

/**
 * Documentação e Base de Conhecimento
 */
documentacao: () => `
CLÁUSULA ESPECÍFICA 6 - DA DOCUMENTAÇÃO E BASE DE CONHECIMENTO
6.1. Portal de suporte online com:
    a) Base de conhecimento: Artigos, FAQs, tutoriais;
    b) Manuais técnicos: Instrumentos mais comuns;
    c) Vídeos tutoriais: Procedimentos passo a passo;
    d) Downloads: Softwares, drivers, firmwares atualizados;
    e) Histórico de chamados: Consulta de atendimentos anteriores.

6.2. Documentação mantida atualizada:
    a) Revisão mensal de artigos;
    b) Novos conteúdos conforme demandas recorrentes;
    c) Atualização imediata para mudanças normativas;
    d) Versões em PDF disponíveis para download.

6.3. Comunidade e fórum (opcional):
    a) Espaço para troca de experiências entre clientes;
    b) Moderação pela equipe técnica;
    c) Respostas a dúvidas comuns;
    d) Compartilhamento de boas práticas.

6.4. Newsletter técnica mensal:
    a) Dicas de uso e conservação;
    b) Alertas sobre atualizações importantes;
    c) Novidades em metrologia e normas;
    d) Casos de sucesso e soluções criativas.
`,

/**
 * Suporte Remoto
 */
suporteRemoto: () => `
CLÁUSULA ESPECÍFICA 7 - DO SUPORTE REMOTO
7.1. Ferramentas de acesso remoto:
    a) TeamViewer, AnyDesk ou similar (seguro e criptografado);
    b) Acesso mediante autorização expressa da CONTRATANTE;
    c) Sessão registrada para auditoria;
    d) Término automático da sessão ao concluir.

7.2. Usos do acesso remoto:
    a) Diagnóstico de problemas em software de instrumentos;
    b) Configuração de parâmetros;
    c) Atualização de firmware remotamente;
    d) Solução de problemas de comunicação (USB, serial, rede);
    e) Demonstrações e treinamentos online.

7.3. Segurança e privacidade (LGPD + Log de Auditoria):
    a) Acesso apenas a sistemas relacionados aos instrumentos;
    b) Proibido acessar dados não relacionados;
    c) Conformidade com LGPD e políticas de segurança da informação;
    d) Termo de responsabilidade assinado.
    
    e) LOG DE AUDITORIA AUTOMÁTICO (Supabase + Compliance LGPD):
       🔒 PROTEÇÃO: Toda sessão remota gera rastro digital completo para auditoria ANPD.
       
       → AUTORIZAÇÃO PRÉVIA OBRIGATÓRIA (Portal Web):
         • Cliente clica em botão "Autorizar Acesso Remoto" ANTES de cada sessão;
         • Popup exibe: "Você autoriza técnico [NOME] a acessar remotamente o computador [HOSTNAME] para resolver chamado #[ID]?";
         • Opções: [ Autorizar por 2 horas ] [ Autorizar até resolver ] [ Negar ];
         • Sistema gera código de acesso temporário (ex: 123-456-789) válido por período escolhido;
         • Código expirado = sessão bloqueada automaticamente.
       
       → REGISTRO AUTOMÁTICO EM SUPABASE (Tabela: sessoes_suporte_remoto):
         ┌─────────────────────┬──────────────┬────────────────────────────────────┐
         │ Campo               │ Tipo         │ Conteúdo Registrado                │
         ├─────────────────────┼──────────────┼────────────────────────────────────┤
         │ id                  │ UUID         │ Identificador único da sessão      │
         │ chamado_id          │ UUID         │ FK para chamado que motivou acesso │
         │ cliente_cnpj        │ TEXT         │ CNPJ do cliente                    │
         │ tecnico_nome        │ TEXT         │ Nome do técnico Enterfix           │
         │ tecnico_cpf         │ TEXT         │ CPF técnico (responsável legal)    │
         │ data_autorizacao    │ TIMESTAMP    │ Quando cliente clicou "Autorizar"  │
         │ ip_cliente          │ INET         │ IP do cliente que autorizou        │
         │ user_agent          │ TEXT         │ Navegador usado na autorização     │
         │ codigo_acesso       │ TEXT         │ Código temporário gerado           │
         │ validade_ate        │ TIMESTAMP    │ Expiração do código                │
         │ data_inicio_sessao  │ TIMESTAMP    │ Quando técnico iniciou conexão     │
         │ data_fim_sessao     │ TIMESTAMP    │ Quando sessão encerrou             │
         │ duracao_minutos     │ INTEGER      │ Tempo total de conexão             │
         │ maquina_acessada    │ TEXT         │ Hostname/IP da máquina cliente     │
         │ software_usado      │ TEXT         │ TeamViewer, AnyDesk, etc.          │
         │ acoes_realizadas    │ JSONB        │ Log de ações (ex: "atualizou firmware v2.3") │
         │ arquivos_modificados│ TEXT[]       │ Lista de arquivos alterados        │
         │ screenshot_inicio   │ TEXT         │ URL Supabase Storage (prova início)│
         │ screenshot_fim      │ TEXT         │ URL Supabase Storage (prova fim)   │
         │ termo_assinado_url  │ TEXT         │ PDF termo responsabilidade         │
         │ revogacao_cliente   │ BOOLEAN      │ Se cliente encerrou antes do tempo │
         │ motivo_revogacao    │ TEXT         │ Motivo do encerramento antecipado  │
         └─────────────────────┴──────────────┴────────────────────────────────────┘
       
       → RETENÇÃO DE LOGS (Conformidade LGPD Art. 16):
         • Logs mantidos por 5 anos (prazo legal processos trabalhistas/civis);
         • Após 5 anos: Anonimização automática (remove CPF/IPs, mantém estatísticas);
         • Cliente pode solicitar cópia dos logs (Art. 18 LGPD - direito de acesso);
         • Em caso de ANPD solicitar auditoria: Logs completos disponíveis imediatamente.
       
       → SCREENSHOT AUTOMÁTICO (Prova Visual):
         • Ao iniciar sessão: Sistema captura tela (prova estado inicial);
         • Ao encerrar sessão: Captura tela (prova estado final);
         • Armazenamento: Supabase Storage (criptografado AES-256);
         • Objetivo: Provar que técnico NÃO acessou dados não relacionados ao chamado.
       
       → REVOGAÇÃO INSTANTÂNEA PELO CLIENTE:
         • Portal mostra botão vermelho "Encerrar Acesso Remoto Agora" durante sessão ativa;
         • Cliente clica → Código de acesso invalidado imediatamente (técnico perde conexão);
         • Sistema registra: "Sessão encerrada por solicitação do cliente às [TIMESTAMP]";
         • Técnico recebe notificação: "Cliente encerrou sessão remotamente".
    
    f) TERMO DE RESPONSABILIDADE DIGITAL (Assinatura Eletrônica):
       → Antes da 1ª sessão remota do contrato, cliente assina termo digital:
         "Declaro ciência de que:
         1. Técnico Enterfix terá acesso temporário ao computador [HOSTNAME];
         2. Acesso limitado a resolver problema do chamado específico;
         3. Posso revogar acesso a qualquer momento via portal;
         4. Sessão é registrada em log de auditoria por 5 anos (LGPD);
         5. Enterfix compromete-se a NÃO acessar dados não relacionados ao suporte."
       
       → Assinatura: Nome completo + CPF + Aceite checkbox + Timestamp RFC 3161;
       → Armazenamento: Supabase Storage (PDF assinado digitalmente);
       → Validade: Durante vigência do contrato (não precisa assinar a cada sessão).
    
    g) NOTIFICAÇÃO POR E-MAIL (Transparência Total):
       → Cliente recebe e-mail automático:
         • Quando autoriza acesso: "Você autorizou acesso remoto até [HORA]. Código: [XXX]";
         • Quando sessão inicia: "Técnico [NOME] conectou-se remotamente às [HORA]";
         • Quando sessão encerra: "Sessão remota concluída. Duração: [X] minutos. Ações realizadas: [LISTA]";
         • Relatório semanal: "Você teve [N] sessões remotas esta semana. Ver detalhes: [LINK]".
    
    h) DASHBOARD DE CONFORMIDADE LGPD:
       → Portal do cliente exibe aba "Segurança e Privacidade":
         • Tabela: Histórico de todas as sessões remotas (últimos 12 meses);
         • Filtros: Por técnico, por chamado, por duração;
         • Download: Exportar logs em PDF (para auditorias internas);
         • KPI: Tempo médio de sessão, número de sessões/mês, taxa de revogação.
       
       → Benefício para cliente corporativo (ISO 27001, LGPD):
         • Demonstra para auditores que tem controle sobre acessos remotos;
         • Logs detalhados = conformidade com Art. 37 LGPD (responsabilização);
         • Em caso de incidente: Prova que Enterfix agiu dentro do escopo autorizado.

7.4.Limitações do suporte remoto: 
    a) Não substitui visita técnica para problemas físicos / mecânicos;
    b) Depende de boa conexão de internet da CONTRATANTE;
    c) Pode requerer colaboração de técnico local para testes.
`,

    /**
     * Treinamentos e Capacitação
     */
    treinamentosSuporte: () => `
CLÁUSULA ESPECÍFICA 8 - DOS TREINAMENTOS E CAPACITAÇÃO
8.1.Treinamentos inclusos(conforme pacote):
    a) Uso correto de instrumentos de medição;
b) Conservação e cuidados básicos;
c) Interpretação de certificados de calibração;
d) Solução de problemas comuns(troubleshooting);
e) Atualização sobre mudanças normativas.

8.2.Formatos de treinamento:
    a) Presencial: Nas instalações da CONTRATANTE(Padrão / Premium);
b) Online ao vivo: Via plataforma de videoconferência(todos pacotes);
c) Gravado: Acesso aos vídeos recentes(Base de Conhecimento);
d) Workshop prático: Mão na massa com equipamentos.

8.3.Certificação de participação:
    a) Emitido para presença≥ 75 % ;
b) Validade: Conforme periodicidade regulatória;
c) Registro mantido no portal.

8.4.Treinamentos adicionais(fora do pacote):
    a) Cobrança por hora ou por turma;
b) Conteúdo personalizado conforme demanda;
c) Material didático customizado.
`,

    /**
     * Relatórios e Indicadores
     */
    relatoriosSuporte: () => `
CLÁUSULA ESPECÍFICA 9 - DOS RELATÓRIOS E INDICADORES
9.1.Relatório mensal de suporte(até 5 º dia útil):
    a) Resumo executivo de chamados abertos / fechados;
b) Tempo médio de resposta e resolução;
c) Taxa de resolução no primeiro contato(FCR);
d) Satisfação do cliente(CSAT);
e) Horas de suporte consumidas vs.disponíveis;
f) Problemas recorrentes e recomendações;
g) Plano de ação para melhorias.

9.2.Dashboard online em tempo real:
    a) Status de chamados abertos;
b) Histórico completo de atendimentos;
c) Indicadores de desempenho atualizados;
d) Gráficos de evolução mensal.

9.3.Reunião trimestral de análise crítica:
    a) Apresentação de resultados consolidados;
b) Discussão de melhorias necessárias;
c) Ajustes em processos ou prioridades;
d) Validação de satisfação e expectativas.

9.4.KPIs principais:
    a) Tempo Médio de Resposta(TMR);
b) Tempo Médio de Resolução(TMRes);
c) Taxa de Resolução no 1 º Contato(FCR);
d) Satisfação do Cliente(CSAT);
e) Disponibilidade do serviço;
f) Número de chamados por categoria.

9.5.SISTEMA DE DETECÇÃO DE OPORTUNIDADES DE UPGRADE(Upsell Automático): 🎯ESTRATÉGIA: Suporte técnico é o melhor "termômetro"
para vendas(cliente revela necessidades reais).

a) ALGORITMO DE DETECÇÃO(Supabase Function executada semanalmente):

    Sistema analisa padrões de uso do cliente e identifica sinais de que pacote atual não atende:

        ┌────────────────────────────────────────────────────────────────────┐│GATILHO 1: Excesso de Horas Consumidas│├────────────────────────────────────────────────────────────────────┤│ IF cliente Básico(10 h / mês) consumiu > 12 h em 2 dos últimos 3 meses││ THEN sugerir upgrade→ Padrão(20 h / mês)││ ARGUMENTO: "Você consumiu média 14h/mês (40% acima do plano).     ││
    Pagou
    R$ 800(Básico) + R$ 800 extras = R$ 1.600.││Pacote Padrão: R$ 1.500(economia R$ 100 / mês + 20 h).
"  │└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐│
GATILHO 2: Tentativas de P1 Negadas(Pacote Básico)│├────────────────────────────────────────────────────────────────────┤│ IF cliente Básico tentou abrir≥ 2 chamados P1 em 3 meses││ THEN sugerir upgrade→ Padrão(atende P1 em 2 h)││ ARGUMENTO: "Você teve 3 situações urgentes mas Básico não atende  ││
P1.Pacote Padrão garante resposta 2 h para emergências "│└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐│ GATILHO 3: Chamados N2 / N3 Recorrentes(Complexidade Alta)│├────────────────────────────────────────────────────────────────────┤│ IF > 60 % dos chamados escalaram para N2 ou N3(últimos 2 meses)││ THEN sugerir upgrade→ Premium(engenheiro dedicado)││ ARGUMENTO: "70% dos seus chamados exigem especialista. Premium    ││
tem engenheiro dedicado que conhece seu parque.
"       │└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐│
GATILHO 4: Solicitações Fora de Horário(Básico / Padrão)│├────────────────────────────────────────────────────────────────────┤│ IF≥ 3 chamados abertos fora do horário do pacote(últimos 2 meses)││ THEN sugerir upgrade→ Premium(24 / 7)││ ARGUMENTO: "Você abriu 4 chamados após 20h. Premium atende 24/7."│└────────────────────────────────────────────────────────────────────┘

        ┌────────────────────────────────────────────────────────────────────┐│
        GATILHO 5: Visitas Técnicas Extras(Acima do Plano)│├────────────────────────────────────────────────────────────────────┤│ IF cliente Básico solicitou≥ 2 visitas extras(além da trimestral)││ THEN sugerir upgrade→ Padrão(1 visita / mês inclusa)││ ARGUMENTO: "Você pagou 3 visitas avulsas (R$ 600 cada = R$ 1.800).││
    Pacote
    Padrão: R$ 1.500 com visita mensal inclusa.
"    │└────────────────────────────────────────────────────────────────────┘

b) NOTIFICAÇÃO AUTOMÁTICA(E - mail Marketing Personalizado): →E - mail disparado quando gatilho ativado com análise real do uso;→
    Simulador mostra economia estimada baseada em dados históricos;→
Dashboard interno comercial lista clientes elegíveis para upgrade;→
Taxa de conversão meta: ≥15 % (benchmark SaaS B2B).

c) ÉTICA E TRANSPARÊNCIA: →Sistema NUNCA sugere upgrade se não houver benefício real;→
Cliente pode fazer downgrade sem multa após 6 meses se uso cair;→
Vendedor não recebe comissão se cliente cancelar upgrade em < 3 meses.
`,

    /**
     * Responsabilidades e Limitações
     */
    responsabilidades: () => `
CLÁUSULA ESPECÍFICA 10 - DAS RESPONSABILIDADES E LIMITAÇÕES
10.1.O suporte técnico NÃO inclui:
    a) Reparos físicos de equipamentos(contratar manutenção);
b) Substituição de peças ou componentes;
c) Calibração de instrumentos(serviço separado);
d) Modificações ou customizações não previstas;
e) Problemas causados por uso inadequado ou acidentes;
f) Suporte a equipamentos de outros fornecedores(exceto integração).

10.2.Responsabilidades da CONTRATANTE(BLINDAGEM: Atividade de MEIO): ⚠️PROTEÇÃO JURÍDICA: O suporte técnico é uma ORIENTAÇÃO TÉCNICA(obrigação de meio), NÃO uma EXECUÇÃO TÉCNICA(obrigação de resultado).

a) Fornecer informações completas e precisas sobre o problema;
b) Disponibilizar acesso aos equipamentos e sistemas;

c) EXECUÇÃO DAS ORIENTAÇÕES REMOTAS(Responsabilidade EXCLUSIVA do Cliente): →Suporte remoto é uma "AJUDA"(aconselhamento técnico), NÃO "OPERAÇÃO À DISTÂNCIA";→
Enterfix ORIENTA o que fazer, mas quem EXECUTA é o cliente ou seu técnico local;→
Cliente assume TODOS os riscos de execução de procedimentos orientados remotamente.

📌 EXEMPLO PRÁTICO(Caso WhatsApp):
    Situação: Cliente envia foto de equipamento com parafuso solto.
Técnico Enterfix responde: "Aperte o parafuso M6 com torque de 5 Nm usando torquímetro".
Cliente aperta com alicate(sem torquímetro) e quebra rosca.

Responsabilidade: 100 % CLIENTE(Enterfix orientou CORRETO, cliente executou ERRADO).

Blindagem Legal: Art.14 CDC não se aplica(não é defeito de serviço, é má execução por terceiro).

d) LIMITAÇÕES DA ORIENTAÇÃO REMOTA: →Técnico Enterfix NÃO está fisicamente presente para verificar execução;→
Não tem como validar ferramentas usadas, habilidade do executor, condições locais;→
Orientação baseada em informações fornecidas(se informação incorreta→ orientação inadequada);→
Cliente DEVE ter capacitação mínima para executar procedimentos orientados.

📌 REGRA DE OURO: Se cliente NÃO tem habilidade / ferramentas adequadas→ CONTRATAR VISITA TÉCNICA(não tentar fazer remotamente).

e) TERMO DE CIÊNCIA(Sistema exibe antes de orientações críticas): →Quando técnico vai orientar procedimento com risco(ex: ajustes mecânicos, firmware, calibração de campo):
    Sistema gera popup automático no WhatsApp / Portal:

    "⚠️ ATENÇÃO: Procedimento orientado remotamente

Você está prestes a receber orientações técnicas que devem ser executadas por pessoa capacitada com ferramentas adequadas.

ENTERFIX fornece a ORIENTAÇÃO(atividade de MEIO).
VOCÊ ou seu técnico executa(atividade de RESULTADO).

Riscos: •Execução incorreta pode danificar equipamento• Enterfix NÃO se responsabiliza por danos causados durante execução• Se não tiver ferramentas adequadas, CONTRATE VISITA TÉCNICA

Declaro que: [] Tenho capacitação para executar o procedimento[] Tenho ferramentas adequadas(especificadas abaixo)[] Assumo responsabilidade pela execução

[Botão: Aceito e prosseguir][Botão: Prefiro visita técnica]
"

→
Aceite registrado em Supabase com timestamp(prova em caso de litígio).

f) ORIENTAÇÕES COM DIFERENTES GRAUS DE RISCO(Classificação Automática):

    🟢RISCO BAIXO(orientação livre, sem termo): •Reiniciar software, verificar cabo conectado, consultar manual;•
Limpar lente com pano macio, verificar nível de bateria;•
Exemplo: "Verifique se cabo USB está bem conectado".

🟡 RISCO MÉDIO(termo simplificado, recomenda capacitação): •Ajustes de configuração de software, calibração básica de tela;•
Limpeza interna com ar comprimido(pressão baixa);•
Exemplo: "Ajuste zero do relógio comparador girando anel graduado".

🔴 RISCO ALTO(termo obrigatório + recomendação forte de visita): •Desmontagem de componentes, ajustes mecânicos com torque específico;•
Atualização de firmware(risco brick), soldagem de componentes;•
Exemplo: "Desmontar base da MMC e ajustar tensão da correia do eixo Y".

🚫 RISCO CRÍTICO(Enterfix RECUSA orientar remotamente, exige visita): •Ajustes que invalidam calibração(requer recalibração RBC após);•
Procedimentos com risco de choque elétrico ou explosão;•
Troca de componentes de segurança(sensores, freios, travas);•
Exemplo: "Não orientamos ajuste de pressão de ar comprimido acima de 10 bar remotamente. VISITA TÉCNICA OBRIGATÓRIA".

g) REGISTROS DE ORIENTAÇÃO(Prova de Boa - Fé): →Toda orientação remota é registrada(texto, áudio, vídeo quando aplicável);→
Chamado armazena: •Orientação EXATA dada pelo técnico(transcrição);•
Ferramentas especificadas como necessárias;•
Avisos dados("use EPI", "desligue equipamento antes");•
Termo de ciência aceito(se aplicável);→
Em litígio: Enterfix prova que orientou corretamente, cliente executou mal.

h) COLABORAÇÃO EM CASO DE DANO: →Se cliente seguir orientação Enterfix E AINDA ASSIM houver dano: •Cliente notifica imediatamente(não tenta consertar por conta);•
Enterfix agenda visita técnica para análise forense(perito);•
Se constatado que orientação estava ERRADA→ Enterfix assume reparo;•
Se constatado que cliente EXECUTOU MAL→ Cliente assume reparo;•
Se dúvida: Análise por terceiro independente(custos rateados 50 / 50).

i) Seguir orientações e recomendações técnicas(dentro da capacidade do cliente);
j) Informar se problema foi resolvido ou persiste(feedback obrigatório);
k) Não tentar reparos por conta após receber orientação(aguardar validação).

10.3.Suspensão do suporte:
a) Inadimplência superior a 15 dias;
b) Uso abusivo ou fraudulento do serviço;
c) Desrespeito à equipe de suporte;
d) Solicitações fora do escopo contratual repetidamente.

10.4.Reativação:
    a) Regularização de pendências;
b) Pagamento de multa de reativação(se suspenso por inadimplência);
c) Retomada em até 24 horas após regularização.
`,
};