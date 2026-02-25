import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError('');
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Validar domínio @enterfix.com.br
    if (!email.endsWith('@enterfix.com.br')) {
      setError('Apenas e-mails corporativos @enterfix.com.br são permitidos.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Cadastro
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;
        
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmar.');
        setEmail('');
        setPassword('');
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        // O App.jsx vai detectar a mudança de sessão automaticamente
      }
    } catch (error) {
      setError(error.message || 'Erro ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAzureLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile',
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError('Erro ao fazer login com Microsoft 365: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo e Título */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Enterfix Metrologia
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de Gestão de Relatórios
            </p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🔒 Acesso Restrito - Colaboradores Enterfix
            </div>
          </div>

          {/* Mensagens de Erro/Sucesso */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          )}

          {/* Login com Microsoft 365 (Recomendado) */}
          <div className="space-y-4">
            <button
              onClick={handleAzureLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <>
                  <svg className="h-7 w-7" viewBox="0 0 23 23" fill="none">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span className="text-base font-semibold text-gray-700">
                    Entrar com Microsoft 365
                  </span>
                </>
              )}
            </button>
            
            <div className="text-center">
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                ⭐ Recomendado - SSO Corporativo
              </span>
            </div>
          </div>

          {/* Divisor */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Login com E-mail (Alternativa) */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail Corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@enterfix.com.br"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando...
                </span>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setMessage('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
              >
                {isSignUp ? 'Já tem conta? Faça login' : 'Primeira vez? Criar conta'}
              </button>
            </div>
          </form>

          {/* Informações de Segurança */}
          <div className="border-t border-gray-200 pt-4">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Acesso restrito a @enterfix.com.br
              </p>
              <p className="text-center text-gray-400">
                Sistema protegido com criptografia SSL/TLS
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>© 2026 Enterfix Metrologia. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
