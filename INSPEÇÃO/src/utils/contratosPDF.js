/**
 * GERADOR DE PDFs DE CONTRATOS - ENTERFIX METROLOGIA
 * 
 * Gera contratos em PDF com formatação profissional,
 * todas as cláusulas legais e proteção jurídica adequada.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    FORO_COMPETENTE,
    CLAUSULAS_GERAIS,
    CLAUSULAS_ESPECIFICAS,
    gerarContratoCompleto
} from './clausulasContratuais';
import {
    buscarConfiguracoesEmpresa,
    getDadosEmpresaPadrao
} from './configuracoesEmpresa';

// ═══════════════════════════════════════════════════════════════════
// ESTILOS GLOBAIS - IMPORTADOS DO PADRÃO ENTERFIX
// ═══════════════════════════════════════════════════════════════════
import {
    LOGO_ENTERFIX,
    CORES,
    TIPOGRAFIA,
    LAYOUT,
    PRESET_CONTRATO,
    getLarguraUtil,
    getLimiteInferior,
    temEspacoNaPagina,
    getCentro,
    getMargemDireita
} from './shared/estilosPDF.js';

/**
 * Adiciona cabeçalho em todas as páginas
 */
function adicionarCabecalho(doc, numeroContrato, statusContrato) {
    // Logo da Enterfix (proporção de marca registrada)
    try {
        doc.addImage(
            LOGO_ENTERFIX.path,
            'PNG',
            LOGO_ENTERFIX.posicaoX,
            LOGO_ENTERFIX.posicaoY,
            LOGO_ENTERFIX.largura,
            LOGO_ENTERFIX.altura
        );
    } catch (error) {
        // Fallback: usar texto se logo não carregar
        console.warn('Logo não carregou, usando texto:', error);
        doc.setFontSize(14);
        doc.setFont(TIPOGRAFIA.fontePrincipal, 'bold');
        doc.setTextColor(...CORES.primaria);
        doc.text('ENTERFIX', LAYOUT.margens.esquerda, 15);
        doc.setFontSize(8);
        doc.setFont(TIPOGRAFIA.fontePrincipal, 'normal');
        doc.text('Metrologia e Calibração', LAYOUT.margens.esquerda, 19);
    }

    // Número do contrato (canto superior direito)
    doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
    doc.setTextColor(...CORES.texto);
    doc.text(`Contrato: ${numeroContrato}`, getMargemDireita(), 15, {
        align: 'right'
    });

    // Linha separadora ABAIXO do logo (corrige bug da linha passando sobre o logo)
    const linhaSeparadoraY = LOGO_ENTERFIX.posicaoY + LOGO_ENTERFIX.altura + 3;
    doc.setDrawColor(...CORES.primaria);
    doc.setLineWidth(LAYOUT.elementos.espessuraLinha);
    doc.line(LAYOUT.margens.esquerda, linhaSeparadoraY, getMargemDireita(), linhaSeparadoraY);

    // Marca d'água se for minuta
    if (statusContrato === 'minuta') {
        doc.setFontSize(60);
        doc.setTextColor(...CORES.textoClaro);
        doc.setFont(TIPOGRAFIA.fontePrincipal, 'bold');
        doc.text('MINUTA', getCentro(), LAYOUT.pagina.altura / 2, {
            angle: 45,
            align: 'center',
            baseline: 'middle'
        });
        doc.setTextColor(...CORES.texto);
        doc.setFont(TIPOGRAFIA.fontePrincipal, 'normal');
    }
}

/**
 * Adiciona rodapé em todas as páginas
 */
