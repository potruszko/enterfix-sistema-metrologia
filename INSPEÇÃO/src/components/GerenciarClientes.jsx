import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Building2, User, Phone, Mail, MapPin, X, Save, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAlert } from './AlertSystem';

const GerenciarClientes = () => {
  const alert = useAlert();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroSituacao, setFiltroSituacao] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [formData, setFormData] = useState({
    // Dados cadastrais
    codigo: '',
    tipo_pessoa: 'juridica',
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    cpf: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    regime_tributario: '',
    contribuinte_icms: false,

    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',

    // Contatos
    contato_responsavel: '',
    telefone: '',
    fax: '',
    celular: '',
    whatsapp: '',
    email: '',
    email_nfe: '',
    skype: '',
    site: '',

    // Dados comerciais
    ramo_atividade: '',
    porte_empresa: '',
    primeira_visita: '',
    tipo_contato: 'cliente',
    situacao: 'ativo',
    vendedor_responsavel: '',
    natureza_operacao: '',

    // Dados financeiros
    limite_credito: '',
    condicao_pagamento: '',
    categoria_financeira: '',

    // Observações
    observacoes_gerais: '',

    // Status
    ativo: true,
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert.error('Erro ao carregar clientes', 'Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatarCNPJ = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numeros
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const formatarCEP = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros.replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
        alert.success('CEP encontrado!', 'Sucesso');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleSalvar = async () => {
    try {
      // Validações básicas
      if (!formData.razao_social?.trim()) {
        alert.warning('Preencha a Razão Social ou Nome', 'Campo Obrigatório');
        return;
      }

      if (formData.tipo_pessoa === 'juridica' && !formData.cnpj?.trim()) {
        alert.warning('CNPJ é obrigatório para Pessoa Jurídica', 'Campo Obrigatório');
        return;
      }

      if (formData.tipo_pessoa === 'fisica' && !formData.cpf?.trim()) {
        alert.warning('CPF é obrigatório para Pessoa Física', 'Campo Obrigatório');
        return;
      }

      // Função auxiliar para converter strings vazias em null
      const cleanValue = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'string' && value.trim() === '') return null;
        return value;
      };

      // Preparar dados (remover formatação e limpar valores vazios)
      const dadosCliente = {
        codigo: cleanValue(formData.codigo),
        tipo_pessoa: formData.tipo_pessoa || 'juridica',
        razao_social: cleanValue(formData.razao_social),
        nome_fantasia: cleanValue(formData.nome_fantasia),
        cnpj: formData.cnpj ? formData.cnpj.replace(/\D/g, '') : null,
        cpf: formData.cpf ? formData.cpf.replace(/\D/g, '') : null,
        inscricao_estadual: cleanValue(formData.inscricao_estadual),
        inscricao_municipal: cleanValue(formData.inscricao_municipal),
        regime_tributario: cleanValue(formData.regime_tributario),
        contribuinte_icms: formData.contribuinte_icms || false,
        
        // Endereço
        cep: formData.cep ? formData.cep.replace(/\D/g, '') : null,
        logradouro: cleanValue(formData.logradouro),
        numero: cleanValue(formData.numero),
        complemento: cleanValue(formData.complemento),
        bairro: cleanValue(formData.bairro),
        cidade: cleanValue(formData.cidade),
        estado: cleanValue(formData.estado),
        
        // Contatos
        contato_responsavel: cleanValue(formData.contato_responsavel),
        telefone: formData.telefone ? formData.telefone.replace(/\D/g, '') : null,
        fax: formData.fax ? formData.fax.replace(/\D/g, '') : null,
        celular: formData.celular ? formData.celular.replace(/\D/g, '') : null,
        whatsapp: formData.whatsapp ? formData.whatsapp.replace(/\D/g, '') : null,
        email: cleanValue(formData.email),
        email_nfe: cleanValue(formData.email_nfe),
        skype: cleanValue(formData.skype),
        site: cleanValue(formData.site),
        
        // Dados comerciais
        ramo_atividade: cleanValue(formData.ramo_atividade),
        porte_empresa: cleanValue(formData.porte_empresa),
        primeira_visita: cleanValue(formData.primeira_visita),
        tipo_contato: cleanValue(formData.tipo_contato) || 'cliente',
        situacao: cleanValue(formData.situacao) || 'ativo',
        vendedor_responsavel: cleanValue(formData.vendedor_responsavel),
        natureza_operacao: cleanValue(formData.natureza_operacao),
        
        // Dados financeiros
        limite_credito: formData.limite_credito ? parseFloat(formData.limite_credito) : null,
        condicao_pagamento: cleanValue(formData.condicao_pagamento),
        categoria_financeira: cleanValue(formData.categoria_financeira),
        
        // Observações
        observacoes_gerais: cleanValue(formData.observacoes_gerais),
        
        // Status
        ativo: formData.ativo !== false,
      };

      let error;

      if (modoEdicao && clienteEditando) {
        // Atualizar cliente existente
        const result = await supabase
          .from('clientes')
          .update(dadosCliente)
          .eq('id', clienteEditando.id);
        error = result.error;
      } else {
        // Criar novo cliente - adicionar created_by
        const { data: { user } } = await supabase.auth.getUser();
        const dadosComCriador = {
          ...dadosCliente,
          created_by: user?.id || null,
        };
        
        const result = await supabase
          .from('clientes')
          .insert([dadosComCriador]);
        error = result.error;
      }

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        throw error;
      }

      alert.success(
        modoEdicao ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!',
        'Sucesso'
      );
      
      setShowModal(false);
      resetForm();
      carregarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert.error('Erro ao salvar cliente', 'Erro');
    }
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setModoEdicao(true);
    setFormData({
      ...cliente,
      cnpj: cliente.cnpj ? formatarCNPJ(cliente.cnpj) : '',
      cpf: cliente.cpf ? formatarCPF(cliente.cpf) : '',
      telefone: cliente.telefone ? formatarTelefone(cliente.telefone) : '',
      celular: cliente.celular ? formatarTelefone(cliente.celular) : '',
      whatsapp: cliente.whatsapp ? formatarTelefone(cliente.whatsapp) : '',
      fax: cliente.fax ? formatarTelefone(cliente.fax) : '',
      cep: cliente.cep ? formatarCEP(cliente.cep) : '',
      primeira_visita: cliente.primeira_visita || '',
      limite_credito: cliente.limite_credito || '',
    });
    setShowModal(true);
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert.success('Cliente excluído com sucesso!', 'Sucesso');
      carregarClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert.error('Erro ao excluir cliente', 'Erro');
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      tipo_pessoa: 'juridica',
      razao_social: '',
      nome_fantasia: '',
      cnpj: '',
      cpf: '',
      inscricao_estadual: '',
      inscricao_municipal: '',
      regime_tributario: '',
      contribuinte_icms: false,
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      contato_responsavel: '',
      telefone: '',
      fax: '',
      celular: '',
      whatsapp: '',
      email: '',
      email_nfe: '',
      skype: '',
      site: '',
      ramo_atividade: '',
      porte_empresa: '',
      primeira_visita: '',
      tipo_contato: 'cliente',
      situacao: 'ativo',
      vendedor_responsavel: '',
      natureza_operacao: '',
      limite_credito: '',
      condicao_pagamento: '',
      categoria_financeira: '',
      observacoes_gerais: '',
      ativo: true,
    });
    setModoEdicao(false);
    setClienteEditando(null);
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const matchSearch = 
      cliente.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cnpj?.includes(searchTerm.replace(/\D/g, '')) ||
      cliente.cpf?.includes(searchTerm.replace(/\D/g, '')) ||
      cliente.cidade?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTipo = filtroTipo === 'todos' || cliente.tipo_pessoa === filtroTipo;
    const matchSituacao = filtroSituacao === 'todos' || cliente.situacao === filtroSituacao;

    return matchSearch && matchTipo && matchSituacao;
  });

  const ESTADOS_BRASIL = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-blue-600" />
              Gerenciar Clientes
            </h1>
            <p className="text-gray-600 mt-1">Cadastre e gerencie seus clientes</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Cliente
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, CNPJ, CPF, cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="juridica">Pessoa Jurídica</option>
            <option value="fisica">Pessoa Física</option>
          </select>

          <select
            value={filtroSituacao}
            onChange={(e) => setFiltroSituacao(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todos">Todas as Situações</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="bloqueado">Bloqueado</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>
      </div>

      {/* Listagem */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando clientes...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cliente.tipo_pessoa === 'juridica' ? (
                          <Building2 className="w-5 h-5 text-blue-600" />
                        ) : (
                          <User className="w-5 h-5 text-green-600" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{cliente.razao_social}</div>
                          {cliente.nome_fantasia && (
                            <div className="text-sm text-gray-500">{cliente.nome_fantasia}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {cliente.tipo_pessoa === 'juridica' 
                          ? cliente.cnpj ? formatarCNPJ(cliente.cnpj) : '-'
                          : cliente.cpf ? formatarCPF(cliente.cpf) : '-'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {cliente.email && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-4 h-4" />
                            {cliente.email}
                          </div>
                        )}
                        {cliente.celular && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-4 h-4" />
                            {formatarTelefone(cliente.celular)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {cliente.cidade && cliente.estado ? `${cliente.cidade}/${cliente.estado}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${cliente.situacao === 'ativo' ? 'bg-green-100 text-green-800' : ''}
                        ${cliente.situacao === 'inativo' ? 'bg-gray-100 text-gray-800' : ''}
                        ${cliente.situacao === 'bloqueado' ? 'bg-red-100 text-red-800' : ''}
                        ${cliente.situacao === 'prospect' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {cliente.situacao || 'ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditar(cliente)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExcluir(cliente.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modoEdicao ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Tipo de Pessoa */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pessoa *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo_pessoa"
                      value="juridica"
                      checked={formData.tipo_pessoa === 'juridica'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Pessoa Jurídica</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo_pessoa"
                      value="fisica"
                      checked={formData.tipo_pessoa === 'fisica'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <User className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Pessoa Física</span>
                  </label>
                </div>
              </div>

              {/* Dados Cadastrais */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dados Cadastrais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.tipo_pessoa === 'juridica' ? 'Razão Social' : 'Nome Completo'} *
                    </label>
                    <input
                      type="text"
                      name="razao_social"
                      value={formData.razao_social}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.tipo_pessoa === 'juridica' ? 'Nome Fantasia' : 'Apelido'}
                    </label>
                    <input
                      type="text"
                      name="nome_fantasia"
                      value={formData.nome_fantasia}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {formData.tipo_pessoa === 'juridica' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CNPJ *
                        </label>
                        <input
                          type="text"
                          name="cnpj"
                          value={formData.cnpj}
                          onChange={(e) => {
                            const formatted = formatarCNPJ(e.target.value);
                            setFormData(prev => ({ ...prev, cnpj: formatted }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="00.000.000/0000-00"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inscrição Estadual
                        </label>
                        <input
                          type="text"
                          name="inscricao_estadual"
                          value={formData.inscricao_estadual}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF *
                      </label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={(e) => {
                          const formatted = formatarCPF(e.target.value);
                          setFormData(prev => ({ ...prev, cpf: formatted }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Interno
                    </label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: CLI001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situação
                    </label>
                    <select
                      name="situacao"
                      value={formData.situacao}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="bloqueado">Bloqueado</option>
                      <option value="prospect">Prospect</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={(e) => {
                        const formatted = formatarCEP(e.target.value);
                        setFormData(prev => ({ ...prev, cep: formatted }));
                      }}
                      onBlur={(e) => buscarCEP(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro
                    </label>
                    <input
                      type="text"
                      name="logradouro"
                      value={formData.logradouro}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      {ESTADOS_BRASIL.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contatos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contatos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pessoa de Contato
                    </label>
                    <input
                      type="text"
                      name="contato_responsavel"
                      value={formData.contato_responsavel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={(e) => {
                        const formatted = formatarTelefone(e.target.value);
                        setFormData(prev => ({ ...prev, telefone: formatted }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(00) 0000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Celular
                    </label>
                    <input
                      type="text"
                      name="celular"
                      value={formData.celular}
                      onChange={(e) => {
                        const formatted = formatarTelefone(e.target.value);
                        setFormData(prev => ({ ...prev, celular: formatted }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => {
                        const formatted = formatarTelefone(e.target.value);
                        setFormData(prev => ({ ...prev, whatsapp: formatted }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail para NF-e
                    </label>
                    <input
                      type="email"
                      name="email_nfe"
                      value={formData.email_nfe}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dados Comerciais */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Comerciais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ramo de Atividade
                    </label>
                    <input
                      type="text"
                      name="ramo_atividade"
                      value={formData.ramo_atividade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Porte da Empresa
                    </label>
                    <select
                      name="porte_empresa"
                      value={formData.porte_empresa}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="MEI">MEI</option>
                      <option value="ME">Microempresa (ME)</option>
                      <option value="EPP">Pequeno Porte (EPP)</option>
                      <option value="MEDIO">Médio Porte</option>
                      <option value="GRANDE">Grande Porte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Limite de Crédito (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="limite_credito"
                      value={formData.limite_credito}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condição de Pagamento
                    </label>
                    <input
                      type="text"
                      name="condicao_pagamento"
                      value={formData.condicao_pagamento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 30 dias, À vista, etc"
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                <textarea
                  name="observacoes_gerais"
                  value={formData.observacoes_gerais}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Informações adicionais sobre o cliente..."
                />
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                {modoEdicao ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarClientes;
