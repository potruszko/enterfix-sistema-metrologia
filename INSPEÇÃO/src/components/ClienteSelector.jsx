import React, { useState, useEffect } from 'react';
import { Search, Plus, Building2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAlert } from './AlertSystem';

const ClienteSelector = ({ 
  clienteSelecionado, 
  onClienteChange, 
  obrigatorio = false,
  label = "Cliente"
}) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    cpf: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: ''
  });
  const alert = useAlert();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('ativo', true)
        .order('razao_social');

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCriarCliente = async () => {
    // Validação básica
    if (!novoCliente.razao_social.trim()) {
      alert.warning('Informe a Razão Social do cliente');
      return;
    }

    if (!novoCliente.cnpj && !novoCliente.cpf) {
      alert.warning('Informe CNPJ ou CPF do cliente');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Função para limpar valores vazios
      const cleanValue = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'string' && value.trim() === '') return null;
        return value;
      };

      // Preparar dados limpando strings vazias
      const dadosCliente = {
        razao_social: cleanValue(novoCliente.razao_social),
        nome_fantasia: cleanValue(novoCliente.nome_fantasia),
        cnpj: novoCliente.cnpj ? novoCliente.cnpj.replace(/\D/g, '') : null,
        cpf: novoCliente.cpf ? novoCliente.cpf.replace(/\D/g, '') : null,
        email: cleanValue(novoCliente.email),
        telefone: novoCliente.telefone ? novoCliente.telefone.replace(/\D/g, '') : null,
        cidade: cleanValue(novoCliente.cidade),
        estado: cleanValue(novoCliente.estado),
        tipo_pessoa: novoCliente.cnpj ? 'juridica' : 'fisica',
        situacao: 'ativo',
        ativo: true,
        created_by: user?.id
      };

      const { data, error } = await supabase
        .from('clientes')
        .insert([dadosCliente])
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        throw error;
      }

      alert.success('Cliente cadastrado com sucesso!');
      setClientes(prev => [...prev, data]);
      onClienteChange(data);
      setShowModal(false);
      setNovoCliente({
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        cpf: '',
        email: '',
        telefone: '',
        cidade: '',
        estado: ''
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      alert.error('Erro ao cadastrar cliente: ' + error.message);
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    return (
      cliente.razao_social?.toLowerCase().includes(termo) ||
      cliente.nome_fantasia?.toLowerCase().includes(termo) ||
      cliente.cnpj?.includes(termo) ||
      cliente.cpf?.includes(termo)
    );
  });

  const formatarCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatarCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .slice(0, 14);
  };

  const formatarTelefone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-industrial-700">
        <Building2 size={18} />
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-2">
        {/* Select de cliente */}
        <div className="flex-1 relative">
          <select
            value={clienteSelecionado?.id || ''}
            onChange={(e) => {
              const cliente = clientes.find(c => c.id === e.target.value);
              onClienteChange(cliente);
            }}
            className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required={obrigatorio}
          >
            <option value="">Selecione um cliente...</option>
            {clientesFiltrados.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome_fantasia || cliente.razao_social}
                {cliente.cnpj && ` - ${cliente.cnpj}`}
                {cliente.cpf && ` - ${cliente.cpf}`}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de adicionar novo */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap"
          title="Cadastrar novo cliente"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {/* Exibir dados do cliente selecionado */}
      {clienteSelecionado && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Razão Social:</span>
              <p className="text-gray-900">{clienteSelecionado.razao_social}</p>
            </div>
            {clienteSelecionado.cnpj && (
              <div>
                <span className="font-medium text-gray-700">CNPJ:</span>
                <p className="text-gray-900">{clienteSelecionado.cnpj}</p>
              </div>
            )}
            {clienteSelecionado.email && (
              <div>
                <span className="font-medium text-gray-700">E-mail:</span>
                <p className="text-gray-900">{clienteSelecionado.email}</p>
              </div>
            )}
            {clienteSelecionado.telefone && (
              <div>
                <span className="font-medium text-gray-700">Telefone:</span>
                <p className="text-gray-900">{clienteSelecionado.telefone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de novo cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-industrial-900 flex items-center gap-2">
                <Building2 size={24} />
                Cadastrar Novo Cliente
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Razão Social */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razão Social *
                </label>
                <input
                  type="text"
                  value={novoCliente.razao_social}
                  onChange={(e) => setNovoCliente({ ...novoCliente, razao_social: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: ACME Indústria e Comércio LTDA"
                />
              </div>

              {/* Nome Fantasia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  value={novoCliente.nome_fantasia}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nome_fantasia: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: ACME Tools"
                />
              </div>

              {/* CNPJ e CPF */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={novoCliente.cnpj}
                    onChange={(e) => setNovoCliente({ ...novoCliente, cnpj: formatarCNPJ(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={novoCliente.cpf}
                    onChange={(e) => setNovoCliente({ ...novoCliente, cpf: formatarCPF(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              {/* Email e Telefone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contato@empresa.com.br"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={novoCliente.telefone}
                    onChange={(e) => setNovoCliente({ ...novoCliente, telefone: formatarTelefone(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={novoCliente.cidade}
                    onChange={(e) => setNovoCliente({ ...novoCliente, cidade: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={novoCliente.estado}
                    onChange={(e) => setNovoCliente({ ...novoCliente, estado: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="ES">ES</option>
                    <option value="PR">PR</option>
                    <option value="SC">SC</option>
                    <option value="RS">RS</option>
                    {/* Adicione outros estados conforme necessário */}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCriarCliente}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Cadastrar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteSelector;
