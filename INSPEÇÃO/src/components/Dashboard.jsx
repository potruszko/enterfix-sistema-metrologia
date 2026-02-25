import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateStatistics } from '../utils/metrologyUtils';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRelatorios: 0,
    aprovados: 0,
    reprovados: 0,
    relatoriosHoje: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar todos os relatórios
      const { data: relatorios, error } = await supabase
        .from('relatorios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (relatorios) {
        // Calcular estatísticas
        const total = relatorios.length;
        const aprovados = relatorios.filter(r => r.status_final === 'APROVADO').length;
        const reprovados = relatorios.filter(r => r.status_final === 'REPROVADO').length;
        
        // Relatórios de hoje
        const hoje = new Date().toISOString().split('T')[0];
        const relatoriosHoje = relatorios.filter(r => {
          const dataRelatorio = new Date(r.created_at).toISOString().split('T')[0];
          return dataRelatorio === hoje;
        }).length;

        setStats({
          totalRelatorios: total,
          aprovados,
          reprovados,
          relatoriosHoje
        });

        // Últimos 5 relatórios
        setRecentReports(relatorios.slice(0, 5));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-industrial-600 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-industrial-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('600', '100')}`}>
          <Icon className={color.replace('border-', 'text-')} size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-industrial-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-industrial-800 mb-2">Dashboard</h1>
        <p className="text-industrial-600">Visão geral dos relatórios de metrologia</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total de Relatórios"
          value={stats.totalRelatorios}
          color="border-blue-600"
          bgColor="bg-white"
        />
        <StatCard
          icon={CheckCircle}
          title="Aprovados"
          value={stats.aprovados}
          color="border-green-600"
          bgColor="bg-white"
        />
        <StatCard
          icon={XCircle}
          title="Reprovados"
          value={stats.reprovados}
          color="border-red-600"
          bgColor="bg-white"
        />
        <StatCard
          icon={Calendar}
          title="Relatórios Hoje"
          value={stats.relatoriosHoje}
          color="border-purple-600"
          bgColor="bg-white"
        />
      </div>

      {/* Gráfico de Taxa de Aprovação */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-industrial-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-600" />
          Taxa de Aprovação
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-green-600">
                    Aprovados: {stats.aprovados}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-red-600">
                    Reprovados: {stats.reprovados}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-lg bg-industrial-200">
                {stats.totalRelatorios > 0 && (
                  <>
                    <div
                      style={{ width: `${(stats.aprovados / stats.totalRelatorios) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                    <div
                      style={{ width: `${(stats.reprovados / stats.totalRelatorios) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                    ></div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-industrial-800">
              {stats.totalRelatorios > 0
                ? Math.round((stats.aprovados / stats.totalRelatorios) * 100)
                : 0}%
            </div>
            <div className="text-sm text-industrial-600">Taxa de Aprovação</div>
          </div>
        </div>
      </div>

      {/* Relatórios Recentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-industrial-800 mb-4">Relatórios Recentes</h2>
        {recentReports.length === 0 ? (
          <div className="text-center py-8 text-industrial-600">
            <FileText size={48} className="mx-auto mb-4 text-industrial-300" />
            <p>Nenhum relatório encontrado</p>
            <p className="text-sm mt-2">Crie seu primeiro relatório para começar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-industrial-200">
                  <th className="text-left py-3 px-4 font-semibold text-industrial-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-industrial-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-industrial-700">Técnico</th>
                  <th className="text-center py-3 px-4 font-semibold text-industrial-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-industrial-700">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((rel) => (
                  <tr key={rel.id} className="border-b border-industrial-100 hover:bg-industrial-50">
                    <td className="py-3 px-4 text-industrial-800">{rel.cliente}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {rel.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-industrial-600">{rel.tecnico_nome}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          rel.status_final === 'APROVADO'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rel.status_final}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-industrial-600">
                      {new Date(rel.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
