import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { getHashtes, createHaste, updateHaste, deleteHaste } from '../lib/api'
import { MATERIAIS_HASTE, ROSCAS, brl, num } from '../lib/utils'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'

const HASTE_FORM = {
  codigo: '', material: 'Inox', diametro: '', custo_por_mm: '', bling_codigo: '', observacoes: ''
}

function HasteForm({ value, onChange, onSave, onCancel, error }) {
  const set = (k, v) => onChange({ ...value, [k]: v })

  const custo100mm = parseFloat(value.custo_por_mm || 0) * 100

  return (
    <form onSubmit={e => { e.preventDefault(); onSave() }} className="space-y-4">
      <Alert type="error" message={error} />
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label">Código *</label>
          <input className="input font-mono uppercase" value={value.codigo}
            onChange={e => set('codigo', e.target.value.toUpperCase())} placeholder="HASTE-MD-1.5" required />
        </div>
        <div>
          <label className="label">Material *</label>
          <select className="select" value={value.material} onChange={e => set('material', e.target.value)} required>
            {MATERIAIS_HASTE.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Diâmetro (mm) *</label>
          <input className="input" type="number" step="0.001" value={value.diametro}
            onChange={e => set('diametro', e.target.value)} placeholder="1.500" required />
          <p className="text-xs text-gray-400 mt-0.5">Deve ser igual ao Ø furo do blank</p>
        </div>
        <div>
          <label className="label">Custo por mm (R$)</label>
          <input className="input" type="number" step="0.000001" value={value.custo_por_mm}
            onChange={e => set('custo_por_mm', e.target.value)} placeholder="0.00" />
          {custo100mm > 0 && (
            <p className="text-xs text-blue-600 mt-0.5">≈ {brl(custo100mm)} / 100mm</p>
          )}
        </div>
        <div>
          <label className="label">Cód. Bling</label>
          <input className="input font-mono" value={value.bling_codigo}
            onChange={e => set('bling_codigo', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Observações</label>
          <textarea className="input resize-none" rows={2} value={value.observacoes}
            onChange={e => set('observacoes', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar haste</button>
      </div>
    </form>
  )
}

export default function Hastes() {
  const [hastes, setHashtes]      = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null)
  const [current, setCurrent]     = useState(HASTE_FORM)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [filterMat, setFilterMat] = useState('')

  const load = useCallback(async () => {
    const params = {}
    if (filterMat) params.material = filterMat
    const res = await getHashtes(params)
    setHashtes(res.data)
    setLoading(false)
  }, [filterMat])

  useEffect(() => { load() }, [load])

  const openNew  = ()  => { setCurrent(HASTE_FORM); setError(''); setModal('new') }
  const openEdit = (h) => { setCurrent(h);           setError(''); setModal('edit') }
  const closeModal = () => setModal(null)

  async function handleSave() {
    setError('')
    try {
      if (modal === 'new') await createHaste(current)
      else await updateHaste(current.id, current)
      await load()
      closeModal()
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao salvar haste')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta haste?')) return
    await deleteHaste(id)
    await load()
  }

  const filtered = hastes.filter(h =>
    h.codigo.toLowerCase().includes(search.toLowerCase())
  )

  const MAT_COLOR = {
    'Metal Duro': 'badge-gray', 'Inox': 'badge-blue',
    'Fibra de Carbono': 'badge-yellow', 'Cerâmica': 'badge-red',
    'Titânio': 'badge-green', 'Tungstênio': 'badge-gray'
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hastes"
        subtitle="Componentes de extensão das pontas de medição"
        action={
          <button className="btn-primary" onClick={openNew}>
            <Plus size={16} /> Nova Haste
          </button>
        }
      />

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-8" placeholder="Buscar por código..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select w-auto" value={filterMat} onChange={e => setFilterMat(e.target.value)}>
          <option value="">Todos os materiais</option>
          {MATERIAIS_HASTE.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Código', 'Material', 'Ø (mm)', 'Custo / mm', 'Custo / 100mm', 'Cód. Bling', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhuma haste encontrada</td></tr>
            ) : filtered.map(h => (
              <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-violet-700">{h.codigo}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${MAT_COLOR[h.material] || 'badge-gray'}`}>{h.material}</span>
                </td>
                <td className="px-4 py-3">{num(h.diametro, 3)}</td>
                <td className="px-4 py-3">{brl(h.custo_por_mm)}/mm</td>
                <td className="px-4 py-3 font-medium">{brl(h.custo_por_mm * 100)}</td>
                <td className="px-4 py-3 font-mono text-gray-500 text-xs">{h.bling_codigo || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(h)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={closeModal} title={modal === 'new' ? 'Nova Haste' : 'Editar Haste'}>
        <HasteForm value={current} onChange={setCurrent} onSave={handleSave} onCancel={closeModal} error={error} />
      </Modal>
    </div>
  )
}
