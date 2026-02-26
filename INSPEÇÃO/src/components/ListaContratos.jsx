import React, { useState, useEffect } from 'react';
import { 
  FileSignature, Plus, Search, Filter, Calendar, AlertCircle, 
  CheckCircle, Clock, XCircle, Eye, Edit, Download, FileText 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAlert } from '../components/AlertSystem';
import { gerarPDFContrato } from '../utils/contratosPDF';

const ListaContratos = ({ onNovoContrato, onEditarContrato }) => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: 'todos',
    status: 'todos',
    vencimento: 'todos'
  });
  const alert = useAlert();

  const tiposContrato = [
    { value: 'todos', label: 'Todos os Tipos' },
    { value: 'prestacao_servico', label: 'Prestação de Serviço' },
    { value: 'comodato', label: 'Comodato' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'sla', label: 'SLA' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'gestao_parque', label: 'Gestão de Parque' },
    { value: 'suporte', label: 'Suporte Técnico' },
    { value: 'validacao', label: 'Validação' },
    { value: 'nda', label: 'Confidencialidade (NDA)' }
  ];

  const statusContrato = [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'minuta', label: 'Minuta', color: 'gray' },
    { value: 'ativo', label: 'Ativo', color: 'green' },
    { value: 'suspenso', label: 'Suspenso', color: 'yellow' },
    { value: 'encerrado', label: 'Encerrado', color: 'blue' },
    { value: 'cancelado', label: 'Cancelado', color: 'red' }
  ];

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vw_contratos_completos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContratos(data || []);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      alert.error('Erro ao carregar contratos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (contrato) => {
    try {
      alert.info('Gerando PDF do contrato...', 'Processando');
      
      // Buscar dados completos do cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', contrato.cliente_id)
        .single();

      if (clienteError) throw clienteError;

      // Preparar dados completos para o PDF
      const dadosCompletos = {
        ...contrato,
        cliente: clienteData
      };

      // Gerar PDF (busca dados da empresa do Supabase automaticamente)
      const { blob, filename } = await gerarPDFContrato(dadosCompletos, null, supabase);

      // Fazer download no navegador
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert.success('PDF baixado com sucesso!', 'Documento');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert.error('Erro ao gerar PDF do contrato: ' + error.message, 'Erro');
    }
  };

  const contratosFiltrados = contratos.filter(contrato => {
    // Filtro de busca
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      const match = (
        contrato.numero_contrato?.toLowerCase().includes(busca) ||
        contrato.razao_social?.toLowerCase().includes(busca) ||
        contrato.nome_fantasia?.toLowerCase().includes(busca) ||
        contrato.numero_os_bling?.toLowerCase().includes(busca)
      );
      if (!match) return false;
    }

    // Filtro de tipo
    if (filtros.tipo !== 'todos' && contrato.tipo_contrato !== filtros.tipo) {
      return false;
    }

    // Filtro de status
    if (filtros.status !== 'todos' && contrato.status !== filtros.status) {
      return false;
    }

    // Filtro de vencimento
    if (filtros.vencimento !== 'todos') {
      if (filtros.vencimento === 'vencidos' && contrato.status_vencimento !== 'vencido') {
        return false;
      }
      if (filtros.vencimento === 'proximos' && !['vence_em_30_dias', 'vence_em_60_dias'].includes(contrato.status_vencimento)) {
        return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status) => {
    const configs = {
      minuta: { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText },
      ativo: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      suspenso: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      encerrado: { bg: 'bg-blue-100', text: 'text-blue-700', icon: XCircle },
      cancelado: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
    };

    const config = configs[status] || configs.minuta;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getVencimentoBadge = (statusVencimento, diasAteVencimento) => {
    if (statusVencimento === 'indeterminado') {
      return <span className="text-xs text-gray-500">Prazo indeterminado</span>;
    }

    if (statusVencimento === 'vencido') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <AlertCircle size={14} />
          Vencido há {Math.abs(diasAteVencimento)} dias
        </span>
      );
    }

    if (statusVencimento === 'vence_em_30_dias') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          <Clock size={14} />
          Vence em {diasAteVencimento} dias
        </span>
      );
    }

    if (statusVencimento === 'vence_em_60_dias') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <Calendar size={14} />
          Vence em {diasAteVencimento} dias
        </span>
      );
    }

    return (
      <span className="text-xs text-gray-600">
        Vence em {diasAteVencimento} dias
      </span>
    );
  };

  const formatarTipoContrato = (tipo) => {
    const tipos = {
      prestacao_servico: 'Prestação de Serviço',
      comodato: 'Comodato',
      manutencao: 'Manutenção',
      sla: 'SLA',
      consultoria: 'Consultoria',
      gestao_parque: 'Gestão de Parque',
      suporte: 'Suporte Técnico',
      validacao: 'Validação',
      nda: 'NDA'
    };
    return tipos[tipo] || tipo;
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-industrial-900 flex items-center gap-3">
              <FileSignature className="text-blue-600" size={32} />
              Gerenciamento de Contratos
            </h1>
            <p className="text-gray-600 mt-1">
              Controle completo de contratos técnicos e comerciais
            </p>
          </div>
          <button
            onClick={onNovoContrato}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={20} />
            Novo Contrato
          </button>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Contratos</p>
                <p className="text-2xl font-bold text-industrial-900">{contratos.length}</p>
              </div>
              <FileSignature className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {contratos.filter(c => c.status === 'ativo').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencendo (30 dias)</p>
                <p className="text-2xl font-bold text-orange-600">
                  {contratos.filter(c => c.status_vencimento === 'vence_em_30_dias').length}
                </p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">
                  {contratos.filter(c => c.status_vencimento === 'vencido').length}
                </p>
              </div>
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente, OS..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtro Tipo */}
            <div>
              <select
                value={filtros.tipo}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {tiposContrato.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>

            {/* Filtro Status */}
            <div>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusContrato.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Contratos */}
      {contratosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <FileSignature className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum contrato encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            {filtros.busca || filtros.tipo !== 'todos' || filtros.status !== 'todos'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando seu primeiro contrato'}
          </p>
          {!filtros.busca && filtros.tipo === 'todos' && filtros.status === 'todos' && (
            <button
              onClick={onNovoContrato}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Criar Primeiro Contrato
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {contratosFiltrados.map(contrato => (
            <div
              key={contrato.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-industrial-900">
                      {contrato.numero_contrato}
                    </h3>
                    {getStatusBadge(contrato.status)}
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {formatarTipoContrato(contrato.tipo_contrato)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cliente</p>
                      <p className="font-medium text-gray-900">
                        {contrato.nome_fantasia || contrato.razao_social}
                      </p>
                      {contrato.cnpj && (
                        <p className="text-sm text-gray-600">
                          CNPJ: {contrato.cnpj}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Vigência</p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Início:</span> {formatarData(contrato.data_inicio)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Fim:</span> {formatarData(contrato.data_fim) || 'Indeterminado'}
                      </p>
                      <div className="mt-1">
                        {getVencimentoBadge(contrato.status_vencimento, contrato.dias_ate_vencimento)}
                      </div>
                    </div>

                    <div>
                      {contrato.numero_os_bling && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">OS Bling</p>
                          <p className="text-sm font-mono text-blue-600">{contrato.numero_os_bling}</p>
                        </div>
                      )}
                      {contrato.valor_total && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Valor Total</p>
                          <p className="text-lg font-semibold text-green-600">
                            {new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(contrato.valor_total)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Visualizar"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => onEditarContrato(contrato)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(contrato)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                    title="Baixar PDF"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>

              {contrato.observacoes && (
                <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Observações:</span> {contrato.observacoes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaContratos;
