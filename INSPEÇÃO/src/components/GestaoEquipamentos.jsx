import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Wrench,
  X
} from 'lucide-react';
import { useAlert } from './AlertSystem';

const GestaoEquipamentos = () => {
  const alert = useAlert();
  const [equipamentos, setEquipamentos] = useState([]);
  const [showAddEquipamento, setShowAddEquipamento] = useState(false);
  const [showAddCalibracao, setShowAddCalibracao] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [expandedEquipamento, setExpandedEquipamento] = useState(null);

  // Formulário novo equipamento
  const [novoEquipamento, setNovoEquipamento] = useState({
    nome: '',
    fabricante: '',
    modelo: '',
    serie: '',
    tipo: 'medicao', // medicao, teste, inspecao
    localizacao: ''
  });

  // Formulário nova calibração
  const [novaCalibracao, setNovaCalibracao] = useState({
    data: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    periodicidade: '12', // meses
    certificado: '',
    laboratorio: '',
    resultado: 'aprovado', // aprovado, aprovado_com_restricao, reprovado
    observacoes: ''
  });

  // Carregar equipamentos do localStorage
  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const carregarEquipamentos = () => {
    try {
      const stored = localStorage.getItem('enterfix_equipamentos');
      if (stored) {
        setEquipamentos(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    }
  };

  const salvarEquipamentos = (equips) => {
    try {
      localStorage.setItem('enterfix_equipamentos', JSON.stringify(equips));
      setEquipamentos(equips);
    } catch (error) {
      console.error('Erro ao salvar equipamentos:', error);
      alert.error('Não foi possível salvar as alterações.', 'Erro ao Salvar');
    }
  };

  // Adicionar novo equipamento
  const handleAddEquipamento = () => {
    if (!novoEquipamento.nome || !novoEquipamento.serie) {
      alert.warning('Preencha os campos obrigatórios: Nome e Número de Série', 'Campos Obrigatórios');
      return;
    }

    const equipamento = {
      id: Date.now().toString(),
      ...novoEquipamento,
      calibracoes: [],
      createdAt: new Date().toISOString()
    };

    salvarEquipamentos([...equipamentos, equipamento]);
    setNovoEquipamento({
      nome: '',
      fabricante: '',
      modelo: '',
      serie: '',
      tipo: 'medicao',
      localizacao: ''
    });
    setShowAddEquipamento(false);
    alert.success(`Equipamento "${novoEquipamento.nome}" cadastrado com sucesso!`, 'Equipamento Cadastrado');
  };

  // Adicionar calibração
  const handleAddCalibracao = () => {
    if (!novaCalibracao.data || !novaCalibracao.dataVencimento) {
      alert.warning('Preencha os campos obrigatórios: Data da Calibração e Data de Vencimento', 'Campos Obrigatórios');
      return;
    }

    const calibracao = {
      id: Date.now().toString(),
      ...novaCalibracao,
      createdAt: new Date().toISOString()
    };

    const equipamentosAtualizados = equipamentos.map(eq => {
      if (eq.id === equipamentoSelecionado.id) {
        return {
          ...eq,
          calibracoes: [...(eq.calibracoes || []), calibracao]
        };
      }
      return eq;
    });

    salvarEquipamentos(equipamentosAtualizados);
    
    setNovaCalibracao({
      data: new Date().toISOString().split('T')[0],
      dataVencimento: '',
      periodicidade: '12',
      certificado: '',
      laboratorio: '',
      resultado: 'aprovado',
      observacoes: ''
    });
    setShowAddCalibracao(false);
    setEquipamentoSelecionado(null);
    alert.success(
      `Calibração registrada para "${equipamentoSelecionado.nome}". Vencimento: ${new Date(novaCalibracao.dataVencimento).toLocaleDateString('pt-BR')}`,
      'Calibração Registrada'
    );
  };

  // Remover equipamento
  const handleRemoverEquipamento = async (id) => {
    const confirmado = await alert.confirm(
      'Tem certeza que deseja remover este equipamento? Esta ação não pode ser desfeita.',
      'Remover Equipamento'
    );
    if (confirmado) {
      salvarEquipamentos(equipamentos.filter(eq => eq.id !== id));
      alert.success('Equipamento removido com sucesso.', 'Equipamento Removido');
    }
  };

  // Calcular status da calibração
  const calcularStatusCalibracao = (dataVencimento) => {
    if (!dataVencimento) return { status: 'sem_calibracao', dias: null, cor: 'gray' };

    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        status: 'vencida', 
        dias: Math.abs(diffDays), 
        cor: 'red',
        texto: `Vencida há ${Math.abs(diffDays)} dias`,
        icone: AlertTriangle
      };
    } else if (diffDays <= 30) {
      return { 
        status: 'vencendo', 
        dias: diffDays, 
        cor: 'yellow',
        texto: `Vence em ${diffDays} dias`,
        icone: Clock
      };
    } else {
      return { 
        status: 'valida', 
        dias: diffDays, 
        cor: 'green',
        texto: `Válida por ${diffDays} dias`,
        icone: CheckCircle
      };
    }
  };

  // Obter última calibração
  const obterUltimaCalibracao = (equipamento) => {
    if (!equipamento.calibracoes || equipamento.calibracoes.length === 0) {
      return null;
    }
    return equipamento.calibracoes.sort((a, b) => 
      new Date(b.data) - new Date(a.data)
    )[0];
  };

  // Estatísticas
  const calcularEstatisticas = () => {
    let total = equipamentos.length;
    let validos = 0;
    let vencendo = 0;
    let vencidos = 0;
    let semCalibracao = 0;

    equipamentos.forEach(eq => {
      const ultima = obterUltimaCalibracao(eq);
      if (!ultima) {
        semCalibracao++;
      } else {
        const status = calcularStatusCalibracao(ultima.dataVencimento);
        if (status.status === 'valida') validos++;
        else if (status.status === 'vencendo') vencendo++;
        else if (status.status === 'vencida') vencidos++;
      }
    });

    return { total, validos, vencendo, vencidos, semCalibracao };
  };

  const stats = calcularEstatisticas();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-industrial-900 mb-2">
          Gestão de Equipamentos
        </h1>
        <p className="text-industrial-600">
          Controle de calibrações e alertas de vencimento
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-industrial-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-industrial-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-industrial-900">{stats.total}</p>
            </div>
            <Wrench className="text-industrial-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-industrial-600 mb-1">Válidos</p>
              <p className="text-2xl font-bold text-green-600">{stats.validos}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-industrial-600 mb-1">Vencendo</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.vencendo}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-industrial-600 mb-1">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-industrial-600 mb-1">Sem Calibração</p>
              <p className="text-2xl font-bold text-gray-600">{stats.semCalibracao}</p>
            </div>
            <AlertTriangle className="text-gray-400" size={32} />
          </div>
        </div>
      </div>

      {/* Botão Adicionar */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddEquipamento(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          Adicionar Equipamento
        </button>
      </div>

      {/* Lista de Equipamentos */}
      <div className="space-y-4">
        {equipamentos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Wrench size={48} className="mx-auto text-industrial-300 mb-4" />
            <p className="text-industrial-600 text-lg">Nenhum equipamento cadastrado</p>
            <p className="text-industrial-400 text-sm mt-2">
              Clique em "Adicionar Equipamento" para começar
            </p>
          </div>
        ) : (
          equipamentos.map(equipamento => {
            const ultima = obterUltimaCalibracao(equipamento);
            const statusCalibracao = ultima 
              ? calcularStatusCalibracao(ultima.dataVencimento)
              : { status: 'sem_calibracao', cor: 'gray', texto: 'Sem calibração', icone: AlertTriangle };

            const StatusIcon = statusCalibracao.icone;
            const isExpanded = expandedEquipamento === equipamento.id;

            return (
              <div 
                key={equipamento.id} 
                className={`bg-white rounded-lg shadow-md border-l-4 ${
                  statusCalibracao.cor === 'red' ? 'border-red-500' :
                  statusCalibracao.cor === 'yellow' ? 'border-yellow-500' :
                  statusCalibracao.cor === 'green' ? 'border-green-500' :
                  'border-gray-400'
                }`}
              >
                {/* Header do Card */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-industrial-900">
                          {equipamento.nome}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusCalibracao.cor === 'red' ? 'bg-red-100 text-red-800' :
                          statusCalibracao.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          statusCalibracao.cor === 'green' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {statusCalibracao.texto}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-industrial-600">
                        <div>
                          <span className="font-medium">Fabricante:</span> {equipamento.fabricante || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Modelo:</span> {equipamento.modelo || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Série:</span> {equipamento.serie}
                        </div>
                        <div>
                          <span className="font-medium">Tipo:</span> {
                            equipamento.tipo === 'medicao' ? 'Medição' :
                            equipamento.tipo === 'teste' ? 'Teste' :
                            'Inspeção'
                          }
                        </div>
                        {equipamento.localizacao && (
                          <div className="col-span-2">
                            <span className="font-medium">Localização:</span> {equipamento.localizacao}
                          </div>
                        )}
                      </div>

                      {ultima && (
                        <div className="mt-4 p-3 bg-industrial-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-industrial-600" />
                            <span className="text-sm font-medium text-industrial-700">
                              Última Calibração
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-industrial-600">
                            <div>
                              <span className="font-medium">Data:</span> {new Date(ultima.data).toLocaleDateString('pt-BR')}
                            </div>
                            <div>
                              <span className="font-medium">Vencimento:</span> {new Date(ultima.dataVencimento).toLocaleDateString('pt-BR')}
                            </div>
                            <div>
                              <span className="font-medium">Certificado:</span> {ultima.certificado || 'N/A'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEquipamentoSelecionado(equipamento);
                          setShowAddCalibracao(true);
                        }}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                        title="Adicionar Calibração"
                      >
                        <Plus size={18} />
                      </button>
                      <button
                        onClick={() => setExpandedEquipamento(isExpanded ? null : equipamento.id)}
                        className="bg-industrial-600 text-white p-2 rounded hover:bg-industrial-700 transition"
                        title="Ver Histórico"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => handleRemoverEquipamento(equipamento.id)}
                        className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                        title="Remover Equipamento"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Histórico Expandido */}
                {isExpanded && (
                  <div className="border-t border-industrial-200 p-6 bg-industrial-50">
                    <h4 className="font-bold text-industrial-900 mb-4 flex items-center gap-2">
                      <FileText size={20} />
                      Histórico de Calibrações ({equipamento.calibracoes?.length || 0})
                    </h4>

                    {!equipamento.calibracoes || equipamento.calibracoes.length === 0 ? (
                      <p className="text-industrial-500 text-center py-4">
                        Nenhuma calibração registrada
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {equipamento.calibracoes
                          .sort((a, b) => new Date(b.data) - new Date(a.data))
                          .map((cal, index) => {
                            const statusCal = calcularStatusCalibracao(cal.dataVencimento);
                            return (
                              <div 
                                key={cal.id} 
                                className={`bg-white p-4 rounded-lg border-l-4 ${
                                  statusCal.cor === 'red' ? 'border-red-500' :
                                  statusCal.cor === 'yellow' ? 'border-yellow-500' :
                                  'border-green-500'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-industrial-900">
                                    Calibração #{equipamento.calibracoes.length - index}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    cal.resultado === 'aprovado' ? 'bg-green-100 text-green-800' :
                                    cal.resultado === 'aprovado_com_restricao' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {cal.resultado === 'aprovado' ? 'Aprovado' :
                                     cal.resultado === 'aprovado_com_restricao' ? 'Aprovado c/ Restrição' :
                                     'Reprovado'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm text-industrial-600">
                                  <div>
                                    <span className="font-medium">Data:</span> {new Date(cal.data).toLocaleDateString('pt-BR')}
                                  </div>
                                  <div>
                                    <span className="font-medium">Vencimento:</span> {new Date(cal.dataVencimento).toLocaleDateString('pt-BR')}
                                  </div>
                                  <div>
                                    <span className="font-medium">Periodicidade:</span> {cal.periodicidade} meses
                                  </div>
                                  <div>
                                    <span className="font-medium">Certificado:</span> {cal.certificado || 'N/A'}
                                  </div>
                                  {cal.laboratorio && (
                                    <div className="col-span-2">
                                      <span className="font-medium">Laboratório:</span> {cal.laboratorio}
                                    </div>
                                  )}
                                  {cal.observacoes && (
                                    <div className="col-span-2">
                                      <span className="font-medium">Observações:</span> {cal.observacoes}
                                    </div>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                  <StatusIcon size={16} className={`text-${statusCal.cor}-500`} />
                                  <span className={`text-${statusCal.cor}-700 font-medium`}>
                                    {statusCal.texto}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Adicionar Equipamento */}
      {showAddEquipamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-industrial-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-industrial-900 flex items-center gap-2">
                <Plus size={24} />
                Adicionar Equipamento
              </h2>
              <button
                onClick={() => setShowAddEquipamento(false)}
                className="text-industrial-400 hover:text-industrial-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Nome do Equipamento *
                </label>
                <input
                  type="text"
                  value={novoEquipamento.nome}
                  onChange={(e) => setNovoEquipamento({ ...novoEquipamento, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Paquímetro Digital"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    Fabricante
                  </label>
                  <input
                    type="text"
                    value={novoEquipamento.fabricante}
                    onChange={(e) => setNovoEquipamento({ ...novoEquipamento, fabricante: e.target.value })}
                    className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Mitutoyo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={novoEquipamento.modelo}
                    onChange={(e) => setNovoEquipamento({ ...novoEquipamento, modelo: e.target.value })}
                    className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: CD-6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Número de Série *
                </label>
                <input
                  type="text"
                  value={novoEquipamento.serie}
                  onChange={(e) => setNovoEquipamento({ ...novoEquipamento, serie: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Tipo de Equipamento
                </label>
                <select
                  value={novoEquipamento.tipo}
                  onChange={(e) => setNovoEquipamento({ ...novoEquipamento, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="medicao">Medição</option>
                  <option value="teste">Teste</option>
                  <option value="inspecao">Inspeção</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Localização
                </label>
                <input
                  type="text"
                  value={novoEquipamento.localizacao}
                  onChange={(e) => setNovoEquipamento({ ...novoEquipamento, localizacao: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Laboratório - Sala 2"
                />
              </div>
            </div>

            <div className="p-6 border-t border-industrial-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAddEquipamento(false)}
                className="px-6 py-2 border border-industrial-300 rounded hover:bg-industrial-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEquipamento}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Calibração */}
      {showAddCalibracao && equipamentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-industrial-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-industrial-900 flex items-center gap-2">
                  <Calendar size={24} />
                  Adicionar Calibração
                </h2>
                <p className="text-sm text-industrial-600 mt-1">
                  {equipamentoSelecionado.nome}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddCalibracao(false);
                  setEquipamentoSelecionado(null);
                }}
                className="text-industrial-400 hover:text-industrial-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    Data da Calibração *
                  </label>
                  <input
                    type="date"
                    value={novaCalibracao.data}
                    onChange={(e) => setNovaCalibracao({ ...novaCalibracao, data: e.target.value })}
                    className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    Periodicidade (meses)
                  </label>
                  <select
                    value={novaCalibracao.periodicidade}
                    onChange={(e) => {
                      const meses = parseInt(e.target.value);
                      const dataBase = new Date(novaCalibracao.data);
                      const dataVenc = new Date(dataBase);
                      dataVenc.setMonth(dataVenc.getMonth() + meses);
                      setNovaCalibracao({ 
                        ...novaCalibracao, 
                        periodicidade: e.target.value,
                        dataVencimento: dataVenc.toISOString().split('T')[0]
                      });
                    }}
                    className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="6">6 meses</option>
                    <option value="12">12 meses (padrão)</option>
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  value={novaCalibracao.dataVencimento}
                  onChange={(e) => setNovaCalibracao({ ...novaCalibracao, dataVencimento: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Número do Certificado
                </label>
                <input
                  type="text"
                  value={novaCalibracao.certificado}
                  onChange={(e) => setNovaCalibracao({ ...novaCalibracao, certificado: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: CERT-12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Laboratório
                </label>
                <input
                  type="text"
                  value={novaCalibracao.laboratorio}
                  onChange={(e) => setNovaCalibracao({ ...novaCalibracao, laboratorio: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: INMETRO, RBC, etc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Resultado da Calibração
                </label>
                <select
                  value={novaCalibracao.resultado}
                  onChange={(e) => setNovaCalibracao({ ...novaCalibracao, resultado: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="aprovado">Aprovado</option>
                  <option value="aprovado_com_restricao">Aprovado com Restrição</option>
                  <option value="reprovado">Reprovado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={novaCalibracao.observacoes}
                  onChange={(e) => setNovaCalibracao({ ...novaCalibracao, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-industrial-300 rounded focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observações adicionais sobre a calibração"
                />
              </div>
            </div>

            <div className="p-6 border-t border-industrial-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddCalibracao(false);
                  setEquipamentoSelecionado(null);
                }}
                className="px-6 py-2 border border-industrial-300 rounded hover:bg-industrial-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCalibracao}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Calendar size={18} />
                Registrar Calibração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestaoEquipamentos;
