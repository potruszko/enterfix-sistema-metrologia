import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Building, User, Wrench, FileText, Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { buscarConfiguracoesEmpresa, atualizarConfiguracoesEmpresa } from '../utils/configuracoesEmpresa';

const Configuracoes = () => {
  const [config, setConfig] = useState({
    nomeEmpresa: 'Enterfix Metrologia',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: 'contato@enterfix.com.br',
    website: 'www.enterfix.com.br',
  });

  const [tecnicos, setTecnicos] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [novoTecnico, setNovoTecnico] = useState({ nome: '', registro: '' });
  const [novoEquipamento, setNovoEquipamento] = useState({ nome: '', identificacao: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar configurações do Supabase ao montar
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);
      
      // Buscar configurações da empresa do Supabase
      const dadosEmpresa = await buscarConfiguracoesEmpresa(supabase);
      
      if (dadosEmpresa) {
        setConfig({
          nomeEmpresa: dadosEmpresa.razaoSocial || 'Enterfix Metrologia',
          cnpj: dadosEmpresa.cnpj || '',
          endereco: dadosEmpresa.endereco || '',
          telefone: dadosEmpresa.telefone || '',
          email: dadosEmpresa.email || 'contato@enterfix.com.br',
          website: dadosEmpresa.website || 'www.enterfix.com.br',
        });
      }

      // Tecnicos e equipamentos ainda no localStorage (por enquanto)
      const savedTecnicos = localStorage.getItem('enterfix_tecnicos');
      const savedEquipamentos = localStorage.getItem('enterfix_equipamentos');
      
      if (savedTecnicos) {
        setTecnicos(JSON.parse(savedTecnicos));
      }
      if (savedEquipamentos) {
        setEquipamentos(JSON.parse(savedEquipamentos));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Fallback para localStorage se houver erro
      const savedConfig = localStorage.getItem('enterfix_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({
          nomeEmpresa: parsedConfig.nomeEmpresa || 'Enterfix Metrologia',
          cnpj: parsedConfig.cnpj || '',
          endereco: parsedConfig.endereco || '',
          telefone: parsedConfig.telefone || '',
          email: parsedConfig.email || 'contato@enterfix.com.br',
          website: parsedConfig.website || 'www.enterfix.com.br',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const adicionarTecnico = () => {
    if (novoTecnico.nome.trim()) {
      setTecnicos(prev => [...prev, { 
        id: Date.now(), 
        ...novoTecnico 
      }]);
      setNovoTecnico({ nome: '', registro: '' });
    }
  };

  const removerTecnico = (id) => {
    setTecnicos(prev => prev.filter(t => t.id !== id));
  };

  const adicionarEquipamento = () => {
    if (novoEquipamento.nome.trim()) {
      setEquipamentos(prev => [...prev, { 
        id: Date.now(), 
        ...novoEquipamento 
      }]);
      setNovoEquipamento({ nome: '', identificacao: '' });
    }
  };

  const removerEquipamento = (id) => {
    setEquipamentos(prev => prev.filter(e => e.id !== id));
  };

  const saveConfig = async () => {
    try {
      // Salvar configurações da empresa no Supabase
      const resultado = await atualizarConfiguracoesEmpresa(supabase, {
        nomeEmpresa: config.nomeEmpresa,
        cnpj: config.cnpj,
        endereco: config.endereco,
        telefone: config.telefone,
        email: config.email,
        website: config.website,
      });

      if (!resultado.success) {
        throw new Error(resultado.error);
      }

      // Tecnicos e equipamentos ainda no localStorage
      localStorage.setItem('enterfix_tecnicos', JSON.stringify(tecnicos));
      localStorage.setItem('enterfix_equipamentos', JSON.stringify(equipamentos));
      
      // Também manter backup no localStorage
      localStorage.setItem('enterfix_config', JSON.stringify(config));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Verifique sua conexão e tente novamente.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-industrial-800 mb-2">Configurações do Sistema</h1>
        <p className="text-industrial-600">Gerencie informações da empresa, técnicos e equipamentos</p>
      </div>

      {/* Informações da Empresa */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-industrial-800">Informações da Empresa</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              Nome da Empresa *
            </label>
            <input
              type="text"
              name="nomeEmpresa"
              value={config.nomeEmpresa}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              CNPJ
            </label>
            <input
              type="text"
              name="cnpj"
              value={config.cnpj}
              onChange={handleInputChange}
              placeholder="00.000.000/0000-00"
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              Endereço Completo
            </label>
            <input
              type="text"
              name="endereco"
              value={config.endereco}
              onChange={handleInputChange}
              placeholder="Rua, Número, Bairro, Cidade - Estado"
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              Telefone
            </label>
            <input
              type="text"
              name="telefone"
              value={config.telefone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={config.email}
              onChange={handleInputChange}
              placeholder="contato@enterfix.com.br"
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={config.website}
              onChange={handleInputChange}
              placeholder="www.empresa.com.br"
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Técnicos Cadastrados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-industrial-800">Técnicos Responsáveis</h2>
        </div>
        
        <p className="text-sm text-industrial-600 mb-4">
          Cadastre os técnicos que aparecerão no dropdown do formulário de relatórios.
        </p>

        {/* Adicionar Técnico */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          <div className="md:col-span-5">
            <input
              type="text"
              placeholder="Nome do Técnico"
              value={novoTecnico.nome}
              onChange={(e) => setNovoTecnico({ ...novoTecnico, nome: e.target.value })}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && adicionarTecnico()}
            />
          </div>
          <div className="md:col-span-5">
            <input
              type="text"
              placeholder="CREA/CRQ (opcional)"
              value={novoTecnico.registro}
              onChange={(e) => setNovoTecnico({ ...novoTecnico, registro: e.target.value })}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && adicionarTecnico()}
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={adicionarTecnico}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de Técnicos */}
        {tecnicos.length > 0 ? (
          <div className="space-y-2">
            {tecnicos.map((tecnico) => (
              <div key={tecnico.id} className="flex items-center justify-between p-3 bg-industrial-50 rounded-md">
                <div>
                  <p className="font-medium text-industrial-800">{tecnico.nome}</p>
                  {tecnico.registro && (
                    <p className="text-sm text-industrial-600">Registro: {tecnico.registro}</p>
                  )}
                </div>
                <button
                  onClick={() => removerTecnico(tecnico.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Remover Técnico"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-industrial-500">
            <User size={48} className="mx-auto mb-2 text-industrial-300" />
            <p>Nenhum técnico cadastrado</p>
          </div>
        )}
      </div>

      {/* Equipamentos Cadastrados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-industrial-800">Equipamentos de Medição</h2>
        </div>
        
        <p className="text-sm text-industrial-600 mb-4">
          Cadastre os equipamentos que aparecerão no dropdown do formulário de relatórios.
        </p>

        {/* Adicionar Equipamento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          <div className="md:col-span-5">
            <input
              type="text"
              placeholder="Nome do Equipamento"
              value={novoEquipamento.nome}
              onChange={(e) => setNovoEquipamento({ ...novoEquipamento, nome: e.target.value })}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && adicionarEquipamento()}
            />
          </div>
          <div className="md:col-span-5">
            <input
              type="text"
              placeholder="Nº de Série / ID (opcional)"
              value={novoEquipamento.identificacao}
              onChange={(e) => setNovoEquipamento({ ...novoEquipamento, identificacao: e.target.value })}
              className="w-full px-3 py-2 border border-industrial-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && adicionarEquipamento()}
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={adicionarEquipamento}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de Equipamentos */}
        {equipamentos.length > 0 ? (
          <div className="space-y-2">
            {equipamentos.map((equipamento) => (
              <div key={equipamento.id} className="flex items-center justify-between p-3 bg-industrial-50 rounded-md">
                <div>
                  <p className="font-medium text-industrial-800">{equipamento.nome}</p>
                  {equipamento.identificacao && (
                    <p className="text-sm text-industrial-600">ID: {equipamento.identificacao}</p>
                  )}
                </div>
                <button
                  onClick={() => removerEquipamento(equipamento.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Remover Equipamento"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-industrial-500">
            <Wrench size={48} className="mx-auto mb-2 text-industrial-300" />
            <p>Nenhum equipamento cadastrado</p>
          </div>
        )}
      </div>

      {/* Informações sobre Banco de Dados */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="text-blue-600 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">💡 Dica para Administradores</h3>
            <p className="text-sm text-blue-800 mb-2">
              As configurações de conexão com o banco de dados (Supabase) são definidas no arquivo <code className="bg-blue-100 px-1 rounded">.env</code> 
              na raiz do projeto por questões de segurança.
            </p>
            <p className="text-sm text-blue-800">
              Se você precisa alterar as credenciais do banco, edite o arquivo <code className="bg-blue-100 px-1 rounded">.env</code> 
              e reinicie o servidor de desenvolvimento.
            </p>
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end items-center gap-4 pt-4 border-t border-industrial-200">
        {saved && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            Configurações salvas com sucesso!
          </div>
        )}
        <button
          onClick={saveConfig}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Save size={20} />
          Salvar Todas as Configurações
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;
