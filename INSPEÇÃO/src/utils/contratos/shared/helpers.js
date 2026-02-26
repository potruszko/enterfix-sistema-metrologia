/**
 * HELPERS COMPARTILHADOS - PDFs de Contratos
 * 
 * Funções utilitárias para manipulação de texto, datas e posicionamento
 * nos documentos PDF.
 */

import { ESTILOS, getLarguraUtil } from './estilos.js';

/**
 * Formata data para formato extenso em português
 * @param {string} data - Data no formato ISO (YYYY-MM-DD)
 * @returns {string} Data formatada (ex: "15 de março de 2026")
 */
export function dataExtenso(data) {
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const [ano, mes, dia] = data.split('-');
    const mesNome = meses[parseInt(mes, 10) - 1];

    return `${parseInt(dia, 10)} de ${mesNome} de ${ano}`;
}

/**
 * Adiciona parágrafo com quebra automática de linha
 * @param {jsPDF} doc - Objeto jsPDF
 * @param {string} texto - Texto do parágrafo
 * @param {number} y - Posição Y inicial
 * @param {Object} opcoes - Opções de formatação
 * @returns {number} Nova posição Y após o parágrafo
 */
export function adicionarParagrafo(doc, texto, y, opcoes = {}) {
    const {
        tamanhoFonte = ESTILOS.tamanhoTexto,
        estilo = 'normal',
        cor = ESTILOS.corTexto,
        alinhamento = 'justify',
        recuo = 0
    } = opcoes;

    doc.setFontSize(tamanhoFonte);
    doc.setFont(ESTILOS.fontePrincipal, estilo);
    doc.setTextColor(...cor);

    const larguraUtil = getLarguraUtil() - recuo;
    const linhas = doc.splitTextToSize(texto, larguraUtil);

    let yAtual = y;
    linhas.forEach((linha, index) => {
        // Verifica se precisa de nova página
        if (yAtual > ESTILOS.alturaPagina - ESTILOS.margemInferior - 20) {
            doc.addPage();
            yAtual = ESTILOS.margemSuperior + 30; // Espaço para cabeçalho
        }

        doc.text(linha, ESTILOS.margemEsquerda + recuo, yAtual, {
            align: alinhamento === 'justify' && index < linhas.length - 1 ? 'left' : alinhamento
        });
        yAtual += ESTILOS.espacamentoLinha;
    });

    return yAtual + 3; // Retorna próxima posição Y + espaçamento
}

/**
 * Adiciona título de seção formatado
 * @param {jsPDF} doc - Objeto jsPDF
 * @param {string} titulo - Texto do título
 * @param {number} y - Posição Y inicial
 * @returns {number} Nova posição Y após o título
 */
export function adicionarTituloSecao(doc, titulo, y) {
    doc.setFontSize(ESTILOS.tamanhoSubtitulo);
    doc.setFont(ESTILOS.fontePrincipal, 'bold');
    doc.setTextColor(...ESTILOS.corPrimaria);

    // Verifica se precisa de nova página
    if (y > ESTILOS.alturaPagina - ESTILOS.margemInferior - 30) {
        doc.addPage();
        y = ESTILOS.margemSuperior + 30;
    }

    doc.text(titulo, ESTILOS.margemEsquerda, y);

    // Linha decorativa abaixo do título
    const larguraTexto = doc.getTextWidth(titulo);
    doc.setDrawColor(...ESTILOS.corPrimaria);
    doc.setLineWidth(0.5);
    doc.line(ESTILOS.margemEsquerda, y + 2, ESTILOS.margemEsquerda + larguraTexto, y + 2);

    // Resetar formatação
    doc.setTextColor(...ESTILOS.corTexto);
    doc.setFont(ESTILOS.fontePrincipal, 'normal');

    return y + 10; // Retorna posição após título + espaçamento
}

/**
 * Adiciona linha separadora
 * @param {jsPDF} doc - Objeto jsPDF
 * @param {number} y - Posição Y da linha
 * @param {Object} opcoes - Opções (cor, espessura, largura)
 * @returns {number} Nova posição Y após a linha
 */
export function adicionarLinhaSeparadora(doc, y, opcoes = {}) {
    const {
        cor = ESTILOS.corPrimaria,
        espessura = 0.5,
        largura = getLarguraUtil()
    } = opcoes;

    doc.setDrawColor(...cor);
    doc.setLineWidth(espessura);
    doc.line(
        ESTILOS.margemEsquerda,
        y,
        ESTILOS.margemEsquerda + largura,
        y
    );

    return y + 5; // Retorna posição após linha + espaçamento
}

/**
 * Verifica se há espaço suficiente na página
 * @param {number} yAtual - Posição Y atual
 * @param {number} espacoNecessario - Espaço necessário em mm
 * @returns {boolean} True se há espaço suficiente
 */
export function temEspacoNaPagina(yAtual, espacoNecessario) {
    const limiteInferior = ESTILOS.alturaPagina - ESTILOS.margemInferior - 30;
    return yAtual + espacoNecessario <= limiteInferior;
}

/**
 * Adiciona espaçamento vertical
 * @param {number} y - Posição Y atual
 * @param {number} espaco - Espaço a adicionar em mm
 * @returns {number} Nova posição Y
 */
export function adicionarEspaco(y, espaco = 5) {
    return y + espaco;
}

/**
 * Formata valor monetário em BRL
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado (ex: "R$ 1.234,56")
 */
export function formatarValorBRL(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

/**
 * Formata CPF (000.000.000-00)
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado
 */
export function formatarCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ (00.000.000/0000-00)
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} CNPJ formatado
 */
export function formatarCNPJ(cnpj) {
    if (!cnpj) return '';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
