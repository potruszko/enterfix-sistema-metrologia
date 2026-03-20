import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, RefreshCw, DownloadCloud } from 'lucide-react'
import { getBlanks, createBlank, updateBlank, deleteBlank, getBlingProdutos, importarBlankDoBling, sincronizarBlankBling } from '../lib/api'
import { ROSCAS, brl, num } from '../lib/utils'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'

const BLANK_FORM = {
  codigo: '', descricao: '', rosca: 'M2', diametro_corpo: '', diametro_furo: '', comprimento: '',
  material: 'Inox', custo: '', bling_codigo: '', observacoes: ''
}

function BlankForm({ value, onChange, onSave, onCancel, error }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave() }} className="space-y-4">
      <Alert type="error" message={error} />
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label">Código *</label>
          <input className="input font-mono uppercase" value={value.codigo}
            onChange={e => set('codigo', e.target.value.toUpperCase())} placeholder="BM2-I0006" required />
        </div>
        <div className="col-span-2">
          <label className="label">Descrição</label>
          <input className="input" value={value.descricao || ''}
            onChange={e => set('descricao', e.target.value)} placeholder="BLANK INOX M2 - Ø. 3,0 MM X L. 6,0 MM - ØF. 2,0 MM" />
        </div>
        <div>
          <label className="label">Rosca *</label>
          <select className="select" value={value.rosca} onChange={e => set('rosca', e.target.value)} required>
            {ROSCAS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Material</label>
          <select className="select" value={value.material} onChange={e => set('material', e.target.value)}>
            {['Inox', 'Alumínio', 'Titânio'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Ø Corpo (mm)</label>
          <input className="input" type="number" step="0.001" value={value.diametro_corpo || ''}
            onChange={e => set('diametro_corpo', e.target.value)} placeholder="3.000" />
        </div>
        <div>
          <label className="label">Ø Furo (mm) *</label>
          <input className="input" type="number" step="0.001" value={value.diametro_furo}
            onChange={e => set('diametro_furo', e.target.value)} placeholder="1.500" required />
          <p className="text-xs text-gray-400 mt-0.5">Define qual haste é compatível</p>
        </div>
        <div>
          <label className="label">Comprimento (mm) *</label>
          <input className="input" type="number" step="0.001" value={value.comprimento}
            onChange={e => set('comprimento', e.target.value)} placeholder="7.500" required />
        </div>
        <div>
          <label className="label">Custo (R$)</label>
          <input className="input" type="number" step="0.0001" value={value.custo}
            onChange={e => set('custo', e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="label">Cód. Bling</label>
          <input className="input font-mono" value={value.bling_codigo}
            onChange={e => set('bling_codigo', e.target.value)} placeholder="BM2-I0006" />
        </div>
        <div className="col-span-2">
          <label className="label">Observações</label>
          <textarea className="input resize-none" rows={2} value={value.observacoes}
            onChange={e => set('observacoes', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar blank</button>
      </div>
    </form>
  )
}

export default function Blanks() {
  const [blanks, setBlanks]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'new' | 'edit'
  const [current, setCurrent]   = useState(BLANK_FORM)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [filterRosca, setFilterRosca] = useState('')
  const [blingModal, setBlingModal]   = useState(false)
  const [blingSearch, setBlingSearch] = useState('')
  const [blingResultados, setBlingResultados] = useState([])
  const [blingLoading, setBlingLoading] = useState(false)
  const [blingErro, setBlingErro]     = useState('')
  const [syncingId, setSyncingId]     = useState(null)

  const load = useCallback(async () => {
    const params = {}
    if (filterRosca) params.rosca = filterRosca
    const res = await getBlanks(params)
    setBlanks(res.data)
    setLoading(false)
  }, [filterRosca])

  useEffect(() => { load() }, [load])

  const openNew  = ()  => { setCurrent(BLANK_FORM); setError(''); setModal('new') }
  const openEdit = (b) => { setCurrent(b);           setError(''); setModal('edit') }
  const closeModal = () => setModal(null)

  async function handleSave() {
    setError('')
    try {
      if (modal === 'new') await createBlank(current)
      else await updateBlank(current.id, current)
      await load()
      closeModal()
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao salvar blank')
    }
  }

  async function buscarNoBling() {
    setBlingLoading(true)
    setBlingErro('')
    try {
      const res = await getBlingProdutos(blingSearch || 'BM')
      setBlingResultados(res.data?.data || [])
    } catch (e) {
      setBlingErro(e.response?.data?.erro || 'Erro ao buscar no Bling')
    } finally {
      setBlingLoading(false)
    }
  }

  async function importarBlank(blingId) {
    setBlingErro('')
    try {
      await importarBlankDoBling(blingId)
      await load()
      setBlingModal(false)
    } catch (e) {
      setBlingErro(e.response?.data?.erro || 'Erro ao importar blank')
    }
  }

  async function sincronizarBlank(b) {
    setSyncingId(b.id)
    try {
      await sincronizarBlankBling(b.id)
      await load()
    } catch (e) {
      alert(e.response?.data?.erro || 'Erro ao sincronizar com Bling')
    } finally {
      setSyncingId(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este blank?')) return
    await deleteBlank(id)
    await load()
  }

  const filtered = blanks.filter(b =>
    b.codigo.toLowerCase().includes(search.toLowerCase()) ||
    (b.descricao || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.observacoes || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blanks"
        subtitle="Corpo roscado base de cada ponta de medição"
        action={
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-1.5" onClick={() => { setBlingModal(true); setBlingResultados([]); setBlingSearch(''); setBlingErro('') }}>
              <DownloadCloud size={16} /> Bling
            </button>
            <button className="btn-primary" onClick={openNew}>
              <Plus size={16} /> Novo Blank
            </button>
          </div>
        }
      />

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-8" placeholder="Buscar por código..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
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
              {['Código', 'Rosca', 'Descrição', 'Ø Corpo', 'Comp.', 'Ø Furo', 'Custo', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">Nenhum blank encontrado</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-blue-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {b.bling_id && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Vinculado ao Bling" />}
                    {b.codigo}
                  </div>
                </td>
                <td className="px-4 py-3"><span className="badge badge-gray">{b.rosca}</span></td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-[240px]">
                  <span title={b.descricao}>{b.descricao ? b.descricao.substring(0, 50) + (b.descricao.length > 50 ? '…' : '') : b.material}</span>
                </td>
                <td className="px-4 py-3 text-right">{b.diametro_corpo > 0 ? `Ø${num(b.diametro_corpo, 1)}` : '—'}</td>
                <td className="px-4 py-3 text-right">{b.comprimento > 0 ? `${num(b.comprimento, 1)}` : '—'}</td>
                <td className="px-4 py-3 text-right">{b.diametro_furo > 0 ? `Ø${num(b.diametro_furo, 2)}` : '—'}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{b.custo > 0 ? brl(b.custo) : <span className="text-amber-600 text-xs">A definir</span>}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    {b.bling_id && (
                      <button onClick={() => sincronizarBlank(b)} disabled={syncingId === b.id}
                        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                        title="Sincronizar com Bling">
                        <RefreshCw size={14} className={syncingId === b.id ? 'animate-spin' : ''} />
                      </button>
                    )}
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={closeModal} title={modal === 'new' ? 'Novo Blank' : 'Editar Blank'}>
        <BlankForm value={current} onChange={setCurrent} onSave={handleSave} onCancel={closeModal} error={error} />
      </Modal>

      {/* Modal: buscar e importar blanks do Bling */}
      <Modal open={blingModal} onClose={() => setBlingModal(false)} title="Importar Blank do Bling">
        <div className="space-y-4">
          <Alert type="error" message={blingErro} />
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Código ou nome (ex: BM2, BM3-I...)"
              value={blingSearch}
              onChange={e => setBlingSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarNoBling()}
            />
            <button className="btn-primary" onClick={buscarNoBling} disabled={blingLoading}>
              {blingLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            {blingResultados.length === 0 && !blingLoading ? (
              <p className="text-sm text-gray-400 py-6 text-center">Digite um código e pressione Buscar</p>
            ) : blingResultados.map(p => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2 gap-3 hover:bg-gray-50">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-blue-700">{p.codigo}</p>
                  <p className="text-xs text-gray-500 truncate" title={p.nome}>{p.nome}</p>
                </div>
                <button className="btn-primary text-xs py-1 px-3 flex-shrink-0" onClick={() => importarBlank(p.id)}>
                  Importar
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">Blanks já importados terão seus dados atualizados.</p>
        </div>
      </Modal>
    </div>
  )
}
