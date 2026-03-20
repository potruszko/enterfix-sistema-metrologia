import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, AlertTriangle, Send, Download } from 'lucide-react'
import { getProdutos, sincronizarBling, getBlingStatus, getBlingProdutos, importarDoBling } from '../lib/api'
import { brl, statusBadge, statusLabel } from '../lib/utils'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'

export default function Bling() {
  const [blingStatus, setBlingStatus] = useState(null)
  const [produtos, setProdutos]       = useState([])
  const [blingProdutos, setBlingProd] = useState([])
  const [loading, setLoading]         = useState(true)
  const [syncing, setSyncing]         = useState(null)
  const [syncAll, setSyncAll]         = useState(false)
  const [blingSearch, setBlingSearch] = useState('')
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')

  async function load() {
    setLoading(true)
    try {
      const [status, prods] = await Promise.all([
        getBlingStatus(),
        getProdutos({ status: 'rascunho' })
      ])
      setBlingStatus(status.data)
      setProdutos(prods.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSync(id) {
    setSyncing(id)
    setError(''); setSuccess('')
    try {
      await sincronizarBling(id)
      setSuccess('Produto sincronizado com o Bling com sucesso!')
      await load()
    } catch (e) {
      setError(e.response?.data?.erro || e.response?.data?.detalhe || 'Falha na sincronização')
    } finally {
      setSyncing(null)
    }
  }

  async function handleSyncAll() {
    setSyncAll(true)
    setError(''); setSuccess('')
    let ok = 0; let fail = 0
    for (const p of produtos) {
      try { await sincronizarBling(p.id); ok++ } catch { fail++ }
    }
    setSuccess(`${ok} produto(s) sincronizados. ${fail > 0 ? `${fail} com erro.` : ''}`)
    await load()
    setSyncAll(false)
  }

  async function buscarNoBling() {
    setError('')
    try {
      const res = await getBlingProdutos(blingSearch)
      setBlingProd(res.data?.data || [])
    } catch (e) {
      setError('Falha ao buscar no Bling: ' + (e.response?.data?.erro || e.message))
    }
  }

  async function handleImportar(blingId) {
    setSyncing(blingId)
    try {
      await importarDoBling(blingId)
      setSuccess('Produto importado com sucesso!')
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao importar')
    } finally {
      setSyncing(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sincronizar com Bling"
        subtitle="Envie as composições para a ficha técnica de produtos do Bling ERP"
      />

      {/* Status da conexão */}
      {blingStatus && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          blingStatus.valido ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          {blingStatus.valido
            ? <CheckCircle size={20} className="text-green-600 shrink-0" />
            : <AlertTriangle size={20} className="text-red-600 shrink-0" />
          }
          <div className="flex-1">
            <p className={`font-semibold text-sm ${blingStatus.valido ? 'text-green-700' : 'text-red-700'}`}>
              {blingStatus.valido ? 'Bling conectado e autenticado' : 'Bling não autenticado'}
            </p>
            {blingStatus.expira_em && (
              <p className="text-xs text-gray-500">
                Token expira em: {new Date(blingStatus.expira_em).toLocaleString('pt-BR')}
              </p>
            )}
            {!blingStatus.valido && (
              <p className="text-xs text-red-600 mt-0.5">
                Configure as credenciais em <a href="/configuracoes" className="underline">Configurações</a>.
              </p>
            )}
          </div>
        </div>
      )}

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {/* Produtos pendentes de sincronização */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Produtos com Rascunho</h2>
            <p className="text-sm text-gray-500">{produtos.length} produto(s) aguardando sincronização</p>
          </div>
          {produtos.length > 0 && (
            <button
              onClick={handleSyncAll}
              disabled={syncAll || !blingStatus?.valido}
              className="btn-success disabled:opacity-50"
            >
              {syncAll ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
              {syncAll ? 'Enviando...' : `Enviar todos (${produtos.length})`}
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Carregando...</div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
            <p>Todos os produtos estão sincronizados!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {produtos.map(p => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-mono font-bold text-gray-900">{p.codigo}</p>
                  <p className="text-xs text-gray-500">{p.nome} · Custo: {brl(p.custo_total)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusBadge(p.status)}>{statusLabel(p.status)}</span>
                  <button
                    onClick={() => handleSync(p.id)}
                    disabled={syncing === p.id || !blingStatus?.valido}
                    className="btn-primary disabled:opacity-50 text-xs px-3 py-1.5"
                  >
                    {syncing === p.id
                      ? <RefreshCw size={13} className="animate-spin" />
                      : <Send size={13} />
                    }
                    {syncing === p.id ? 'Enviando...' : 'Sincronizar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buscar e importar do Bling */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-1">Importar produto do Bling</h2>
        <p className="text-sm text-gray-500 mb-4">
          Busque um produto existente no Bling e importe-o para o sistema local.
        </p>

        <div className="flex gap-3 mb-4">
          <input className="input flex-1" placeholder="Código ou nome do produto (ex: PM2-D0203)"
            value={blingSearch} onChange={e => setBlingSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarNoBling()} />
          <button onClick={buscarNoBling} disabled={!blingStatus?.valido} className="btn-secondary disabled:opacity-50">
            <RefreshCw size={15} /> Buscar
          </button>
        </div>

        {blingProdutos.length > 0 && (
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
            {blingProdutos.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-mono font-semibold text-sm text-gray-900">{p.codigo}</p>
                  <p className="text-xs text-gray-500">{p.nome}</p>
                </div>
                <button
                  onClick={() => handleImportar(p.id)}
                  disabled={syncing === p.id}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  <Download size={13} /> Importar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
