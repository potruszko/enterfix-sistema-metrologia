import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Briefcase, Award, Building2, 
  FileSignature, Save, Upload, Camera, Shield 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAlert } from './AlertSystem';

const PerfilUsuario = () => {
  const alert = useAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  
  const [perfil, setPerfil] = useState({
    nome_completo: '',
    cargo: '',
    telefone: '',
    foto_url: '',
    registro_profissional: '',
    tipo_registro: 'CREA',
    empresa: 'Enterfix Metrologia',
    departamento: '',
    especializacao: '',
    bio: '',
    assinatura_url: '',
    role: 'tecnico'
  });

  const tiposRegistro = [
    'CREA', 'CRM', 'CRQ', 'CRF', 'CRMV', 'CRO', 
    'CRT', 'CONFEA', 'Outro', 'Não se aplica'
  ];

  const roles = [
    { value: 'admin', label: '🔑 Administrador', desc: 'Acesso total ao sistema' },
    { value: 'gestor', label: '👔 Gestor', desc: 'Gerencia equipes e relatórios' },
    { value: 'tecnico', label: '🔧 Técnico', desc: 'Cria e edita relatórios' },
    { value: 'visualizador', label: '👁️ Visualizador', desc: 'Apenas visualiza relatórios' }
  ];

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      
      // Obter usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Usuário não autenticado');

      setUserEmail(user.email);
      setUserId(user.id);

      // Buscar perfil do usuário
      const { data: perfilData, error: perfilError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (perfilError && perfilError.code !== 'PGRST116') {
        // PGRST116 = row not found (normal para usuário novo)
        throw perfilError;
      }

      if (perfilData) {
        setPerfil({
          nome_completo: perfilData.nome_completo || '',
          cargo: perfilData.cargo || '',
          telefone: perfilData.telefone || '',
          foto_url: perfilData.foto_url || '',
          registro_profissional: perfilData.registro_profissional || '',
          tipo_registro: perfilData.tipo_registro || 'CREA',
          empresa: perfilData.empresa || 'Enterfix Metrologia',
          departamento: perfilData.departamento || '',
          especializacao: perfilData.especializacao || '',
          bio: perfilData.bio || '',
          assinatura_url: perfilData.assinatura_url || '',
          role: perfilData.role || 'tecnico'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      alert.error('Erro ao carregar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvar = async () => {
    try {
      setSaving(true);

      // Validações básicas
      if (!perfil.nome_completo || perfil.nome_completo.trim().length < 3) {
        alert.warning('Por favor, preencha seu nome completo.');
        return;
      }

      // Upsert (insert or update) do perfil
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...perfil,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      alert.success('Perfil atualizado com sucesso! ✅');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert.error('Erro ao salvar perfil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert.warning('Por favor, selecione uma imagem válida.');
      return;
    }

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert.warning('A imagem deve ter no máximo 2MB.');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-foto-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setPerfil(prev => ({ ...prev, foto_url: publicUrl }));
      alert.success('Foto enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      alert.error('Erro ao enviar foto: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-industrial-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-industrial-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-industrial-800 mb-2">
            Perfil do Usuário
          </h1>
          <p className="text-industrial-600">
            Configure seus dados profissionais e preferências
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header do Card - Foto e Info Básica */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Foto de Perfil */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                  {perfil.foto_url ? (
                    <img 
                      src={perfil.foto_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-white/60" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition shadow-lg">
                  <Camera size={20} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUploadFoto}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Info Básica */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">
                  {perfil.nome_completo || 'Seu Nome'}
                </h2>
                <p className="text-blue-100 mb-2">
                  {perfil.cargo || 'Cargo não informado'}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                  <Mail size={16} />
                  <span className="text-sm">{userEmail}</span>
                </div>
              </div>

              {/* Badge de Role */}
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                <p className="text-xs text-blue-100 mb-1">Permissão</p>
                <p className="font-semibold">
                  {roles.find(r => r.value === perfil.role)?.label || '🔧 Técnico'}
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome Completo */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <User size={18} />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome_completo"
                  value={perfil.nome_completo}
                  onChange={handleInputChange}
                  placeholder="João da Silva Santos"
                  required
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <Briefcase size={18} />
                  Cargo / Função
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={perfil.cargo}
                  onChange={handleInputChange}
                  placeholder="Técnico em Metrologia"
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <Phone size={18} />
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={perfil.telefone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Tipo de Registro */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <Award size={18} />
                  Tipo de Registro
                </label>
                <select
                  name="tipo_registro"
                  value={perfil.tipo_registro}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {tiposRegistro.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Número do Registro */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <FileSignature size={18} />
                  Nº Registro Profissional
                </label>
                <input
                  type="text"
                  name="registro_profissional"
                  value={perfil.registro_profissional}
                  onChange={handleInputChange}
                  placeholder="Ex: 123456/SP"
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Empresa */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <Building2 size={18} />
                  Empresa
                </label>
                <input
                  type="text"
                  name="empresa"
                  value={perfil.empresa}
                  onChange={handleInputChange}
                  placeholder="Enterfix Metrologia"
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <Building2 size={18} />
                  Departamento / Setor
                </label>
                <input
                  type="text"
                  name="departamento"
                  value={perfil.departamento}
                  onChange={handleInputChange}
                  placeholder="Laboratório de Metrologia"
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Especialização */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <Award size={18} />
                  Especialização / Área de Atuação
                </label>
                <input
                  type="text"
                  name="especializacao"
                  value={perfil.especializacao}
                  onChange={handleInputChange}
                  placeholder="Ex: Calibração de Instrumentos Dimensionais, Metrologia Industrial"
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-2">
                  <User size={18} />
                  Bio / Resumo Profissional
                </label>
                <textarea
                  name="bio"
                  value={perfil.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Descreva brevemente sua experiência profissional, certificações e áreas de expertise..."
                  className="w-full px-4 py-3 border border-industrial-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Nível de Permissão (Opcional - só admin pode alterar) */}
              <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-center gap-2 text-sm font-medium text-industrial-700 mb-3">
                  <Shield size={18} />
                  Nível de Permissão
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {roles.map(role => (
                    <div
                      key={role.value}
                      className={`p-3 rounded-lg border-2 transition ${
                        perfil.role === role.value
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 bg-white opacity-60'
                      }`}
                    >
                      <p className="font-medium text-sm mb-1">{role.label}</p>
                      <p className="text-xs text-gray-600">{role.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  ℹ️ Seu nível de permissão é definido pelo administrador do sistema
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-industrial-200">
              <button
                onClick={handleSalvar}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span className="font-medium">Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span className="font-medium">Salvar Perfil</span>
                  </>
                )}
              </button>
              
              <button
                onClick={carregarPerfil}
                disabled={saving}
                className="px-6 py-3 bg-industrial-100 text-industrial-700 rounded-lg hover:bg-industrial-200 disabled:opacity-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Card de Ajuda */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            💡 Dica: Sistema em Expansão
          </h3>
          <p className="text-amber-800 text-sm">
            Mantenha seu perfil completo! Em breve, novas funcionalidades de gestão de metrologia 
            utilizarão seus dados profissionais para automatizar relatórios e certificações.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
