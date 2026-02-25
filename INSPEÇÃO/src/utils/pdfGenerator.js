import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    formatMetrologicalValue,
    formatDate
} from './metrologyUtils';

// Logo Enterfix em Base64 (cache)
let enterfixLogoBase64 = null;
let enterfixLogoAspectRatio = 3.5; // Proporção padrão (largura/altura)

/**
 * Carrega configurações da empresa do localStorage
 */
const getEmpresaConfig = () => {
    try {
        const savedConfig = localStorage.getItem('enterfix_config');
        if (savedConfig) {
            return JSON.parse(savedConfig);
        }
    } catch (error) {
        console.warn('Erro ao carregar configurações da empresa:', error);
    }

    // Valores padrão caso não existam configurações
    return {
        nomeEmpresa: 'Enterfix Metrologia Industrial',
        cnpj: '',
        endereco: '',
        telefone: '',
        email: 'contato@enterfix.com.br',
        website: 'www.enterfix.com.br'
    };
};

/**
 * Carrega o logo da Enterfix e calcula sua proporção
 */
const loadEnterfixLogo = async () => {
    if (enterfixLogoBase64) return enterfixLogoBase64;

    try {
        const response = await fetch('/assets/images/LOGO_ENTERFIX_LIGHT.png');
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                enterfixLogoBase64 = reader.result;

                // Calcular proporção da imagem
                const img = new Image();
                img.onload = () => {
                    enterfixLogoAspectRatio = img.width / img.height;
                    resolve(enterfixLogoBase64);
                };
                img.onerror = () => {
                    resolve(enterfixLogoBase64); // Usar proporção padrão em caso de erro
                };
                img.src = enterfixLogoBase64;
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn('Logo não carregado:', error);
        return null;
    }
};

/**
 * Desenha o cabeçalho Clean/Minimalista (fundo branco)
 */
const drawModernHeader = (doc, pageWidth, dados, logoBase64) => {
    // Logo ou Texto (sem fundo escuro)
    if (logoBase64) {
        try {
            // Usar proporção calculada para manter integridade da imagem
            const logoHeight = 18;
            const logoWidth = logoHeight * enterfixLogoAspectRatio;

            doc.addImage(logoBase64, 'PNG', 14, 10, logoWidth, logoHeight);
        } catch {
            drawTextLogo(doc);
        }
    } else {
        drawTextLogo(doc);
    }

    // Título do relatório (preto)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const titulo = dados.tipo === 'FABRICACAO' ?
        'RELATÓRIO DE FABRICAÇÃO' :
        'RELATÓRIO DE CALIBRAÇÃO';
    doc.text(titulo, pageWidth / 2, 20, {
        align: 'center'
    });

    // Info do relatório (cinza escuro)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Nº: ${dados.numeroRelatorio}`, pageWidth - 14, 20, {
        align: 'right'
    });
    doc.text(`Data: ${formatDate(dados.data)}`, pageWidth - 14, 26, {
        align: 'right'
    });

    // Linha azul fina de separação (Enterfix Blue)
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(14, 35, pageWidth - 14, 35);

    return 42;
};

/**
 * Fallback para logo em texto (sem fundo)
 */
const drawTextLogo = (doc) => {
    doc.setTextColor(37, 99, 235); // Azul Enterfix
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ENTERFIX', 16, 22);
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('Metrologia Industrial', 16, 28);
};

/**
 * Desenha título de seção Clean
 */
const drawSection = (doc, yPos, pageWidth, title) => {
    // Título da seção (preto, bold)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(title, 14, yPos + 5);

    // Linha azul fina horizontal
    doc.setDrawColor(37, 99, 235); // Azul Enterfix
    doc.setLineWidth(0.5);
    doc.line(14, yPos + 8, pageWidth - 14, yPos + 8);

    return yPos + 12;
};

/**
 * Desenha campo de informação Clean
 */
const drawInfoField = (doc, x, y, label, value, width = 85) => {
    // Label em cinza escuro
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(label + ':', x, y);

    // Valor em preto
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const valueText = doc.splitTextToSize(value || 'N/A', width);
    doc.text(valueText, x, y + 4);

    return y + 4 + (valueText.length * 4);
};

/**
 * Desenha rodapé Clean
 */
const drawModernFooter = (doc, pageWidth, pageHeight, pageNum, totalPages, empresaConfig) => {
    const footerY = pageHeight - 20;

    // Linha superior fina
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    // Esquerda: Empresa (usar configurações dinâmicas)
    const nomeEmpresa = empresaConfig.nomeEmpresa || 'Enterfix Metrologia Industrial';
    const website = empresaConfig.website || 'www.enterfix.com.br';
    const email = empresaConfig.email || 'contato@enterfix.com.br';

    doc.text(nomeEmpresa, 14, footerY);
    doc.text(`${website} | ${email}`, 14, footerY + 4);

    // Centro: Número da página
    doc.setFont('helvetica', 'bold');
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth / 2, footerY + 2, {
        align: 'center'
    });

    // Direita: Data de emissão
    doc.setFont('helvetica', 'normal');
    doc.text('Emitido em:', pageWidth - 14, footerY, {
        align: 'right'
    });
    doc.text(formatDate(new Date()), pageWidth - 14, footerY + 4, {
        align: 'right'
    });
};