function adicionarRodape(doc, numeroPagina, totalPaginas, dadosEmpresa) {
    const y = LAYOUT.pagina.altura - 15;

    // Linha separadora
    doc.setDrawColor(...CORES.textoSecundario);
    doc.setLineWidth(0.3);
    doc.line(LAYOUT.margens.esquerda, y - 3, getMargemDireita(), y - 3);

    // Informações da empresa
    doc.setFontSize(TIPOGRAFIA.tamanhos.pequeno);
    doc.setTextColor(...CORES.textoSecundario);
    doc.setFont(TIPOGRAFIA.fontePrincipal, 'normal');

    const textoRodape = `${dadosEmpresa.razaoSocial} - CNPJ: ${dadosEmpresa.cnpj} - ${dadosEmpresa.cidade}/${dadosEmpresa.estado}`;
    doc.text(textoRodape, getCentro(), y, {
        align: 'center'
    });

    const contatoRodape = `Tel: ${dadosEmpresa.telefone} - Email: ${dadosEmpresa.email} - ${dadosEmpresa.website}`;
    doc.text(contatoRodape, getCentro(), y + 4, {
        align: 'center'
    });

    // Número da página
    doc.setFontSize(TIPOGRAFIA.tamanhos.pequeno);
    doc.text(`Página ${numeroPagina} de ${totalPaginas}`, getMargemDireita(), y, {
        align: 'right'
    });
}

/**
 * Adiciona parágrafo com quebra automática de linha
 */
function adicionarParagrafo(doc, texto, y, opcoes = {}) {
    const {
        tamanhoFonte = TIPOGRAFIA.tamanhos.corpo,
            estilo = 'normal',
            cor = CORES.texto,
            alinhamento = 'justify',
            recuo = 0
    } = opcoes;

    doc.setFontSize(tamanhoFonte);
    doc.setFont(PRESET_CONTRATO.fonte, estilo);
    doc.setTextColor(...cor);

    const larguraUtil = getLarguraUtil() - recuo;
    const linhas = doc.splitTextToSize(texto, larguraUtil);

    let yAtual = y;
    linhas.forEach((linha, index) => {
        // Verifica se precisa de nova página
        if (!temEspacoNaPagina(yAtual, 20)) {
            doc.addPage();
            yAtual = LAYOUT.margens.superior + LAYOUT.elementos.alturaCabecalho;
        }

        doc.text(linha, LAYOUT.margens.esquerda + recuo, yAtual, {
            align: alinhamento === 'justify' && index < linhas.length - 1 ? 'left' : alinhamento
        });
        yAtual += LAYOUT.espacamentos.entreLinhas;
    });

    return yAtual + 3; // Retorna próxima posição Y
}

/**
 * Adiciona título de seção
 */
