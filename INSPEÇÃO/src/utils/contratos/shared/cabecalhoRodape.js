/**
 * CABEÇALHO E RODAPÉ - PDFs de Contratos
 * 
 * Funções para adicionar elementos padronizados de cabeçalho e rodapé
 * em todas as páginas dos contratos.
 */

import { ESTILOS, getLarguraUtil } from './estilos.js';

/**
 * Adiciona cabeçalho padrão em todas as páginas
 * @param {jsPDF} doc - Objeto jsPDF
 * @param {string} numeroContrato - Número identificador do contrato
 * @param {string} statusContrato - Status do contrato (minuta, ativo, etc)
 */
export function adicionarCabecalho(doc, numeroContrato, statusContrato) {
    const larguraUtil = getLarguraUtil();

    // Logo da Enterfix (marca registrada com proporção correta)
    try {
        doc.addImage(
            ESTILOS.logo.path,
            'PNG',
            ESTILOS.logo.posX,
            ESTILOS.logo.posY,
            ESTILOS.logo.largura,
            ESTILOS.logo.altura
        );
    } catch (error) {
        // Fallback: usar texto se logo não carregar
        console.warn('Logo não carregou, usando texto:', error);
        doc.setFontSize(14);
        doc.setFont(ESTILOS.fontePrincipal, 'bold');
        doc.setTextColor(...ESTILOS.corPrimaria);
        doc.text('ENTERFIX', ESTILOS.margemEsquerda, 15);
        doc.setFontSize(8);
        doc.setFont(ESTILOS.fontePrincipal, 'normal');
        doc.text('Metrologia e Calibração', ESTILOS.margemEsquerda, 19);
    }

    // Número do contrato (canto superior direito)
    doc.setFontSize(10);
    doc.setTextColor(...ESTILOS.corTexto);
    doc.text(
        `Contrato: ${numeroContrato}`,
        ESTILOS.larguraPagina - ESTILOS.margemDireita,
        15,
        { align: 'right' }
    );

    // Marca d'água MINUTA (se aplicável)
    if (statusContrato === 'minuta') {
        doc.setFontSize(60);
        doc.setTextColor(200, 200, 200); // Cinza claro
        doc.setFont(ESTILOS.fontePrincipal, 'bold');
        doc.text(
            'MINUTA',
            ESTILOS.larguraPagina / 2,
            ESTILOS.alturaPagina / 2,
            {
                align: 'center',
                angle: 45
            }
        );
        doc.setTextColor(...ESTILOS.corTexto);
        doc.setFont(ESTILOS.fontePrincipal, 'normal');
    }

    // Linha separadora abaixo do cabeçalho
    doc.setDrawColor(...ESTILOS.corPrimaria);
    doc.setLineWidth(0.5);
    doc.line(
        ESTILOS.margemEsquerda,
        ESTILOS.logo.posY + ESTILOS.logo.altura + 3,
        ESTILOS.larguraPagina - ESTILOS.margemDireita,
        ESTILOS.logo.posY + ESTILOS.logo.altura + 3
    );
}

/**
 * Adiciona rodapé padrão em todas as páginas
 * @param {jsPDF} doc - Objeto jsPDF
 * @param {number} numeroPagina - Número da página atual
 * @param {number} totalPaginas - Total de páginas do documento
 * @param {Object} dadosEmpresa - Dados da empresa (do Supabase)
 */
export function adicionarRodape(doc, numeroPagina, totalPaginas, dadosEmpresa) {
    const y = ESTILOS.alturaPagina - 15;

    // Linha separadora acima do rodapé
    doc.setDrawColor(...ESTILOS.corSecundaria);
    doc.setLineWidth(0.3);
    doc.line(
        ESTILOS.margemEsquerda,
        y - 3,
        ESTILOS.larguraPagina - ESTILOS.margemDireita,
        y - 3
    );

    // Informações da empresa (linha 1)
    doc.setFontSize(ESTILOS.tamanhoRodape);
    doc.setTextColor(...ESTILOS.corSecundaria);
    doc.setFont(ESTILOS.fontePrincipal, 'normal');

    const textoRodape = `${dadosEmpresa.razaoSocial} - CNPJ: ${dadosEmpresa.cnpj} - ${dadosEmpresa.cidade}/${dadosEmpresa.estado}`;
    doc.text(textoRodape, ESTILOS.larguraPagina / 2, y, {
        align: 'center'
    });

    // Informações de contato (linha 2)
    const contatoRodape = `Tel: ${dadosEmpresa.telefone} - Email: ${dadosEmpresa.email} - ${dadosEmpresa.website}`;
    doc.text(contatoRodape, ESTILOS.larguraPagina / 2, y + 4, {
        align: 'center'
    });

    // Número da página (canto inferior direito)
    doc.setFontSize(ESTILOS.tamanhoRodape);
    doc.text(
        `Página ${numeroPagina} de ${totalPaginas}`,
        ESTILOS.larguraPagina - ESTILOS.margemDireita,
        y,
        { align: 'right' }
    );
}

/**
 * Adiciona cabeçalho e rodapé em todas as páginas do documento
 * @param {jsPDF} doc - Objeto jsPDF
 * @param {string} numeroContrato - Número do contrato
 * @param {string} statusContrato - Status do contrato
 * @param {Object} dadosEmpresa - Dados da empresa
 */
export function aplicarCabecalhoRodapeEmTodasPaginas(doc, numeroContrato, statusContrato, dadosEmpresa) {
    const totalPaginas = doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        
        // Rodapé em todas as páginas
        adicionarRodape(doc, i, totalPaginas, dadosEmpresa);
        
        // Cabeçalho em todas exceto a primeira (primeira já tem logo no início)
        if (i > 1) {
            adicionarCabecalho(doc, numeroContrato, statusContrato);
        }
    }
}