/**
 * Gera PDF para Certificado Técnico de Reparo de Apalpadores
 */
const generateReparoApalpadorPDF = async (dados) => {
    // Validação de dados obrigatórios
    if (!dados.dadosReparo) {
        console.error('Erro: dadosReparo não está definido', dados);
        throw new Error('Dados de reparo não encontrados. Certifique-se de preencher todos os campos obrigatórios.');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoBase64 = await loadEnterfixLogo();
    const empresaConfig = getEmpresaConfig();

    // Cabeçalho modificado para Certificado de Reparo
    if (logoBase64) {
        try {
            const logoHeight = 18;
            const logoWidth = logoHeight * enterfixLogoAspectRatio;
            doc.addImage(logoBase64, 'PNG', 14, 10, logoWidth, logoHeight);
        } catch {
            drawTextLogo(doc);
        }
    } else {
        drawTextLogo(doc);
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICADO TÉCNICO DE REPARO', pageWidth / 2, 20, {
        align: 'center'
    });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Apalpadores de Máquinas de Medição por Coordenadas', pageWidth / 2, 27, {
        align: 'center'
    });

    // Número do Relatório e Data (canto superior direito)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nº: ${dados.numeroRelatorio}`, pageWidth - 14, 15, {
        align: 'right'
    });
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${formatDate(new Date(dados.data))}`, pageWidth - 14, 20, {
        align: 'right'
    });

    let yPosition = 40;

    // IDENTIFICAÇÃO
    yPosition = drawSection(doc, yPosition, pageWidth, 'IDENTIFICAÇÃO');

    const colWidth = (pageWidth - 34) / 2;
    let leftY = yPosition;
    let rightY = yPosition;

    leftY = drawInfoField(doc, 14, leftY, 'Cliente', dados.cliente, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY, 'OS/Projeto', dados.projetoOS, colWidth - 5);

    leftY = drawInfoField(doc, 14, leftY + 3, 'Modelo/Equipamento', dados.numeroDesenho, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY + 3, 'Nº de Série', dados.revisao, colWidth - 5);

    leftY = drawInfoField(doc, 14, leftY + 3, 'Token de Verificação', dados.dadosReparo.tokenVerificacao, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY + 3, 'Data', formatDate(new Date(dados.data)), colWidth - 5);

    yPosition = Math.max(leftY, rightY) + 5;

    // Selo de Resultado (APROVADO/REPROVADO)
    const resultadoFinal = dados.parecerFinal || dados.status_final || 'APROVADO';
    const isAprovado = resultadoFinal === 'APROVADO';
    const seloColor = isAprovado ? [34, 197, 94] : [239, 68, 68]; // green-500 : red-500
    const seloTextColor = [255, 255, 255];

    doc.setFillColor(...seloColor);
    doc.roundedRect(14, yPosition, 60, 10, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...seloTextColor);
    doc.text(resultadoFinal, 44, yPosition + 6.5, {
        align: 'center'
    });
    doc.setTextColor(0, 0, 0);

    yPosition += 18;

    // PREFÁCIO E NORMAS TÉCNICAS
    yPosition = drawSection(doc, yPosition, pageWidth, 'PREFÁCIO E NORMAS TÉCNICAS');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);

    const prefacioTexto = [
        'Este certificado atesta que o equipamento listado foi inspecionado, testado e reparado de acordo com',
        'os mais rigorosos padrões de qualidade da Enterfix, em conformidade com as normas técnicas aplicáveis.',
        'Todos os procedimentos seguem nosso sistema de qualidade registrado para BS EN ISO 9001:2000.'
    ];

    prefacioTexto.forEach((linha, i) => {
        doc.text(linha, 14, yPosition + (i * 4), {
            maxWidth: pageWidth - 28
        });
    });
    yPosition += 18;

    doc.setFont('helvetica', 'bold');
    doc.text('Disclaimer:', 14, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 4;

    const disclaimerTexto = [
        'Os resultados apresentados são válidos para as condições de teste no momento da emissão deste certificado.',
        'A Enterfix não se responsabiliza por danos ou falhas decorrentes de mau uso, instalação inadequada ou',
        'intervenções não autorizadas após a entrega do equipamento.'
    ];

    disclaimerTexto.forEach((linha, i) => {
        doc.text(linha, 14, yPosition + (i * 4), {
            maxWidth: pageWidth - 28
        });
    });
    yPosition += 18;

    // NORMAS E REFERÊNCIAS
    yPosition = drawSection(doc, yPosition, pageWidth, 'NORMAS E REFERÊNCIAS');

    leftY = yPosition;
    rightY = yPosition;

    leftY = drawInfoField(doc, 14, leftY, 'Norma Aplicável', dados.dadosReparo.normaISO, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY, 'Referência ISO', dados.dadosReparo.referenciaISO9001, colWidth - 5);

    leftY = drawInfoField(doc, 14, leftY + 3, 'Referência ABNT', dados.dadosReparo.referenciaABNT, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY + 3, 'Técnico', dados.tecnico, colWidth - 5);

    yPosition = Math.max(leftY, rightY) + 10;

    // TESTES DE DESVIO
    yPosition = drawSection(doc, yPosition, pageWidth, 'RESULTADOS DOS TESTES DE DESVIO');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(60, 60, 60);
    doc.text('Critério de Aceitação: Conforme ABNT NBR ISO 12110-1, desvios devem estar dentro dos limites máximo e mínimo.', 14, yPosition);
    yPosition += 4;
    doc.setFontSize(7);
    doc.text('Valores calculados automaticamente com base no teste de repetibilidade (2σ por direção).', 14, yPosition);
    yPosition += 7;

    const desvioData = dados.dadosReparo.testesDesvio.map(teste => {
        const desvioPos = parseFloat(teste.desvioPos);
        const desvioNeg = parseFloat(teste.desvioNeg);
        const limiteMax = parseFloat(teste.limiteMax);
        const limiteMin = parseFloat(teste.limiteMin);

        // Z não tem desvio positivo
        const statusOK = teste.eixo === 'Z' ?
            (!isNaN(desvioNeg) && desvioNeg >= limiteMin) :
            (!isNaN(desvioPos) && !isNaN(desvioNeg) && desvioPos <= limiteMax && desvioNeg >= limiteMin);

        return [
            teste.eixo,
            teste.eixo === 'Z' ? '-' : formatMetrologicalValue(teste.desvioPos),
            formatMetrologicalValue(teste.desvioNeg),
            formatMetrologicalValue(teste.limiteMax),
            formatMetrologicalValue(teste.limiteMin),
            statusOK ? 'Padrão' : 'Fora'
        ];
    });

    doc.autoTable({
        startY: yPosition,
        head: [
            ['Eixo', 'Desvio +\n(mm)', 'Desvio -\n(mm)', 'Limite\nMáx.', 'Limite\nMín.', 'Padrão']
        ],
        body: desvioData,
        theme: 'grid',
        headStyles: {
            fillColor: [245, 245, 245],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'center',
            cellPadding: 4
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [0, 0, 0],
            cellPadding: 3
        },
        columnStyles: {
            0: {
                halign: 'center',
                cellWidth: 20,
                fillColor: [250, 250, 250]
            },
            1: {
                halign: 'center',
                cellWidth: 28,
                fillColor: [230, 255, 230]
            },
            2: {
                halign: 'center',
                cellWidth: 28,
                fillColor: [230, 255, 230]
            },
            3: {
                halign: 'center',
                cellWidth: 25
            },
            4: {
                halign: 'center',
                cellWidth: 25
            },
            5: {
                halign: 'center',
                cellWidth: 30,
                fontStyle: 'bold'
            }
        }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // REPETIBILIDADE QA319
    if (yPosition > pageHeight - 120) {
        doc.addPage();
        yPosition = 20;
    }

    yPosition = drawSection(doc, yPosition, pageWidth, 'TESTE DE REPETIBILIDADE (QA319)');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('50 pontos de toque (10 em cada direção: +X, -X, +Y, -Y, -Z)', 14, yPosition);
    yPosition += 5;

    // Tabela de Pontos de Toque
    const repetibilidadeTableData = [];
    for (let i = 0; i < 10; i++) {
        repetibilidadeTableData.push([
            i + 1,
            formatMetrologicalValue(dados.dadosReparo.repetibilidade.pontosX_positivo[i] || '-'),
            formatMetrologicalValue(dados.dadosReparo.repetibilidade.pontosX_negativo[i] || '-'),
            formatMetrologicalValue(dados.dadosReparo.repetibilidade.pontosY_positivo[i] || '-'),
            formatMetrologicalValue(dados.dadosReparo.repetibilidade.pontosY_negativo[i] || '-'),
            formatMetrologicalValue(dados.dadosReparo.repetibilidade.pontosZ_negativo[i] || '-')
        ]);
    }

    doc.autoTable({
        startY: yPosition,
        head: [
            ['Ponto', '+X', '-X', '+Y', '-Y', '-Z']
        ],
        body: repetibilidadeTableData,
        theme: 'grid',
        headStyles: {
            fillColor: [245, 245, 245],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
            cellPadding: 2
        },
        bodyStyles: {
            fontSize: 7,
            textColor: [0, 0, 0],
            cellPadding: 2,
            halign: 'center'
        },
        columnStyles: {
            0: {
                cellWidth: 15,
                fillColor: [250, 250, 250],
                fontStyle: 'bold'
            }
        }
    });

    yPosition = doc.lastAutoTable.finalY + 8;

    // Fórmula do Cálculo
    doc.setFillColor(240, 248, 255);
    doc.rect(14, yPosition, pageWidth - 28, 14, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(40, 40, 40);
    doc.text('Fórmula: 2σ = 2 × √[Σ(Xi - X̄)² / (n-1)]', 18, yPosition + 5);
    doc.setFont('helvetica', 'normal');
    doc.text('Critério: 2σ ≤ 0.005mm (5μm) com confiabilidade de 95%', 18, yPosition + 10);
    yPosition += 18;

    // MÉTODOS DE TESTE E ANÁLISE
    if (yPosition > pageHeight - 80) {
        doc.addPage();
        yPosition = 20;
    }

    yPosition = drawSection(doc, yPosition, pageWidth, 'MÉTODOS DE TESTE E ANÁLISE DE RESULTADOS');

    const metodosInfo = [{
            titulo: 'Teste de Repetibilidade (Repeatability Test)',
            texto: 'O teste segue o procedimento QA319, parte do nosso sistema de qualidade registrado para BS EN ISO 9001:2000. ' +
                'Os apalpadores são montados verticalmente em uma giga de teste específica e os testes são executados no plano X-Y ' +
                'de referência. A repetibilidade é analisada pelo desvio padrão 2σ, com n=10 e confiabilidade de 95%.'
        },
        {
            titulo: 'Comunicação',
            texto: 'Garantimos a eficiência da comunicação por meio de testes em interfaces a cabo, ópticas (legacy/modulate) e de rádio.'
        },
        {
            titulo: 'Força de Trigger',
            texto: 'Verificamos a força de acionamento (trigger force) em Newtons, conforme especificações do fabricante para cada modelo.'
        },
        {
            titulo: 'Estanqueidade',
            texto: 'Certificamos a estanqueidade de apalpadores projetados para ambientes com líquidos refrigerantes.'
        },
        {
            titulo: 'Módulo Knemático',
            texto: 'Avaliamos e ajustamos o módulo knemático para garantir o alinhamento correto e o funcionamento perfeito do apalpador.'
        },
        {
            titulo: 'Danos Estruturais',
            texto: 'Inspecionamos e corrigimos danos externos e estruturais causados por colisões ou uso excessivo.'
        },
        {
            titulo: 'Capacidade de Toque',
            texto: 'Realizamos 50 toques a cada 6° de rotação (360°). A aprovação depende da quantidade e dispersão de erros.'
        }
    ];

    doc.setFontSize(8);
    metodosInfo.forEach((metodo, i) => {
        // Calcular altura necessária ANTES de renderizar
        const linhasTexto = doc.splitTextToSize(metodo.texto, pageWidth - 28);
        const alturaItemCompleto = 4 + (linhasTexto.length * 4) + 2; // título + texto + espaçamento

        // Verificar se o item COMPLETO cabe na página atual
        if (yPosition + alturaItemCompleto > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
        }

        // Agora é seguro renderizar o item completo
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(metodo.titulo, 14, yPosition);
        yPosition += 4;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        doc.text(linhasTexto, 14, yPosition);
        yPosition += linhasTexto.length * 4 + 2;
    });

    yPosition += 5;

    // CHECKLIST DE INSPEÇÃO
    // Calcular altura estimada: título (15mm) + tabela (6 linhas × 10mm) + margem
    const alturaEstimadaChecklist = 15 + (6 * 10) + 10; // ~85mm

    if (yPosition + alturaEstimadaChecklist > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
    }

    yPosition = drawSection(doc, yPosition, pageWidth, 'CHECKLIST DE INSPEÇÃO VISUAL E FUNCIONAL');

    const checklist = dados.dadosReparo.checklist;

    // Construir texto de comunicação com status OK
    const tiposComunicacao = [
        checklist.comunicacao.radio ? 'Rádio' : '',
        checklist.comunicacao.optica ? 'Óptica' : '',
        checklist.comunicacao.cabo ? 'Cabo' : ''
    ].filter(t => t).join(', ');

    const comunicacaoStatus = tiposComunicacao ? `OK - ${tiposComunicacao}` : 'NOK';

    const checklistData = [
        ['Estanqueidade', checklist.estanqueidade ? 'OK' : 'NOK'],
        ['Módulo Cinemático', checklist.moduloCinematico ? 'OK' : 'NOK'],
        ['Força de Trigger', checklist.forcaTrigger ? 'OK' : 'NOK'],
        ['Danos Estruturais', checklist.danosEstruturais ? 'OK' : 'NOK'],
        ['Capacidade de Toque', checklist.capacidadeToque ? 'OK' : 'NOK'],
        ['Comunicação', comunicacaoStatus]
    ];

    doc.autoTable({
        startY: yPosition,
        body: checklistData,
        theme: 'grid',
        bodyStyles: {
            fontSize: 9,
            textColor: [0, 0, 0],
            cellPadding: 4
        },
        columnStyles: {
            0: {
                halign: 'left',
                cellWidth: 80
            },
            1: {
                halign: 'center',
                cellWidth: 'auto'
            }
        },
        didParseCell: function (data) {
            // Aplicar estilo apenas na coluna de status (coluna 1)
            if (data.column.index === 1 && data.section === 'body') {
                const cellText = data.cell.text[0];

                if (cellText.startsWith('OK')) {
                    // Estilo para OK: fundo verde claro, texto verde escuro, negrito
                    data.cell.styles.fillColor = [220, 255, 220];
                    data.cell.styles.textColor = [0, 128, 0];
                    data.cell.styles.fontStyle = 'bold';
                } else if (cellText === 'NOK') {
                    // Estilo para NOK: fundo vermelho claro, texto vermelho escuro, negrito
                    data.cell.styles.fillColor = [255, 220, 220];
                    data.cell.styles.textColor = [200, 0, 0];
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // OBSERVAÇÕES (se houver)
    if (dados.observacoes && dados.observacoes.trim()) {
        if (yPosition > pageHeight - 70) {
            doc.addPage();
            yPosition = 20;
        }

        yPosition = drawSection(doc, yPosition, pageWidth, 'OBSERVAÇÕES TÉCNICAS');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const observacoesLines = doc.splitTextToSize(dados.observacoes, pageWidth - 32);
        doc.text(observacoesLines, 16, yPosition);
        yPosition += observacoesLines.length * 4.5 + 10;
    }

    // FOTOS ANEXADAS (se houver)
    if (dados.fotos && dados.fotos.length > 0) {
        // Filtrar apenas fotos válidas (não vazias e com conteúdo base64)
        const fotosValidas = dados.fotos.filter(foto =>
            foto &&
            typeof foto === 'string' &&
            foto.trim() !== '' &&
            foto.startsWith('data:image/')
        );

        // Só renderizar se houver fotos válidas
        if (fotosValidas.length > 0) {
            // Altura padrão fixa com proporção 4:3
            const fotoHeight = 55; // mm - altura padrão
            const fotoWidth = fotoHeight * (4 / 3); // 73.33mm - proporção 4:3
            const espacamentoHorizontal = 8;
            const espacamentoVertical = 10;

            // Verificar quantas fotos cabem por linha com essa largura
            const fotosPerRow = Math.floor((pageWidth - 28) / (fotoWidth + espacamentoHorizontal)) || 1;

            // Calcular altura necessária para o título da seção
            const alturaTituloSecao = 15;

            // Verificar se cabe pelo menos título + uma linha de fotos
            const alturaPrimeiraLinha = alturaTituloSecao + fotoHeight + espacamentoVertical;
            if (yPosition + alturaPrimeiraLinha > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }

            yPosition = drawSection(doc, yPosition, pageWidth, 'FOTOS ANEXADAS');

            let currentRow = 0;
            for (let i = 0; i < fotosValidas.length; i++) {
                const col = i % fotosPerRow;
                const row = Math.floor(i / fotosPerRow);

                // Se mudou de linha, verificar se a nova linha cabe na página
                if (row > currentRow) {
                    const alturaNovaLinha = fotoHeight + espacamentoVertical;
                    if (yPosition + alturaNovaLinha > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                        currentRow = 0;
                    } else {
                        currentRow = row;
                    }
                }

                const xPos = 14 + (col * (fotoWidth + espacamentoHorizontal));
                const yPos = yPosition + ((row - (row > currentRow ? currentRow : 0)) * (fotoHeight + espacamentoVertical));

                try {
                    // Detectar formato automaticamente do data URL
                    const fotoData = fotosValidas[i];
                    let formato = 'JPEG'; // padrão

                    if (fotoData.includes('data:image/png')) {
                        formato = 'PNG';
                    } else if (fotoData.includes('data:image/jpeg') || fotoData.includes('data:image/jpg')) {
                        formato = 'JPEG';
                    } else if (fotoData.includes('data:image/webp')) {
                        formato = 'WEBP';
                    }

                    doc.addImage(fotoData, formato, xPos, yPos, fotoWidth, fotoHeight);
                } catch (error) {
                    console.error('Erro ao adicionar foto', i, ':', error);
                    // Desenhar placeholder indicando erro
                    doc.setDrawColor(200, 200, 200);
                    doc.setFillColor(245, 245, 245);
                    doc.rect(xPos, yPos, fotoWidth, fotoHeight, 'FD');
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text('Erro ao carregar', xPos + fotoWidth / 2, yPos + fotoHeight / 2, {
                        align: 'center'
                    });
                }
            }

            // Atualizar posição Y após todas as fotos
            const totalRows = Math.ceil(fotosValidas.length / fotosPerRow);
            yPosition += totalRows * (fotoHeight + espacamentoVertical) + 5;
        }
    }

    // PARECER FINAL
    if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
    }

    const parecerFinal = dados.status_final || 'APROVADO';
    const parecerColor = parecerFinal === 'APROVADO' ? [220, 255, 220] : [255, 220, 220];
    const parecerTextColor = parecerFinal === 'APROVADO' ? [0, 128, 0] : [200, 0, 0];

    doc.setFillColor(...parecerColor);
    doc.rect(14, yPosition, pageWidth - 28, 20, 'F');

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.rect(14, yPosition, pageWidth - 28, 20);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...parecerTextColor);
    doc.text(`VALIDAÇÃO TÉCNICA: ${parecerFinal}`, pageWidth / 2, yPosition + 12, {
        align: 'center'
    });

    yPosition += 30;

    // ASSINATURA
    const assinaturaX = pageWidth / 2;
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(assinaturaX - 40, yPosition + 15, assinaturaX + 40, yPosition + 15);

    yPosition += 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(dados.tecnico || 'Técnico Responsável', assinaturaX, yPosition, {
        align: 'center'
    });

    yPosition += 4;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Técnico Responsável - Enterfix Metrologia', assinaturaX, yPosition, {
        align: 'center'
    });

    // RODAPÉ
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawModernFooter(doc, pageWidth, pageHeight, i, totalPages, empresaConfig);
    }

    // SALVAR
    const nomeArquivo = `CertificadoReparo_${dados.numeroRelatorio}_${dados.cliente.replace(/\s+/g, '_')}.pdf`;
    doc.save(nomeArquivo);
};

/**
 * Gera PDF com design moderno
 */
export const generatePDF = async (dados) => {
    // Se for Certificado de Reparo de Apalpadores, usar gerador específico
    if (dados.tipo === 'REPARO_APALPADOR') {
        return generateReparoApalpadorPDF(dados);
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoBase64 = await loadEnterfixLogo();
    const empresaConfig = getEmpresaConfig();

    let yPosition = drawModernHeader(doc, pageWidth, dados, logoBase64);
    yPosition += 5;

    // IDENTIFICAÇÃO DO CLIENTE
    yPosition = drawSection(doc, yPosition, pageWidth, 'IDENTIFICAÇÃO DO CLIENTE');

    const colWidth = (pageWidth - 34) / 2;
    let leftY = yPosition;
    let rightY = yPosition;

    leftY = drawInfoField(doc, 14, leftY, 'Cliente', dados.cliente, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY,
        dados.tipo === 'FABRICACAO' ? 'Nº da OP' : 'OS/Projeto',
        dados.projetoOS, colWidth - 5);

    leftY = drawInfoField(doc, 14, leftY + 3,
        dados.tipo === 'FABRICACAO' ? 'Código da Peça' : 'Modelo da Esfera',
        dados.numeroDesenho, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY + 3,
        dados.tipo === 'FABRICACAO' ? 'Revisão' : 'Nº de Série',
        dados.revisao, colWidth - 5);

    yPosition = Math.max(leftY, rightY) + 5;

    if (dados.tipo === 'FABRICACAO') {
        leftY = yPosition;
        rightY = yPosition;

        leftY = drawInfoField(doc, 14, leftY, 'Material', dados.material, colWidth - 5);
        rightY = drawInfoField(doc, 14 + colWidth + 6, rightY, 'Lote', dados.lote, colWidth - 5);

        leftY = drawInfoField(doc, 14, leftY + 3, 'Dureza', dados.dureza || 'N/A', colWidth - 5);
        if (dados.quantidade) {
            rightY = drawInfoField(doc, 14 + colWidth + 6, rightY + 3, 'Quantidade', dados.quantidade, colWidth - 5);
        }

        yPosition = Math.max(leftY, rightY) + 8;
    }

    if (dados.tipo === 'CALIBRACAO') {
        leftY = yPosition;
        rightY = yPosition;

        leftY = drawInfoField(doc, 14, leftY, 'Temperatura',
            dados.temperatura ? dados.temperatura + ' °C' : 'N/A', colWidth - 5);
        rightY = drawInfoField(doc, 14 + colWidth + 6, rightY, 'Umidade',
            dados.umidade ? dados.umidade + ' %' : 'N/A', colWidth - 5);

        yPosition = Math.max(leftY, rightY) + 8;
    }

    // CONDIÇÕES DE MEDIÇÃO
    yPosition = drawSection(doc, yPosition, pageWidth, 'CONDIÇÕES DE MEDIÇÃO');

    leftY = yPosition;
    rightY = yPosition;

    leftY = drawInfoField(doc, 14, leftY, 'Equipamento Utilizado', dados.equipamento, colWidth - 5);
    rightY = drawInfoField(doc, 14 + colWidth + 6, rightY, 'Técnico Responsável', dados.tecnico, colWidth - 5);

    yPosition = Math.max(leftY, rightY) + 10;

    // TABELA DE MEDIÇÕES
    yPosition = drawSection(doc, yPosition, pageWidth, 'RESULTADOS DAS MEDIÇÕES');

    // Verificar se alguma medição tem equipamento específico
    const temEquipamentoEspecifico = dados.medicoes.some(med => med.equipamento);

    const tableData = dados.medicoes.map((med, index) => {
        const row = [
            index + 1,
            med.descricao || '-',
            formatMetrologicalValue(med.nominal),
            formatMetrologicalValue(med.tolPos),
            formatMetrologicalValue(med.tolNeg),
            formatMetrologicalValue(med.medido),
            med.status || '-'
        ];

        // Se tem equipamento específico, adicionar coluna
        if (temEquipamentoEspecifico) {
            row.splice(2, 0, med.equipamento || dados.equipamento || '-');
        }

        return row;
    });

    const tableHeaders = temEquipamentoEspecifico ? ['#', 'Descrição', 'Equipamento', 'Nominal', 'Tol. (+)', 'Tol. (-)', 'Medido', 'Status'] : ['#', 'Descrição', 'Nominal', 'Tol. (+)', 'Tol. (-)', 'Medido', 'Status'];

    doc.autoTable({
        startY: yPosition,
        head: [
            tableHeaders
        ],
        body: tableData,
        theme: 'grid', // Grid clean para impressão
        headStyles: {
            fillColor: [245, 245, 245], // Cinza muito claro
            textColor: [0, 0, 0], // Preto
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'center',
            cellPadding: 4,
            lineWidth: 0.1,
            lineColor: [200, 200, 200]
        },
        bodyStyles: {
            fontSize: 8,
            textColor: [0, 0, 0], // Preto
            cellPadding: 3,
            lineWidth: 0.1,
            lineColor: [200, 200, 200] // Linhas finas cinza
        },
        columnStyles: temEquipamentoEspecifico ? {
            0: {
                halign: 'center',
                cellWidth: 10
            },
            1: {
                halign: 'left',
                cellWidth: 'auto'
            },
            2: {
                halign: 'left',
                cellWidth: 40
            },
            3: {
                halign: 'center',
                cellWidth: 20
            },
            4: {
                halign: 'center',
                cellWidth: 18
            },
            5: {
                halign: 'center',
                cellWidth: 18
            },
            6: {
                halign: 'center',
                cellWidth: 20
            },
            7: {
                halign: 'center',
                cellWidth: 18
            }
        } : {
            0: {
                halign: 'center',
                cellWidth: 10
            },
            1: {
                halign: 'left',
                cellWidth: 'auto'
            },
            2: {
                halign: 'center',
                cellWidth: 24
            },
            3: {
                halign: 'center',
                cellWidth: 20
            },
            4: {
                halign: 'center',
                cellWidth: 20
            },
            5: {
                halign: 'center',
                cellWidth: 24
            },
            6: {
                halign: 'center',
                cellWidth: 20
            }
        },
        didParseCell: (data) => {
            // Índice de status muda se tem coluna de equipamento
            const statusColumnIndex = temEquipamentoEspecifico ? 7 : 6;
            if (data.column.index === statusColumnIndex && data.section === 'body') {
                const status = data.cell.raw;
                if (status === 'OK') {
                    data.cell.styles.textColor = [22, 101, 52]; // Verde escuro
                    data.cell.styles.fontStyle = 'bold';
                } else if (status === 'NOK') {
                    data.cell.styles.textColor = [153, 27, 27]; // Vermelho escuro
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },
        margin: {
            left: 14,
            right: 14
        }
    });

    yPosition = doc.lastAutoTable.finalY + 12;

    // OBSERVAÇÕES (se houver)
    if (dados.observacoes && dados.observacoes.trim()) {
        if (yPosition > pageHeight - 70) {
            doc.addPage();
            yPosition = 20;
        }

        yPosition = drawSection(doc, yPosition, pageWidth, 'OBSERVAÇÕES');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0); // Preto para legibilidade
        const observacoesLines = doc.splitTextToSize(dados.observacoes, pageWidth - 32);
        doc.text(observacoesLines, 16, yPosition);
        yPosition += observacoesLines.length * 4.5 + 10;
    }

    // PARECER FINAL (apenas borda colorida, fundo branco)
    if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
    }

    const parecerColor = dados.parecerFinal === 'APROVADO' ? [34, 197, 94] : [239, 68, 68];

    // Apenas borda colorida (sem fundo)
    doc.setDrawColor(...parecerColor);
    doc.setLineWidth(1.5);
    doc.roundedRect(14, yPosition, pageWidth - 28, 18, 2, 2, 'S');

    // Texto do parecer
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Label em preto
    doc.text('PARECER FINAL:', 20, yPosition + 8);

    // Status em cor
    doc.setFontSize(14);
    doc.setTextColor(...parecerColor);
    doc.text(dados.parecerFinal, pageWidth / 2, yPosition + 12, {
        align: 'center'
    });

    yPosition += 25;

    // FOTOS ANEXADAS (se houver)
    if (dados.fotos && dados.fotos.length > 0) {
        // Filtrar apenas fotos válidas (não vazias e com conteúdo base64)
        const fotosValidas = dados.fotos.filter(foto =>
            foto &&
            typeof foto === 'string' &&
            foto.trim() !== '' &&
            foto.startsWith('data:image/')
        );

        // Só renderizar se houver fotos válidas
        if (fotosValidas.length > 0) {
            // Altura padrão fixa com proporção 4:3
            const fotoHeight = 55; // mm - altura padrão
            const fotoWidth = fotoHeight * (4 / 3); // 73.33mm - proporção 4:3
            const espacamentoHorizontal = 8;
            const espacamentoVertical = 10;

            // Verificar quantas fotos cabem por linha com essa largura
            const fotosPerRow = Math.floor((pageWidth - 28) / (fotoWidth + espacamentoHorizontal)) || 1;

            // Calcular altura necessária para o título da seção
            const alturaTituloSecao = 15;

            // Verificar se cabe pelo menos título + uma linha de fotos
            const alturaPrimeiraLinha = alturaTituloSecao + fotoHeight + espacamentoVertical;
            if (yPosition + alturaPrimeiraLinha > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }

            yPosition = drawSection(doc, yPosition, pageWidth, 'FOTOS ANEXADAS');

            let currentRow = 0;
            for (let i = 0; i < fotosValidas.length; i++) {
                const col = i % fotosPerRow;
                const row = Math.floor(i / fotosPerRow);

                // Se mudou de linha, verificar se a nova linha cabe na página
                if (row > currentRow) {
                    const alturaNovaLinha = fotoHeight + espacamentoVertical;
                    if (yPosition + alturaNovaLinha > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                        currentRow = 0;
                    } else {
                        currentRow = row;
                    }
                }

                const xPos = 14 + (col * (fotoWidth + espacamentoHorizontal));
                const yPos = yPosition + ((row - (row > currentRow ? currentRow : 0)) * (fotoHeight + espacamentoVertical));

                try {
                    // Detectar formato automaticamente do data URL
                    const fotoData = fotosValidas[i];
                    let formato = 'JPEG'; // padrão

                    if (fotoData.includes('data:image/png')) {
                        formato = 'PNG';
                    } else if (fotoData.includes('data:image/jpeg') || fotoData.includes('data:image/jpg')) {
                        formato = 'JPEG';
                    } else if (fotoData.includes('data:image/webp')) {
                        formato = 'WEBP';
                    }

                    doc.addImage(fotoData, formato, xPos, yPos, fotoWidth, fotoHeight);
                } catch (error) {
                    console.error('Erro ao adicionar foto', i, ':', error);
                    // Desenhar placeholder indicando erro
                    doc.setDrawColor(200, 200, 200);
                    doc.setFillColor(245, 245, 245);
                    doc.rect(xPos, yPos, fotoWidth, fotoHeight, 'FD');
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text('Erro ao carregar', xPos + fotoWidth / 2, yPos + fotoHeight / 2, {
                        align: 'center'
                    });
                }
            }

            // Atualizar posição Y após todas as fotos
            const totalRows = Math.ceil(fotosValidas.length / fotosPerRow);
            yPosition += totalRows * (fotoHeight + espacamentoVertical) + 5;
        }
    }

    // ASSINATURA (Clean)
    if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
    }

    const assinaturaX = pageWidth / 2;

    // Linha simples para assinatura
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(assinaturaX - 40, yPosition + 15, assinaturaX + 40, yPosition + 15);

    yPosition += 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(dados.tecnico || 'Técnico Responsável', assinaturaX, yPosition, {
        align: 'center'
    });

    yPosition += 4;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Técnico Responsável - Enterfix Metrologia', assinaturaX, yPosition, {
        align: 'center'
    });

    // RODAPÉ EM TODAS AS PÁGINAS
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawModernFooter(doc, pageWidth, pageHeight, i, totalPages, empresaConfig);
    }

    // SALVAR
    const nomeArquivo = `${dados.numeroRelatorio}_${dados.cliente.replace(/\s+/g, '_')}.pdf`;
    doc.save(nomeArquivo);
};