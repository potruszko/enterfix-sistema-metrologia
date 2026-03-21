const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  NumberFormat
} = require('docx');
const {
  v4: uuidv4
} = require('uuid');

// Diretório para salvar contratos
const CONTRATOS_DIR = path.join(__dirname, '../../contratos');

// Criar diretório se não existir
if (!fs.existsSync(CONTRATOS_DIR)) {
  fs.mkdirSync(CONTRATOS_DIR, {
    recursive: true
  });
}

// Função auxiliar para criar TextRun com fonte Calibri
function criarTexto(texto, opcoes = {}) {
  return new TextRun({
    text: texto,
    font: 'Calibri',
    size: opcoes.size || 22,
    bold: opcoes.bold || false,
    italics: opcoes.italics || false,
    ...opcoes
  });
}

/**
 * Gerar contrato de comodato em formato DOCX
 */
exports.gerarContrato = async (req, res) => {
  try {
    const formData = req.body;

    // Mapear campos do frontend para o formato esperado pelo backend
    const data = {
      // Dados do comodatário
      comodatario_razao_social: formData.nome,
      comodatario_nome_fantasia: formData.fantasia,
      comodatario_cnpj: formData.cnpj,
      comodatario_ie: formData.ie,
      comodatario_endereco: `${formData.endereco}, ${formData.numero}${formData.complemento ? ', ' + formData.complemento : ''}, ${formData.bairro}, ${formData.cidade}/${formData.uf}, CEP: ${formData.cep}`,
      comodatario_representante: formData.representante,
      comodatario_cargo: formData.cargo,
      comodatario_telefone: formData.telefone,
      comodatario_celular: formData.celular,
      comodatario_email: formData.email,

      // Dados do equipamento
      objeto_nome: formData.equipamento,
      objeto_modelo: formData.modelo,
      objeto_numero_serie: formData.numeroSerie,
      objeto_descricao_tecnica: formData.descricaoTecnica,
      objeto_estado_conservacao: formData.estadoConservacao,
      objeto_acessorios: formData.acessorios,
      objeto_valor_referencia: formData.valorReferencia,
      objeto_finalidade: formData.finalidade,

      // Dados do contrato
      data_inicio: formData.dataInicio,
      prazo_meses: formData.prazoMeses,
      foro_cidade: formData.cidade || 'Curitiba',

      // Assinante
      nomeAssinante: formData.nomeAssinante,
      cargoAssinante: formData.cargoAssinante
    };

    // Validação básica
    if (!data.comodatario_razao_social || !data.objeto_nome) {
      return res.status(400).json({
        error: 'Dados obrigatórios faltando',
        required: ['nome', 'equipamento']
      });
    }

    // Gerar documento
    const resultado = criarDocumentoContrato(data);
    const doc = resultado.documento;
    const numeroContrato = resultado.numeroContrato;

    // Gerar buffer e enviar diretamente
    const buffer = await Packer.toBuffer(doc);

    const filename = `Contrato_${numeroContrato}_${data.comodatario_razao_social.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Erro ao gerar contrato:', error);
    res.status(500).json({
      error: 'Erro ao gerar contrato',
      details: error.message
    });
  }
};

/**
 * Criar documento completo seguindo estrutura jurídica
 */
function criarDocumentoContrato(data) {
  console.log('📝 Gerando contrato com dados:', {
    comodatario: data.comodatario_razao_social,
    equipamento: data.objeto_nome,
    modelo: data.objeto_modelo,
    serie: data.objeto_numero_serie
  });

  const hoje = new Date().toLocaleDateString('pt-BR');

  // Gerar número único do contrato (formato: ENT-AAAA-MM-DD-XXXXX)
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-5);
  const numeroContrato = `ENT-${ano}${mes}${dia}-${timestamp}`;

  // Dados do comodante (Enterfix) - usa assinante customizado se fornecido
  const comodante = {
    razao_social: process.env.ENTERFIX_RAZAO_SOCIAL || 'Enterfix Metrologia Ltda.',
    cnpj: process.env.ENTERFIX_CNPJ || '00.000.000/0001-00',
    endereco: process.env.ENTERFIX_ENDERECO || 'Endereço da Enterfix',
    representante: data.nomeAssinante || process.env.ENTERFIX_REPRESENTANTE || 'Representante Legal',
    cargo: data.cargoAssinante || process.env.ENTERFIX_CARGO || 'Diretor'
  };

  // Carregar logo
  const logoPath = path.join(__dirname, '../../client/public/images/LOGO_ENTERFIX_LIGHT.png');
  let logoImage = null;

  if (fs.existsSync(logoPath)) {
    logoImage = fs.readFileSync(logoPath);
  }

  const sections = [{
    properties: {
      page: {
        margin: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1440
        },
        pageNumbers: {
          start: 1,
          formatType: NumberFormat.DECIMAL
        }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: logoImage ? [
              new ImageRun({
                data: logoImage,
                transformation: {
                  width: 150,
                  height: 50
                }
              })
            ] : [
              criarTexto('Enterfix Metrologia', {
                bold: true,
                size: 24
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 100
            }
          }),
          new Paragraph({
            children: [
              criarTexto('Contrato Nº ', {
                size: 20,
                bold: true
              }),
              criarTexto(numeroContrato, {
                size: 20,
                bold: true,
                color: '1F1659'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200
            }
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              criarTexto(`${hoje} | www.enterfix.com.br | Página `, {
                size: 18
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                font: 'Calibri',
                size: 18
              })
            ]
          })
        ]
      })
    },
    children: [
      // TÍTULO
      new Paragraph({
        text: 'CONTRATO DE COMODATO DE EQUIPAMENTO',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200
        }
      }),

      new Paragraph({
        children: [
          criarTexto('Contrato Nº ', {
            size: 24,
            bold: true
          }),
          criarTexto(numeroContrato, {
            size: 24,
            bold: true,
            color: '1F1659'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400
        }
      }),

      // 1. IDENTIFICAÇÃO DAS PARTES
      new Paragraph({
        text: '1. IDENTIFICAÇÃO DAS PARTES',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        children: [
          criarTexto('COMODANTE: ', {
            bold: true
          }),
          criarTexto(`${comodante.razao_social}, inscrita no CNPJ sob nº ${comodante.cnpj}, `)
        ]
      }),
      new Paragraph({
        text: `com sede em ${comodante.endereco}, neste ato representada por ${comodante.representante}, ${comodante.cargo}.`,
        spacing: {
          after: 200
        }
      }),

      new Paragraph({
        children: [
          criarTexto('COMODATÁRIO: ', {
            bold: true
          }),
          criarTexto(`${data.comodatario_razao_social}, inscrita no CNPJ/CPF sob nº ${data.comodatario_cnpj}, `)
        ]
      }),
      new Paragraph({
        text: `com sede/domicílio em ${data.comodatario_endereco}, neste ato representada por ${data.comodatario_representante}, ${data.comodatario_cargo}.`,
        spacing: {
          after: 300
        }
      }),

      // 2. OBJETO DO CONTRATO
      new Paragraph({
        text: '2. OBJETO DO CONTRATO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: 'O presente contrato tem por objeto o comodato, sem ônus, do seguinte equipamento:',
        spacing: {
          after: 100
        }
      }),

      new Paragraph({
        children: [
          criarTexto('Nome/Modelo: ', {
            bold: true
          }),
          criarTexto(`${data.objeto_nome} - ${data.objeto_modelo || 'N/A'}`)
        ]
      }),
      new Paragraph({
        children: [
          criarTexto('Número de Série: ', {
            bold: true
          }),
          criarTexto(data.objeto_numero_serie || 'N/A')
        ]
      }),
      new Paragraph({
        children: [
          criarTexto('Descrição Técnica: ', {
            bold: true
          }),
          criarTexto(data.objeto_descricao_tecnica || 'Conforme especificações do fabricante')
        ]
      }),
      new Paragraph({
        children: [
          criarTexto('Estado de Conservação: ', {
            bold: true
          }),
          criarTexto(data.objeto_estado_conservacao || 'Bom estado de funcionamento')
        ]
      }),
      new Paragraph({
        children: [
          criarTexto('Acessórios Inclusos: ', {
            bold: true
          }),
          criarTexto(data.objeto_acessorios || 'Conforme lista anexa')
        ]
      }),
      new Paragraph({
        children: [
          criarTexto('Valor de Referência: ', {
            bold: true
          }),
          criarTexto(`R$ ${data.objeto_valor_referencia || '0,00'}`)
        ],
        spacing: {
          after: 200
        }
      }),
      new Paragraph({
        children: [
          criarTexto('Finalidade: ', {
            bold: true
          }),
          criarTexto(data.objeto_finalidade || 'Teste, avaliação técnica e demonstração')
        ],
        spacing: {
          after: 300
        }
      }),

      // 3. NATUREZA DO COMODATO
      new Paragraph({
        text: '3. NATUREZA DO COMODATO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '3.1. O presente comodato é GRATUITO, não transferindo a propriedade do equipamento ao COMODATÁRIO.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '3.2. O comodato NÃO obriga o COMODATÁRIO a realizar compra futura do equipamento.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '3.3. O empréstimo não caracteriza permuta automática ou compromisso de troca.',
        spacing: {
          after: 300
        }
      }),

      // 4. PRAZO
      new Paragraph({
        text: '4. PRAZO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: `4.1. O prazo do comodato é de ${data.prazo_dias || '30'} (${extenso(data.prazo_dias || 30)}) dias, contados a partir de ${data.prazo_inicio || hoje}.`,
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '4.2. O prazo poderá ser renovado mediante acordo entre as partes, formalizado por escrito.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '4.3. O COMODANTE poderá solicitar a devolução imediata do equipamento a qualquer momento, independentemente do prazo estabelecido.',
        spacing: {
          after: 300
        }
      }),

      // 5. OBRIGAÇÕES DO COMODATÁRIO
      new Paragraph({
        text: '5. OBRIGAÇÕES DO COMODATÁRIO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '5.1. Utilizar o equipamento de forma adequada, conforme sua finalidade e especificações técnicas.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.2. Responsabilizar-se integralmente por danos, extravios, furtos ou roubos ocorridos durante o período de comodato.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.3. NÃO subemprestar, ceder, alugar ou transferir o equipamento a terceiros.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.4. NÃO abrir, reparar, substituir peças ou realizar qualquer intervenção técnica sem autorização expressa do COMODANTE.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.5. Comunicar imediatamente ao COMODANTE sobre defeitos, mau funcionamento ou necessidade de manutenção.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.6. Manter o equipamento em local seguro, protegido contra intempéries e uso indevido.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.7. Não permitir o uso do equipamento por pessoas não autorizadas ou não capacitadas para sua operação.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.8. Manter registro atualizado das utilizações do equipamento, quando solicitado pelo COMODANTE.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.9. Comunicar ao COMODANTE qualquer alteração na localização do equipamento com antecedência mínima de 48 (quarenta e oito) horas.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '5.10. Facilitar o acesso do COMODANTE ao equipamento para fins de inspeção, manutenção ou verificação de condições de uso, mediante aviso prévio de 24 (vinte e quatro) horas.',
        spacing: {
          after: 300
        }
      }),

      // 6. MANUTENÇÃO E SUPORTE
      new Paragraph({
        text: '6. MANUTENÇÃO E SUPORTE',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '6.1. A manutenção preventiva e corretiva do equipamento, quando resultante de defeito de fabricação ou desgaste natural, é de responsabilidade do COMODANTE.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '6.2. Considera-se mau uso: operação fora das especificações, quedas, choques, exposição a líquidos, uso inadequado de energia, instalação incorreta.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '6.3. Danos decorrentes de mau uso serão de inteira responsabilidade do COMODATÁRIO.',
        spacing: {
          after: 300
        }
      }),

      // 7. VALOR DE REFERÊNCIA DO BEM
      new Paragraph({
        text: '7. VALOR DE REFERÊNCIA DO BEM',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: `7.1. O valor de referência do equipamento, para fins de responsabilização, é de R$ ${data.objeto_valor_referencia || '0,00'} (${extensoValor(data.objeto_valor_referencia || 0)}).`,
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '7.2. Este valor será utilizado como base para cálculo de indenização em caso de perda total, extravio ou danos irreparáveis.',
        spacing: {
          after: 300
        }
      }),

      // 8. RESPONSABILIZAÇÃO EM CASO DE DANO
      new Paragraph({
        text: '8. RESPONSABILIZAÇÃO EM CASO DE DANO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '8.1. Em caso de EXTRAVIO, FURTO ou ROUBO, o COMODATÁRIO deverá indenizar o COMODANTE pelo valor integral de referência do equipamento.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '8.2. Em caso de DANOS FÍSICOS ou ELÉTRICOS resultantes de mau uso, o COMODATÁRIO arcará com os custos de reparo ou substituição.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '8.3. Em caso de PERDA TOTAL, o COMODATÁRIO deverá ressarcir o valor de referência atualizado.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '8.4. O pagamento da indenização deverá ser realizado em até 30 (trinta) dias após a notificação formal.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '8.5. Fica facultado ao COMODANTE registrar Boletim de Ocorrência e tomar medidas judiciais cabíveis para ressarcimento de prejuízos.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '8.6. Os valores de indenização serão atualizados pelo IGPM-FGV desde a data de aquisição do equipamento até a data do efetivo pagamento.',
        spacing: {
          after: 300
        }
      }),

      // 9. DEVOLUÇÃO
      new Paragraph({
        text: '9. DEVOLUÇÃO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '9.1. O equipamento deverá ser devolvido nas mesmas condições em que foi emprestado, considerado o desgaste natural.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '9.2. A devolução será acompanhada de Termo de Devolução e Vistoria Técnica realizada pelo COMODANTE.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '9.3. O COMODATÁRIO deverá devolver o equipamento no endereço do COMODANTE, arcando com custos de transporte.',
        spacing: {
          after: 300
        }
      }),

      // 10. EVENTUAL NEGOCIAÇÃO FUTURA
      new Paragraph({
        text: '10. EVENTUAL NEGOCIAÇÃO FUTURA',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '10.1. Caso haja interesse na aquisição do equipamento, o COMODATÁRIO deverá manifestar por escrito.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '10.2. O procedimento de compra seguirá negociação comercial independente, com emissão de proposta e Nota Fiscal correspondente.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '10.3. Eventuais trocas ou permutas dependerão de avaliação técnica e acordo formal entre as partes.',
        spacing: {
          after: 300
        }
      }),

      // 11. RESCISÃO
      new Paragraph({
        text: '11. RESCISÃO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '11.1. O contrato poderá ser rescindido imediatamente nas seguintes hipóteses:',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: 'a) Descumprimento de qualquer cláusula contratual pelo COMODATÁRIO;',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: 'b) Utilização inadequada ou para fins diversos do estabelecido;',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: 'c) Subempréstimo ou cessão não autorizada;',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: 'd) Interesse do COMODANTE em reaver o equipamento;',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: 'e) Comum acordo entre as partes.',
        spacing: {
          after: 300
        }
      }),

      // 12. PRIVACIDADE E CONFIDENCIALIDADE
      new Paragraph({
        text: '12. PRIVACIDADE E CONFIDENCIALIDADE',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: '12.1. Caso o equipamento colete, processe ou armazene dados, o COMODATÁRIO compromete-se a utilizá-lo em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '12.2. É vedado o compartilhamento de informações técnicas, dados de calibração ou qualquer informação confidencial relacionada ao equipamento.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '12.3. O COMODATÁRIO obriga-se a manter sigilo sobre métodos, processos e tecnologias empregados no equipamento, sob pena de responsabilização civil e criminal.',
        spacing: {
          after: 100
        }
      }),
      new Paragraph({
        text: '12.4. Em caso de descontinuidade do comodato, o COMODATÁRIO deverá devolver o equipamento sem reter cópias de software, configurações ou dados de propriedade do COMODANTE.',
        spacing: {
          after: 300
        }
      }),

      // 13. FORO
      new Paragraph({
        text: '13. FORO',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200
        }
      }),

      new Paragraph({
        text: `13.1. As partes elegem o foro da Comarca de ${process.env.FORO_CIDADE || 'Sua Cidade'}, ${process.env.FORO_ESTADO || 'Estado'}, para dirimir quaisquer questões oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.`,
        spacing: {
          after: 400
        }
      }),

      // Data e Assinaturas
      new Paragraph({
        text: `E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.`,
        spacing: {
          before: 200,
          after: 150
        }
      }),

      new Paragraph({
        text: `${data.foro_cidade || 'Curitiba'}, ${hoje}`,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 250
        }
      }),

      // Assinatura COMODANTE
      new Paragraph({
        text: '_______________________________________________',
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 250,
          after: 80
        }
      }),
      new Paragraph({
        text: comodante.razao_social,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 40
        }
      }),
      new Paragraph({
        text: `${comodante.representante} - ${comodante.cargo}`,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 40
        }
      }),
      new Paragraph({
        text: 'COMODANTE',
        alignment: AlignmentType.CENTER,
        bold: true,
        spacing: {
          after: 250
        }
      }),

      // Assinatura COMODATÁRIO
      new Paragraph({
        text: '_______________________________________________',
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 250,
          after: 80
        }
      }),
      new Paragraph({
        text: data.comodatario_razao_social,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 40
        }
      }),
      new Paragraph({
        text: `${data.comodatario_representante} - ${data.comodatario_cargo}`,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 40
        }
      }),
      new Paragraph({
        text: 'COMODATÁRIO',
        alignment: AlignmentType.CENTER,
        bold: true,
        spacing: {
          after: 250
        }
      }),

      // Testemunhas
      new Paragraph({
        text: 'TESTEMUNHAS:',
        alignment: AlignmentType.CENTER,
        bold: true,
        spacing: {
          before: 200,
          after: 200
        }
      }),

      // Grid de testemunhas lado a lado
      new Paragraph({
        children: [
          new TextRun({
            text: '1. _______________________________     ',
            font: 'Calibri',
            size: 22
          }),
          new TextRun({
            text: '2. _______________________________',
            font: 'Calibri',
            size: 22
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 80
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Nome:                                                      ',
            font: 'Calibri',
            size: 20
          }),
          new TextRun({
            text: 'Nome:',
            font: 'Calibri',
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 40
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'CPF:                                                        ',
            font: 'Calibri',
            size: 20
          }),
          new TextRun({
            text: 'CPF:',
            font: 'Calibri',
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ]
  }];

  const documento = new Document({
    sections,
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 100,
              after: 100
            }
          }
        },
        heading1: {
          run: {
            font: 'Calibri',
            size: 32,
            bold: true
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 240
            }
          }
        },
        heading2: {
          run: {
            font: 'Calibri',
            size: 26,
            bold: true
          },
          paragraph: {
            spacing: {
              before: 200,
              after: 120
            }
          }
        }
      }
    }
  });

  return {
    documento: documento,
    numeroContrato: numeroContrato
  };
}

/**
 * Converter número para extenso (simplificado)
 */
function extenso(num) {
  const numeros = {
    0: 'zero',
    1: 'um',
    2: 'dois',
    3: 'três',
    4: 'quatro',
    5: 'cinco',
    6: 'seis',
    7: 'sete',
    8: 'oito',
    9: 'nove',
    10: 'dez',
    15: 'quinze',
    30: 'trinta',
    45: 'quarenta e cinco',
    60: 'sessenta',
    90: 'noventa'
  };
  return numeros[num] || num.toString();
}

/**
 * Converter valor para extenso (simplificado)
 */
function extensoValor(valor) {
  return `${valor} reais`; // Simplificado - pode ser expandido com biblioteca
}

/**
 * Gerar contrato em PDF (usando Puppeteer)
 */
exports.gerarContratoPDF = async (req, res) => {
  try {
    res.status(501).json({
      message: 'Geração de PDF em desenvolvimento',
      alternative: 'Use o formato DOCX e converta depois'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Listar contratos gerados
 */
exports.listarContratos = async (req, res) => {
  try {
    const files = fs.readdirSync(CONTRATOS_DIR);

    const contratos = files
      .filter(file => file.endsWith('.docx'))
      .map(file => {
        const stats = fs.statSync(path.join(CONTRATOS_DIR, file));
        return {
          filename: file,
          data_criacao: stats.birthtime,
          tamanho: `${(stats.size / 1024).toFixed(2)} KB`,
          downloadUrl: `/contratos/${file}`
        };
      })
      .sort((a, b) => b.data_criacao - a.data_criacao);

    res.json({
      total: contratos.length,
      contratos
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Download de contrato específico
 */
exports.downloadContrato = async (req, res) => {
  try {
    const {
      filename
    } = req.params;
    const filepath = path.join(CONTRATOS_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: 'Arquivo não encontrado'
      });
    }

    res.download(filepath);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};