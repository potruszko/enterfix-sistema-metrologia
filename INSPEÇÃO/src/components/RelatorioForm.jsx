import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileDown, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  formatMetrologicalValue, 
  calculateStatus, 
  generateReportNumber 
} from '../utils/metrologyUtils';
import { generatePDF } from '../utils/pdfGenerator';
import { useAlert } from './AlertSystem';
import { PECAS_DISPONIVEIS, gerarTextoObservacoes } from '../utils/pecasSubstituidas';
import ClienteSelector from './ClienteSelector';

const RelatorioForm = ({ relatorioId = null, onSaveComplete }) => {
  const alert = useAlert();
  const [tipoRelatorio, setTipoRelatorio] = useState('FABRICACAO');
  const [formData, setFormData] = useState({
    cliente: '',
    projetoOS: '',
    numeroDesenho: '',
    revisao: '',
    material: '',
    lote: '',
    dureza: '',
    quantidade: '',
    equipamento: '',
    tecnico: '',
    data: new Date().toISOString().split('T')[0],
    temperatura: '',
    umidade: '',
    observacoes: '',
  });

  const [medicoes, setMedicoes] = useState([
    { id: 1, descricao: '', nominal: '', tolPos: '', tolNeg: '', medido: '', status: '', equipamento: '' }
  ]);

  const [fotos, setFotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado para cliente selecionado
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // Estado para peças substituídas
  const [pecasSelecionadas, setPecasSelecionadas] = useState([]);

  // Estados específicos para Certificado de Reparo de Apalpadores
  const [dadosReparo, setDadosReparo] = useState({
    tokenVerificacao: '',
    normaISO: 'ISO 10360-2',
    referenciaISO9001: 'ISO 9001:2000',
    referenciaABNT: 'ABNT NBR 12110-1',
    testesDesvio: [
      { eixo: 'X', desvioPos: '', desvioNeg: '', limiteMax: '0.0025', limiteMin: '-0.0025' },
      { eixo: 'Y', desvioPos: '', desvioNeg: '', limiteMax: '0.0025', limiteMin: '-0.0025' },
      { eixo: 'Z', desvioPos: '', desvioNeg: '', limiteMax: '0.0025', limiteMin: '-0.0025' }
    ],
    repetibilidade: {
      pontosX_positivo: Array(10).fill(''),
      pontosX_negativo: Array(10).fill(''),
      pontosY_positivo: Array(10).fill(''),
      pontosY_negativo: Array(10).fill(''),
      pontosZ_negativo: Array(10).fill(''),
      mediaX_pos: 0,
      mediaX_neg: 0,
      mediaY_pos: 0,
      mediaY_neg: 0,
      mediaZ_neg: 0,
      desvioPatraoX_pos: 0,
      desvioPatraoX_neg: 0,
      desvioPatraoY_pos: 0,
      desvioPatraoY_neg: 0,
      desvioPatraoZ_neg: 0
    },
    checklist: {
      estanqueidade: false,
      moduloCinematico: false,
      forcaTrigger: false,
      danosEstruturais: false,
      capacidadeToque: false,
      comunicacao: { radio: false, optica: false, cabo: false }
    }
  });
  const [originalNumeroRelatorio, setOriginalNumeroRelatorio] = useState(null);
  const [originalRelatorioId, setOriginalRelatorioId] = useState(null);
  const [originalStatusRelatorio, setOriginalStatusRelatorio] = useState(null);
  const [versao, setVersao] = useState(1);

  // Estados para dados cadastrados
  const [tecnicos, setTecnicos] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [showNovoTecnico, setShowNovoTecnico] = useState(false);
  const [showNovoEquipamento, setShowNovoEquipamento] = useState(false);
  const [novoTecnicoNome, setNovoTecnicoNome] = useState('');
  const [novoEquipamentoNome, setNovoEquipamentoNome] = useState('');

  // Carregar técnicos e equipamentos ao montar o componente
  useEffect(() => {
    carregarTecnicosEquipamentos();
  }, []);

  // Atualizar observações automaticamente quando peças substituídas mudarem
  useEffect(() => {
    const textoGerado = gerarTextoObservacoes(pecasSelecionadas);
    setFormData(prev => ({
      ...prev,
      observacoes: textoGerado
    }));
  }, [pecasSelecionadas]);

  const carregarTecnicosEquipamentos = () => {
    try {
      // Carregar técnicos do localStorage (Configurações) - chave separada
      const tecnicosStored = localStorage.getItem('enterfix_tecnicos');
      if (tecnicosStored) {
        setTecnicos(JSON.parse(tecnicosStored));
      }

      // Carregar equipamentos do localStorage (Gestão de Equipamentos)
      const equipamentosStored = localStorage.getItem('enterfix_equipamentos');
      if (equipamentosStored) {
        const equips = JSON.parse(equipamentosStored);
        setEquipamentos(equips);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // Carregar relatório para edição
  useEffect(() => {
    if (relatorioId) {
      loadRelatorioForEdit(relatorioId);
    }
  }, [relatorioId]);

  const loadRelatorioForEdit = async (id) => {
    try {
      const { data, error } = await supabase
        .from('relatorios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setIsEditing(true);
        setOriginalRelatorioId(data.id);
        setOriginalNumeroRelatorio(data.dados.numeroRelatorio);
        setOriginalStatusRelatorio(data.status_relatorio || 'emitido');
        setTipoRelatorio(data.tipo);
        
        // Carregar cliente se houver cliente_id
        if (data.cliente_id) {
          const { data: clienteData } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', data.cliente_id)
            .single();
          
          if (clienteData) {
            setClienteSelecionado(clienteData);
          }
        }
        
        setFormData({
          cliente: data.cliente,
          projetoOS: data.projeto_os,
          numeroDesenho: data.dados.numeroDesenho || '',
          revisao: data.dados.revisao || '',
          material: data.dados.material || '',
          lote: data.dados.lote || '',
          dureza: data.dados.dureza || '',
          quantidade: data.dados.quantidade || '',
          equipamento: data.dados.equipamento || '',
          tecnico: data.tecnico_nome,
          data: data.dados.data || new Date().toISOString().split('T')[0],
          temperatura: data.dados.temperatura || '',
          umidade: data.dados.umidade || '',
          observacoes: data.dados.observacoes || '',
        });

        // Carregar medições ou dados de reparo baseado no tipo
        if (data.tipo === 'REPARO_APALPADOR' && data.dados.dadosReparo) {
          setDadosReparo(data.dados.dadosReparo);
        } else {
          setMedicoes(data.dados.medicoes || [{ id: 1, descricao: '', nominal: '', tolPos: '', tolNeg: '', medido: '', status: '', equipamento: '' }]);
        }
        
        // Carregar peças substituídas se existirem
        if (data.dados.pecasSubstituidas) {
          setPecasSelecionadas(data.dados.pecasSubstituidas);
        }
        
        // Carregar fotos se existirem
        if (data.dados.fotos && data.dados.fotos.length > 0) {
          setFotos(data.dados.fotos.map((fotoData, index) => ({
            id: Date.now() + index,
            name: `foto_${index + 1}.jpg`,
            data: fotoData
          })));
        }
        
        // Calcular próxima versão
        const { count } = await supabase
          .from('relatorios')
          .select('*', { count: 'exact', head: true })
          .eq('dados->>numeroRelatorio', data.dados.numeroRelatorio);
        
        setVersao((count || 0) + 1);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      alert.error('Não foi possível carregar o relatório. Verifique sua conexão.', 'Erro ao Carregar');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicaoChange = (id, field, value) => {
    setMedicoes(prev => {
      const updated = prev.map(med => {
        if (med.id === id) {
          const newMed = { ...med, [field]: value };
          
          // Calcular status automaticamente quando 'medido' é alterado
          if (field === 'medido' && value !== '') {
            newMed.status = calculateStatus(
              newMed.nominal,
              newMed.tolPos,
              newMed.tolNeg,
              value
            );
          }
          
          return newMed;
        }
        return med;
      });
      return updated;
    });
  };

  const adicionarLinha = () => {
    const newId = Math.max(...medicoes.map(m => m.id), 0) + 1;
    setMedicoes(prev => [
      ...prev,
      { id: newId, descricao: '', nominal: '', tolPos: '', tolNeg: '', medido: '', status: '', equipamento: '' }
    ]);
  };

  const removerLinha = (id) => {
    if (medicoes.length > 1) {
      setMedicoes(prev => prev.filter(med => med.id !== id));
    }
  };

  // Handlers para upload de fotos
  const handleFotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotos(prev => [...prev, {
            id: Date.now() + Math.random(),
            name: file.name,
            data: reader.result
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        alert.warning('Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc).', 'Formato Inválido');
      }
    });
    
    e.target.value = ''; // Reset input
  };

  const removerFoto = (id) => {
    setFotos(prev => prev.filter(foto => foto.id !== id));
  };

  // Funções específicas para Certificado de Reparo de Apalpadores
  const calcularDesvioPadrao = (pontos) => {
    const valores = pontos.filter(p => p !== '' && !isNaN(parseFloat(p))).map(p => parseFloat(p));
    if (valores.length < 2) return { media: 0, desvio: 0 };
    
    const media = valores.reduce((sum, val) => sum + val, 0) / valores.length;
    const variancia = valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / (valores.length - 1);
    const desvio = Math.sqrt(variancia);
    return { 
      media: media.toFixed(6),
      desvio: (2 * desvio).toFixed(6) // 2σ
    };
  };

  const atualizarDadosReparo = (campo, valor) => {
    setDadosReparo(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const atualizarTesteDesvio = (index, campo, valor) => {
    setDadosReparo(prev => {
      const novosTestes = [...prev.testesDesvio];
      novosTestes[index] = { ...novosTestes[index], [campo]: valor };
      return { ...prev, testesDesvio: novosTestes };
    });
  };

  const atualizarRepetibilidade = (direcao, index, valor) => {
    setDadosReparo(prev => {
      const novosPontos = [...prev.repetibilidade[`pontos${direcao}`]];
      novosPontos[index] = valor;
      
      const { media, desvio } = calcularDesvioPadrao(novosPontos);
      
      // Mapear direção para campos de média e desvio
      const dirMap = {
        'X_positivo': { media: 'mediaX_pos', desvio: 'desvioPatraoX_pos' },
        'X_negativo': { media: 'mediaX_neg', desvio: 'desvioPatraoX_neg' },
        'Y_positivo': { media: 'mediaY_pos', desvio: 'desvioPatraoY_pos' },
        'Y_negativo': { media: 'mediaY_neg', desvio: 'desvioPatraoY_neg' },
        'Z_negativo': { media: 'mediaZ_neg', desvio: 'desvioPatraoZ_neg' }
      };
      
      const novaRepetibilidade = {
        ...prev.repetibilidade,
        [`pontos${direcao}`]: novosPontos,
        [dirMap[direcao].media]: media,
        [dirMap[direcao].desvio]: desvio
      };

      // Atualizar automaticamente testesDesvio com base nos resultados de repetibilidade
      const novosTestesDesvio = [
        { 
          eixo: 'X', 
          desvioPos: novaRepetibilidade.desvioPatraoX_pos, 
          desvioNeg: novaRepetibilidade.desvioPatraoX_neg, 
          limiteMax: '0.0025', 
          limiteMin: '-0.0025' 
        },
        { 
          eixo: 'Y', 
          desvioPos: novaRepetibilidade.desvioPatraoY_pos, 
          desvioNeg: novaRepetibilidade.desvioPatraoY_neg, 
          limiteMax: '0.0025', 
          limiteMin: '-0.0025' 
        },
        { 
          eixo: 'Z', 
          desvioPos: '0', // Z não tem positivo
          desvioNeg: novaRepetibilidade.desvioPatraoZ_neg, 
          limiteMax: '0.0025', 
          limiteMin: '-0.0025' 
        }
      ];

      return {
        ...prev,
        repetibilidade: novaRepetibilidade,
        testesDesvio: novosTestesDesvio
      };
    });
  };

  const atualizarChecklist = (campo, valor) => {
    setDadosReparo(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [campo]: valor
      }
    }));
  };

  const atualizarChecklistComunicacao = (tipo, valor) => {
    setDadosReparo(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        comunicacao: {
          ...prev.checklist.comunicacao,
          [tipo]: valor
        }
      }
    }));
  };

  const validarDesvios = () => {
    return dadosReparo.testesDesvio.every(teste => {
      const desvioPos = parseFloat(teste.desvioPos);
      const desvioNeg = parseFloat(teste.desvioNeg);
      const limiteMax = parseFloat(teste.limiteMax);
      const limiteMin = parseFloat(teste.limiteMin);
      
      if (isNaN(desvioPos) || isNaN(desvioNeg)) return true; // Se não preenchido, não reprova
      
      return desvioPos <= limiteMax && desvioNeg >= limiteMin;
    });
  };

  const validarRepetibilidade = () => {
    const rep = dadosReparo.repetibilidade;
    const desvios = [
      parseFloat(rep.desvioPatraoX_pos),
      parseFloat(rep.desvioPatraoX_neg),
      parseFloat(rep.desvioPatraoY_pos),
      parseFloat(rep.desvioPatraoY_neg),
      parseFloat(rep.desvioPatraoZ_neg)
    ];
    
    // Se nenhum foi calculado, não reprova
    const calculados = desvios.filter(d => !isNaN(d) && d > 0);
    if (calculados.length === 0) return true;
    
    // Todos os calculados devem estar <= 0.005mm (5μm)
    return calculados.every(d => d <= 0.005);
  };

  const validarChecklist = () => {
    const { estanqueidade, moduloCinematico, forcaTrigger, danosEstruturais, capacidadeToque, comunicacao } = dadosReparo.checklist;
    const comunicacaoOK = comunicacao.radio || comunicacao.optica || comunicacao.cabo;
    return estanqueidade && moduloCinematico && forcaTrigger && danosEstruturais && capacidadeToque && comunicacaoOK;
  };

  const calcularParecerFinal = () => {
    if (tipoRelatorio === 'REPARO_APALPADOR') {
      const desviosOK = validarDesvios();
      const repetibilidadeOK = validarRepetibilidade();
      const checklistOK = validarChecklist();
      return (desviosOK && repetibilidadeOK && checklistOK) ? 'APROVADO' : 'REPROVADO';
    }
    
    const temNOK = medicoes.some(m => m.status === 'NOK');
    return temNOK ? 'REPROVADO' : 'APROVADO';
  };

  const salvarRelatorio = async (emitir = false) => {
    setSaving(true);
    
    try {
      const numeroRelatorio = isEditing ? originalNumeroRelatorio : generateReportNumber();
      const parecerFinal = calcularParecerFinal();
      
      // Decisão: UPDATE ou INSERT?
      // Se estiver editando um RASCUNHO → UPDATE (não cria versão)
      // Se estiver editando um EMITIDO → INSERT (cria nova versão)
      // Se for novo → INSERT
      const isRascunhoEditado = isEditing && originalStatusRelatorio === 'rascunho' && !emitir;
      
      const versaoAtual = emitir ? (isEditing ? versao : 1) : 1;
      const statusRelatorio = emitir ? 'emitido' : 'rascunho';
      
      // Construir objeto dados baseado no tipo de relatório
      let dadosRelatorio = {
        ...formData,
        numeroRelatorio,
        versao: versaoAtual,
        relatorioOriginal: isEditing ? originalNumeroRelatorio : null,
      };

      // Se for REPARO_APALPADOR, incluir dados específicos ao invés de medições
      if (tipoRelatorio === 'REPARO_APALPADOR') {
        dadosRelatorio = {
          ...dadosRelatorio,
          dadosReparo: dadosReparo,
          fotos: fotos.map(f => f.data),
          pecasSubstituidas: pecasSelecionadas,
        };
      } else {
        dadosRelatorio = {
          ...dadosRelatorio,
          medicoes: medicoes,
          fotos: fotos.map(f => f.data),
          pecasSubstituidas: pecasSelecionadas,
        };
      }
      
      const relatorio = {
        tipo: tipoRelatorio,
        cliente: clienteSelecionado?.razao_social || formData.cliente,
        cliente_id: clienteSelecionado?.id || null,
        projeto_os: formData.projetoOS,
        dados: dadosRelatorio,
        status_final: parecerFinal,
        status_relatorio: statusRelatorio,
        tecnico_nome: formData.tecnico,
      };

      let data, error;

      if (isRascunhoEditado) {
        // UPDATE: Editar rascunho existente (não cria nova versão)
        const result = await supabase
          .from('relatorios')
          .update(relatorio)
          .eq('id', originalRelatorioId)
          .select('*');
        
        data = result.data;
        error = result.error;
      } else {
        // INSERT: Novo relatório ou nova versão de emitido
        const result = await supabase
          .from('relatorios')
          .insert([relatorio])
          .select('*');
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Erro detalhado:', error);
        throw error;
      }

      const mensagem = isRascunhoEditado
        ? 'Rascunho atualizado com sucesso!'
        : (emitir
            ? (isEditing 
                ? `Versão ${versaoAtual} do relatório ${numeroRelatorio} emitida com sucesso!` 
                : `Relatório ${numeroRelatorio} emitido com sucesso!`)
            : `Relatório salvo como rascunho!`);
      
      alert.success(mensagem, isRascunhoEditado ? 'Atualizado!' : (emitir ? 'Relatório Emitido!' : 'Rascunho Salvo!'));
      
      // Resetar formulário
      resetForm();
      
      // Navegar para histórico se callback fornecido
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      alert.error(
        error.message === 'Invalid API key' 
          ? 'Chave de API inválida. Verifique a configuração do Supabase no arquivo .env'
          : `Não foi possível salvar: ${error.message}`,
        'Erro ao Salvar'
      );
    } finally {
      setSaving(false);
    }
  };

  const exportarPDF = async () => {
    const numeroRelatorio = generateReportNumber();
    const parecerFinal = calcularParecerFinal();
    
    // Construir objeto dados baseado no tipo de relatório
    let dadosRelatorio = {
      tipo: tipoRelatorio,
      numeroRelatorio,
      ...formData,
      fotos: fotos.map(f => f.data),
      parecerFinal,
    };

    // Se for REPARO_APALPADOR, incluir dadosReparo ao invés de medicoes
    if (tipoRelatorio === 'REPARO_APALPADOR') {
      dadosRelatorio.dadosReparo = dadosReparo;
    } else {
      dadosRelatorio.medicoes = medicoes;
    }

    await generatePDF(dadosRelatorio);
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      projetoOS: '',
      numeroDesenho: '',
      revisao: '',
      material: '',
      lote: '',
      dureza: '',
      quantidade: '',
      equipamento: '',
      tecnico: '',
      data: new Date().toISOString().split('T')[0],
      temperatura: '',
      umidade: '',
      observacoes: '',
    });
    setMedicoes([
      { id: 1, descricao: '', nominal: '', tolPos: '', tolNeg: '', medido: '', status: '', equipamento: '' }
    ]);
    setFotos([]);
    setPecasSelecionadas([]);
    setClienteSelecionado(null);
    setIsEditing(false);
    setOriginalNumeroRelatorio(null);
    setOriginalRelatorioId(null);
    setOriginalStatusRelatorio(null);
    setVersao(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-industrial-800">
            {isEditing 
              ? (originalStatusRelatorio === 'rascunho' 
                  ? `Editar Rascunho ${originalNumeroRelatorio}` 
                  : `Editar Relatório ${originalNumeroRelatorio} (Nova Versão ${versao})`)
              : 'Novo Relatório de Metrologia'}
          </h2>
          {isEditing && originalStatusRelatorio === 'rascunho' && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
              Editando Rascunho
            </span>
          )}
          {isEditing && originalStatusRelatorio === 'emitido' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              Modo Edição
            </span>
          )}
        </div>
        
        {/* Tipo de Relatório */}
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipoRelatorio"
              value="FABRICACAO"
              checked={tipoRelatorio === 'FABRICACAO'}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium text-industrial-700">Relatório de Fabricação</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipoRelatorio"
              value="CALIBRACAO"
              checked={tipoRelatorio === 'CALIBRACAO'}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium text-industrial-700">Relatório de Calibração</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipoRelatorio"
              value="REPARO_APALPADOR"
              checked={tipoRelatorio === 'REPARO_APALPADOR'}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium text-industrial-700">Certificado Técnico de Reparo (Apalpadores)</span>
          </label>
        </div>

        {/* Identificação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <ClienteSelector
              clienteSelecionado={clienteSelecionado}
              onClienteChange={(cliente) => {
                setClienteSelecionado(cliente);
                setFormData({ ...formData, cliente: cliente?.razao_social || '' });
              }}
              obrigatorio={true}
              label="Cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              {tipoRelatorio === 'FABRICACAO' ? 'Número da OP' : 'OS/Projeto'}
            </label>
            <input
              type="text"
              name="projetoOS"
              value={formData.projetoOS}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              {tipoRelatorio === 'FABRICACAO' ? 'Código da Peça' : 'Modelo da Esfera'}
            </label>
            <input
              type="text"
              name="numeroDesenho"
              value={formData.numeroDesenho}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              {tipoRelatorio === 'FABRICACAO' ? 'Revisão do Desenho' : 'Nº de Série'}
            </label>
            <input
              type="text"
              name="revisao"
              value={formData.revisao}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {tipoRelatorio === 'FABRICACAO' && (
            <>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Lote da Matéria-prima
                </label>
                <input
                  type="text"
                  name="lote"
                  value={formData.lote}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Quantidade de Peças
                </label>
                <input
                  type="number"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleInputChange}
                  placeholder="Ex: 100"
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Dureza
                </label>
                <input
                  type="text"
                  name="dureza"
                  value={formData.dureza}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {tipoRelatorio === 'CALIBRACAO' && (
            <>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Temperatura (°C)
                </label>
                <input
                  type="text"
                  name="temperatura"
                  value={formData.temperatura}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Umidade (%)
                </label>
                <input
                  type="text"
                  name="umidade"
                  value={formData.umidade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {tipoRelatorio === 'REPARO_APALPADOR' && (
            <>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Token de Verificação *
                </label>
                <input
                  type="text"
                  name="tokenVerificacao"
                  value={dadosReparo.tokenVerificacao}
                  onChange={(e) => atualizarDadosReparo('tokenVerificacao', e.target.value)}
                  placeholder="Ex: TK-2026-00123"
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Norma Aplicável
                </label>
                <input
                  type="text"
                  name="normaISO"
                  value={dadosReparo.normaISO}
                  onChange={(e) => atualizarDadosReparo('normaISO', e.target.value)}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Referência ISO 9001
                </label>
                <input
                  type="text"
                  name="referenciaISO9001"
                  value={dadosReparo.referenciaISO9001}
                  onChange={(e) => atualizarDadosReparo('referenciaISO9001', e.target.value)}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Referência ABNT
                </label>
                <input
                  type="text"
                  name="referenciaABNT"
                  value={dadosReparo.referenciaABNT}
                  onChange={(e) => atualizarDadosReparo('referenciaABNT', e.target.value)}
                  className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              Equipamento Utilizado *
            </label>
            {!showNovoEquipamento ? (
              <div className="flex gap-2">
                <select
                  name="equipamento"
                  value={formData.equipamento}
                  onChange={(e) => {
                    if (e.target.value === '__NOVO__') {
                      setShowNovoEquipamento(true);
                      setNovoEquipamentoNome('');
                    } else {
                      handleInputChange(e);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um equipamento</option>
                  {equipamentos.map(eq => (
                    <option key={eq.id} value={eq.nome}>
                      {eq.nome} {eq.serie ? `(SN: ${eq.serie})` : ''}
                    </option>
                  ))}
                  <option value="__NOVO__">✨ Adicionar novo equipamento...</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novoEquipamentoNome}
                  onChange={(e) => setNovoEquipamentoNome(e.target.value)}
                  onBlur={() => {
                    if (novoEquipamentoNome.trim()) {
                      setFormData(prev => ({ ...prev, equipamento: novoEquipamentoNome.trim() }));
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && novoEquipamentoNome.trim()) {
                      setFormData(prev => ({ ...prev, equipamento: novoEquipamentoNome.trim() }));
                      setShowNovoEquipamento(false);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do novo equipamento"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNovoEquipamento(false);
                    setNovoEquipamentoNome('');
                  }}
                  className="px-3 py-2 border border-industrial-300 rounded-md hover:bg-industrial-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {equipamentos.length === 0 && !showNovoEquipamento && (
              <p className="text-xs text-industrial-500 mt-1">
                💡 Cadastre equipamentos em "Equipamentos" para seleção rápida
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              Técnico Responsável *
            </label>
            {!showNovoTecnico ? (
              <div className="flex gap-2">
                <select
                  name="tecnico"
                  value={formData.tecnico}
                  onChange={(e) => {
                    if (e.target.value === '__NOVO__') {
                      setShowNovoTecnico(true);
                      setNovoTecnicoNome('');
                    } else {
                      handleInputChange(e);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um técnico</option>
                  {tecnicos.map((tec, index) => (
                    <option key={index} value={tec.nome}>
                      {tec.nome} {tec.registro ? `(${tec.registro})` : ''}
                    </option>
                  ))}
                  <option value="__NOVO__">✨ Adicionar novo técnico...</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novoTecnicoNome}
                  onChange={(e) => setNovoTecnicoNome(e.target.value)}
                  onBlur={() => {
                    if (novoTecnicoNome.trim()) {
                      setFormData(prev => ({ ...prev, tecnico: novoTecnicoNome.trim() }));
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && novoTecnicoNome.trim()) {
                      setFormData(prev => ({ ...prev, tecnico: novoTecnicoNome.trim() }));
                      setShowNovoTecnico(false);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do novo técnico"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNovoTecnico(false);
                    setNovoTecnicoNome('');
                  }}
                  className="px-3 py-2 border border-industrial-300 rounded-md hover:bg-industrial-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {tecnicos.length === 0 && !showNovoTecnico && (
              <p className="text-xs text-industrial-500 mt-1">
                💡 Cadastre técnicos em "Configurações" para seleção rápida
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Tabela de Medições - Fabricação e Calibração */}
      {(tipoRelatorio === 'FABRICACAO' || tipoRelatorio === 'CALIBRACAO') && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-industrial-800">Medições</h3>
            <button
              onClick={adicionarLinha}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Adicionar Linha
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-industrial-100 border-b-2 border-industrial-300">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-industrial-700">
                    Descrição da Cota
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-industrial-700">
                    Equipamento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-industrial-700">
                    Nominal
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-industrial-700">
                    Tol. (+)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-industrial-700">
                    Tol. (-)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-industrial-700">
                    Medido
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicoes.map((medicao, index) => (
                  <tr key={medicao.id} className="border-b border-industrial-200 hover:bg-industrial-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={medicao.descricao}
                        onChange={(e) => handleMedicaoChange(medicao.id, 'descricao', e.target.value)}
                        className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Ex: Diâmetro externo"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={medicao.equipamento}
                        onChange={(e) => handleMedicaoChange(medicao.id, 'equipamento', e.target.value)}
                        className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Selecionar...</option>
                        {equipamentos.map(eq => (
                          <option key={eq.id} value={eq.nome}>
                            {eq.nome}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.0001"
                        value={medicao.nominal}
                        onChange={(e) => handleMedicaoChange(medicao.id, 'nominal', e.target.value)}
                        className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="20.0000"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.0001"
                        value={medicao.tolPos}
                        onChange={(e) => handleMedicaoChange(medicao.id, 'tolPos', e.target.value)}
                        className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="0.0500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.0001"
                        value={medicao.tolNeg}
                        onChange={(e) => handleMedicaoChange(medicao.id, 'tolNeg', e.target.value)}
                        className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="0.0500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.0001"
                        value={medicao.medido}
                        onChange={(e) => handleMedicaoChange(medicao.id, 'medido', e.target.value)}
                        className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="20.0250"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {medicao.status && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            medicao.status === 'OK'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {medicao.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removerLinha(medicao.id)}
                        disabled={medicoes.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remover linha"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seções Específicas para Certificado de Reparo de Apalpadores */}
      {tipoRelatorio === 'REPARO_APALPADOR' && (
        <>
          {/* Testes de Desvio (X, Y, Z) - CALCULADO AUTOMATICAMENTE */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-industrial-800 mb-4">Testes de Desvio (Eixos X, Y, Z)</h3>
            <p className="text-sm text-industrial-600 mb-2">Limites padrão: ±0.0025mm</p>
            <p className="text-xs text-blue-600 mb-4 italic">⚠️ Valores calculados automaticamente com base no teste de repetibilidade (2σ)</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-industrial-100 border-b-2 border-industrial-300">
                    <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">Eixo</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">Desvio + (mm)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">Desvio - (mm)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">Limite Máximo</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">Limite Mínimo</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-industrial-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosReparo.testesDesvio.map((teste, index) => {
                    const desvioPos = parseFloat(teste.desvioPos);
                    const desvioNeg = parseFloat(teste.desvioNeg);
                    const limiteMax = parseFloat(teste.limiteMax);
                    const limiteMin = parseFloat(teste.limiteMin);
                    const statusOK = !isNaN(desvioPos) && !isNaN(desvioNeg) && 
                                     desvioPos <= limiteMax && desvioNeg >= limiteMin;
                    
                    return (
                      <tr key={teste.eixo} className="border-b border-industrial-200 hover:bg-industrial-50">
                        <td className="px-4 py-3 text-center font-bold text-industrial-700">{teste.eixo}</td>
                        <td className="px-4 py-3">
                          <div className="w-full px-2 py-1 border border-industrial-300 rounded bg-gray-100 text-center font-mono text-sm">
                            {teste.eixo === 'Z' ? '-' : (teste.desvioPos || '0.000000')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-full px-2 py-1 border border-industrial-300 rounded bg-gray-100 text-center font-mono text-sm">
                            {teste.desvioNeg || '0.000000'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.0001"
                            value={teste.limiteMax}
                            onChange={(e) => atualizarTesteDesvio(index, 'limiteMax', e.target.value)}
                            className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500 text-center bg-industrial-50"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.0001"
                            value={teste.limiteMin}
                            onChange={(e) => atualizarTesteDesvio(index, 'limiteMin', e.target.value)}
                            className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500 text-center bg-industrial-50"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          {teste.desvioPos !== '' && teste.desvioNeg !== '' && (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                statusOK
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {statusOK ? 'OK' : 'NOK'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Repetibilidade QA319 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-industrial-800 mb-4">Teste de Repetibilidade (QA319)</h3>
            <p className="text-sm text-industrial-600 mb-4">
              50 pontos de toque (10 pontos em cada direção: +X, -X, +Y, -Y, -Z) - Cálculo automático de 2σ por direção
            </p>
            <p className="text-xs text-industrial-500 mb-6">
              Fórmula: 2σ = 2 × √[Σ(Xi - X̅)² / (n-1)]
            </p>
            
            {/* Tabela de Pontos de Toque */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-industrial-100 border-b-2 border-industrial-300">
                    <th className="px-3 py-2 text-center text-xs font-semibold text-industrial-700">Ponto</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-industrial-700">+X</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-industrial-700">-X</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-industrial-700">+Y</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-industrial-700">-Y</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-industrial-700">-Z</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-industrial-200 hover:bg-industrial-50">
                      <td className="px-3 py-2 text-center font-medium text-industrial-700">{i + 1}</td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.000001"
                          value={dadosReparo.repetibilidade.pontosX_positivo[i]}
                          onChange={(e) => atualizarRepetibilidade('X_positivo', i, e.target.value)}
                          className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500 text-center text-xs"
                          placeholder="0.000000"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.000001"
                          value={dadosReparo.repetibilidade.pontosX_negativo[i]}
                          onChange={(e) => atualizarRepetibilidade('X_negativo', i, e.target.value)}
                          className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500 text-center text-xs"
                          placeholder="0.000000"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.000001"
                          value={dadosReparo.repetibilidade.pontosY_positivo[i]}
                          onChange={(e) => atualizarRepetibilidade('Y_positivo', i, e.target.value)}
                          className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500 text-center text-xs"
                          placeholder="0.000000"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.000001"
                          value={dadosReparo.repetibilidade.pontosY_negativo[i]}
                          onChange={(e) => atualizarRepetibilidade('Y_negativo', i, e.target.value)}
                          className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500 text-center text-xs"
                          placeholder="0.000000"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.000001"
                          value={dadosReparo.repetibilidade.pontosZ_negativo[i]}
                          onChange={(e) => atualizarRepetibilidade('Z_negativo', i, e.target.value)}
                          className="w-full px-2 py-1 border border-industrial-300 rounded focus:ring-1 focus:ring-blue-500 text-center text-xs"
                          placeholder="0.000000"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resultados Estatísticos */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-800 mb-1">+X</p>
                <p className="text-xs text-blue-700">Média: {dadosReparo.repetibilidade.mediaX_pos} mm</p>
                <p className="text-sm font-bold text-blue-900">2σ: {dadosReparo.repetibilidade.desvioPatraoX_pos} mm</p>
                {parseFloat(dadosReparo.repetibilidade.desvioPatraoX_pos) > 0 && (
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    parseFloat(dadosReparo.repetibilidade.desvioPatraoX_pos) <= 0.005
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(dadosReparo.repetibilidade.desvioPatraoX_pos) <= 0.005 ? 'OK' : 'NOK'}
                  </span>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-800 mb-1">-X</p>
                <p className="text-xs text-blue-700">Média: {dadosReparo.repetibilidade.mediaX_neg} mm</p>
                <p className="text-sm font-bold text-blue-900">2σ: {dadosReparo.repetibilidade.desvioPatraoX_neg} mm</p>
                {parseFloat(dadosReparo.repetibilidade.desvioPatraoX_neg) > 0 && (
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    parseFloat(dadosReparo.repetibilidade.desvioPatraoX_neg) <= 0.005
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(dadosReparo.repetibilidade.desvioPatraoX_neg) <= 0.005 ? 'OK' : 'NOK'}
                  </span>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800 mb-1">+Y</p>
                <p className="text-xs text-green-700">Média: {dadosReparo.repetibilidade.mediaY_pos} mm</p>
                <p className="text-sm font-bold text-green-900">2σ: {dadosReparo.repetibilidade.desvioPatraoY_pos} mm</p>
                {parseFloat(dadosReparo.repetibilidade.desvioPatraoY_pos) > 0 && (
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    parseFloat(dadosReparo.repetibilidade.desvioPatraoY_pos) <= 0.005
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(dadosReparo.repetibilidade.desvioPatraoY_pos) <= 0.005 ? 'OK' : 'NOK'}
                  </span>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800 mb-1">-Y</p>
                <p className="text-xs text-green-700">Média: {dadosReparo.repetibilidade.mediaY_neg} mm</p>
                <p className="text-sm font-bold text-green-900">2σ: {dadosReparo.repetibilidade.desvioPatraoY_neg} mm</p>
                {parseFloat(dadosReparo.repetibilidade.desvioPatraoY_neg) > 0 && (
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    parseFloat(dadosReparo.repetibilidade.desvioPatraoY_neg) <= 0.005
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(dadosReparo.repetibilidade.desvioPatraoY_neg) <= 0.005 ? 'OK' : 'NOK'}
                  </span>
                )}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-purple-800 mb-1">-Z</p>
                <p className="text-xs text-purple-700">Média: {dadosReparo.repetibilidade.mediaZ_neg} mm</p>
                <p className="text-sm font-bold text-purple-900">2σ: {dadosReparo.repetibilidade.desvioPatraoZ_neg} mm</p>
                {parseFloat(dadosReparo.repetibilidade.desvioPatraoZ_neg) > 0 && (
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    parseFloat(dadosReparo.repetibilidade.desvioPatraoZ_neg) <= 0.005
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(dadosReparo.repetibilidade.desvioPatraoZ_neg) <= 0.005 ? 'OK' : 'NOK'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Checklist de Inspeção */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-industrial-800 mb-4">Checklist de Inspeção Visual e Funcional</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-industrial-50 rounded-lg">
                <input
                  type="checkbox"
                  id="estanqueidade"
                  checked={dadosReparo.checklist.estanqueidade}
                  onChange={(e) => atualizarChecklist('estanqueidade', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="estanqueidade" className="text-industrial-700 font-medium cursor-pointer flex-1">
                  Estanqueidade (sem vazamentos visíveis)
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-industrial-50 rounded-lg">
                <input
                  type="checkbox"
                  id="moduloCinematico"
                  checked={dadosReparo.checklist.moduloCinematico}
                  onChange={(e) => atualizarChecklist('moduloCinematico', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="moduloCinematico" className="text-industrial-700 font-medium cursor-pointer flex-1">
                  Módulo Cinemático (movimento suave e sem travamentos)
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-industrial-50 rounded-lg">
                <input
                  type="checkbox"
                  id="forcaTrigger"
                  checked={dadosReparo.checklist.forcaTrigger}
                  onChange={(e) => atualizarChecklist('forcaTrigger', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="forcaTrigger" className="text-industrial-700 font-medium cursor-pointer flex-1">
                  Força de Trigger (dentro dos parâmetros do fabricante)
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-industrial-50 rounded-lg">
                <input
                  type="checkbox"
                  id="danosEstruturais"
                  checked={dadosReparo.checklist.danosEstruturais}
                  onChange={(e) => atualizarChecklist('danosEstruturais', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="danosEstruturais" className="text-industrial-700 font-medium cursor-pointer flex-1">
                  Danos Estruturais (inspeção de colisões ou uso excessivo)
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-industrial-50 rounded-lg">
                <input
                  type="checkbox"
                  id="capacidadeToque"
                  checked={dadosReparo.checklist.capacidadeToque}
                  onChange={(e) => atualizarChecklist('capacidadeToque', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="capacidadeToque" className="text-industrial-700 font-medium cursor-pointer flex-1">
                  Capacidade de Toque (50 toques a cada 6° de rotação - 360°)
                </label>
              </div>

              <div className="p-3 bg-industrial-50 rounded-lg">
                <p className="text-industrial-700 font-medium mb-3">Comunicação (pelo menos uma deve estar OK):</p>
                <div className="flex gap-6 ml-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dadosReparo.checklist.comunicacao.radio}
                      onChange={(e) => atualizarChecklistComunicacao('radio', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-industrial-700">Rádio</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dadosReparo.checklist.comunicacao.optica}
                      onChange={(e) => atualizarChecklistComunicacao('optica', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-industrial-700">Óptica (Legacy/Modulate)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dadosReparo.checklist.comunicacao.cabo}
                      onChange={(e) => atualizarChecklistComunicacao('cabo', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-industrial-700">Cabo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Upload de Fotos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-industrial-800 mb-4">Fotos Anexas</h3>
        
        <div className="mb-4">
          <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-industrial-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="w-10 h-10 text-industrial-400 mb-2" />
              <span className="text-sm text-industrial-600 font-medium">
                Clique para adicionar fotos
              </span>
              <span className="text-xs text-industrial-500 mt-1">
                PNG, JPG, JPEG até 5MB
              </span>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Grid de Fotos */}
        {fotos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fotos.map((foto) => (
              <div key={foto.id} className="relative group">
                <img
                  src={foto.data}
                  alt={foto.name}
                  className="w-full h-32 object-cover rounded-lg border-2 border-industrial-200"
                />
                <button
                  onClick={() => removerFoto(foto.id)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <X size={16} />
                </button>
                <p className="text-xs text-industrial-600 mt-1 truncate">{foto.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Observações e Ações */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-industrial-700 mb-3">
            Peças Substituídas
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {PECAS_DISPONIVEIS.map((peca) => (
              <label
                key={peca.id}
                className="flex items-center gap-2 p-3 border border-industrial-200 rounded-md hover:bg-industrial-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={pecasSelecionadas.includes(peca.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPecasSelecionadas(prev => [...prev, peca.id]);
                    } else {
                      setPecasSelecionadas(prev => prev.filter(id => id !== peca.id));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-industrial-700">{peca.nome}</span>
              </label>
            ))}
          </div>

          <label className="block text-sm font-medium text-industrial-700 mb-2">
            Observações Técnicas (Geradas Automaticamente)
          </label>
          <div className="relative">
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-industrial-50"
              placeholder="Selecione as peças substituídas acima para gerar automaticamente o texto técnico, ou escreva suas próprias observações..."
            />
            {pecasSelecionadas.length > 0 && (
              <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                <span>✓</span>
                <span>Texto gerado com base em {pecasSelecionadas.length} peça(s) selecionada(s)</span>
              </div>
            )}
          </div>
        </div>

        {/* Parecer Final */}
        <div className="mb-6 p-4 bg-industrial-50 rounded-lg border border-industrial-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-industrial-700">Parecer Final:</span>
            <span
              className={`text-xl font-bold px-6 py-2 rounded-full ${
                calcularParecerFinal() === 'APROVADO'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {calcularParecerFinal()}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={exportarPDF}
            className="flex items-center gap-2 px-6 py-3 bg-industrial-600 text-white rounded-md hover:bg-industrial-700 transition-colors"
          >
            <FileDown size={20} />
            Exportar PDF
          </button>
          <button
            onClick={() => salvarRelatorio(false)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
          <button
            onClick={() => salvarRelatorio(true)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Salvando...' : 'Salvar e Emitir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatorioForm;
