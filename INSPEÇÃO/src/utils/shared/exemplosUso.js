/**
 * ═══════════════════════════════════════════════════════════════════
 * EXEMPLO - Como usar estilos padronizados em PDFs
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Este arquivo demonstra como usar o arquivo global de estilos
 * para manter identidade visual consistente em TODOS os PDFs.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ═══════════════════════════════════════════════════════════════════
// IMPORTAR DO ARQUIVO GLOBAL DE ESTILOS
// ═══════════════════════════════════════════════════════════════════
import {
    // Logo da marca
    LOGO_ENTERFIX,
    
    // Paleta de cores
    CORES,
    
    // Tipografia
    TIPOGRAFIA,
    
    // Layout e espaçamentos
    LAYOUT,
    
    // Estilos de tabela
    ESTILOS_TABELA,
    
    // Funções utilitárias
    getLarguraUtil,
    getCentro,
    getLimiteInferior,
    temEspacoNaPagina,
    
    // Presets prontos
    PRESET_CONTRATO,
    PRESET_RELATORIO,
    PRESET_CERTIFICADO,
} from '../shared/estilosPDF.js';

/**
 * ═══════════════════════════════════════════════════════════════════
 * EXEMPLO 1: Relatório Técnico Simples
 * ═══════════════════════════════════════════════════════════════════
 */
export function gerarRelatorioSimples(dados) {
    const doc = new jsPDF();
    let y = LAYOUT.margens.superior;

    // ─────────────────────────────────────────────────────────────────
    // CABEÇALHO com Logo
    // ─────────────────────────────────────────────────────────────────
    doc.addImage(
        LOGO_ENTERFIX.path,
        'PNG',
        LOGO_ENTERFIX.posicaoX,
        LOGO_ENTERFIX.posicaoY,
        LOGO_ENTERFIX.largura,
        LOGO_ENTERFIX.altura
    );

    // Título do documento
    y = LOGO_ENTERFIX.posicaoY + LOGO_ENTERFIX.altura + 10;
    doc.setFont(PRESET_RELATORIO.fonte, TIPOGRAFIA.pesos.negrito);
    doc.setFontSize(TIPOGRAFIA.tamanhos.h1);
    doc.setTextColor(...CORES.primaria);
    doc.text('RELATÓRIO TÉCNICO', getCentro(), y, { align: 'center' });

    // ─────────────────────────────────────────────────────────────────
    // LINHA SEPARADORA
    // ─────────────────────────────────────────────────────────────────
    y += 8;
    doc.setDrawColor(...CORES.primaria);
    doc.setLineWidth(LAYOUT.elementos.espessuraLinhaGrossa);
    doc.line(
        LAYOUT.margens.esquerda,
        y,
        LAYOUT.pagina.largura - LAYOUT.margens.direita,
        y
    );

    // ─────────────────────────────────────────────────────────────────
    // CONTEÚDO
    // ─────────────────────────────────────────────────────────────────
    y += LAYOUT.espacamentos.entreSecoes;
    
    // Título de seção
    doc.setFont(TIPOGRAFIA.fontePrincipal, TIPOGRAFIA.pesos.negrito);
    doc.setFontSize(TIPOGRAFIA.tamanhos.h2);
    doc.setTextColor(...CORES.secundaria);
    doc.text('1. Identificação', LAYOUT.margens.esquerda, y);
    
    y += LAYOUT.espacamentos.entreParagrafos;

    // Texto normal
    doc.setFont(TIPOGRAFIA.fontePrincipal, TIPOGRAFIA.pesos.normal);
    doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
    doc.setTextColor(...CORES.texto);
    
    const texto = `Cliente: ${dados.cliente}\nEquipamento: ${dados.equipamento}\nData: ${dados.data}`;
    const linhas = doc.splitTextToSize(texto, getLarguraUtil());
    doc.text(linhas, LAYOUT.margens.esquerda, y);
    y += linhas.length * LAYOUT.espacamentos.entreLinhas;

    // ─────────────────────────────────────────────────────────────────
    // TABELA com estilos padrão Enterfix
    // ─────────────────────────────────────────────────────────────────
    y += LAYOUT.espacamentos.entreSecoes;
    
    doc.autoTable({
        startY: y,
        head: [['Item', 'Descrição', 'Status']],
        body: [
            ['1', 'Calibração realizada', 'APROVADO'],
            ['2', 'Ensaio de conformidade', 'APROVADO'],
            ['3', 'Verificação final', 'PENDENTE'],
        ],
        // Usar estilos padronizados Enterfix
        headStyles: ESTILOS_TABELA.cabecalho,
        bodyStyles: ESTILOS_TABELA.corpo,
        alternateRowStyles: ESTILOS_TABELA.alternado,
        // Estilizar células específicas
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 2) {
                if (data.cell.raw === 'APROVADO') {
                    data.cell.styles.textColor = CORES.sucesso;
                    data.cell.styles.fontStyle = 'bold';
                } else if (data.cell.raw === 'PENDENTE') {
                    data.cell.styles.textColor = CORES.alerta;
                }
            }
        },
    });

    // ─────────────────────────────────────────────────────────────────
    // RODAPÉ
    // ─────────────────────────────────────────────────────────────────
    const yRodape = LAYOUT.pagina.altura - LAYOUT.margens.inferior - 10;
    
    // Linha separadora
    doc.setDrawColor(...CORES.linha);
    doc.setLineWidth(LAYOUT.elementos.espessuraLinha);
    doc.line(
        LAYOUT.margens.esquerda,
        yRodape - 5,
        LAYOUT.pagina.largura - LAYOUT.margens.direita,
        yRodape - 5
    );
    
    // Texto do rodapé (cores Enterfix)
    doc.setFontSize(TIPOGRAFIA.tamanhos.pequeno);
    doc.setTextColor(...CORES.textoSecundario);
    doc.text(
        'Enterfix Metrologia - www.enterfix.com.br - Tel: (11) 4942-2222',
        getCentro(),
        yRodape,
        { align: 'center' }
    );

    return doc;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * EXEMPLO 2: Certificado de Calibração
 * ═══════════════════════════════════════════════════════════════════
 */
