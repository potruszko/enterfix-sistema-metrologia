/**
 * CLÁUSULAS ESPECÍFICAS - Suporte Técnico Continuado
 * 
 * Serviços de suporte técnico para instrumentos e sistemas de medição.
 * Base: ITIL v4, ISO/IEC 20000
 */

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

7.3. Segurança e privacidade:
    a) Acesso apenas a sistemas relacionados aos instrumentos;
    b) Proibido acessar dados não relacionados;
    c) Conformidade com LGPD e políticas de segurança da informação;
    d) Termo de responsabilidade assinado.

7.4. Limitações do suporte remoto:
    a) Não substitui visita técnica para problemas físicos/mecânicos;
    b) Depende de boa conexão de internet da CONTRATANTE;
    c) Pode requerer colaboração de técnico local para testes.
`,

    /**
     * Treinamentos e Capacitação
     */
    treinamentosSuporte: () => `
CLÁUSULA ESPECÍFICA 8 - DOS TREINAMENTOS E CAPACITAÇÃO
8.1. Treinamentos inclusos (conforme pacote):
    a) Uso correto de instrumentos de medição;
    b) Conservação e cuidados básicos;
    c) Interpretação de certificados de calibração;
    d) Solução de problemas comuns (troubleshooting);
    e) Atualização sobre mudanças normativas.

8.2. Formatos de treinamento:
    a) Presencial: Nas instalações da CONTRATANTE (Padrão/Premium);
    b) Online ao vivo: Via plataforma de videoconferência (todos pacotes);
    c) Gravado: Acesso aos vídeos recentes (Base de Conhecimento);
    d) Workshop prático: Mão na massa com equipamentos.

8.3. Certificação de participação:
    a) Emitido para presença ≥ 75%;
    b) Validade: Conforme periodicidade regulatória;
    c) Registro mantido no portal.

8.4. Treinamentos adicionais (fora do pacote):
    a) Cobrança por hora ou por turma;
    b) Conteúdo personalizado conforme demanda;
    c) Material didático customizado.
`,

    /**
     * Relatórios e Indicadores
     */
    relatoriosSuporte: () => `
CLÁUSULA ESPECÍFICA 9 - DOS RELATÓRIOS E INDICADORES
9.1. Relatório mensal de suporte (até 5º dia útil):
    a) Resumo executivo de chamados abertos/fechados;
    b) Tempo médio de resposta e resolução;
    c) Taxa de resolução no primeiro contato (FCR);
    d) Satisfação do cliente (CSAT);
    e) Horas de suporte consumidas vs. disponíveis;
    f) Problemas recorrentes e recomendações;
    g) Plano de ação para melhorias.

9.2. Dashboard online em tempo real:
    a) Status de chamados abertos;
    b) Histórico completo de atendimentos;
    c) Indicadores de desempenho atualizados;
    d) Gráficos de evolução mensal.

9.3. Reunião trimestral de análise crítica:
    a) Apresentação de resultados consolidados;
    b) Discussão de melhorias necessárias;
    c) Ajustes em processos ou prioridades;
    d) Validação de satisfação e expectativas.

9.4. KPIs principais:
    a) Tempo Médio de Resposta (TMR);
    b) Tempo Médio de Resolução (TMRes);
    c) Taxa de Resolução no 1º Contato (FCR);
    d) Satisfação do Cliente (CSAT);
    e) Disponibilidade do serviço;
    f) Número de chamados por categoria.
`,

    /**
     * Responsabilidades e Limitações
     */
    responsabilidades: () => `
CLÁUSULA ESPECÍFICA 10 - DAS RESPONSABILIDADES E LIMITAÇÕES
10.1. O suporte técnico NÃO inclui:
    a) Reparos físicos de equipamentos (contratar manutenção);
    b) Substituição de peças ou componentes;
    c) Calibração de instrumentos (serviço separado);
    d) Modificações ou customizações não previstas;
    e) Problemas causados por uso inadequado ou acidentes;
    f) Suporte a equipamentos de outros fornecedores (exceto integração).

10.2. Responsabilidades da CONTRATANTE:
    a) Fornecer informações completas e precisas sobre o problema;
    b) Disponibilizar acesso aos equipamentos e sistemas;
    c) Executar testes solicitados pela equipe de suporte;
    d) Seguir orientações e recomendações técnicas;
    e) Informar se problema foi resolvido ou persiste.

10.3. Suspensão do suporte:
    a) Inadimplência superior a 15 dias;
    b) Uso abusivo ou fraudulento do serviço;
    c) Desrespeito à equipe de suporte;
    d) Solicitações fora do escopo contratual repetidamente.

10.4. Reativação:
    a) Regularização de pendências;
    b) Pagamento de multa de reativação (se suspenso por inadimplência);
    c) Retomada em até 24 horas após regularização.
`,
};
