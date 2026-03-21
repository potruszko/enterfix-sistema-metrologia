import { useState, useEffect, useCallback } from 'react'
import { GitBranch, ChevronRight, ChevronDown, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { getProdutos, getProdutoBom } from '../lib/api'

const CATEGORIAS = {
  materia_prima: { label: 'Matéria Prima', color: 'bg-gray-600 text-gray-100' },
  componente:    { label: 'Componente',    color: 'bg-blue-700 text-blue-100' },
  semiacabado:   { label: 'Semiacabado',   color: 'bg-yellow-700 text-yellow-100' },
  acabado:       { label: 'Acabado',       color: 'bg-green-700 text-green-100' },
}

function CatBadge({ cat }) {
  const c = CATEGORIAS[cat] || CATEGORIAS.acabado
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${c.color}`}>
      {c.label}
    </span>
  )
}

function BomNode({ node, nivel }) {
  const [open, setOpen] = useState(nivel < 2)
  const hasChildren = node.filhos && node.filhos.length > 0
  const indent = nivel * 20

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-800 cursor-pointer select-none"
        style={{ paddingLeft: indent + 8 }}
        onClick={() => hasChildren && setOpen(o => !o)}
      >
        <span className="w-4 flex-shrink-0 text-gray-500">
          {hasChildren
            ? (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />)
            : <span className="inline-block w-3.5" />}
        </span>

        <span className="text-xs font-mono text-gray-300 w-24 flex-shrink-0">
          {node.codigo_componente}
        </span>

        <span className="text-sm text-white flex-1 truncate">
          {node.nome_componente || node.filho_nome || '-'}
        </span>

        {node.filho_categoria && (
          <CatBadge cat={node.filho_categoria} />
        )}

        <span className="text-xs text-gray-400 w-14 text-right flex-shrink-0">
          ×{parseFloat(node.quantidade).toLocaleString('pt-BR', { maximumFractionDigits: 3 })}
        </span>

        <span className="text-xs text-gray-300 w-20 text-right flex-shrink-0">
          R$ {parseFloat(node.custo_unitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>

        <span className="text-xs font-semibold text-green-400 w-20 text-right flex-shrink-0">
          R$ {parseFloat(node.custo_linha || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {open && hasChildren && node.filhos.map((f, i) => (
        <BomNode key={i} node={f} nivel={nivel + 1} />
      ))}
    </div>
  )
}

export default function BOM() {
  const [produtos, setProdutos] = useState([])
  const [selected, setSelected] = useState(null)
  const [bom, setBom] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingBom, setLoadingBom] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [erro, setErro] = useState(null)

  const fetchProdutos = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const r = await getProdutos({ limit: 500 })
      const list = Array.isArray(r.data) ? r.data : (r.data.produtos || [])
      list.sort((a, b) => {
        const order = { materia_prima: 0, componente: 1, semiacabado: 2, acabado: 3 }
        const oa = order[a.categoria] !== undefined ? order[a.categoria] : 3
        const ob = order[b.categoria] !== undefined ? order[b.categoria] : 3
        return oa - ob || (a.codigo || '').localeCompare(b.codigo || '')
      })
      setProdutos(list)
    } catch (e) {
      setErro('Erro ao carregar produtos: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProdutos() }, [fetchProdutos])

  async function fetchBom(produto) {
    setSelected(produto)
    setBom(null)
    setLoadingBom(true)
    try {
      const r = await getProdutoBom(produto.id)
      setBom(r.data)
    } catch (e) {
      setErro('Erro ao carregar BOM: ' + e.message)
    } finally {
      setLoadingBom(false)
    }
  }

  async function syncCompleto() {
    if (!confirm('Sincronizar TODOS os produtos ativos com o Bling (incluindo estrutura BOM)?\n\nEsta operação pode demorar vários minutos.')) return
    setSyncing(true)
    setSyncResult(null)
    try {
      const r = await fetch('/api/bling/sync-full', { method: 'POST' })
      const data = await r.json()
      setSyncResult(data)
    } catch (e) {
      setErro('Erro no sync: ' + e.message)
    } finally {
      setSyncing(false)
    }
  }

  const custoTotal = bom
    ? (bom.arvore || []).reduce((acc, n) => acc + (n.custo_linha || 0), 0)
    : 0

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* ── Lista de produtos ── */}
      <aside className="w-72 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <GitBranch size={16} className="text-blue-400" />
            Produtos
          </h2>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-400" size={24} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-1">
          {Object.entries(CATEGORIAS).map(([cat, meta]) => {
            const items = produtos.filter(p => (p.categoria || 'acabado') === cat)
            if (items.length === 0) return null
            return (
              <div key={cat}>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-4 pt-3 pb-1">
                  {meta.label}
                </p>
                {items.map(p => (
                  <button
                    key={p.id}
                    onClick={() => fetchBom(p)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors ${selected && selected.id === p.id ? 'bg-gray-800 border-l-2 border-blue-500' : ''}`}
                  >
                    <p className="text-xs font-mono text-gray-400">{p.codigo}</p>
                    <p className="text-sm text-white truncate">{p.nome}</p>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Painel BOM ── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-950">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
          <div>
            {selected
              ? <>
                  <h1 className="text-lg font-bold text-white">{selected.nome}</h1>
                  <p className="text-xs text-gray-400 font-mono">{selected.codigo}</p>
                </>
              : <h1 className="text-sm text-gray-500">Selecione um produto para ver a árvore BOM</h1>
            }
          </div>
          <button
            onClick={syncCompleto}
            disabled={syncing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {syncing
              ? <Loader2 size={16} className="animate-spin" />
              : <RefreshCw size={16} />}
            Sync Completo Bling
          </button>
        </div>

        {erro && (
          <div className="mx-6 mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-2">
            <AlertCircle size={16} /> {erro}
          </div>
        )}

        {syncResult && (
          <div className="mx-6 mt-4 text-sm bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
            <p className="font-semibold text-white mb-1">Resultado do Sync Completo</p>
            <div className="flex gap-6 text-sm">
              <span className="text-green-400">✓ Criados: {syncResult.sincronizados}</span>
              <span className="text-blue-400">↑ Atualizados: {syncResult.atualizados}</span>
              <span className="text-yellow-400">⚙ Estruturas: {syncResult.estruturas}</span>
              {syncResult.erros && syncResult.erros.length > 0 && (
                <span className="text-red-400">✗ Erros: {syncResult.erros.length}</span>
              )}
            </div>
            {syncResult.erros && syncResult.erros.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto text-xs text-red-300 space-y-1">
                {syncResult.erros.map((e, i) => (
                  <p key={i}><span className="font-mono">{e.codigo}</span>: {JSON.stringify(e.erro)}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Árvore */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loadingBom && (
            <div className="flex items-center justify-center pt-16">
              <Loader2 className="animate-spin text-blue-400" size={32} />
            </div>
          )}

          {bom && !loadingBom && (
            <>
              {/* Cabeçalho colunas */}
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-gray-800 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                <span className="w-4 flex-shrink-0" />
                <span className="w-24 flex-shrink-0">Código</span>
                <span className="flex-1">Nome</span>
                <span className="w-24 flex-shrink-0 text-center">Categoria</span>
                <span className="w-14 text-right flex-shrink-0">Qtd</span>
                <span className="w-20 text-right flex-shrink-0">Custo Unit.</span>
                <span className="w-20 text-right flex-shrink-0">Total Linha</span>
              </div>

              {bom.arvore && bom.arvore.length > 0
                ? bom.arvore.map((node, i) => <BomNode key={i} node={node} nivel={0} />)
                : <p className="text-gray-500 text-sm px-2 py-4">Nenhum componente cadastrado neste produto.</p>
              }

              {/* Rodapé custo */}
              <div className="mt-4 flex justify-end border-t border-gray-800 pt-3 px-2">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Custo Total da Árvore</p>
                  <p className="text-2xl font-bold text-green-400">
                    R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  {bom.custo_total && (
                    <p className="text-xs text-gray-500 mt-1">
                      Custo cadastrado: R$ {parseFloat(bom.custo_total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {!bom && !loadingBom && !selected && (
            <div className="flex flex-col items-center justify-center pt-16 text-gray-600">
              <GitBranch size={48} className="mb-4" />
              <p className="text-lg">Selecione um produto na lista à esquerda</p>
              <p className="text-sm mt-1">para visualizar sua árvore de composição</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
