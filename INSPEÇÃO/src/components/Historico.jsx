import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Calendar, Edit, Copy, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDate } from '../utils/metrologyUtils';
import { generatePDF } from '../utils/pdfGenerator';
import { useAlert } from './AlertSystem';

const Historico = ({ onEditRelatorio, onDuplicarRelatorio }) => {
  const alert = useAlert();
  const [relatorios, setRelatorios] = useState([]);
  const [filteredRelatorios, setFilteredRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('TODOS');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [selectedRelatorio, setSelectedRelatorio] = useState(null);

  useEffect(() => {
    loadRelatorios();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterTipo, filterStatus, relatorios]);

  const loadRelatorios = async () => {
    try {
      setLoading(true);
      // Otimização: Não carregar fotos no list (só quando visualizar)
      const { data, error } = await supabase
        .from('relatorios')
        .select('id, tipo, cliente, projeto_os, status_final, status_relatorio, tecnico_nome, created_at, dados')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Remover fotos dos dados para list view (economia de memória)
      const relatoriosOtimizados = (data || []).map(rel => ({
        ...rel,
        dados: {
          ...rel.dados,
          fotos: rel.dados.fotos ? [`${rel.dados.fotos.length} foto(s)`] : []
        }
      }));

      setRelatorios(relatoriosOtimizados);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      alert.error('Não foi possível carregar o histórico. Verifique sua conexão.', 'Erro ao Carregar');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...relatorios];

    // Filtro de busca (cliente ou número de desenho)
    if (searchTerm) {
      filtered = filtered.filter(rel =>
        rel.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rel.dados.numeroDesenho && rel.dados.numeroDesenho.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro de tipo
    if (filterTipo !== 'TODOS') {
      filtered = filtered.filter(rel => rel.tipo === filterTipo);
    }

    // Filtro de status
    if (filterStatus !== 'TODOS') {
      filtered = filtered.filter(rel => rel.status_final === filterStatus);
    }

    setFilteredRelatorios(filtered);
  };

  const viewRelatorio = (relatorio) => {
    setSelectedRelatorio(relatorio);
  };

  const closeModal = () => {
    setSelectedRelatorio(null);
  };

  const downloadRelatorio = async (relatorio) => {
    const dadosRelatorio = {
      tipo: relatorio.tipo,
      numeroRelatorio: relatorio.dados.numeroRelatorio,
      cliente: relatorio.cliente,
      projetoOS: relatorio.projeto_os,
      ...relatorio.dados,
      parecerFinal: relatorio.status_final,
      tecnico: relatorio.tecnico_nome
    };

    await generatePDF(dadosRelatorio);
  };

  const duplicarRelatorio = async (relatorio) => {
    try {
      const { data, error } = await supabase
        .from('relatorios')
        .select('*')
        .eq('id', relatorio.id)
        .single();

      if (error) throw error;

      if (data) {
        // Criar cópia sem ID e com status rascunho
        const novoRelatorio = {
          ...data,
          id: undefined,
          created_at: undefined,
          status_relatorio: 'rascunho',
          dados: {
            ...data.dados,
            versao: 1,
            numeroRelatorio: undefined, // Será gerado novo número
            relatorioOriginal: null,
            data: new Date().toISOString().split('T')[0],
          }
        };

        const { data: novoData, error: insertError } = await supabase
          .from('relatorios')
          .insert([novoRelatorio])
          .select();

        if (insertError) throw insertError;

        alert.success(`Relatório duplicado com sucesso!`, 'Duplicado!');
        loadRelatorios(); // Recarregar lista

        // Se houver callback para edição, abrir o novo relatório
        if (onDuplicarRelatorio && novoData[0]) {
          onDuplicarRelatorio(novoData[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao duplicar relatório:', error);
      alert.error('Não foi possível duplicar o relatório.', 'Erro ao Duplicar');
    }
  };

  const excluirRelatorio = async (relatorio) => {
    const confirmado = await alert.confirm(
      `Tem certeza que deseja excluir o relatório ${relatorio.dados.numeroRelatorio || 'sem número'}?\n\nEsta ação não pode ser desfeita.`,
      'Confirmar Exclusão'
    );

    if (!confirmado) return;

    try {
      const { error } = await supabase
        .from('relatorios')
        .delete()
        .eq('id', relatorio.id);

      if (error) throw error;

      alert.success('Relatório excluído com sucesso!', 'Excluído!');
      loadRelatorios(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      alert.error('Não foi possível excluir o relatório.', 'Erro ao Excluir');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-industrial-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-industrial-800 mb-2">Histórico de Relatórios</h1>
        <p className="text-industrial-600">Busque e gerencie relatórios anteriores</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-industrial-700 mb-2">
              Buscar por Cliente ou Nº Desenho
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full pl-10 pr-4 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-industrial-400" size={20} />
            </div>
          </div>

          {/* Filtro de Tipo */}
          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-4 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              <option value="FABRICACAO">Fabricação</option>
              <option value="CALIBRACAO">Calibração</option>
              <option value="REPARO_APALPADOR">Certificado de Reparo</option>
            </select>
          </div>

          {/* Filtro de Status */}
          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              <option value="APROVADO">Aprovado</option>
              <option value="REPROVADO">Reprovado</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-industrial-600">
          Exibindo {filteredRelatorios.length} de {relatorios.length} relatórios
        </div>
      </div>

      {/* Lista de Relatórios */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredRelatorios.length === 0 ? (
          <div className="text-center py-12 text-industrial-600">
            <Filter size={48} className="mx-auto mb-4 text-industrial-300" />
            <p>Nenhum relatório encontrado</p>
            <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-industrial-200 bg-industrial-50">
                  <th className="text-left py-4 px-4 font-semibold text-industrial-700">Nº Relatório</th>
                  <th className="text-left py-4 px-4 font-semibold text-industrial-700">Cliente</th>
                  <th className="text-left py-4 px-4 font-semibold text-industrial-700">Tipo</th>
                  <th className="text-left py-4 px-4 font-semibold text-industrial-700">Técnico</th>
                  <th className="text-center py-4 px-4 font-semibold text-industrial-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-industrial-700">Data</th>
                  <th className="text-center py-4 px-4 font-semibold text-industrial-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRelatorios.map((rel) => (
                  <tr key={rel.id} className="border-b border-industrial-100 hover:bg-industrial-50">
                    <td className="py-3 px-4 font-mono text-sm text-industrial-800">
                      {rel.dados.numeroRelatorio || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-industrial-800 font-medium">{rel.cliente}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {rel.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-industrial-600">{rel.tecnico_nome}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            rel.status_final === 'APROVADO'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rel.status_final}
                        </span>
                        {rel.status_relatorio && (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              rel.status_relatorio === 'emitido'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {rel.status_relatorio === 'emitido' ? '✓ Emitido' : '📝 Rascunho'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-industrial-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(rel.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewRelatorio(rel)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => duplicarRelatorio(rel)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                          title="Duplicar Relatório"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => onEditRelatorio && onEditRelatorio(rel.id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                          title="Editar (Nova Versão)"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => downloadRelatorio(rel)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => excluirRelatorio(rel)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Excluir Relatório"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Visualização */}
      {selectedRelatorio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-industrial-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-industrial-800">
                {selectedRelatorio.dados.numeroRelatorio}
              </h3>
              <button
                onClick={closeModal}
                className="text-industrial-600 hover:text-industrial-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informações Gerais */}
              <div>
                <h4 className="font-semibold text-industrial-700 mb-2">Informações Gerais</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Cliente:</span> {selectedRelatorio.cliente}</div>
                  <div><span className="font-medium">Tipo:</span> {selectedRelatorio.tipo}</div>
                  <div><span className="font-medium">Técnico:</span> {selectedRelatorio.tecnico_nome}</div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        selectedRelatorio.status_final === 'APROVADO'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedRelatorio.status_final}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medições */}
              {selectedRelatorio.dados.medicoes && selectedRelatorio.dados.medicoes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-industrial-700 mb-2">Medições</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-industrial-100">
                          <th className="px-3 py-2 text-left">Descrição</th>
                          <th className="px-3 py-2 text-center">Nominal</th>
                          <th className="px-3 py-2 text-center">Tol. (+)</th>
                          <th className="px-3 py-2 text-center">Tol. (-)</th>
                          <th className="px-3 py-2 text-center">Medido</th>
                          <th className="px-3 py-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRelatorio.dados.medicoes.map((med, index) => (
                          <tr key={index} className="border-b border-industrial-100">
                            <td className="px-3 py-2">{med.descricao}</td>
                            <td className="px-3 py-2 text-center">{med.nominal}</td>
                            <td className="px-3 py-2 text-center">{med.tolPos}</td>
                            <td className="px-3 py-2 text-center">{med.tolNeg}</td>
                            <td className="px-3 py-2 text-center">{med.medido}</td>
                            <td className="px-3 py-2 text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  med.status === 'OK'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {med.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Observações */}
              {selectedRelatorio.dados.observacoes && (
                <div>
                  <h4 className="font-semibold text-industrial-700 mb-2">Observações</h4>
                  <p className="text-sm text-industrial-600 bg-industrial-50 p-3 rounded">
                    {selectedRelatorio.dados.observacoes}
                  </p>
                </div>
              )}

              {/* Botão de Download */}
              <div className="flex justify-end">
                <button
                  onClick={() => downloadRelatorio(selectedRelatorio)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historico;
