/**
 * ESTILOS COMPARTILHADOS - PDFs de Contratos
 * 
 * Configurações visuais padronizadas para todos os tipos de contrato.
 * Mantém identidade visual consistente da marca Enterfix.
 */

/**
 * Configurações de estilo do PDF
 */
export const ESTILOS = {
    // Fontes
    fontePrincipal: 'times',
    tamanhoTitulo: 16,
    tamanhoSubtitulo: 12,
    tamanhoTexto: 10,
    tamanhoRodape: 8,
    
    // Margens (mm)
    margemEsquerda: 20,
    margemDireita: 20,
    margemSuperior: 20,
    margemInferior: 20,
    espacamentoLinha: 5,
    
    // Dimensões da página A4 (mm)
    larguraPagina: 210,
    alturaPagina: 297,
    
    // Cores (RGB)
    corPrimaria: [0, 51, 102],      // Azul escuro Enterfix
    corSecundaria: [128, 128, 128], // Cinza
    corTexto: [0, 0, 0],            // Preto
    corDestaque: [41, 128, 185],    // Azul claro
    
    // Logo da marca registrada
    logo: {
        path: '/assets/images/LOGO_ENTERFIX_LIGHT.png',
        // Dimensões baseadas na proporção real da imagem (684px × 334px = 2.05:1)
        largura: 40,    // mm
        altura: 19.5,   // mm (mantém proporção 2.05:1)
        posX: 20,       // Alinhado à margem esquerda
        posY: 10,       // Topo da página
    },
};

/**
 * Calcula largura útil da página (descontando margens)
 */
export function getLarguraUtil() {
    return ESTILOS.larguraPagina - ESTILOS.margemEsquerda - ESTILOS.margemDireita;
}

/**
 * Calcula altura útil da página (descontando margens)
 */
export function getAlturaUtil() {
    return ESTILOS.alturaPagina - ESTILOS.margemSuperior - ESTILOS.margemInferior;
}

/**
 * Retorna posição X centralizada para um elemento de largura específica
 */
export function getCentroX(larguraElemento = 0) {
    return (ESTILOS.larguraPagina - larguraElemento) / 2;
}