function adicionarTituloSecao(doc, titulo, y) {
    doc.setFontSize(TIPOGRAFIA.tamanhos.h2);
    doc.setFont(PRESET_CONTRATO.fonte, 'bold');
    doc.setTextColor(...CORES.primaria);

    // Verifica se precisa de nova página
    if (!temEspacoNaPagina(y, 30)) {
        doc.addPage();
        y = LAYOUT.margens.superior + LAYOUT.elementos.alturaCabecalho;
    }

    doc.text(titulo, LAYOUT.margens.esquerda, y);

    // Linha decorativa
    const larguraTexto = doc.getTextWidth(titulo);
    doc.setDrawColor(...CORES.primaria);
    doc.setLineWidth(LAYOUT.elementos.espessuraLinha);
    doc.line(LAYOUT.margens.esquerda, y + 2, LAYOUT.margens.esquerda + larguraTexto, y + 2);

    doc.setTextColor(...CORES.texto);
    doc.setFont(PRESET_CONTRATO.fonte, 'normal');

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
 * @param {Object} dadosContrato - Dados do contrato
 * @param {Object} dadosEmpresa - Dados da empresa (opcional, busca do Supabase se não fornecido)
 * @param {Object} supabase - Cliente Supabase (opcional, necessário se dadosEmpresa não fornecido)
 */
export async function gerarPDFContrato(dadosContrato, dadosEmpresa = null, supabase = null) {
    try {
        // Buscar dados da empresa se não fornecidos
        if (!dadosEmpresa) {
            if (supabase) {
                dadosEmpresa = await buscarConfiguracoesEmpresa(supabase);
            } else {
                dadosEmpresa = getDadosEmpresaPadrao();
            }
        }

        return new Promise((resolve, reject) => {
            try {
                // Criar documento
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                let y = LAYOUT.margens.superior + LAYOUT.elementos.alturaCabecalho;

                // Adicionar cabeçalho
                adicionarCabecalho(doc, dadosContrato.numero_contrato, dadosContrato.status);

                // ═══════════ TÍTULO PRINCIPAL ═══════════
                doc.setFontSize(TIPOGRAFIA.tamanhos.h1);
                doc.setFont(PRESET_CONTRATO.fonte, 'bold');
                doc.setTextColor(...CORES.primaria);

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
                doc.text(titulo, getCentro(), y, {
                    align: 'center'
                });

                y += 8;
                doc.setFontSize(TIPOGRAFIA.tamanhos.h2);
                doc.text(`Nº ${dadosContrato.numero_contrato}`, getCentro(), y, {
                    align: 'center'
                });

                y += 10;
                doc.setDrawColor(...CORES.primaria);
                doc.setLineWidth(0.7);
                doc.line(LAYOUT.margens.esquerda, y, getMargemDireita(), y);

                y += 10;
                doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
                doc.setFont(PRESET_CONTRATO.fonte, 'normal');
                doc.setTextColor(...CORES.texto);

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
                const dadosContratada = `${dadosEmpresa.razaoSocial}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${dadosEmpresa.cnpj}, com sede em ${dadosEmpresa.endereco}, ${dadosEmpresa.cidade}/${dadosEmpresa.estado}, CEP ${dadosEmpresa.cep}, Inscrição Estadual nº ${dadosEmpresa.inscricaoEstadual}, neste ato representada na forma de seu contrato social.`;
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
                    y = LAYOUT.margens.superior + LAYOUT.elementos.alturaCabecalho;

                    // Título destacado
                    doc.setFontSize(TIPOGRAFIA.tamanhos.h2);
                    doc.setFont(PRESET_CONTRATO.fonte, 'bold');
                    doc.setTextColor(...CORES.primaria);
                    doc.text('CLÁUSULAS ESPECÍFICAS', getCentro(), y, {
                        align: 'center'
                    });
                    y += 8;

                    // Subtítulo com tipo de contrato
                    doc.setFontSize(TIPOGRAFIA.tamanhos.h3);
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
                    doc.text(titulosContratos[dadosContrato.tipo_contrato] || 'Disposições Específicas', getCentro(), y, {
                        align: 'center'
                    });

                    doc.setDrawColor(...CORES.primaria);
                    doc.setLineWidth(LAYOUT.elementos.espessuraLinha);
                    doc.line(LAYOUT.margens.esquerda, y + 2, getMargemDireita(), y + 2);

                    y += 10;
                    doc.setTextColor(...CORES.texto);
                    doc.setFont(PRESET_CONTRATO.fonte, 'normal');

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
                y = LAYOUT.margens.superior + LAYOUT.elementos.alturaCabecalho;

                const limiteInferior = getLimiteInferior();

                const encerramento = `E por estarem assim justas e contratadas, as partes assinam o presente contrato em 2 (duas) vias de igual teor e forma, na presença das testemunhas abaixo.`;
                const linhasEncerramento = doc.splitTextToSize(encerramento, getLarguraUtil());
                doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
                doc.setFont(PRESET_CONTRATO.fonte, 'italic');
                linhasEncerramento.forEach(linha => {
                    doc.text(linha, getCentro(), y, {
                        align: 'center'
                    });
                    y += 5;
                });
                y += 5;

                const dataAssinatura = `${dadosEmpresa.cidade}/${dadosEmpresa.estado}, ${dataExtenso(new Date().toISOString().split('T')[0])}.`;
                doc.setFont(PRESET_CONTRATO.fonte, 'normal');
                doc.text(dataAssinatura, getCentro(), y, {
                    align: 'center'
                });
                y += 15;

                // Verificar espaço disponível
                const espacoNecessario = 80; // Espaço para assinaturas
                if (!temEspacoNaPagina(y, espacoNecessario)) {
                    doc.addPage();
                    y = LAYOUT.margens.superior + LAYOUT.elementos.alturaCabecalho;
                }

                // Bloco CONTRATADA
                doc.setDrawColor(...CORES.texto);
                doc.setLineWidth(0.3);
                const larguraAssinatura = 70;
                const centroX = getCentro();

                doc.line(centroX - larguraAssinatura / 2, y, centroX + larguraAssinatura / 2, y);
                y += 4;
                doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
                doc.setFont(PRESET_CONTRATO.fonte, 'bold');
                doc.text(dadosEmpresa.razaoSocial, centroX, y, {
                    align: 'center'
                });
                y += 4;
                doc.setFontSize(TIPOGRAFIA.tamanhos.pequeno);
                doc.setFont(PRESET_CONTRATO.fonte, 'normal');
                doc.text(`CNPJ: ${dadosEmpresa.cnpj}`, centroX, y, {
                    align: 'center'
                });
                y += 4;
                doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
                doc.setFont(PRESET_CONTRATO.fonte, 'bold');
                doc.text('CONTRATADA', centroX, y, {
                    align: 'center'
                });
                y += 15;

                // Bloco CONTRATANTE
                doc.setDrawColor(...CORES.texto);
                doc.line(centroX - larguraAssinatura / 2, y, centroX + larguraAssinatura / 2, y);
                y += 4;
                doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
                doc.setFont(PRESET_CONTRATO.fonte, 'bold');
                doc.text(cliente.razao_social, centroX, y, {
                    align: 'center'
                });
                y += 4;
                doc.setFontSize(TIPOGRAFIA.tamanhos.pequeno);
                doc.setFont(PRESET_CONTRATO.fonte, 'normal');
                doc.text(cliente.tipo_pessoa === 'juridica' ? `CNPJ: ${cliente.cnpj}` : `CPF: ${cliente.cpf}`, centroX, y, {
                    align: 'center'
                });
                y += 4;
                doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
                doc.setFont(PRESET_CONTRATO.fonte, 'bold');
                doc.text('CONTRATANTE', centroX, y, {
                    align: 'center'
                });
                y += 15;

                // TESTEMUNHAS (verificar espaço novamente)
                const espacoTestemunhas = 25;
                if (!temEspacoNaPagina(y, espacoTestemunhas)) {
                    doc.addPage();
                    y = LAYOUT.margens.superior + LAYOUT.elementos.alturaCabecalho;
                }

                doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
                doc.setFont(PRESET_CONTRATO.fonte, 'bold');
                doc.text('TESTEMUNHAS:', LAYOUT.margens.esquerda, y);
                y += 8;

                const larguraTeste = 65;
                const espacoEntreTestemunhas = 10;
                const testemunha1X = centroX - larguraTeste - espacoEntreTestemunhas / 2;
                const testemunha2X = centroX + espacoEntreTestemunhas / 2;

                // Testemunha 1
                doc.setDrawColor(...CORES.texto);
                doc.line(testemunha1X, y, testemunha1X + larguraTeste, y);
                // Testemunha 2
                doc.line(testemunha2X, y, testemunha2X + larguraTeste, y);

                y += 4;
                doc.setFontSize(TIPOGRAFIA.tamanhos.pequeno);
                doc.setFont(PRESET_CONTRATO.fonte, 'normal');
                doc.text('Nome:', testemunha1X, y);
                doc.text('Nome:', testemunha2X, y);
                y += 4;
                doc.text('CPF:', testemunha1X, y);
                doc.text('CPF:', testemunha2X, y);

                // ═══════════ RODAPÉS ═══════════
                const totalPaginas = doc.getNumberOfPages();
                for (let i = 1; i <= totalPaginas; i++) {
                    doc.setPage(i);
                    adicionarRodape(doc, i, totalPaginas, dadosEmpresa);
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
    } catch (error) {
        console.error('Erro ao buscar configurações ou gerar PDF:', error);
        throw error;
    }
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
        // 1. Buscar dados da empresa
        const dadosEmpresa = await buscarConfiguracoesEmpresa(supabase);

        // 2. Gerar PDF
        const {
            blob,
            filename
        } = await gerarPDFContrato(dadosContrato, dadosEmpresa, supabase);

        // 3. Upload para Supabase
        const {
            path,
            publicUrl
        } = await uploadPDFContrato(
            supabase,
            blob,
            filename,
            dadosContrato.id
        );

        // 4. Atualizar registro do contrato com URL do PDF
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