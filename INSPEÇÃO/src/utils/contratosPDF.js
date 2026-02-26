/**
 * GERADOR DE PDFs DE CONTRATOS - ENTERFIX METROLOGIA
 * 
 * Gera contratos em PDF com formatação profissional,
 * todas as cláusulas legais e proteção jurídica adequada.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    DADOS_ENTERFIX,
    FORO_COMPETENTE,
    CLAUSULAS_GERAIS,
    CLAUSULAS_ESPECIFICAS,
    gerarContratoCompleto
} from './clausulasContratuais';

/**
 * Configurações de estilo do PDF
 */
const ESTILOS = {
    fontePrincipal: 'times',
    tamanhoTitulo: 16,
    tamanhoSubtitulo: 12,
    tamanhoTexto: 10,
    tamanhoRodape: 8,
    margemEsquerda: 20,
    margemDireita: 20,
    margemSuperior: 20,
    margemInferior: 20,
    espacamentoLinha: 5,
    larguraPagina: 210, // A4
    alturaPagina: 297,
    corPrimaria: [0, 51, 102], // Azul escuro
    corSecundaria: [128, 128, 128], // Cinza
    corTexto: [0, 0, 0], // Preto
};

/**
 * Adiciona cabeçalho em todas as páginas
 */
function adicionarCabecalho(doc, numeroContrato, statusContrato) {
    const larguraUtil = ESTILOS.larguraPagina - ESTILOS.margemEsquerda - ESTILOS.margemDireita;

    // Logo da Enterfix
    try {
        // Usar logo do projeto (base64 inline para funcionar no PDF)
        const logoPath = '/assets/images/Enterfix-Symbol.png';
        doc.addImage(logoPath, 'PNG', ESTILOS.margemEsquerda, 8, 25, 12);
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

    // Número do contrato
    doc.setFontSize(10);
    doc.setTextColor(...ESTILOS.corTexto);
    doc.text(`Contrato: ${numeroContrato}`, ESTILOS.larguraPagina - ESTILOS.margemDireita, 15, {
        align: 'right'
    });

    // Linha separadora
    doc.setDrawColor(...ESTILOS.corPrimaria);
    doc.setLineWidth(0.5);
    doc.line(ESTILOS.margemEsquerda, 22, ESTILOS.larguraPagina - ESTILOS.margemDireita, 22);

    // Marca d'água se for minuta
    if (statusContrato === 'minuta') {
        doc.setFontSize(60);
        doc.setTextColor(200, 200, 200);
        doc.setFont(ESTILOS.fontePrincipal, 'bold');
        doc.text('MINUTA', ESTILOS.larguraPagina / 2, ESTILOS.alturaPagina / 2, {
            angle: 45,
            align: 'center',
            baseline: 'middle'
        });
        doc.setTextColor(...ESTILOS.corTexto);
        doc.setFont(ESTILOS.fontePrincipal, 'normal');
    }
}

/**
 * Adiciona rodapé em todas as páginas
 */
function adicionarRodape(doc, numeroPagina, totalPaginas) {
    const y = ESTILOS.alturaPagina - 15;

    // Linha separadora
    doc.setDrawColor(...ESTILOS.corSecundaria);
    doc.setLineWidth(0.3);
    doc.line(ESTILOS.margemEsquerda, y - 3, ESTILOS.larguraPagina - ESTILOS.margemDireita, y - 3);

    // Informações da empresa
    doc.setFontSize(ESTILOS.tamanhoRodape);
    doc.setTextColor(...ESTILOS.corSecundaria);
    doc.setFont(ESTILOS.fontePrincipal, 'normal');

    const textoRodape = `${DADOS_ENTERFIX.razaoSocial} - CNPJ: ${DADOS_ENTERFIX.cnpj} - ${DADOS_ENTERFIX.cidade}/${DADOS_ENTERFIX.estado}`;
    doc.text(textoRodape, ESTILOS.larguraPagina / 2, y, {
        align: 'center'
    });

    const contatoRodape = `Tel: ${DADOS_ENTERFIX.telefone} - Email: ${DADOS_ENTERFIX.email} - ${DADOS_ENTERFIX.website}`;
    doc.text(contatoRodape, ESTILOS.larguraPagina / 2, y + 4, {
        align: 'center'
    });

    // Número da página
    doc.setFontSize(ESTILOS.tamanhoRodape);
    doc.text(`Página ${numeroPagina} de ${totalPaginas}`, ESTILOS.larguraPagina - ESTILOS.margemDireita, y, {
        align: 'right'
    });
}

/**
 * Adiciona parágrafo com quebra automática de linha
 */
function adicionarParagrafo(doc, texto, y, opcoes = {}) {
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

    const larguraUtil = ESTILOS.larguraPagina - ESTILOS.margemEsquerda - ESTILOS.margemDireita - recuo;
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

    return yAtual + 3; // Retorna próxima posição Y
}

/**
 * Adiciona título de seção
 */
function adicionarTituloSecao(doc, titulo, y) {
    doc.setFontSize(ESTILOS.tamanhoSubtitulo);
    doc.setFont(ESTILOS.fontePrincipal, 'bold');
    doc.setTextColor(...ESTILOS.corPrimaria);

    // Verifica se precisa de nova página
    if (y > ESTILOS.alturaPagina - ESTILOS.margemInferior - 30) {
        doc.addPage();
        y = ESTILOS.margemSuperior + 30;
    }

    doc.text(titulo, ESTILOS.margemEsquerda, y);

    // Linha decorativa
    const larguraTexto = doc.getTextWidth(titulo);
    doc.setDrawColor(...ESTILOS.corPrimaria);
    doc.setLineWidth(0.5);
    doc.line(ESTILOS.margemEsquerda, y + 2, ESTILOS.margemEsquerda + larguraTexto, y + 2);

    doc.setTextColor(...ESTILOS.corTexto);
    doc.setFont(ESTILOS.fontePrincipal, 'normal');

    return y + 10;
}

/**
 * Formata data para extenso
 */
function dataExtenso(data) {
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const d = new Date(data + 'T12:00:00'); // Adiciona hora para evitar problema de timezone
    const dia = d.getDate();
    const mes = meses[d.getMonth()];
    const ano = d.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
}

/**
 * Gera PDF completo do contrato
 */
export async function gerarPDFContrato(dadosContrato) {
    return new Promise((resolve, reject) => {
        try {
            // Criar documento
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            let y = ESTILOS.margemSuperior + 30; // Após cabeçalho

            // Adicionar cabeçalho
            adicionarCabecalho(doc, dadosContrato.numero_contrato, dadosContrato.status);

            // ═══════════ TÍTULO PRINCIPAL ═══════════
            doc.setFontSize(ESTILOS.tamanhoTitulo);
            doc.setFont(ESTILOS.fontePrincipal, 'bold');
            doc.setTextColor(...ESTILOS.corPrimaria);

            const tipoContrato = {
                'prestacao_servico': 'PRESTAÇÃO DE SERVIÇOS DE CALIBRAÇÃO',
                'comodato': 'COMODATO DE EQUIPAMENTOS',
                'manutencao': 'MANUTENÇÃO DE INSTRUMENTOS',
                'sla': 'ACORDO DE NÍVEL DE SERVIÇO (SLA)',
                'consultoria': 'CONSULTORIA EM METROLOGIA',
                'gestao_parque': 'GESTÃO DE PARQUE DE INSTRUMENTOS',
                'suporte': 'SUPORTE TÉCNICO ESPECIALIZADO',
                'validacao': 'VALIDAÇÃO DE EQUIPAMENTOS',
                'nda': 'ACORDO DE CONFIDENCIALIDADE (NDA)',
            };

            const titulo = `CONTRATO DE ${tipoContrato[dadosContrato.tipo_contrato] || 'SERVIÇOS'}`;
            doc.text(titulo, ESTILOS.larguraPagina / 2, y, {
                align: 'center'
            });

            y += 8;
            doc.setFontSize(14);
            doc.text(`Nº ${dadosContrato.numero_contrato}`, ESTILOS.larguraPagina / 2, y, {
                align: 'center'
            });

            y += 10;
            doc.setDrawColor(...ESTILOS.corPrimaria);
            doc.setLineWidth(0.7);
            doc.line(ESTILOS.margemEsquerda, y, ESTILOS.larguraPagina - ESTILOS.margemDireita, y);

            y += 10;
            doc.setFontSize(ESTILOS.tamanhoTexto);
            doc.setFont(ESTILOS.fontePrincipal, 'normal');
            doc.setTextColor(...ESTILOS.corTexto);

            // ═══════════ QUALIFICAÇÃO DAS PARTES ═══════════
            const preambulo = `Pelo presente instrumento particular de contrato, as partes abaixo qualificadas:`;
            y = adicionarParagrafo(doc, preambulo, y, {
                estilo: 'italic'
            });
            y += 3;

            // CONTRATADA
            y = adicionarParagrafo(doc, 'CONTRATADA:', y, {
                estilo: 'bold'
            });
            const dadosContratada = `${DADOS_ENTERFIX.razaoSocial}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${DADOS_ENTERFIX.cnpj}, com sede em ${DADOS_ENTERFIX.endereco}, ${DADOS_ENTERFIX.cidade}/${DADOS_ENTERFIX.estado}, CEP ${DADOS_ENTERFIX.cep}, Inscrição Estadual nº ${DADOS_ENTERFIX.inscricaoEstadual}, neste ato representada na forma de seu contrato social.`;
            y = adicionarParagrafo(doc, dadosContratada, y);
            y += 3;

            // CONTRATANTE
            y = adicionarParagrafo(doc, 'CONTRATANTE:', y, {
                estilo: 'bold'
            });
            const cliente = dadosContrato.cliente;
            const dadosContratante = cliente.tipo_pessoa === 'juridica' ?
                `${cliente.razao_social}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${cliente.cnpj}${cliente.inscricao_estadual ? `, Inscrição Estadual nº ${cliente.inscricao_estadual}` : ''}, com endereço em ${cliente.logradouro || ''} ${cliente.numero ? ', ' + cliente.numero : ''}${cliente.complemento ? ' - ' + cliente.complemento : ''}, ${cliente.bairro || ''}, ${cliente.cidade || ''}/${cliente.estado || ''}, CEP ${cliente.cep || ''}.` :
                `${cliente.razao_social}, pessoa física, portadora do CPF nº ${cliente.cpf}, residente e domiciliada em ${cliente.logradouro || ''} ${cliente.numero ? ', ' + cliente.numero : ''}${cliente.complemento ? ' - ' + cliente.complemento : ''}, ${cliente.bairro || ''}, ${cliente.cidade || ''}/${cliente.estado || ''}, CEP ${cliente.cep || ''}.`;
            y = adicionarParagrafo(doc, dadosContratante, y);
            y += 5;

            const introducao = `Têm entre si justo e contratado o seguinte:`;
            y = adicionarParagrafo(doc, introducao, y, {
                estilo: 'italic'
            });
            y += 8;

            // ═══════════ CLÁUSULAS ═══════════

            // CLÁUSULA 1 - OBJETO
            y = adicionarTituloSecao(doc, 'CLÁUSULA PRIMEIRA - DO OBJETO', y);
            const descricaoServico = {
                'prestacao_servico': 'prestação de serviços de calibração e ensaios metrológicos',
                'comodato': 'comodato de equipamentos de medição',
                'manutencao': 'manutenção preventiva e corretiva de instrumentos de medição',
                'sla': 'prestação de serviços com acordo de nível de serviço (SLA)',
                'consultoria': 'consultoria técnica em metrologia',
                'gestao_parque': 'gestão de parque de instrumentos de medição',
                'suporte': 'suporte técnico especializado em metrologia',
                'validacao': 'validação de equipamentos e processos metrológicos',
                'nda': 'prestação de serviços com acordo de confidencialidade',
            };
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.objeto(descricaoServico[dadosContrato.tipo_contrato]), y);
            y += 5;

            // CLÁUSULA 2 - VIGÊNCIA
            y = adicionarTituloSecao(doc, 'CLÁUSULA SEGUNDA - DA VIGÊNCIA', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.vigencia(
                dataExtenso(dadosContrato.data_inicio),
                dadosContrato.data_fim ? dataExtenso(dadosContrato.data_fim) : null,
                dadosContrato.prazo_indeterminado
            ), y);
            y += 5;

            // CLÁUSULA 3 - VALOR E PAGAMENTO
            y = adicionarTituloSecao(doc, 'CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.valorPagamento(
                dadosContrato.valor_total || 0,
                dadosContrato.valor_mensal || null,
                dadosContrato.forma_pagamento
            ), y);
            y += 5;

            // CLÁUSULA 4 - OBRIGAÇÕES DA CONTRATADA
            y = adicionarTituloSecao(doc, 'CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.obrigacoesContratada(), y);
            y += 5;

            // CLÁUSULA 5 - OBRIGAÇÕES DA CONTRATANTE
            y = adicionarTituloSecao(doc, 'CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATANTE', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.obrigacoesContratante(), y);
            y += 5;

            // CLÁUSULA 6 - LIMITAÇÃO DE RESPONSABILIDADE
            y = adicionarTituloSecao(doc, 'CLÁUSULA SEXTA - DA LIMITAÇÃO DE RESPONSABILIDADE', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.limitacaoResponsabilidade(), y);
            y += 5;

            // CLÁUSULA 7 - CONFIDENCIALIDADE E LGPD
            y = adicionarTituloSecao(doc, 'CLÁUSULA SÉTIMA - DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.confidencialidade(), y);
            y += 5;

            // CLÁUSULA 8 - GARANTIA
            y = adicionarTituloSecao(doc, 'CLÁUSULA OITAVA - DA GARANTIA', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.garantia('90 dias'), y);
            y += 5;

            // CLÁUSULA 9 - RESCISÃO
            y = adicionarTituloSecao(doc, 'CLÁUSULA NONA - DA RESCISÃO', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.rescisao(), y);
            y += 5;

            // CLÁUSULAS ESPECÍFICAS DO TIPO DE CONTRATO (DESTACADAS)
            if (CLAUSULAS_ESPECIFICAS[dadosContrato.tipo_contrato]) {
                const clausulaEspecifica = CLAUSULAS_ESPECIFICAS[dadosContrato.tipo_contrato](dadosContrato.dados_especificos || {});
                
                // Nova página para cláusulas específicas (melhor organização)
                doc.addPage();
                y = ESTILOS.margemSuperior + 30;
                
                // Título destacado
                doc.setFontSize(14);
                doc.setFont(ESTILOS.fontePrincipal, 'bold');
                doc.setTextColor(...ESTILOS.corPrimaria);
                doc.text('CLÁUSULAS ESPECÍFICAS', ESTILOS.larguraPagina / 2, y, { align: 'center' });
                y += 8;
                
                // Subtítulo com tipo de contrato
                doc.setFontSize(12);
                const titulosContratos = {
                    'prestacao_servico': 'Prestação de Serviços de Calibração',
                    'comodato': 'Comodato de Equipamentos',
                    'manutencao': 'Manutenção de Instrumentos',
                    'sla': 'Acordo de Nível de Serviço (SLA)',
                    'consultoria': 'Consultoria em Metrologia',
                    'gestao_parque': 'Gestão de Parque de Instrumentos',
                    'suporte': 'Suporte Técnico Especializado',
                    'validacao': 'Validação de Equipamentos',
                    'nda': 'Confidencialidade (NDA)'
                };
                doc.text(titulosContratos[dadosContrato.tipo_contrato] || 'Disposições Específicas', ESTILOS.larguraPagina / 2, y, { align: 'center' });
                
                doc.setDrawColor(...ESTILOS.corPrimaria);
                doc.setLineWidth(0.5);
                doc.line(ESTILOS.margemEsquerda, y + 2, ESTILOS.larguraPagina - ESTILOS.margemDireita, y + 2);
                
                y += 10;
                doc.setTextColor(...ESTILOS.corTexto);
                doc.setFont(ESTILOS.fontePrincipal, 'normal');
                
                y = adicionarParagrafo(doc, clausulaEspecifica, y);
                y += 5;
            }

            // CLÁUSULAS ADICIONAIS (se houver)
            if (dadosContrato.clausulas_adicionais && dadosContrato.clausulas_adicionais.trim()) {
                y = adicionarTituloSecao(doc, 'CLÁUSULA ADICIONAL', y);
                y = adicionarParagrafo(doc, dadosContrato.clausulas_adicionais, y);
                y += 5;
            }

            // CLÁUSULA FINAL - DISPOSIÇÕES GERAIS
            y = adicionarTituloSecao(doc, 'CLÁUSULA DÉCIMA - DAS DISPOSIÇÕES GERAIS', y);
            y = adicionarParagrafo(doc, CLAUSULAS_GERAIS.disposicoesGerais(), y);
            y += 10;

            // ═══════════ ASSINATURAS ═══════════
            // Nova página para assinaturas
            doc.addPage();
            y = ESTILOS.margemSuperior + 30;

            const limiteInferior = ESTILOS.alturaPagina - ESTILOS.margemInferior - 30; // Reservar espaço para rodapé

            const encerramento = `E por estarem assim justas e contratadas, as partes assinam o presente contrato em 2 (duas) vias de igual teor e forma, na presença das testemunhas abaixo.`;
            const linhasEncerramento = doc.splitTextToSize(encerramento, ESTILOS.larguraPagina - 40);
            doc.setFontSize(10);
            doc.setFont(ESTILOS.fontePrincipal, 'italic');
            linhasEncerramento.forEach(linha => {
                doc.text(linha, ESTILOS.larguraPagina / 2, y, { align: 'center' });
                y += 5;
            });
            y += 5;

            const dataAssinatura = `${DADOS_ENTERFIX.cidade}/${DADOS_ENTERFIX.estado}, ${dataExtenso(new Date().toISOString().split('T')[0])}.`;
            doc.setFont(ESTILOS.fontePrincipal, 'normal');
            doc.text(dataAssinatura, ESTILOS.larguraPagina / 2, y, { align: 'center' });
            y += 15;

            // Verificar espaço disponível
            const espacoNecessario = 80; // Espaço para assinaturas
            if (y + espacoNecessario > limiteInferior) {
                doc.addPage();
                y = ESTILOS.margemSuperior + 30;
            }

            // Bloco CONTRATADA
            doc.setDrawColor(...ESTILOS.corTexto);
            doc.setLineWidth(0.3);
            const larguraAssinatura = 70;
            const centroX = ESTILOS.larguraPagina / 2;

            doc.line(centroX - larguraAssinatura / 2, y, centroX + larguraAssinatura / 2, y);
            y += 4;
            doc.setFontSize(10);
            doc.setFont(ESTILOS.fontePrincipal, 'bold');
            doc.text(DADOS_ENTERFIX.razaoSocial, centroX, y, { align: 'center' });
            y += 4;
            doc.setFontSize(9);
            doc.setFont(ESTILOS.fontePrincipal, 'normal');
            doc.text(`CNPJ: ${DADOS_ENTERFIX.cnpj}`, centroX, y, { align: 'center' });
            y += 4;
            doc.setFontSize(10);
            doc.setFont(ESTILOS.fontePrincipal, 'bold');
            doc.text('CONTRATADA', centroX, y, { align: 'center' });
            y += 15;

            // Bloco CONTRATANTE
            doc.setDrawColor(...ESTILOS.corTexto);
            doc.line(centroX - larguraAssinatura / 2, y, centroX + larguraAssinatura / 2, y);
            y += 4;
            doc.setFontSize(10);
            doc.setFont(ESTILOS.fontePrincipal, 'bold');
            doc.text(cliente.razao_social, centroX, y, { align: 'center' });
            y += 4;
            doc.setFontSize(9);
            doc.setFont(ESTILOS.fontePrincipal, 'normal');
            doc.text(cliente.tipo_pessoa === 'juridica' ? `CNPJ: ${cliente.cnpj}` : `CPF: ${cliente.cpf}`, centroX, y, { align: 'center' });
            y += 4;
            doc.setFontSize(10);
            doc.setFont(ESTILOS.fontePrincipal, 'bold');
            doc.text('CONTRATANTE', centroX, y, { align: 'center' });
            y += 15;

            // TESTEMUNHAS (verificar espaço novamente)
            const espacoTestemunhas = 25;
            if (y + espacoTestemunhas > limiteInferior) {
                doc.addPage();
                y = ESTILOS.margemSuperior + 30;
            }

            doc.setFontSize(10);
            doc.setFont(ESTILOS.fontePrincipal, 'bold');
            doc.text('TESTEMUNHAS:', ESTILOS.margemEsquerda, y);
            y += 8;

            const larguraTeste = 65;
            const espacoEntreTestemunhas = 10;
            const testemunha1X = centroX - larguraTeste - espacoEntreTestemunhas / 2;
            const testemunha2X = centroX + espacoEntreTestemunhas / 2;

            // Testemunha 1
            doc.setDrawColor(...ESTILOS.corTexto);
            doc.line(testemunha1X, y, testemunha1X + larguraTeste, y);
            // Testemunha 2
            doc.line(testemunha2X, y, testemunha2X + larguraTeste, y);

            y += 4;
            doc.setFontSize(9);
            doc.setFont(ESTILOS.fontePrincipal, 'normal');
            doc.text('Nome:', testemunha1X, y);
            doc.text('Nome:', testemunha2X, y);
            y += 4;
            doc.text('CPF:', testemunha1X, y);
            doc.text('CPF:', testemunha2X, y);

            // ═══════════ RODAPÉS ═══════════
            const totalPaginas = doc.getNumberOfPages();
            for (let i = 1; i <= totalPaginas; i++) {
                doc.setPage(i);
                adicionarRodape(doc, i, totalPaginas);
                if (i > 1) { // Cabeçalho em todas exceto primeira
                    adicionarCabecalho(doc, dadosContrato.numero_contrato, dadosContrato.status);
                }
            }

            // ═══════════ FINALIZAR ═══════════
            const pdfBlob = doc.output('blob');
            const pdfBase64 = doc.output('dataurlstring');

            resolve({
                blob: pdfBlob,
                base64: pdfBase64,
                filename: `Contrato_${dadosContrato.numero_contrato}_${dadosContrato.cliente.razao_social.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
            });

        } catch (error) {
            console.error('Erro ao gerar PDF do contrato:', error);
            reject(error);
        }
    });
}

/**
 * Faz upload do PDF para Supabase Storage
 */
export async function uploadPDFContrato(supabase, pdfBlob, filename, contratoId) {
    try {
        const filePath = `contratos/${contratoId}/${filename}`;

        const {
            data,
            error
        } = await supabase.storage
            .from('contratos')
            .upload(filePath, pdfBlob, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) throw error;

        // Obter URL pública
        const {
            data: {
                publicUrl
            }
        } = supabase.storage
            .from('contratos')
            .getPublicUrl(filePath);

        return {
            path: data.path,
            publicUrl
        };

    } catch (error) {
        console.error('Erro ao fazer upload do PDF:', error);
        throw error;
    }
}

/**
 * Gera PDF e faz upload automaticamente
 */
export async function gerarEUploadPDFContrato(supabase, dadosContrato) {
    try {
        // 1. Gerar PDF
        const {
            blob,
            filename
        } = await gerarPDFContrato(dadosContrato);

        // 2. Upload para Supabase
        const {
            path,
            publicUrl
        } = await uploadPDFContrato(
            supabase,
            blob,
            filename,
            dadosContrato.id
        );

        // 3. Atualizar registro do contrato com URL do PDF
        const {
            error: updateError
        } = await supabase
            .from('contratos')
            .update({
                pdf_url: publicUrl
            })
            .eq('id', dadosContrato.id);

        if (updateError) throw updateError;

        return {
            success: true,
            url: publicUrl,
            filename
        };

    } catch (error) {
        console.error('Erro no processo de gerar e upload do PDF:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export default {
    gerarPDFContrato,
    uploadPDFContrato,
    gerarEUploadPDFContrato,
};