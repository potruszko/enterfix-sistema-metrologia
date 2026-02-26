import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, FileSignature, Building2, Calendar, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAlert } from './AlertSystem';
import ClienteSelector from './ClienteSelector';
import { gerarEUploadPDFContrato } from '../utils/contratosPDF';
import InfoField from './forms/InfoField';

// Importar configurações dos contratos
import { CONFIG_PLANOS } from '../utils/contratos/clausulas/plano_manutencao';
import { CONFIG_PACOTES_SUPORTE } from '../utils/contratos/clausulas/suporte';

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
      value: 'plano_manutencao', 
      label: 'Plano de Manutenção Recorrente',
      descricao: 'Bronze/Prata/Ouro - Manutenção + Calibração + Benefícios Escalonados'
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
        setSaving(false);
        return;
      }
      if (!tipoContrato) {
        alert.warning('Selecione o tipo de contrato', 'Validação');
        setSaving(false);
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

      // 1. Inserir contrato no banco
      const { data, error } = await supabase
        .from('contratos')
        .insert([contrato])
        .select()
        .single();

      if (error) throw error;

      alert.success(`Contrato ${numeroContrato} criado com sucesso!`, 'Contrato Salvo');

      // 2. Gerar PDF automaticamente (não esperamos, continua em background)
      try {
        const dadosCompletosContrato = {
          ...data,
          cliente: clienteSelecionado
        };
        
        alert.info('Gerando PDF do contrato...', 'Processando');
        const pdfResult = await gerarEUploadPDFContrato(supabase, dadosCompletosContrato);
        
        if (pdfResult.success) {
          alert.success('PDF gerado com sucesso!', 'Documento');
        } else {
          console.warn('PDF não foi gerado:', pdfResult.error);
          alert.warning('Contrato salvo, mas PDF não foi gerado. Você pode gerar depois.', 'Aviso');
        }
      } catch (pdfError) {
        console.error('Erro ao gerar PDF:', pdfError);
        // Não bloqueamos o fluxo se PDF falhar
        alert.warning('Contrato salvo, mas houve erro ao gerar PDF.', 'Aviso');
      }
      
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📦 Pacote de Suporte
              </label>
              <select
                value={dadosEspecificos.pacote || ''}
                onChange={(e) => {
                  const pacote = e.target.value;
                  handleDadosEspecificosChange('pacote', pacote);
                  // Auto-popular campos do CONFIG
                  if (pacote && CONFIG_PACOTES_SUPORTE[pacote]) {
                    const config = CONFIG_PACOTES_SUPORTE[pacote];
                    handleDadosEspecificosChange('horas_mensais', config.horasMensais);
                    handleDadosEspecificosChange('sla_p1', config.slaRespostaP1);
                    handleDadosEspecificosChange('taxa_p1', config.taxaAcionamentoIndevidoP1);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o pacote...</option>
                <option value="basico">Básico - Demanda Ocasional</option>
                <option value="padrao">Padrão - ISO 9001 Regular</option>
                <option value="premium">Premium - 24/7 Crítico</option>
              </select>
            </div>

            {dadosEspecificos.pacote && CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote] && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <h4 className="font-semibold text-blue-900 mb-3">📊 Características do Pacote</h4>
                <InfoField 
                  label="Horas/mês" 
                  value={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].horasMensais === 999 ? 'Ilimitadas' : `${CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].horasMensais}h`}
                  highlight={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].horasMensais === 999}
                />
                <InfoField 
                  label="SLA Resposta P1" 
                  value={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].slaRespostaP1 ? `${CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].slaRespostaP1} hora(s)` : 'Não atende P1'}
                  highlight={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].slaRespostaP1 === 1}
                />
                <InfoField 
                  label="Taxa Acionamento Indevido P1" 
                  value={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].taxaAcionamentoIndevidoP1 === 0 ? 'SEM TAXA' : `R$ ${CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].taxaAcionamentoIndevidoP1}`}
                  highlight={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].taxaAcionamentoIndevidoP1 === 0}
                />
                <InfoField 
                  label="Suporte 24/7" 
                  value={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].suporte24x7 ? '✅ Sim' : '❌ Não'}
                  highlight={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].suporte24x7}
                />
                <InfoField 
                  label="Acesso Remoto" 
                  value={CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].acessoRemoto ? '✅ Sim' : '❌ Não'}
                />
                {CONFIG_PACOTES_SUPORTE[dadosEspecificos.pacote].engenheiroDedicado && (
                  <div className="text-sm text-green-600 font-medium pt-2 border-t">
                    ✅ Engenheiro dedicado que conhece seu parque
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canais de Atendimento
                </label>
                <input
                  type="text"
                  value={dadosEspecificos.canais_atendimento || 'E-mail, Telefone, WhatsApp'}
                  onChange={(e) => handleDadosEspecificosChange('canais_atendimento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escopo do Suporte
                </label>
                <textarea
                  value={dadosEspecificos.escopo_suporte || ''}
                  onChange={(e) => handleDadosEspecificosChange('escopo_suporte', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição do escopo..."
                />
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t pt-4">
              <h4 className="font-semibold text-gray-700">🛡️ Proteções e Automações</h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.log_lgpd || false}
                  onChange={(e) => handleDadosEspecificosChange('log_lgpd', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Log Auditoria LGPD</strong> - Rastreabilidade sessões remotas (25 campos Supabase, screenshots, termo autorização)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.termo_meio || false}
                  onChange={(e) => handleDadosEspecificosChange('termo_meio', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Termo Atividade de Meio</strong> - Classificação risco procedimentos orientados (🟢🟡🔴🚫)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.upsell_automatico || false}
                  onChange={(e) => handleDadosEspecificosChange('upsell_automatico', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Sistema Upsell Automático</strong> - 6 gatilhos detecção, e-mail personalizado (meta conversão 15%)
                </span>
              </label>
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

      case 'plano_manutencao':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Plano de Manutenção
              </label>
              <select
                value={dadosEspecificos.plano || ''}
                onChange={(e) => {
                  const plano = e.target.value;
                  handleDadosEspecificosChange('plano', plano);
                  // Auto-popular campos do CONFIG
                  if (plano && CONFIG_PLANOS[plano]) {
                    const config = CONFIG_PLANOS[plano];
                    handleDadosEspecificosChange('visitas_ano', config.visitas);
                    handleDadosEspecificosChange('carencia_meses', config.carencia);
                    handleDadosEspecificosChange('multa_rescisao', config.multa);
                    handleDadosEspecificosChange('equipamento_substituto', config.equipamentoSubstituto);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o plano...</option>
                <option value="bronze">🥉 Bronze - Preventivo Básico (Orçamento Restrito)</option>
                <option value="prata">🥈 Prata - Prioritário (ISO 9001/17025)</option>
                <option value="ouro">🥇 Ouro - Full Service Premium (24/7 Crítico)</option>
              </select>
            </div>

            {dadosEspecificos.plano && CONFIG_PLANOS[dadosEspecificos.plano] && (
              <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg space-y-2">
                <h4 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                  {dadosEspecificos.plano === 'bronze' && '🥉'}
                  {dadosEspecificos.plano === 'prata' && '🥈'}
                  {dadosEspecificos.plano === 'ouro' && '🥇'}
                  Características do Plano {CONFIG_PLANOS[dadosEspecificos.plano].nome}
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <InfoField 
                    label="Visitas/ano" 
                    value={`${CONFIG_PLANOS[dadosEspecificos.plano].visitas}x`}
                    icon="📅"
                  />
                  <InfoField 
                    label="Periodicidade" 
                    value={CONFIG_PLANOS[dadosEspecificos.plano].periodicidade}
                    icon="🔄"
                  />
                  <InfoField 
                    label="Calibração" 
                    value={CONFIG_PLANOS[dadosEspecificos.plano].calibracaoTipo}
                    highlight={dadosEspecificos.plano === 'ouro'}
                  />
                  <InfoField 
                    label="Prioridade SLA" 
                    value={CONFIG_PLANOS[dadosEspecificos.plano].prioridadeSLA}
                    highlight={CONFIG_PLANOS[dadosEspecificos.plano].prioridadeSLA === '24h'}
                  />
                  <InfoField 
                    label="Emergências Inclusas" 
                    value={CONFIG_PLANOS[dadosEspecificos.plano].emergenciasInclusas === 999 ? 'Ilimitadas' : CONFIG_PLANOS[dadosEspecificos.plano].emergenciasInclusas}
                    highlight={CONFIG_PLANOS[dadosEspecificos.plano].emergenciasInclusas === 999}
                  />
                  <InfoField 
                    label="Desconto Fabricação" 
                    value={`${CONFIG_PLANOS[dadosEspecificos.plano].descontoFabricacao}%`}
                    highlight={CONFIG_PLANOS[dadosEspecificos.plano].descontoFabricacao >= 20}
                  />
                  <InfoField 
                    label="Desconto Eng. Reversa" 
                    value={`${CONFIG_PLANOS[dadosEspecificos.plano].descontoEngenhariaReversa}%`}
                    highlight={CONFIG_PLANOS[dadosEspecificos.plano].descontoEngenhariaReversa >= 20}
                  />
                  <InfoField 
                    label="Técnico Exclusivo" 
                    value={CONFIG_PLANOS[dadosEspecificos.plano].tecnicoExclusivo ? '✅ Sim' : '❌ Não'}
                    highlight={CONFIG_PLANOS[dadosEspecificos.plano].tecnicoExclusivo}
                  />
                </div>

                {CONFIG_PLANOS[dadosEspecificos.plano].equipamentoSubstituto && (
                  <div className="mt-3 p-3 bg-green-100 border-2 border-green-300 rounded text-sm">
                    <strong className="text-green-800 flex items-center gap-2">
                      ⭐ DIFERENCIAL OURO: Equipamento Substituto
                    </strong>
                    <p className="text-gray-700 mt-1">
                      Se o reparo demorar mais de 5 dias, fornecemos equipamento equivalente/superior 
                      calibrado RBC em até <strong>48h</strong>, sem custo adicional.
                    </p>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-blue-300">
                  <InfoField 
                    label="Carência" 
                    value={`${CONFIG_PLANOS[dadosEspecificos.plano].carencia} meses`}
                    icon="⏰"
                  />
                  <InfoField 
                    label="Multa Rescisão" 
                    value={`${CONFIG_PLANOS[dadosEspecificos.plano].multa * 100}% saldo`}
                    icon="⚖️"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipamentos Cobertos
                </label>
                <textarea
                  value={dadosEspecificos.equipamentos_cobertos || ''}
                  onChange={(e) => handleDadosEspecificosChange('equipamentos_cobertos', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: MMC Zeiss, Paquímetros digitais, Micrômetros, Blocos padrão..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações Específicas
                </label>
                <textarea
                  value={dadosEspecificos.observacoes || ''}
                  onChange={(e) => handleDadosEspecificosChange('observacoes', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Particularidades deste contrato..."
                />
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t pt-4">
              <h4 className="font-semibold text-gray-700">📊 Inteligência de Negócio</h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.dashboard_upgrade || false}
                  onChange={(e) => handleDadosEspecificosChange('dashboard_upgrade', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Dashboard de Upgrade</strong> - Mostrar benefícios que faltam no plano atual (gerar desejo)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.calculo_mtbf || false}
                  onChange={(e) => handleDadosEspecificosChange('calculo_mtbf', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Cálculo Automático MTBF/MTTR</strong> - Queries Supabase mensais + alertas confiabilidade
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.relatorio_capex || false}
                  onChange={(e) => handleDadosEspecificosChange('relatorio_capex', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Relatório CAPEX Estratégico</strong> - {
                    dadosEspecificos.plano === 'bronze' ? 'Anual simples' :
                    dadosEspecificos.plano === 'prata' ? 'Semestral detalhado' :
                    dadosEspecificos.plano === 'ouro' ? 'Trimestral + reunião presencial' :
                    'Periodicidade conforme plano'
                  }
                </span>
              </label>
            </div>

            {/* Comparação de planos (se não for Ouro) */}
            {dadosEspecificos.plano && dadosEspecificos.plano !== 'ouro' && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  💡 Benefícios que faltam neste plano
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {dadosEspecificos.plano === 'bronze' && (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Calibração completa RBC inclusa (disponível no Prata)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Emergências inclusas (1x no Prata, ilimitadas no Ouro)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Equipamento substituto em 48h (exclusivo Ouro)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Técnico exclusivo (exclusivo Ouro)</span>
                      </li>
                    </>
                  )}
                  {dadosEspecificos.plano === 'prata' && (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Equipamento substituto em 48h (exclusivo Ouro) - Evita paradas longas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Técnico exclusivo que conhece seu parque (exclusivo Ouro)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Emergências ilimitadas (Prata tem 1x/ano, Ouro ilimitadas)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-400">❌</span>
                        <span>Descontos maiores: 25% fabricação/ER vs. 15% atual</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        );

      case 'nda':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Tipo de Parte (Quem receberá informação confidencial)
              </label>
              <select
                value={dadosEspecificos.tipo_parte || ''}
                onChange={(e) => handleDadosEspecificosChange('tipo_parte', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                <option value="terceiro_fabricante">🏭 Terceiro Fabricante (Usinagem, Tratamento, Caldeiraria)</option>
                <option value="cliente_final">👤 Cliente Final (Contratante do serviço)</option>
                <option value="parceiro_comercial">🤝 Parceiro Comercial (Representante, Consultor)</option>
                <option value="ex_colaborador">👔 Ex-Colaborador (Acordo pós-desligamento)</option>
              </select>
            </div>

            {/* CONDICIONAL: Blindagens especiais para Terceiro Fabricante */}
            {dadosEspecificos.tipo_parte === 'terceiro_fabricante' && (
              <div className="mt-4 p-4 border-2 border-orange-300 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                  ⚠️ Blindagens Especiais para Terceiro Fabricante
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-1">
                      CNPJ do Fornecedor *
                    </label>
                    <input
                      type="text"
                      value={dadosEspecificos.cnpj_fornecedor || ''}
                      onChange={(e) => handleDadosEspecificosChange('cnpj_fornecedor', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500"
                      placeholder="00.000.000/0001-00"
                      required
                    />
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dadosEspecificos.sistema_enterfix_tracking || false}
                      onChange={(e) => handleDadosEspecificosChange('sistema_enterfix_tracking', e.target.checked)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="text-sm text-gray-700">
                      Registrar em Módulo Fornecedores (rastreabilidade arquivos STEP/DXF)
                    </span>
                  </label>

                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                    <strong className="text-red-800">Multas Automáticas:</strong>
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
                      <li>Vazamento arquivo técnico: <strong className="text-red-600">R$ 50.000</strong> OU 100% valor pedido (o maior)</li>
                      <li>Fabricação não autorizada: <strong className="text-red-600">R$ 100.000</strong> OU 200% lucro obtido (o maior)</li>
                      <li>Engenharia reversa: <strong className="text-red-600">R$ 80.000</strong> + indenização danos</li>
                    </ul>
                  </div>

                  <label className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="text-sm text-gray-700">
                      <strong>Certificado de Destruição Obrigatório</strong> (15 dias após conclusão - DOD 5220.22-M)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Avisos para outros tipos */}
            {dadosEspecificos.tipo_parte === 'cliente_final' && (
              <div className="mt-4 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
                <strong className="text-blue-800">Multas Cliente Final:</strong>
                <ul className="list-disc ml-5 mt-2 space-y-1 text-sm text-gray-700">
                  <li>Uso projeto sem licença: <strong>200%</strong> valor Engenharia Reversa</li>
                  <li>Replicação filiais não autorizadas: <strong>R$ 50.000</strong> por unidade</li>
                  <li>Compartilhamento com terceiros: <strong>R$ 100.000</strong> + regresso</li>
                </ul>
              </div>
            )}

            {dadosEspecificos.tipo_parte === 'parceiro_comercial' && (
              <div className="mt-4 p-4 border-2 border-purple-300 rounded-lg bg-purple-50">
                <strong className="text-purple-800">Multas Parceiro Comercial:</strong>
                <ul className="list-disc ml-5 mt-2 space-y-1 text-sm text-gray-700">
                  <li>Vazamento lista clientes: <strong>R$ 80.000</strong></li>
                  <li>Concorrência desleal (oferecer serviço diretamente): <strong>R$ 200.000</strong></li>
                  <li>Uso marca sem autorização: <strong>R$ 50.000</strong></li>
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finalidade
                </label>
                <input
                  type="text"
                  value={dadosEspecificos.finalidade || ''}
                  onChange={(e) => handleDadosEspecificosChange('finalidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Prestação de serviços, Fabricação de peças"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo de Sigilo (anos)
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.prazo_sigilo || '5'}
                  onChange={(e) => handleDadosEspecificosChange('prazo_sigilo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Multa Adicional Customizada (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dadosEspecificos.multa_customizada || ''}
                  onChange={(e) => handleDadosEspecificosChange('multa_customizada', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t pt-4">
              <h4 className="font-semibold text-gray-700">🔐 Rastreabilidade Digital</h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.rastreabilidade_digital || false}
                  onChange={(e) => handleDadosEspecificosChange('rastreabilidade_digital', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Rastreabilidade Digital</strong> - Marca d'água XML + hash SHA-256 + logs Supabase 10 anos
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.alertas_vencimento || false}
                  onChange={(e) => handleDadosEspecificosChange('alertas_vencimento', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>Alertas Automáticos Vencimento</strong> - 15 dias antes, dia vencimento, 7 dias atraso
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dadosEspecificos.qr_code_pecas || false}
                  onChange={(e) => handleDadosEspecificosChange('qr_code_pecas', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  <strong>QR Code em Peças Físicas</strong> - Rastreabilidade cadeia de custódia
                </span>
              </label>
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
