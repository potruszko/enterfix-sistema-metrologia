import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 6000)
      return () => clearTimeout(t)
    }
  }, [error])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.endsWith('@enterfix.com.br')) {
      setError('Apenas e-mails @enterfix.com.br têm acesso a este sistema.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('invalid login')) {
        setError('E-mail ou senha incorretos.')
      } else {
        setError(msg || 'Erro ao autenticar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">

          {/* Logo */}
          <div className="text-center space-y-3">
            <img
              src="/logo-light.png"
              alt="Enterfix"
              className="h-12 mx-auto"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gestão de Composição</h2>
              <p className="text-xs text-gray-500 mt-1">Pontas de Medição</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🔒 Acesso restrito — colaboradores Enterfix
            </span>
          </div>

          {/* Mensagens */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail corporativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@enterfix.com.br"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? 'Aguarde...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Acesso concedido pelo administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
