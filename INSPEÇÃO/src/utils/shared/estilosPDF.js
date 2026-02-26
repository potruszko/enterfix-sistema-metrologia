/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTILOS GLOBAIS - PDFs ENTERFIX
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ⚠️  IMPORTANTE: Este é o ÚNICO arquivo de estilos para TODOS os PDFs
 *     (Contratos, Relatórios, Certificados, Ordens de Serviço)
 * 
 * 🎨  IDENTIDADE VISUAL ENTERFIX - Marca Registrada
 * 
 * 📋  Para modificar aparência dos PDFs, edite APENAS este arquivo.
 *     Todas as mudanças serão aplicadas automaticamente em todos os documentos.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════
 * MARCA REGISTRADA - LOGO ENTERFIX
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ⚠️  NÃO ALTERAR PROPORÇÃO - Marca registrada protegida
 * Imagem original: 684px × 334px = proporção 2.05:1
 */
export const LOGO_ENTERFIX = {
    path: '/assets/images/LOGO_ENTERFIX_LIGHT.png',
    largura: 40, // mm
    altura: 19.5, // mm (proporção 2.05:1 = MARCA REGISTRADA)
    posicaoX: 20, // Alinhado à margem esquerda
    posicaoY: 10, // Topo da página
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * PALETA DE CORES ENTERFIX
 * ═══════════════════════════════════════════════════════════════════
 * Cores oficiais da identidade visual (RGB para jsPDF)
 */
export const CORES = {
    // Cores principais da marca
    primaria: [0, 51, 102], // Azul escuro Enterfix #003366
    secundaria: [41, 128, 185], // Azul claro #2980B9

    // Cores de texto
    texto: [0, 0, 0], // Preto puro #000000
    textoSecundario: [128, 128, 128], // Cinza médio #808080
    textoClaro: [200, 200, 200], // Cinza claro #C8C8C8

    // Cores de status
    sucesso: [22, 101, 52], // Verde escuro #166534
    sucessoClaro: [220, 255, 220], // Verde claro #DCFFDC
    alerta: [202, 138, 4], // Amarelo/laranja #CA8A04
    alertaClaro: [255, 250, 220], // Amarelo claro #FFFADC
    erro: [153, 27, 27], // Vermelho escuro #991B1B
    erroClaro: [255, 220, 220], // Vermelho claro #FFDCDC

    // Cores de fundo
    fundoBranco: [255, 255, 255], // Branco puro
    fundoCinza: [245, 245, 245], // Cinza muito claro #F5F5F5
    fundoAzul: [240, 248, 255], // Azul muito claro #F0F8FF

    // Cores de linhas e bordas
    linha: [200, 200, 200], // Cinza para linhas
    borda: [128, 128, 128], // Cinza para bordas
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * TIPOGRAFIA
 * ═══════════════════════════════════════════════════════════════════
 */
export const TIPOGRAFIA = {
    // Fonte principal (jsPDF suporta: 'helvetica', 'times', 'courier')
    fontePrincipal: 'helvetica', // Moderna e legível
    fonteSecundaria: 'times', // Para contratos/documentos formais
    fonteMono: 'courier', // Para códigos/dados técnicos

    // Tamanhos de fonte (em pontos)
    tamanhos: {
        h1: 18, // Título principal
        h2: 14, // Subtítulo
        h3: 12, // Seção
        corpo: 10, // Texto padrão
        pequeno: 8, // Rodapé, observações
        muitoPequeno: 7, // Legendas muito pequenas
    },

    // Pesos (estilos jsPDF)
    pesos: {
        normal: 'normal',
        negrito: 'bold',
        italico: 'italic',
        negritoItalico: 'bolditalic',
    },
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * LAYOUT E ESPAÇAMENTO
 * ═══════════════════════════════════════════════════════════════════
 */
export const LAYOUT = {
    // Dimensões da página A4 (mm)
    pagina: {
        largura: 210, // Largura A4
        altura: 297, // Altura A4
    },

    // Margens padrão (mm)
    margens: {
        esquerda: 20,
        direita: 20,
        superior: 20,
        inferior: 20,
    },

    // Espaçamentos (mm)
    espacamentos: {
        entreLinhas: 5, // Espaço entre linhas de texto
        entreParagrafos: 8, // Espaço entre parágrafos
        entreSecoes: 12, // Espaço entre seções
        recuo: 10, // Recuo de parágrafo
    },

    // Tamanhos de elementos (mm)
    elementos: {
        alturaCabecalho: 35, // Altura reservada para cabeçalho
        alturaRodape: 25, // Altura reservada para rodapé
        espessuraLinha: 0.5, // Espessura padrão de linhas
        espessuraLinhaGrossa: 1.0, // Espessura de linhas destacadas
    },
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * TABELAS (jsPDF AutoTable)
 * ═══════════════════════════════════════════════════════════════════
 */
export const ESTILOS_TABELA = {
    // Estilo do cabeçalho da tabela
    cabecalho: {
        fillColor: CORES.primaria, // Fundo azul Enterfix
        textColor: [255, 255, 255], // Texto branco
        fontStyle: 'bold',
        fontSize: TIPOGRAFIA.tamanhos.corpo,
        halign: 'center', // Alinhamento horizontal
        valign: 'middle', // Alinhamento vertical
    },

    // Estilo do corpo da tabela
    corpo: {
        fontSize: TIPOGRAFIA.tamanhos.pequeno,
        cellPadding: 3,
        lineColor: CORES.linha,
        lineWidth: 0.1,
    },

    // Estilo alternado (zebrado)
    alternado: {
        fillColor: CORES.fundoCinza,
    },

    // Estilo para células de destaque
    destaque: {
        fillColor: CORES.fundoAzul,
        fontStyle: 'bold',
    },
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * FUNÇÕES UTILITÁRIAS DE CÁLCULO
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * Calcula largura útil da página (descontando margens)
 * @returns {number} Largura em mm
 */
export function getLarguraUtil() {
    return LAYOUT.pagina.largura - LAYOUT.margens.esquerda - LAYOUT.margens.direita;
}

/**
 * Calcula altura útil da página (descontando margens e cabeçalho/rodapé)
 * @returns {number} Altura em mm
 */
export function getAlturaUtil() {
    return LAYOUT.pagina.altura -
        LAYOUT.margens.superior -
        LAYOUT.margens.inferior -
        LAYOUT.elementos.alturaCabecalho -
        LAYOUT.elementos.alturaRodape;
}

/**
 * Retorna posição X centralizada para elemento de largura específica
 * @param {number} larguraElemento - Largura do elemento em mm
 * @returns {number} Posição X em mm
 */
export function getCentroX(larguraElemento = 0) {
    return (LAYOUT.pagina.largura - larguraElemento) / 2;
}

/**
 * Retorna posição X centralizada da página
 * @returns {number} Posição X em mm
 */
export function getCentro() {
    return LAYOUT.pagina.largura / 2;
}

/**
 * Calcula posição X da margem direita
 * @returns {number} Posição X em mm
 */
export function getMargemDireita() {
    return LAYOUT.pagina.largura - LAYOUT.margens.direita;
}

/**
 * Calcula limite inferior da página (onde começa o rodapé)
 * @returns {number} Posição Y em mm
 */
export function getLimiteInferior() {
    return LAYOUT.pagina.altura - LAYOUT.margens.inferior - LAYOUT.elementos.alturaRodape;
}

/**
 * Verifica se há espaço suficiente na página
 * @param {number} yAtual - Posição Y atual
 * @param {number} espacoNecessario - Espaço necessário em mm
 * @returns {boolean} True se há espaço
 */
export function temEspacoNaPagina(yAtual, espacoNecessario) {
    return yAtual + espacoNecessario <= getLimiteInferior();
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * PRESETS DE ESTILOS COMPLETOS
 * ═══════════════════════════════════════════════════════════════════
 * Configurações prontas para uso em diferentes tipos de documento
 */

/**
 * Preset para CONTRATOS (formal, elegante)
 */
export const PRESET_CONTRATO = {
    fonte: TIPOGRAFIA.fonteSecundaria, // Times (mais formal)
    corPrimaria: CORES.primaria,
    corTexto: CORES.texto,
    margens: LAYOUT.margens,
    espacamento: LAYOUT.espacamentos.entreLinhas,
};

/**
 * Preset para RELATÓRIOS TÉCNICOS (moderno, legível)
 */
export const PRESET_RELATORIO = {
    fonte: TIPOGRAFIA.fontePrincipal, // Helvetica (mais moderna)
    corPrimaria: CORES.primaria,
    corDestaque: CORES.secundaria,
    corTexto: CORES.texto,
    margens: LAYOUT.margens,
    espacamento: LAYOUT.espacamentos.entreLinhas,
};

/**
 * Preset para CERTIFICADOS (destacado, oficial)
 */
export const PRESET_CERTIFICADO = {
    fonte: TIPOGRAFIA.fontePrincipal,
    corPrimaria: CORES.secundaria, // Azul claro mais destacado
    corTexto: CORES.texto,
    margens: {
        ...LAYOUT.margens,
        esquerda: 25,
        direita: 25
    }, // Margens maiores
    espacamento: LAYOUT.espacamentos.entreParagrafos,
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTAÇÕES LEGADAS (Compatibilidade com código antigo)
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * @deprecated Use os exports nomeados acima. Este objeto será removido na v2.0
 */
export const ESTILOS = {
    // Fontes
    fontePrincipal: TIPOGRAFIA.fonteSecundaria,
    tamanhoTitulo: TIPOGRAFIA.tamanhos.h1,
    tamanhoSubtitulo: TIPOGRAFIA.tamanhos.h2,
    tamanhoTexto: TIPOGRAFIA.tamanhos.corpo,
    tamanhoRodape: TIPOGRAFIA.tamanhos.pequeno,

    // Margens
    margemEsquerda: LAYOUT.margens.esquerda,
    margemDireita: LAYOUT.margens.direita,
    margemSuperior: LAYOUT.margens.superior,
    margemInferior: LAYOUT.margens.inferior,
    espacamentoLinha: LAYOUT.espacamentos.entreLinhas,

    // Dimensões
    larguraPagina: LAYOUT.pagina.largura,
    alturaPagina: LAYOUT.pagina.altura,

    // Cores
    corPrimaria: CORES.primaria,
    corSecundaria: CORES.textoSecundario,
    corTexto: CORES.texto,

    // Logo
    logo: LOGO_ENTERFIX,
};