export function gerarCertificadoCalibracao(dados) {
    const doc = new jsPDF();
    
    // Usar preset de certificado (margens maiores)
    let y = PRESET_CERTIFICADO.margens.superior + 20;

    // ─────────────────────────────────────────────────────────────────
    // BORDA DECORATIVA  (azul claro Enterfix)
    // ─────────────────────────────────────────────────────────────────
    doc.setDrawColor(...CORES.secundaria);
    doc.setLineWidth(2);
    doc.rect(15, 15, 180, 267); // Borda externa

    // ─────────────────────────────────────────────────────────────────
    // Logo centralizado
    // ─────────────────────────────────────────────────────────────────
    const logoX = getCentro() - (LOGO_ENTERFIX.largura / 2);
    doc.addImage(
        LOGO_ENTERFIX.path,
        'PNG',
        logoX,
        25,
        LOGO_ENTERFIX.largura,
        LOGO_ENTERFIX.altura
    );

    y = 25 + LOGO_ENTERFIX.altura + 15;

    // ─────────────────────────────────────────────────────────────────
    // TÍTULO DESTACADO
    // ─────────────────────────────────────────────────────────────────
    doc.setFont(PRESET_CERTIFICADO.fonte, TIPOGRAFIA.pesos.negrito);
    doc.setFontSize(20);
    doc.setTextColor(...CORES.secundaria);
    doc.text('CERTIFICADO DE CALIBRAÇÃO', getCentro(), y, { align: 'center' });

    // Número do certificado
    y += 10;
    doc.setFontSize(TIPOGRAFIA.tamanhos.h3);
    doc.setTextColor(...CORES.texto);
    doc.text(`Nº ${dados.numeroCertificado}`, getCentro(), y, { align: 'center' });

    // ─────────────────────────────────────────────────────────────────
    // Resto do certificado...
    // ─────────────────────────────────────────────────────────────────
    
    return doc;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * EXEMPLO 3: Contrato (usando preset formal)
 * ═══════════════════════════════════════════════════════════════════
 */
export function gerarContratoExemplo(dados) {
    const doc = new jsPDF();
    let y = LAYOUT.margens.superior;

    // Logo
    doc.addImage(
        LOGO_ENTERFIX.path,
        'PNG',
        LOGO_ENTERFIX.posicaoX,
        LOGO_ENTERFIX.posicaoY,
        LOGO_ENTERFIX.largura,
        LOGO_ENTERFIX.altura
    );

    y = LOGO_ENTERFIX.posicaoY + LOGO_ENTERFIX.altura + 15;

    // Título (fonte formal Times)
    doc.setFont(PRESET_CONTRATO.fonte, TIPOGRAFIA.pesos.negrito);
    doc.setFontSize(TIPOGRAFIA.tamanhos.h1);
    doc.setTextColor(...PRESET_CONTRATO.corPrimaria);
    doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', getCentro(), y, { align: 'center' });

    // Conteúdo formal...
    // (resto do contrato)
    
    return doc;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * EXEMPLO 4: Caixa de Destaque (padrão Enterfix)
 * ═══════════════════════════════════════════════════════════════════
 */
function adicionarCaixaDestaque(doc, texto, y, tipo = 'info') {
    const cores = {
        info: { fundo: CORES.fundoAzul, borda: CORES.secundaria, texto: CORES.primaria },
        sucesso: { fundo: CORES.sucessoClaro, borda: CORES.sucesso, texto: CORES.sucesso },
        alerta: { fundo: CORES.alertaClaro, borda: CORES.alerta, texto: CORES.alerta },
        erro: { fundo: CORES.erroClaro, borda: CORES.erro, texto: CORES.erro },
    };

    const cor = cores[tipo];
    const largura = getLarguraUtil();
    const altura = 15;

    // Fundo
    doc.setFillColor(...cor.fundo);
    doc.rect(LAYOUT.margens.esquerda, y, largura, altura, 'F');

    // Borda
    doc.setDrawColor(...cor.borda);
    doc.setLineWidth(0.5);
    doc.rect(LAYOUT.margens.esquerda, y, largura, altura);

    // Texto
    doc.setFont(TIPOGRAFIA.fontePrincipal, TIPOGRAFIA.pesos.normal);
    doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
    doc.setTextColor(...cor.texto);
    doc.text(texto, LAYOUT.margens.esquerda + 5, y + 8);

    return y + altura + LAYOUT.espacamentos.entreParagrafos;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * DICAS DE USO
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. SEMPRE importar de '../shared/estilosPDF.js'
 * 2. NUNCA hardcodar cores ou margens
 * 3. Usar PRESET adequado (CONTRATO, RELATORIO, CERTIFICADO)
 * 4. Logo sempre com LOGO_ENTERFIX (proporção correta)
 * 5. Cores sempre de CORES.* (identidade Enterfix)
 * 6. Fontes e tamanhos de TIPOGRAFIA.*
 * 7. Margens e espaçamentos de LAYOUT.*
 * 8. Tabelas com ESTILOS_TABELA.*
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
