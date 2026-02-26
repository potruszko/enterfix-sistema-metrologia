/**
 * CLÁUSULAS ESPECÍFICAS - Manutenção Preventiva e Corretiva
 * 
 * Finalidade: Manutenção preventiva e corretiva de instrumentos e equipamentos de medição
 * Aplicável a: Empresas que necessitam manter equipamentos em condições operacionais
 * 
 * Base legal/normativa:
 * - ABNT NBR 5462:1994 - Confiabilidade e Mantenabilidade
 * - ABNT NBR 15467:2007 - Sistemas de gestão da manutenção
 * - ISO 55000:2014 - Gestão de ativos
 * - NR-12 - Segurança no Trabalho em Máquinas e Equipamentos
 * 
 * Serviços complementares (contratos separados):
 * - calibracao.js: Calibração dimensional e metrológica pós-manutenção
 * - fabricacao.js: Fabricação de peças de reposição sob medida
 * - consultoria.js: Consultoria em otimização de manutenção
 * - plano_manutencao.js: Planos recorrentes (Bronze/Prata/Ouro) com descontos
 * 
 * @module contratos/clausulas/manutencao
 * @category Atômico  
 * @version 2.0.0
 * @lastUpdate 26/02/2026
 * @author Paulo Enterfix
 */

export const CLAUSULAS_MANUTENCAO = {
    /**
     * Escopo dos Serviços de Manutenção
     */
    escopo: () => `
CLÁUSULA ESPECÍFICA 1 - DO ESCOPO DOS SERVIÇOS DE MANUTENÇÃO
1.1. O presente contrato tem por objeto a manutenção de instrumentos e equipamentos de medição:
    a) Manutenção preventiva programada conforme plano estabelecido;
    b) Manutenção corretiva para restauração de funcionalidade;
    c) Limpeza técnica e lubrificação de componentes móveis;
    d) Substituição de peças desgastadas ou defeituosas (consumíveis);
    e) Ajustes mecânicos e regulagens conforme especificações do fabricante;
    f) Testes de funcionalidade e verificação de desempenho operacional;
    g) Emissão de relatório técnico de manutenção detalhado.

1.2. Modalidades de manutenção atendidas:
    a) PREVENTIVA: Intervenções programadas para evitar falhas e prolongar vida útil;
    b) CORRETIVA: Reparos após identificação de defeito ou mau funcionamento;
    c) PREDITIVA: Monitoramento de condições para antecipar necessidades de intervenção;
    d) EMERGENCIAL: Atendimento prioritário em até 24h para equipamentos críticos.

1.3. NÃO estão inclusos no escopo de manutenção:
    a) Calibração dimensional ou metrológica (vide "Contrato de Calibração");
    b) Peças eletrônicas principais (placas, sensores, displays);
    c) Peças danificadas por mau uso, acidentes ou negligência;
    d) Modificações, upgrades ou customizações não previstas;
    e) Equipamentos obsoletos sem peças de reposição no mercado;
    f) Equipamentos fora da garantia do fabricante (sem histórico de manutenção).

1.4. Serviços complementares disponíveis mediante contratação adicional:
    a) Calibração completa pós-manutenção → "Contrato de Calibração";
    b) Fabricação de peças descontinuadas ou especiais → "Contrato de Fabricação";
    c) Engenharia reversa para peças sem documentação → "Contrato de Engenharia Reversa";
    d) Planos recorrentes com descontos (Bronze/Prata/Ouro) → "Contrato de Plano de Manutenção";
    e) Consultoria em otimização de manutenção → "Contrato de Consultoria".
`,

    /**
     * Plano de Manutenção Preventiva
     */
    planoPreventiva: () => `
CLÁUSULA ESPECÍFICA 2 - DO PLANO DE MANUTENÇÃO PREVENTIVA
2.1. A CONTRATADA elaborará Plano de Manutenção Preventiva (PMP) contendo:
    a) Cronograma anual de intervenções;
    b) Check-lists detalhados por tipo de equipamento;
    c) Periodicidade recomendada (mensal, trimestral, semestral, anual);
    d) Rotinas de inspeção e pontos críticos;
    e) Previsão de peças e materiais necessários.

2.2. Periodicidade padrão (ajustável conforme uso):
    a) MENSAL: Limpeza, inspeção visual, verificação de conexões;
    b) TRIMESTRAL: Lubrificação, ajustes básicos, testes de funcionamento;
    c) SEMESTRAL: Inspeção detalhada, substituição de consumíveis;
    d) ANUAL: Revisão geral, atualização de firmware, testes completos.

2.3. O PMP será revisado anualmente ou sempre que:
    a) Houver alteração no perfil de uso dos equipamentos;
    b) Ocorrerem falhas recorrentes fora do previsto;
    c) Novos equipamentos forem incorporados ao contrato.

2.4. A CONTRATANTE será notificada com 15 (quinze) dias de antecedência sobre cada intervenção programada.
`,

    /**
     * Atendimento Corretivo
     */
    corretiva: () => `
CLÁUSULA ESPECÍFICA 3 - DA MANUTENÇÃO CORRETIVA
3.1. Prazos de atendimento conforme criticidade:
    a) CRÍTICO (produção parada): Até 24 horas;
    b) URGENTE (impacto significativo): Até 48 horas;
    c) NORMAL (sem impacto imediato): Até 5 dias úteis;
    d) PROGRAMÁVEL (pode aguardar parada programada): Conforme acordo.

3.2. Procedimento para solicitação:
    a) Abertura de chamado via sistema, e-mail ou telefone;
    b) Descrição detalhada do defeito/sintoma;
    c) Classificação de criticidade pela CONTRATANTE;
    d) Recebimento de número de protocolo de atendimento.

3.3. A CONTRATADA compromete-se a:
    a) Confirmar recebimento do chamado em até 2 horas;
    b) Realizar diagnóstico remoto quando possível;
    c) Deslocar técnico dentro do prazo acordado;
    d) Fornecer atualizações sobre progresso do reparo;
    e) Emitir relatório técnico ao finalizar.

3.4. Se o reparo exceder 5 (cinco) dias úteis:
    a) A CONTRATADA oferecerá equipamento substituto (quando disponível);
    b) Será elaborado plano de ação com novo prazo estimado;
    c) Descontos proporcionais poderão ser aplicados conforme SLA.
`,

    /**
     * Peças de Reposição
     */
    pecas: () => `
CLÁUSULA ESPECÍFICA 4 - DAS PEÇAS DE REPOSIÇÃO
4.1. Peças incluídas no contrato (sem custo adicional):
    a) Componentes de desgaste natural (vedações, filtros, fusíveis);
    b) Consumíveis de manutenção preventiva;
    c) Peças com defeito de fabricação cobertas por garantia;
    d) Itens previstos no Anexo II - Lista de Peças Cobertas.

4.2. Peças NÃO incluídas (orçamento separado):
    a) Componentes eletrônicos principais (placas, sensores);
    b) Peças danificadas por mau uso, acidente ou negligência;
    c) Upgrades ou melhorias não previstas;
    d) Componentes de equipamentos fora da garantia do fabricante.

4.3. Aprovação de peças adicionais:
    a) Orçamento prévio enviado à CONTRATANTE;
    b) Prazo de 48h para aprovação ou recusa;
    c) Após aprovação, prazo adicional de 15 dias para aquisição/instalação;
    d) Parcelamento disponível para valores superiores a R$ 5.000,00.

4.4. Todas as peças terão garantia de no mínimo 90 (noventa) dias.
`,

    /**
     * Relatórios e Documentação
     */
    relatorios: () => `
CLÁUSULA ESPECÍFICA 5 - DOS RELATÓRIOS E DOCUMENTAÇÃO
5.1. Relatório de Manutenção Preventiva conterá:
    a) Data e horário da intervenção;
    b) Técnico responsável e credenciais;
    c) Check-list completo com status de cada item;
    d) Peças substituídas e ajustes realizados;
    e) Observações e recomendações técnicas;
    f) Próxima manutenção prevista.

5.2. Relatório de Manutenção Corretiva conterá:
    a) Descrição do problema reportado;
    b) Diagnóstico técnico detalhado;
    c) Causa raiz identificada (quando possível);
    d) Ações corretivas executadas;
    e) Testes realizados e resultados;
    f) Recomendações para evitar reincidência.

5.3. Histórico de Manutenção:
    a) Registros mantidos por no mínimo 5 anos;
    b) Acesso via portal web da CONTRATANTE;
    c) Exportação de relatórios em PDF ou Excel;
    d) Indicadores de desempenho (MTBF, MTTR, disponibilidade).

5.4. Entrega de relatórios:
    a) Preventiva: Até 3 dias úteis após execução;
    b) Corretiva: Até 24h após conclusão do reparo.
`,

    /**
     * Indicadores de Desempenho (KPIs)
     */
    indicadores: () => `
CLÁUSULA ESPECÍFICA 6 - DOS INDICADORES DE DESEMPENHO
6.1. Serão monitorados os seguintes KPIs:
    a) MTBF (Mean Time Between Failures): Tempo médio entre falhas;
    b) MTTR (Mean Time To Repair): Tempo médio de reparo;
    c) Disponibilidade: % de tempo operacional dos equipamentos;
    d) Taxa de conformidade com prazos de atendimento;
    e) Reincidência de falhas no mesmo equipamento.

6.2. Metas acordadas:
    a) Disponibilidade dos equipamentos: ≥ 95%;
    b) Atendimento dentro do prazo SLA: ≥ 90%;
    c) MTTR para equipamentos críticos: ≤ 4 horas;
    d) Taxa de reincidência (mesma falha em 30 dias): ≤ 5%.

6.3. Relatório mensal de indicadores será enviado até o 5º dia útil do mês subsequente.

6.4. Descumprimento sistemático das metas (3 meses consecutivos) enseja:
    a) Desconto de 10% na mensalidade;
    b) Plano de melhoria obrigatório;
    c) Possibilidade de rescisão sem multa pela CONTRATANTE.
`,

    /**
     * Equipe Técnica
     */
    equipe: () => `
CLÁUSULA ESPECÍFICA 7 - DA EQUIPE TÉCNICA
7.1. A CONTRATADA disponibilizará equipe técnica composta por:
    a) Técnicos certificados pelos fabricantes dos equipamentos;
    b) Profissionais com no mínimo 2 anos de experiência;
    c) Treinamento anualizado em normas e procedimentos;
    d) Equipamentos de proteção individual (EPIs) adequados.

7.2. Cada técnico portará:
    a) Identificação oficial da empresa;
    b) Certificações técnicas aplicáveis;
    c) Ferramentas e instrumentos calibrados;
    d) Equipamento de segurança do trabalho.

7.3. A CONTRATANTE poderá:
    a) Solicitar substituição de técnico inadequado;
    b) Verificar qualificações e certificações;
    c) Avaliar desempenho após cada intervenção.
`,

    /**
     * Garantia dos Serviços
     */
    garantia: () => `
CLÁUSULA ESPECÍFICA 8 - DA GARANTIA DOS SERVIÇOS
8.1. Todos os serviços de manutenção têm garantia de 90 (noventa) dias:
    a) Mesma falha reincidindo: Novo reparo sem custo;
    b) Peças substituídas: Garantia do fabricante ou 90 dias (o que for maior);
    c) Ajustes e regulagens: 30 dias de garantia.

8.2. Garantia NÃO cobre:
    a) Danos causados após a manutenção;
    b) Uso inadequado ou fora das especificações;
    c) Manutenção realizada por terceiros não autorizados;
    d) Falhas em componentes diferentes dos reparados.

8.3. Durante o período de garantia:
    a) Atendimento prioritário para reincidências;
    b) Sem custo adicional de mão de obra ou deslocamento;
    c) Substituição automática se falha persistir após 3ª intervenção.
`,

    /**
     * Suspensão e Retomada
     */
    suspensao: () => `
CLÁUSULA ESPECÍFICA 9 - DA SUSPENSÃO E RETOMADA DOS SERVIÇOS
9.1. Os serviços poderão ser suspensos temporariamente:
    a) A pedido da CONTRATANTE (férias coletivas, parada programada);
    b) Por inadimplência superior a 30 dias;
    c) Por força maior ou caso fortuito.

9.2. Durante suspensão a pedido da CONTRATANTE:
    a) Serviços suspensos sem cobrança durante período acordado (contratos pontuais);
    b) Atendimentos emergenciais conforme disponibilidade (cobrança à parte);
    c) Prazo máximo de suspensão: 90 dias corridos.

9.3. Retomada dos serviços:
    a) Aviso prévio de 15 dias;
    b) Inspeção geral dos equipamentos (incluso);
    c) Atualização do Plano de Manutenção Preventiva.

9.4. Suspensão em contratos recorrentes:
    a) Vide "Contrato de Plano de Manutenção" para condições específicas;
    b) Mensalidade reduzida a 30% para manter vínculo contratual durante suspensão (apenas planos recorrentes).
`,
};