import { useState, useEffect, useCallback } from 'react'
import {
  GitBranch, ChevronRight, ChevronDown, AlertCircle, Loader2,
  Pencil, Check, X, Printer, Search, Upload, Eye
} from 'lucide-react'
import { getProdutos, getProdutoBom, getBlingPreview, sincronizarBling } from '../lib/api'

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
  const [erro, setErro] = useState(null)
  // Preview/Sync modal
  const [syncModal, setSyncModal] = useState(null)   // { produto }
  const [preview, setPreview] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState(null)

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

  async function abrirSyncModal(produto, e) {
    e.stopPropagation()
    setSyncModal({ produto })
    setPreview(null)
    setSyncMsg(null)
    setLoadingPreview(true)
    try {
      const r = await getBlingPreview(produto.id)
      setPreview(r.data)
    } catch (ex) {
      setPreview({ erro: ex.message, acao: 'erro', produto_local: produto, produto_bling: null, mudancas: [] })
    } finally {
      setLoadingPreview(false)
    }
  }

  async function confirmarSync() {
    if (!syncModal) return
    setSyncing(true)
    setSyncMsg(null)
    try {
      await sincronizarBling(syncModal.produto.id)
      setSyncMsg({ tipo: 'ok', texto: 'Sincronizado com sucesso!' })
      fetchProdutos()
    } catch (e) {
      setSyncMsg({ tipo: 'erro', texto: 'Erro: ' + (e.response && e.response.data && e.response.data.erro) || e.message })
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
                  <div
                    key={p.id}
                    className={`flex items-center group transition-colors border-l-2 ${
                      selected && selected.id === p.id
                        ? 'bg-gray-800 border-blue-500'
                        : 'border-transparent hover:bg-gray-800/60 hover:border-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => fetchBom(p)}
                      className="flex-1 text-left px-3 py-2 min-w-0"
                    >
                      <p className="text-[11px] font-mono text-gray-400">{p.codigo}</p>
                      <p className="text-sm text-white truncate leading-tight">{p.nome}</p>
                      {p.custo_total && (
                        <p className="text-[10px] text-green-400 font-mono mt-0.5">{brl(p.custo_total)}</p>
                      )}
                    </button>
                    <button
                      onClick={(e) => abrirSyncModal(p, e)}
                      title="Prévia e Sincronizar no Bling"
                      className="px-2 py-3 text-gray-600 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <Upload size={13} />
                    </button>
                  </div>
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
            {selected && (
              <button
                onClick={(e) => abrirSyncModal(selected, e)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Eye size={13} /> Prévia Bling
              </button>
            )}
          </div>
        </div>

        {/* Alertas */}
        {erro && (
          <div className="mx-5 mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-2 flex-shrink-0">
            <AlertCircle size={14} /> {erro}
          </div>
        )}

        {syncMsg && (
          <div className={`mx-5 mt-3 text-sm rounded-lg px-4 py-2 flex-shrink-0 border ${
            syncMsg.tipo === 'ok'
              ? 'bg-green-950 border-green-800 text-green-300'
              : 'bg-red-950 border-red-800 text-red-300'
          }`}>
            {syncMsg.texto}
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

      {/* ══ Modal de Prévia e Sync Bling ══ */}
      {syncModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <div>
                <h2 className="font-bold text-white text-sm">Prévia de Sincronização — Bling</h2>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{syncModal.produto.codigo} · {syncModal.produto.nome}</p>
              </div>
              <button onClick={() => setSyncModal(null)} className="text-gray-500 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>

            {/* Corpo */}
            <div className="px-5 py-4 space-y-4">
              {loadingPreview && (
                <div className="flex items-center justify-center py-8 gap-3">
                  <Loader2 className="animate-spin text-blue-400" size={20} />
                  <span className="text-gray-400 text-sm">Consultando Bling...</span>
                </div>
              )}

              {!loadingPreview && preview && (
                <>
                  {/* Badge de ação */}
                  <div className={`text-xs font-semibold px-3 py-2 rounded-lg border ${
                    preview.acao === 'criar'      ? 'bg-green-900/50 text-green-300 border-green-700' :
                    preview.acao === 'atualizar' ? 'bg-blue-900/50 text-blue-300 border-blue-700' :
                    'bg-red-900/50 text-red-300 border-red-700'
                  }`}>
                    {preview.acao === 'criar'      ? '+ Produto NÃO existe no Bling — será criado' :
                     preview.acao === 'atualizar' ? '↑ Produto existe no Bling — campos abaixo serão atualizados' :
                     '✗ Não foi possível consultar Bling: ' + preview.erro}
                  </div>

                  {/* Tabela de comparação */}
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-700">
                        <th className="text-left pb-2">Campo</th>
                        <th className="text-left pb-2">Local (será enviado)</th>
                        <th className="text-left pb-2">Bling atual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {[
                        { campo: 'Código',   local: preview.produto_local.codigo,      bling: preview.produto_bling ? preview.produto_bling.codigo : '—' },
                        { campo: 'Nome',     local: preview.produto_local.nome,        bling: preview.produto_bling ? preview.produto_bling.nome : '—' },
                        { campo: 'Custo',    local: brl(preview.produto_local.custo_total), bling: preview.produto_bling ? brl(preview.produto_bling.precoCusto) : '—' },
                        { campo: 'Preço',    local: brl(preview.produto_local.preco_venda), bling: preview.produto_bling ? brl(preview.produto_bling.preco) : '—' },
                      ].map(({ campo, local, bling }) => {
                        const changed = bling !== '—' && local !== bling
                        return (
                          <tr key={campo} className={changed ? 'bg-yellow-900/20' : ''}>
                            <td className="py-2 text-gray-400 pr-3">{campo}</td>
                            <td className="py-2 text-white font-mono pr-3">{local}</td>
                            <td className={`py-2 font-mono ${changed ? 'text-yellow-400' : 'text-gray-500'}`}>
                              {bling}{changed ? ' ← será alterado' : ''}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {/* Estrutura */}
                  <div className="text-xs p-3 bg-gray-800 rounded-lg space-y-1">
                    <p className="text-gray-400 font-semibold">Composição BOM</p>
                    <p className="text-white">
                      {preview.produto_local.componentes_count || 0} componente(s) local será(ão) enviado(s)
                    </p>
                    {preview.estrutura_bling ? (
                      <p className="text-yellow-400">
                        ⚠ Bling já tem estrutura com {preview.estrutura_bling.componentes.length} item(s) — será substituída
                      </p>
                    ) : (
                      <p className="text-gray-500">Bling não tem estrutura cadastrada</p>
                    )}
                  </div>

                  {/* Resultado do sync */}
                  {syncMsg && (
                    <div className={`text-xs px-3 py-2 rounded-lg border ${
                      syncMsg.tipo === 'ok'
                        ? 'bg-green-900/50 border-green-700 text-green-300'
                        : 'bg-red-900/50 border-red-700 text-red-300'
                    }`}>{syncMsg.texto}</div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-5 py-4 border-t border-gray-700">
              <button
                onClick={() => { setSyncModal(null); setSyncMsg(null) }}
                className="flex-1 py-2 text-sm text-gray-300 border border-gray-600 rounded-lg hover:border-gray-400 transition-colors"
              >
                {syncMsg && syncMsg.tipo === 'ok' ? 'Fechar' : 'Cancelar'}
              </button>
              {(!syncMsg || syncMsg.tipo !== 'ok') && (
                <button
                  onClick={confirmarSync}
                  disabled={syncing || loadingPreview || !preview || preview.acao === 'erro'}
                  className="flex-1 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {syncing
                    ? <><Loader2 size={13} className="animate-spin" /> Enviando...</>
                    : <><Upload size={13} /> Confirmar e Enviar ao Bling</>
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

