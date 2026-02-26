import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, FileSignature, Building2, Calendar, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAlert } from './AlertSystem';
import ClienteSelector from './ClienteSelector';

const NovoContrato = ({ contratoId = null, onSaveComplete, onCancel }) => {
  const alert = useAlert();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [saving, setSaving] = useState(false);
  const [numeroContrato, setNumeroContrato] = useState('');

  // Estados do formulário
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [tipoContrato, setTipoContrato] = useState('');
  const [formData, setFormData] = useState({
    // Dados básicos
    numero_os_bling: '',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
    prazo_indeterminado: false,
    renovacao_automatica: false,
    
    // Valores
    valor_mensal: '',
    valor_total: '',
    forma_pagamento: '',
    
    // Status e assinaturas
    status: 'minuta',
    assinado_cliente: false,
    assinado_enterfix: false,
    
    // Cláusulas
    clausulas_adicionais: '',
  });

  const [dadosEspecificos, setDadosEspecificos] = useState({});

  useEffect(() => {
    gerarNumeroContrato();
  }, []);

  const gerarNumeroContrato = async () => {
    try {
      const ano = new Date().getFullYear();
      const { count } = await supabase
        .from('contratos')
        .select('*', { count: 'exact', head: true })
        .ilike('numero_contrato', `CT-${ano}-%`);
      
      const proximoNumero = (count || 0) + 1;
      const numeroFormatado = `CT-${ano}-${String(proximoNumero).padStart(3, '0')}`;
      setNumeroContrato(numeroFormatado);
    } catch (error) {
      console.error('Erro ao gerar número do contrato:', error);
    }
  };

  const tiposContrato = [
    { 
      value: 'prestacao_servico', 
      label: 'Prestação de Serviço',
      descricao: 'Contrato padrão para serviços de calibração e metrologia'
    },
    { 
      value: 'comodato', 
      label: 'Comodato',
      descricao: 'Empréstimo de equipamentos ao cliente'
    },
    { 
      value: 'manutencao', 
      label: 'Manutenção',
      descricao: 'Manutenção preventiva e corretiva de equipamentos'
    },
    { 
      value: 'sla', 
      label: 'SLA (Acordo de Nível de Serviço)',
      descricao: 'Definição de tempos de resposta e atendimento'
    },
    { 
      value: 'consultoria', 
      label: 'Consultoria',
      descricao: 'Serviços de consultoria em metrologia'
    },
    { 
      value: 'gestao_parque', 
      label: 'Gestão de Parque de Instrumentos',
      descricao: 'Gestão completa do parque de instrumentos do cliente'
    },
    { 
      value: 'suporte', 
      label: 'Suporte Técnico',
      descricao: 'Suporte técnico especializado'
    },
    { 
      value: 'validacao', 
      label: 'Validação',
      descricao: 'Validação de processos e equipamentos'
    },
    { 
      value: 'nda', 
      label: 'NDA / Confidencialidade',
      descricao: 'Acordo de confidencialidade'
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDadosEspecificosChange = (campo, valor) => {
    setDadosEspecificos(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const proximaEtapa = () => {
    // Validações por etapa
    if (etapaAtual === 1 && !clienteSelecionado) {
      alert.warning('Selecione um cliente para continuar', 'Cliente Obrigatório');
      return;
    }
    if (etapaAtual === 2 && !tipoContrato) {
      alert.warning('Selecione o tipo de contrato para continuar', 'Tipo Obrigatório');
      return;
    }
    if (etapaAtual === 3) {
      if (!formData.data_inicio) {
        alert.warning('Informe a data de início', 'Campo Obrigatório');
        return;
      }
      if (!formData.prazo_indeterminado && !formData.data_fim) {
        alert.warning('Informe a data de término ou marque como prazo indeterminado', 'Campo Obrigatório');
        return;
      }
    }
    
    setEtapaAtual(prev => Math.min(prev + 1, 5));
  };

  const etapaAnterior = () => {
    setEtapaAtual(prev => Math.max(prev - 1, 1));
  };

  const handleSalvar = async () => {
    try {
      setSaving(true);

      // Validações finais
      if (!clienteSelecionado) {
        alert.warning('Selecione um cliente', 'Validação');
        return;
      }
      if (!tipoContrato) {
        alert.warning('Selecione o tipo de contrato', 'Validação');
        return;
      }

      const contrato = {
        numero_contrato: numeroContrato,
        tipo_contrato: tipoContrato,
        cliente_id: clienteSelecionado.id,
        numero_os_bling: formData.numero_os_bling || null,
        data_inicio: formData.data_inicio,
        data_fim: formData.prazo_indeterminado ? null : formData.data_fim,
        prazo_indeterminado: formData.prazo_indeterminado,
        renovacao_automatica: formData.renovacao_automatica,
        valor_mensal: formData.valor_mensal ? parseFloat(formData.valor_mensal) : null,
        valor_total: formData.valor_total ? parseFloat(formData.valor_total) : null,
        forma_pagamento: formData.forma_pagamento || null,
        status: formData.status,
        dados_especificos: dadosEspecificos,
        clausulas_adicionais: formData.clausulas_adicionais || null,
        assinado_cliente: formData.assinado_cliente,
        assinado_enterfix: formData.assinado_enterfix,
        versao: 1,
      };

      const { data, error } = await supabase
        .from('contratos')
        .insert([contrato])
        .select()
        .single();

      if (error) throw error;

      alert.success(`Contrato ${numeroContrato} criado com sucesso!`, 'Contrato Salvo');
      
      if (onSaveComplete) {
        onSaveComplete(data);
      }
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      alert.error('Erro ao salvar contrato', 'Erro');
    } finally {
      setSaving(false);
    }
  };

  const renderCamposEspecificos = () => {
    switch (tipoContrato) {
      case 'prestacao_servico':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escopo dos Serviços
              </label>
              <textarea
                value={dadosEspecificos.escopo_servicos || ''}
                onChange={(e) => handleDadosEspecificosChange('escopo_servicos', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva os serviços que serão prestados..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Periodicidade
                </label>
                <select
                  value={dadosEspecificos.periodicidade || ''}
                  onChange={(e) => handleDadosEspecificosChange('periodicidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="mensal">Mensal</option>
                  <option value="bimestral">Bimestral</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                  <option value="sob_demanda">Sob Demanda</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade de Atendimentos
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.quantidade_atendimentos || ''}
                  onChange={(e) => handleDadosEspecificosChange('quantidade_atendimentos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 12 (mensal)"
                />
              </div>
            </div>
          </div>
        );

      case 'comodato':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipamentos em Comodato
              </label>
              <textarea
                value={dadosEspecificos.equipamentos || ''}
                onChange={(e) => handleDadosEspecificosChange('equipamentos', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Liste os equipamentos, modelo, número de série, valor..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total dos Equipamentos (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dadosEspecificos.valor_equipamentos || ''}
                  onChange={(e) => handleDadosEspecificosChange('valor_equipamentos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável pela Manutenção
                </label>
                <select
                  value={dadosEspecificos.responsavel_manutencao || ''}
                  onChange={(e) => handleDadosEspecificosChange('responsavel_manutencao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="enterfix">Enterfix</option>
                  <option value="cliente">Cliente</option>
                  <option value="compartilhado">Compartilhado</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'manutencao':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipamentos Cobertos
              </label>
              <textarea
                value={dadosEspecificos.equipamentos_cobertos || ''}
                onChange={(e) => handleDadosEspecificosChange('equipamentos_cobertos', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Liste os equipamentos cobertos pelo contrato..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Manutenção
                </label>
                <select
                  value={dadosEspecificos.tipo_manutencao || ''}
                  onChange={(e) => handleDadosEspecificosChange('tipo_manutencao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="preventiva">Preventiva</option>
                  <option value="corretiva">Corretiva</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Periodicidade Preventiva
                </label>
                <select
                  value={dadosEspecificos.periodicidade_preventiva || ''}
                  onChange={(e) => handleDadosEspecificosChange('periodicidade_preventiva', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chamados Corretivos Inclusos
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.chamados_inclusos || ''}
                  onChange={(e) => handleDadosEspecificosChange('chamados_inclusos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 12"
                />
              </div>
            </div>
          </div>
        );

      case 'sla':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de Resposta (horas)
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.tempo_resposta_horas || ''}
                  onChange={(e) => handleDadosEspecificosChange('tempo_resposta_horas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de Resolução (horas)
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.tempo_resolucao_horas || ''}
                  onChange={(e) => handleDadosEspecificosChange('tempo_resolucao_horas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilidade Garantida (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dadosEspecificos.disponibilidade_percentual || ''}
                  onChange={(e) => handleDadosEspecificosChange('disponibilidade_percentual', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 99.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Níveis de Escalação
              </label>
              <textarea
                value={dadosEspecificos.niveis_escalacao || ''}
                onChange={(e) => handleDadosEspecificosChange('niveis_escalacao', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nível 1: Suporte Técnico (4h)&#10;Nível 2: Coordenação (8h)&#10;Nível 3: Gerência (24h)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penalidades por Descumprimento
              </label>
              <textarea
                value={dadosEspecificos.penalidades || ''}
                onChange={(e) => handleDadosEspecificosChange('penalidades', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Defina as penalidades em caso de não cumprimento do SLA..."
              />
            </div>
          </div>
        );

      case 'consultoria':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivos da Consultoria
              </label>
              <textarea
                value={dadosEspecificos.objetivos || ''}
                onChange={(e) => handleDadosEspecificosChange('objetivos', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva os objetivos e metas da consultoria..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Contratadas
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.horas_contratadas || ''}
                  onChange={(e) => handleDadosEspecificosChange('horas_contratadas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor por Hora (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dadosEspecificos.valor_hora || ''}
                  onChange={(e) => handleDadosEspecificosChange('valor_hora', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entregáveis
              </label>
              <textarea
                value={dadosEspecificos.entregaveis || ''}
                onChange={(e) => handleDadosEspecificosChange('entregaveis', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Liste os documentos e entregáveis do projeto..."
              />
            </div>
          </div>
        );

      case 'gestao_parque':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade Estimada de Instrumentos
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.quantidade_instrumentos || ''}
                  onChange={(e) => handleDadosEspecificosChange('quantidade_instrumentos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Software de Gestão
                </label>
                <select
                  value={dadosEspecificos.software_gestao || ''}
                  onChange={(e) => handleDadosEspecificosChange('software_gestao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="enterfix">Enterfix Sistema</option>
                  <option value="cliente">Sistema do Cliente</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serviços Inclusos
              </label>
              <div className="space-y-2">
                {['Cadastro de Instrumentos', 'Agendamento de Calibrações', 'Rastreabilidade', 'Relatórios Gerenciais', 'Controle de Vencimentos'].map(servico => (
                  <label key={servico} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dadosEspecificos.servicos_inclusos?.includes(servico) || false}
                      onChange={(e) => {
                        const servicos = dadosEspecificos.servicos_inclusos || [];
                        if (e.target.checked) {
                          handleDadosEspecificosChange('servicos_inclusos', [...servicos, servico]);
                        } else {
                          handleDadosEspecificosChange('servicos_inclusos', servicos.filter(s => s !== servico));
                        }
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{servico}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'suporte':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Suporte
                </label>
                <select
                  value={dadosEspecificos.nivel_suporte || ''}
                  onChange={(e) => handleDadosEspecificosChange('nivel_suporte', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="basico">Básico (horário comercial)</option>
                  <option value="intermediario">Intermediário (8x5)</option>
                  <option value="avancado">Avançado (24x7)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canais de Atendimento
                </label>
                <input
                  type="text"
                  value={dadosEspecificos.canais_atendimento || ''}
                  onChange={(e) => handleDadosEspecificosChange('canais_atendimento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: E-mail, Telefone, WhatsApp"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escopo do Suporte
              </label>
              <textarea
                value={dadosEspecificos.escopo_suporte || ''}
                onChange={(e) => handleDadosEspecificosChange('escopo_suporte', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o que está coberto pelo suporte técnico..."
              />
            </div>
          </div>
        );

      case 'validacao':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipamento/Processo a Validar
              </label>
              <input
                type="text"
                value={dadosEspecificos.item_validacao || ''}
                onChange={(e) => handleDadosEspecificosChange('item_validacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fases da Validação
              </label>
              <div className="space-y-2">
                {['IQ (Qualificação de Instalação)', 'OQ (Qualificação Operacional)', 'PQ (Qualificação de Performance)'].map(fase => (
                  <label key={fase} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dadosEspecificos.fases_validacao?.includes(fase) || false}
                      onChange={(e) => {
                        const fases = dadosEspecificos.fases_validacao || [];
                        if (e.target.checked) {
                          handleDadosEspecificosChange('fases_validacao', [...fases, fase]);
                        } else {
                          handleDadosEspecificosChange('fases_validacao', fases.filter(f => f !== fase));
                        }
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{fase}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Normas Aplicáveis
              </label>
              <input
                type="text"
                value={dadosEspecificos.normas_aplicaveis || ''}
                onChange={(e) => handleDadosEspecificosChange('normas_aplicaveis', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: RDC 301, ISO 17025, etc"
              />
            </div>
          </div>
        );

      case 'nda':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Informação Confidencial
              </label>
              <textarea
                value={dadosEspecificos.tipo_informacao || ''}
                onChange={(e) => handleDadosEspecificosChange('tipo_informacao', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o tipo de informação protegida..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finalidade
                </label>
                <input
                  type="text"
                  value={dadosEspecificos.finalidade || ''}
                  onChange={(e) => handleDadosEspecificosChange('finalidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Prestação de serviços"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Multa por Descumprimento (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dadosEspecificos.multa_descumprimento || ''}
                  onChange={(e) => handleDadosEspecificosChange('multa_descumprimento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            Selecione um tipo de contrato para ver os campos específicos
          </div>
        );
    }
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Selecione o Cliente</h3>
              <p className="text-gray-600 mt-1">Escolha o cliente para este contrato</p>
            </div>
            <ClienteSelector
              clienteSelecionado={clienteSelecionado}
              onClienteChange={setClienteSelecionado}
              obrigatorio={true}
              label="Cliente"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileSignature className="w-16 h-16 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Tipo de Contrato</h3>
              <p className="text-gray-600 mt-1">Selecione o tipo de contrato a ser criado</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposContrato.map(tipo => (
                <div
                  key={tipo.value}
                  onClick={() => setTipoContrato(tipo.value)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    tipoContrato === tipo.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{tipo.label}</h4>
                  <p className="text-sm text-gray-600">{tipo.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Dados Básicos</h3>
              <p className="text-gray-600 mt-1">Informe as datas e valores do contrato</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>Número do Contrato:</strong> {numeroContrato}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número OS Bling (Opcional)
                </label>
                <input
                  type="text"
                  name="numero_os_bling"
                  value={formData.numero_os_bling}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: OS-2026-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Inicial
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minuta">Minuta (Rascunho)</option>
                  <option value="ativo">Ativo (Vigente)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início *
                </label>
                <input
                  type="date"
                  name="data_inicio"
                  value={formData.data_inicio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Término {!formData.prazo_indeterminado && '*'}
                </label>
                <input
                  type="date"
                  name="data_fim"
                  value={formData.data_fim}
                  onChange={handleInputChange}
                  disabled={formData.prazo_indeterminado}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  required={!formData.prazo_indeterminado}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="prazo_indeterminado"
                  checked={formData.prazo_indeterminado}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Prazo Indeterminado</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="renovacao_automatica"
                  checked={formData.renovacao_automatica}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Renovação Automática</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Mensal (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="valor_mensal"
                  value={formData.valor_mensal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="valor_total"
                  value={formData.valor_total}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  name="forma_pagamento"
                  value={formData.forma_pagamento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="boleto">Boleto</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência</option>
                  <option value="cartao">Cartão</option>
                  <option value="deposito">Depósito</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Dados Específicos</h3>
              <p className="text-gray-600 mt-1">
                {tipoContrato ? tiposContrato.find(t => t.value === tipoContrato)?.label : 'Configure os detalhes do contrato'}
              </p>
            </div>
            {renderCamposEspecificos()}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Revisão e Cláusulas</h3>
              <p className="text-gray-600 mt-1">Adicione cláusulas adicionais e revise o contrato</p>
            </div>

            {/* Resumo */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-4">Resumo do Contrato</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Número:</span>
                  <span className="font-medium text-gray-900 ml-2">{numeroContrato}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium text-gray-900 ml-2">{clienteSelecionado?.razao_social}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    {tiposContrato.find(t => t.value === tipoContrato)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-900 ml-2 capitalize">{formData.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Vigência:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    {formData.data_inicio} {formData.prazo_indeterminado ? '(Indeterminado)' : `até ${formData.data_fim}`}
                  </span>
                </div>
                {formData.valor_total && (
                  <div>
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="font-medium text-gray-900 ml-2">
                      R$ {parseFloat(formData.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cláusulas Adicionais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cláusulas Adicionais
              </label>
              <textarea
                name="clausulas_adicionais"
                value={formData.clausulas_adicionais}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Digite cláusulas específicas ou observações importantes..."
              />
            </div>

            {/* Assinaturas */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Controle de Assinaturas</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="assinado_cliente"
                    checked={formData.assinado_cliente}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Assinado pelo Cliente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="assinado_enterfix"
                    checked={formData.assinado_enterfix}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Assinado pela Enterfix</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Novo Contrato</h1>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map(etapa => (
            <div key={etapa} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                etapa < etapaAtual ? 'bg-green-600 text-white' :
                etapa === etapaAtual ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {etapa < etapaAtual ? '✓' : etapa}
              </div>
              {etapa < 5 && (
                <div className={`flex-1 h-1 mx-2 ${
                  etapa < etapaAtual ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Cliente</span>
          <span>Tipo</span>
          <span>Básico</span>
          <span>Específico</span>
          <span>Revisão</span>
        </div>
      </div>

      {/* Conteúdo da Etapa */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {renderEtapa()}
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between">
        <button
          onClick={etapaAnterior}
          disabled={etapaAtual === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Anterior
        </button>

        {etapaAtual < 5 ? (
          <button
            onClick={proximaEtapa}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Próximo
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSalvar}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Salvando...' : 'Salvar Contrato'}
          </button>
        )}
      </div>
    </div>
  );
};

export default NovoContrato;
