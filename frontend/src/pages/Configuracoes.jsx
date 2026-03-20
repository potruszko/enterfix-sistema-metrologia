import { useState, useEffect } from 'react'
import { ExternalLink, CheckCircle, Key, Save } from 'lucide-react'
import { getConfigs, saveConfigs, getBlingAuthUrl, salvarTokenManual, getBlingStatus } from '../lib/api'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'

export default function Configuracoes() {
  const [configs, setConfigs]       = useState({})
  const [blingStatus, setBlingStatus] = useState(null)
  const [token, setToken]           = useState({ access_token: '', refresh_token: '', expires_in: 21600 })
  const [horaMaquina, setHoraMaquina] = useState('150')
  const [lotePadrao, setLotePadrao] = useState('10')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [authUrl, setAuthUrl]       = useState('')

  const searchParams = new URLSearchParams(window.location.search)
  const blingOk = searchParams.get('bling') === 'ok'

  useEffect(() => {
    async function load() {
      try {
        const [c, s, u] = await Promise.all([getConfigs(), getBlingStatus(), getBlingAuthUrl()])
        setConfigs(c.data)
        setBlingStatus(s.data)
        setAuthUrl(u.data?.url || '')
        setHoraMaquina(c.data.hora_maquina || '150')
        setLotePadrao(c.data.lote_padrao || '10')
      } catch (e) {
        console.error('Erro ao carregar configurações:', e)
      }
    }
    load()

    if (blingOk) setSuccess('Bling autenticado com sucesso!')
  }, [])

  async function salvarConfigs() {
    setSaving(true); setError(''); setSuccess('')
    try {
      await saveConfigs({ hora_maquina: horaMaquina, lote_padrao: lotePadrao })
      setSuccess('Configurações salvas!')
    } catch { setError('Erro ao salvar') } finally { setSaving(false) }
  }

  async function salvarToken() {
    setSaving(true); setError(''); setSuccess('')
    try {
      await salvarTokenManual(token)
      setSuccess('Token Bling salvo com sucesso!')
      const s = await getBlingStatus()
      setBlingStatus(s.data)
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao salvar token')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Configurações" subtitle="Integrações e parâmetros do sistema" />

      <Alert type="success" message={success} />
      <Alert type="error" message={error} />

      {/* Bling OAuth */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900">Integração Bling API v3</h2>
          {blingStatus?.valido && <CheckCircle size={16} className="text-green-600" />}
        </div>

        {blingStatus?.valido ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✓ Autenticado — token válido até {blingStatus.expira_em
              ? new Date(blingStatus.expira_em).toLocaleString('pt-BR') : '—'}
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            ⚠ Não autenticado — configure seu token abaixo.
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Opção 1 — Autenticação OAuth (recomendado)
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Clique no botão abaixo para autorizar o acesso ao Bling. Você será redirecionado
            de volta automaticamente após autorizar.
          </p>
          {authUrl ? (
            <div className="flex flex-wrap gap-2">
              <a href={authUrl} className="btn-primary inline-flex items-center gap-1.5">
                <ExternalLink size={15} />
                {blingStatus?.valido ? 'Reconectar Bling' : 'Conectar com Bling'}
              </a>
              {blingStatus?.valido && (
                <span className="text-xs text-gray-400 self-center">
                  Token válido — clique para renovar a conexão se necessário
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-red-500">
              Configure BLING_CLIENT_ID e BLING_CLIENT_SECRET no arquivo .env do backend.
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Opção 2 — Token manual
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Cole o access_token obtido diretamente via Postman ou Bling Developer Portal.
          </p>
          <div className="space-y-3">
            <div>
              <label className="label">Access Token *</label>
              <input className="input font-mono text-xs" value={token.access_token}
                onChange={e => setToken(t => ({ ...t, access_token: e.target.value }))}
                placeholder="Bearer eyJhbGci..." />
            </div>
            <div>
              <label className="label">Refresh Token (opcional)</label>
              <input className="input font-mono text-xs" value={token.refresh_token}
                onChange={e => setToken(t => ({ ...t, refresh_token: e.target.value }))}
                placeholder="Refresh token para renovação automática" />
            </div>
            <div>
              <label className="label">Validade (segundos)</label>
              <input className="input w-32" type="number" value={token.expires_in}
                onChange={e => setToken(t => ({ ...t, expires_in: parseInt(e.target.value) }))} />
            </div>
            <button onClick={salvarToken} disabled={saving} className="btn-secondary">
              <Key size={15} /> Salvar token
            </button>
          </div>
        </div>
      </div>

      {/* Parâmetros de custo */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-gray-900">Parâmetros de Custo</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Custo Hora-Máquina (R$)</label>
            <input className="input" type="number" step="0.01" value={horaMaquina}
              onChange={e => setHoraMaquina(e.target.value)}
              placeholder="150.00" />
            <p className="text-xs text-gray-400 mt-1">Torno Nexturn — por hora</p>
          </div>
          <div>
            <label className="label">Lote Padrão (peças)</label>
            <input className="input" type="number" step="1" value={lotePadrao}
              onChange={e => setLotePadrao(e.target.value)}
              placeholder="10" />
            <p className="text-xs text-gray-400 mt-1">Para rateio do setup</p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          Custo de setup por peça = (Hora-Máquina × Tempo Setup) ÷ Lote Padrão
        </div>

        <button onClick={salvarConfigs} disabled={saving} className="btn-primary">
          <Save size={15} /> Salvar configurações
        </button>
      </div>

      {/* Info Bling endpoints */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-2">Referência da API Bling v3</h2>
        <div className="space-y-1 text-xs font-mono text-gray-500">
          <p>GET  /api/bling/auth/status       — status da autenticação</p>
          <p>GET  /api/bling/auth/url          — URL de autorização OAuth</p>
          <p>GET  /api/bling/auth/callback     — callback OAuth (automático)</p>
          <p>POST /api/bling/auth/token-manual — salvar token manualmente</p>
          <p>GET  /api/bling/produtos          — listar produtos no Bling</p>
          <p>POST /api/bling/sincronizar/:id   — enviar composição ao Bling</p>
          <p>POST /api/bling/importar/:blingId — importar produto do Bling</p>
        </div>
      </div>
    </div>
  )
}
