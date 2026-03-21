import { useState, useEffect, useCallback, useRef } from 'react'
import {
  GitBranch, ChevronRight, ChevronDown, RefreshCw, AlertCircle, Loader2,
  Pencil, Check, X, Printer, Search, Tag
} from 'lucide-react'
import { getProdutos, getProdutoBom, updateProduto } from '../lib/api'

const CATEGORIAS = {
  materia_prima: { label: 'Matéria Prima', color: 'bg-gray-600 text-gray-100' },
  componente:    { label: 'Componente',    color: 'bg-blue-700 text-blue-100' },
  semiacabado:   { label: 'Semiacabado',   color: 'bg-yellow-600 text-yellow-100' },
  acabado:       { label: 'Acabado',       color: 'bg-green-700 text-green-100' },
}

const UNIDADES = ['un', 'mm', 'm', 'kg', 'g', 'l', 'ml', 'h', 'min', 'pc']

const brl = (v) => 'R$ ' + parseFloat(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtQtd = (v, u) => parseFloat(v).toLocaleString('pt-BR', { maximumFractionDigits: 4 }) + (u ? ' ' + u : '')

function CatBadge({ cat }) {
  const c = CATEGORIAS[cat] || CATEGORIAS.acabado
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${c.color}`}>
      {c.label}
    </span>
  )
}

// ── Nó editável da árvore BOM ─────────────────────────────────────────────────
function BomNode({ node, nivel, onUpdate, produtoId }) {
  const [open, setOpen] = useState(nivel < 2)
  const [editing, setEditing] = useState(false)
  const [editQtd, setEditQtd] = useState(String(node.quantidade))
  const [editUnidade, setEditUnidade] = useState(node.unidade || 'un')
  const [editFatorPerda, setEditFatorPerda] = useState(String(node.fator_perda || 1))
  const [saving, setSaving] = useState(false)
  const hasChildren = node.filhos && node.filhos.length > 0
  const indent = nivel * 22

  const qtdEfetiva = parseFloat(editQtd) * parseFloat(editFatorPerda || 1)
  const custoLinha = qtdEfetiva * parseFloat(node.custo_unitario || 0)

  async function salvar() {
    setSaving(true)
    try {
      await fetch(`/api/produto-componentes/${node.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantidade: parseFloat(editQtd),
          unidade: editUnidade,
          fator_perda: parseFloat(editFatorPerda)
        })
      })
      onUpdate()
      setEditing(false)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  function cancelar() {
    setEditQtd(String(node.quantidade))
    setEditUnidade(node.unidade || 'un')
    setEditFatorPerda(String(node.fator_perda || 1))
    setEditing(false)
  }

  return (
    <div className="bom-node">
      <div
        className={`flex items-center gap-1.5 py-1.5 pr-2 rounded group transition-colors ${editing ? 'bg-gray-800 ring-1 ring-blue-500' : 'hover:bg-gray-800/60'}`}
        style={{ paddingLeft: indent + 6 }}
      >
        {/* Expand toggle */}
        <button
          className="w-5 h-5 flex items-center justify-center text-gray-500 flex-shrink-0"
          onClick={() => hasChildren && setOpen(o => !o)}
        >
          {hasChildren ? (open ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : <span className="w-3" />}
        </button>

        {/* Código */}
        <span className="text-xs font-mono text-gray-400 w-24 flex-shrink-0 truncate" title={node.codigo_componente}>
          {node.codigo_componente}
        </span>

        {/* Nome */}
        <span className="text-sm text-white flex-1 truncate min-w-0" title={node.nome_componente || node.filho_nome}>
          {node.nome_componente || node.filho_nome || '-'}
        </span>

        {/* Categoria badge (apenas filhos-produto) */}
        {node.filho_categoria && (
          <CatBadge cat={node.filho_categoria} />
        )}

        {/* Tipo */}
        <span className="text-[10px] text-gray-500 w-16 flex-shrink-0 text-center truncate">
          {node.tipo_componente === 'mao_de_obra' ? 'M.Obra' : node.tipo_componente}
        </span>

        {/* Quantidade + Unidade editável */}
        {editing ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              className="w-16 bg-gray-700 text-white text-xs rounded px-1.5 py-0.5 border border-blue-500 text-right"
              value={editQtd}
              onChange={e => setEditQtd(e.target.value)}
              type="number" step="any" min="0"
            />
            <select
              className="bg-gray-700 text-white text-xs rounded px-1 py-0.5 border border-blue-500"
              value={editUnidade}
              onChange={e => setEditUnidade(e.target.value)}
            >
              {UNIDADES.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        ) : (
          <span className="text-xs text-gray-300 w-20 text-right flex-shrink-0 font-mono">
            {fmtQtd(node.quantidade, node.unidade || 'un')}
          </span>
        )}

        {/* Fator de perda */}
        {editing ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[10px] text-gray-400">×perda</span>
            <input
              className="w-12 bg-gray-700 text-white text-xs rounded px-1.5 py-0.5 border border-yellow-500 text-right"
              value={editFatorPerda}
              onChange={e => setEditFatorPerda(e.target.value)}
              type="number" step="0.01" min="1"
            />
          </div>
        ) : (
          node.fator_perda && parseFloat(node.fator_perda) > 1 ? (
            <span className="text-[10px] text-yellow-400 w-16 flex-shrink-0 text-center">
              +{((parseFloat(node.fator_perda) - 1) * 100).toFixed(0)}% perda
            </span>
          ) : <span className="w-16 flex-shrink-0" />
        )}

        {/* Custo unitário */}
        <span className="text-xs text-gray-400 w-20 text-right flex-shrink-0">
          {brl(node.custo_unitario || 0)}
        </span>

        {/* Total linha */}
        <span className="text-xs font-semibold text-green-400 w-22 text-right flex-shrink-0">
          {brl(editing ? custoLinha : node.custo_linha)}
        </span>

        {/* Ações */}
        {editing ? (
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={salvar} disabled={saving} className="p-1 text-green-400 hover:text-green-300">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            </button>
            <button onClick={cancelar} className="p-1 text-gray-400 hover:text-red-400">
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-gray-600 hover:text-blue-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Editar quantidade"
          >
            <Pencil size={12} />
          </button>
        )}
      </div>

      {/* Filhos */}
      {open && hasChildren && (
        <div className="ml-0">
          {node.filhos.map((f, i) => (
            <BomNode key={i} node={f} nivel={nivel + 1} onUpdate={onUpdate} produtoId={produtoId} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Rollup recursivo ──────────────────────────────────────────────────────────
function calcularCustoArvore(arvore) {
  if (!arvore) return 0
  return arvore.reduce((acc, node) => {
    const qtdEfetiva = parseFloat(node.quantidade) * parseFloat(node.fator_perda || 1)
    const custoNode = node.filho_custo_total && node.filhos && node.filhos.length > 0
      ? parseFloat(node.filho_custo_total) * qtdEfetiva
      : parseFloat(node.custo_unitario || 0) * qtdEfetiva
    return acc + custoNode
  }, 0)
}

// ── Exportar para impressão ───────────────────────────────────────────────────
function exportarPDF(produto, bom) {
  const linhas = []
  function flatten(nodes, nivel) {
    for (const n of nodes) {
      const indent = '  '.repeat(nivel)
      const qtd = fmtQtd(n.quantidade, n.unidade || 'un')
      const perda = n.fator_perda && parseFloat(n.fator_perda) > 1 ? ` ×${n.fator_perda}` : ''
      linhas.push(`${indent}${n.codigo_componente} | ${n.nome_componente || n.filho_nome} | ${qtd}${perda} | ${brl(n.custo_unitario)} | ${brl(n.custo_linha)}`)
      if (n.filhos && n.filhos.length > 0) flatten(n.filhos, nivel + 1)
    }
  }
  flatten(bom.arvore || [], 0)
  const custo = calcularCustoArvore(bom.arvore)

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>BOM - ${produto.codigo}</title>
<style>
  body{font-family:monospace;font-size:12px;padding:20px}
  h1{font-size:18px;margin-bottom:4px}
  h2{font-size:13px;color:#666;margin-bottom:16px;font-weight:normal}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  th{background:#333;color:#fff;padding:6px 8px;text-align:left;font-size:11px}
  td{padding:5px 8px;border-bottom:1px solid #eee;font-size:11px}
  .total{font-weight:bold;font-size:14px;margin-top:16px;text-align:right}
  .footer{margin-top:24px;font-size:10px;color:#999}
</style></head><body>
<h1>BOM — ${produto.codigo}</h1>
<h2>${produto.nome} | Categoria: ${CATEGORIAS[produto.categoria] ? CATEGORIAS[produto.categoria].label : 'Acabado'}</h2>
<table>
<tr><th>Código</th><th>Componente</th><th>Tipo</th><th>Quantidade</th><th>Fator Perda</th><th>Custo Unit.</th><th>Total Linha</th></tr>
${(bom.arvore || []).map(n => renderLinhaHTML(n, 0)).join('')}
</table>
<div class="total">Custo Total da BOM: ${brl(custo)}</div>
<div class="footer">Gerado em ${new Date().toLocaleString('pt-BR')} — Enterfix Sistema de Metrologia</div>
</body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  setTimeout(() => win.print(), 500)
}

function renderLinhaHTML(node, nivel) {
  const indent = '&nbsp;'.repeat(nivel * 4)
  const perda = node.fator_perda && parseFloat(node.fator_perda) > 1 ? parseFloat(node.fator_perda).toFixed(2) : '1.00'
  const tipo = node.tipo_componente === 'mao_de_obra' ? 'Mão de Obra' : node.tipo_componente
  const linhas = `<tr style="background:${nivel % 2 === 0 ? '#fff' : '#f9f9f9'}">
    <td>${indent}${node.codigo_componente}</td>
    <td>${node.nome_componente || node.filho_nome || ''}</td>
    <td>${tipo}</td>
    <td>${fmtQtd(node.quantidade, node.unidade || 'un')}</td>
    <td>${perda}</td>
    <td>${brl(node.custo_unitario)}</td>
    <td>${brl(node.custo_linha)}</td>
  </tr>`
  const filhos = node.filhos && node.filhos.length > 0
    ? node.filhos.map(f => renderLinhaHTML(f, nivel + 1)).join('')
    : ''
  return linhas + filhos
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function BOM() {
  const [produtos, setProdutos] = useState([])
  const [filtro, setFiltro] = useState('')
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

  const fetchBom = useCallback(async (produto) => {
    setSelected(produto)
    setBom(null)
    setErro(null)
    setLoadingBom(true)
    try {
      const r = await getProdutoBom(produto.id)
      setBom(r.data)
    } catch (e) {
      setErro('Erro ao carregar BOM: ' + e.message)
    } finally {
      setLoadingBom(false)
    }
  }, [])

  function refreshBom() {
    if (selected) fetchBom(selected)
  }

  async function syncCompleto() {
    if (!confirm('Sincronizar TODOS os produtos ativos com o Bling (incluindo estrutura BOM)?\n\nEsta operação pode demorar vários minutos.')) return
    setSyncing(true)
    setSyncResult(null)
    setErro(null)
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

  const produtosFiltrados = produtos.filter(p => {
    if (!filtro) return true
    const q = filtro.toLowerCase()
    return (p.codigo || '').toLowerCase().includes(q) || (p.nome || '').toLowerCase().includes(q)
  })

  const custoTotal = calcularCustoArvore(bom && bom.arvore)

  return (
    <div className="flex h-full overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ══ Painel esquerdo: lista de produtos ══ */}
      <aside className="w-72 flex-shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="px-3 py-3 border-b border-gray-700 space-y-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <GitBranch size={13} className="text-blue-400" /> Produtos
          </h2>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="w-full bg-gray-800 text-white text-xs rounded-lg pl-7 pr-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Filtrar código ou nome..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-400" size={20} />
          </div>
        )}

        {/* Lista agrupada por categoria */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(CATEGORIAS).map(([cat, meta]) => {
            const items = produtosFiltrados.filter(p => (p.categoria || 'acabado') === cat)
            if (items.length === 0) return null
            return (
              <div key={cat}>
                <div className={`flex items-center gap-1.5 px-3 pt-3 pb-1`}>
                  <span className={`w-2 h-2 rounded-full ${meta.color.split(' ')[0]}`} />
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {meta.label} ({items.length})
                  </p>
                </div>
                {items.map(p => (
                  <button
                    key={p.id}
                    onClick={() => fetchBom(p)}
                    className={`w-full text-left px-3 py-2 transition-colors border-l-2 ${
                      selected && selected.id === p.id
                        ? 'bg-gray-800 border-blue-500'
                        : 'border-transparent hover:bg-gray-800/60 hover:border-gray-600'
                    }`}
                  >
                    <p className="text-[11px] font-mono text-gray-400">{p.codigo}</p>
                    <p className="text-sm text-white truncate leading-tight">{p.nome}</p>
                    {p.custo_total && (
                      <p className="text-[10px] text-green-400 font-mono mt-0.5">{brl(p.custo_total)}</p>
                    )}
                  </button>
                ))}
              </div>
            )
          })}
          {!loading && produtosFiltrados.length === 0 && (
            <p className="text-gray-500 text-xs text-center py-8 px-4">
              {filtro ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}
            </p>
          )}
        </div>
      </aside>

      {/* ══ Painel direito: árvore BOM ══ */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-950">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 flex-shrink-0">
          <div className="min-w-0">
            {selected ? (
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-white truncate">{selected.nome}</h1>
                    <CatBadge cat={selected.categoria || 'acabado'} />
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{selected.codigo}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Selecione um produto para ver a árvore BOM</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {selected && bom && (
              <button
                onClick={() => exportarPDF(selected, bom)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
              >
                <Printer size={13} /> Exportar PDF
              </button>
            )}
            <button
              onClick={syncCompleto}
              disabled={syncing}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Sync Bling
            </button>
          </div>
        </div>

        {/* Alertas */}
        {erro && (
          <div className="mx-5 mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-2 flex-shrink-0">
            <AlertCircle size={14} /> {erro}
          </div>
        )}

        {syncResult && (
          <div className="mx-5 mt-3 text-sm bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 flex-shrink-0">
            <p className="font-semibold text-white mb-1 text-xs">Resultado do Sync</p>
            <div className="flex gap-4 text-xs">
              <span className="text-green-400">✓ Criados: {syncResult.sincronizados}</span>
              <span className="text-blue-400">↑ Atualizados: {syncResult.atualizados}</span>
              <span className="text-yellow-400">⚙ Estruturas: {syncResult.estruturas}</span>
              {syncResult.erros && syncResult.erros.length > 0 && (
                <span className="text-red-400">✗ Erros: {syncResult.erros.length}</span>
              )}
            </div>
          </div>
        )}

        {/* Cabeçalho colunas */}
        {bom && !loadingBom && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-800 flex-shrink-0 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            <span className="w-5 flex-shrink-0" />
            <span className="w-24 flex-shrink-0">Código</span>
            <span className="flex-1">Componente</span>
            <span className="w-16 text-center flex-shrink-0">Cat.</span>
            <span className="w-16 text-center flex-shrink-0">Tipo</span>
            <span className="w-20 text-right flex-shrink-0">Qtd / Un</span>
            <span className="w-16 text-right flex-shrink-0">Perda</span>
            <span className="w-20 text-right flex-shrink-0">Unit.</span>
            <span className="w-22 text-right flex-shrink-0">Total</span>
            <span className="w-6 flex-shrink-0" />
          </div>
        )}

        {/* Árvore */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {loadingBom && (
            <div className="flex items-center justify-center pt-16">
              <Loader2 className="animate-spin text-blue-400" size={28} />
            </div>
          )}

          {bom && !loadingBom && (
            <>
              {bom.arvore && bom.arvore.length > 0 ? (
                bom.arvore.map((node, i) => (
                  <BomNode key={node.id || i} node={node} nivel={0} onUpdate={refreshBom} produtoId={selected.id} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">Nenhum componente cadastrado neste produto.</p>
                  <p className="text-gray-600 text-xs mt-1">Use "Construir Produto" para adicionar componentes.</p>
                </div>
              )}

              {/* Rodapé custo */}
              <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Componentes: <span className="text-white font-mono">{(bom.arvore || []).length}</span></p>
                    {bom.custo_total && (
                      <p>Custo cadastrado: <span className="text-gray-300 font-mono">{brl(bom.custo_total)}</span></p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Custo Total BOM (com perdas)</p>
                    <p className="text-2xl font-bold text-green-400">{brl(custoTotal)}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {!bom && !loadingBom && (
            <div className="flex flex-col items-center justify-center pt-20 text-gray-700">
              <GitBranch size={40} className="mb-4" />
              <p className="text-base">Selecione um produto</p>
              <p className="text-sm mt-1 text-gray-600">para visualizar e editar sua árvore BOM</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

