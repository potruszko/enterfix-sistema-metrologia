import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Eye, RefreshCw } from 'lucide-react'
import { getProdutos, deleteProduto, sincronizarBling } from '../lib/api'
import { TIPOS, ROSCAS, brl, statusBadge, statusLabel } from '../lib/utils'
import PageHeader from '../components/PageHeader'

function compositionBadge(produto) {
  if (produto.tem_composicao) {
    const quantidade = produto.quantidade_componentes || 0
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        {quantidade} {quantidade === 1 ? 'item' : 'itens'}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Sem composição
    </span>
  )
}

export default function Produtos() {
  const [produtos, setProdutos]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterRosca, setFilterRosca] = useState('')
  const [syncing, setSyncing]     = useState(null)

  async function load() {
    const params = {}
    if (filterTipo)  params.tipo  = filterTipo
    if (filterRosca) params.rosca = filterRosca
    if (search)      params.q     = search
    const res = await getProdutos(params)
    setProdutos(res.data)
    setLoading(false)
  }

  useEffect(() => { setLoading(true); load() }, [filterTipo, filterRosca, search])

  async function handleDelete(id) {
    if (!confirm('Remover este produto?')) return
    await deleteProduto(id); load()
  }

  async function handleSync(id) {
    setSyncing(id)
    try {
      await sincronizarBling(id)
      await load()
    } catch (e) {
      alert(e.response?.data?.erro || 'Erro ao sincronizar')
    } finally {
      setSyncing(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos"
        subtitle="Todos os produtos com suas composições"
        action={
          <Link to="/construir" className="btn-primary">
            <Plus size={16} /> Novo Produto
          </Link>
        }
      />

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-8" placeholder="Buscar código ou nome..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select w-auto" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="select w-auto" value={filterRosca} onChange={e => setFilterRosca(e.target.value)}>
          <option value="">Todas as roscas</option>
          {ROSCAS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <div className="card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Código', 'Nome', 'Tipo', 'Rosca', 'Comp. Total', 'Ø Esfera', 'Composição', 'Custo', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={10} className="text-center py-8 text-gray-400">Carregando...</td></tr>
            ) : produtos.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-gray-400">
                  <p className="text-lg mb-2">Nenhum produto cadastrado</p>
                  <Link to="/construir" className="text-blue-600 hover:underline text-sm">
                    Criar primeiro produto →
                  </Link>
                </td>
              </tr>
            ) : produtos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-blue-700">{p.codigo}</td>
                <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={p.nome}>{p.nome}</td>
                <td className="px-4 py-3"><span className="badge badge-blue">{p.tipo}</span></td>
                <td className="px-4 py-3 font-mono text-gray-600">{p.rosca || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.comprimento_total ? `${p.comprimento_total} mm` : '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.diametro_esfera ? `Ø${p.diametro_esfera} mm` : '—'}</td>
                <td className="px-4 py-3">{compositionBadge(p)}</td>
                <td className="px-4 py-3 font-semibold">{brl(p.custo_total)}</td>
                <td className="px-4 py-3">
                  <span className={statusBadge(p.status)}>{statusLabel(p.status)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link to={`/produtos/${p.id}`} className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Ver detalhes">
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => handleSync(p.id)}
                      disabled={syncing === p.id}
                      className="p-1.5 rounded hover:bg-green-50 text-green-600 disabled:opacity-50"
                      title="Sincronizar com Bling"
                    >
                      <RefreshCw size={14} className={syncing === p.id ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Remover">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
