// Banco de dados de peças e suas descrições técnicas
export const PECAS_DISPONIVEIS = [{
        id: 'modulo_cinematico',
        nome: 'Módulo Cinemático',
        descricao: 'módulo cinemático devido à perda de repetibilidade e danos nos assentos de contato decorrentes da colisão'
    },
    {
        id: 'vidro_protecao',
        nome: 'Vidro de Proteção',
        descricao: 'vidro de proteção'
    },
    {
        id: 'vedacoes_estruturais',
        nome: 'Vedações Estruturais',
        descricao: 'vedações estruturais'
    },
    {
        id: 'orings',
        nome: 'O-Rings de Estanqueidade',
        descricao: 'o-rings de estanqueidade'
    },
    {
        id: 'mola_trigger',
        nome: 'Mola de Trigger',
        descricao: 'mola de trigger para restauração da força de deflexão'
    },
    {
        id: 'sensor_optico',
        nome: 'Sensor Óptico',
        descricao: 'sensor óptico de detecção'
    },
    {
        id: 'bateria',
        nome: 'Bateria',
        descricao: 'bateria de alimentação'
    },
    {
        id: 'placa_eletronica',
        nome: 'Placa Eletrônica',
        descricao: 'placa eletrônica de controle'
    },
    {
        id: 'cabo_comunicacao',
        nome: 'Cabo de Comunicação',
        descricao: 'cabo de comunicação'
    },
    {
        id: 'transmissor_radio',
        nome: 'Transmissor de Rádio',
        descricao: 'transmissor de rádio'
    },
    {
        id: 'haste_palpadora',
        nome: 'Haste Palpadora',
        descricao: 'haste palpadora'
    },
    {
        id: 'esfera_ruby',
        nome: 'Esfera de Ruby',
        descricao: 'esfera de ruby'
    },
    {
        id: 'anel_fixacao',
        nome: 'Anel de Fixação',
        descricao: 'anel de fixação'
    },
    {
        id: 'conexao_m8',
        nome: 'Conexão M8',
        descricao: 'conexão M8'
    },
    {
        id: 'carcaca',
        nome: 'Carcaça',
        descricao: 'carcaça externa devido a danos estruturais'
    }
];

/**
 * Gera o texto de observações baseado nas peças selecionadas
 * @param {Array<string>} pecasSelecionadasIds - IDs das peças selecionadas
 * @returns {string} Texto formatado com as observações técnicas
 */
export const gerarTextoObservacoes = (pecasSelecionadasIds) => {
    if (!pecasSelecionadasIds || pecasSelecionadasIds.length === 0) {
        return '';
    }

    // Filtrar peças selecionadas
    const pecasSelecionadas = PECAS_DISPONIVEIS.filter(peca =>
        pecasSelecionadasIds.includes(peca.id)
    );

    if (pecasSelecionadas.length === 0) {
        return '';
    }

    // Construir lista de descrições
    const descricoes = pecasSelecionadas.map(peca => peca.descricao);

    // Formatar lista com vírgulas e "e" antes do último item
    let listaFormatada;
    if (descricoes.length === 1) {
        listaFormatada = descricoes[0];
    } else if (descricoes.length === 2) {
        listaFormatada = descricoes.join(' e ');
    } else {
        const ultimoItem = descricoes.pop();
        listaFormatada = descricoes.join(', ') + ' e ' + ultimoItem;
    }

    // Verificar se módulo cinemático está incluído para ajustar o texto
    const temModuloCinematico = pecasSelecionadasIds.includes('modulo_cinematico');
    const temVedacoes = pecasSelecionadasIds.includes('vedacoes_estruturais') ||
        pecasSelecionadasIds.includes('orings') ||
        pecasSelecionadasIds.includes('vidro_protecao');

    // Construir texto base
    let texto = `Realizada a substituição d${descricoes.length > 1 ? 'os componentes: ' : 'o componente: '}${listaFormatada}.`;

    // Adicionar contexto adicional baseado nas peças
    if (temVedacoes) {
        texto += ' As intervenções visaram restaurar a integridade pneumática e o índice de proteção (IP) do equipamento, prevenindo a entrada de fluidos refrigerantes e contaminantes particulados.';
    }

    if (temModuloCinematico) {
        texto += ' O conjunto foi testado para garantir o restabelecimento da força de deflexão original e a precisão micrométrica de disparo.';
    }

    // Finalizar com declaração de testes
    if (!temModuloCinematico && pecasSelecionadas.length > 0) {
        texto += ' O equipamento foi submetido aos testes de conformidade estabelecidos pelas normas técnicas aplicáveis.';
    }

    return texto;
};