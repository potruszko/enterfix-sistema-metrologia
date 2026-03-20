import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { getEsferas, createEsfera, updateEsfera, deleteEsfera } from '../lib/api'
import { MATERIAIS_ESFERA, DIAMETROS_ESFERA, brl, num } from '../lib/utils'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'

const ESFERA_FORM = {
  codigo: '', descricao: '', material: 'Rubi', diametro: '', custo: '', bling_codigo: '', observacoes: ''
}

function EsferaForm({ value, onChange, onSave, onCancel, error }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave() }} className="space-y-4">
      <Alert type="error" message={error} />
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label">Código *</label>
          <input className="input font-mono uppercase" value={value.codigo}
            onChange={e => set('codigo', e.target.value.toUpperCase())} placeholder="ESFERA-RUBI-2.0" required />
        </div>
        <div className="col-span-2">
          <label className="label">Descrição</label>
          <input className="input" value={value.descricao || ''}
            onChange={e => set('descricao', e.target.value)}
            placeholder="ESFERA DE RUBI COM FURO - Ø. 2,0 MM" />
        </div>
        <div>
          <label className="label">Material *</label>
          <select className="select" value={value.material} onChange={e => set('material', e.target.value)} required>
            {MATERIAIS_ESFERA.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Diâmetro (mm) *</label>
          <select className="select" value={value.diametro} onChange={e => set('diametro', e.target.value)} required>
            <option value="">Selecione...</option>
            {DIAMETROS_ESFERA.map(d => <option key={d} value={d}>Ø {d} mm</option>)}
          </select>
        </div>
        <div>
          <label className="label">Custo (R$)</label>
          <input className="input" type="number" step="0.0001" value={value.custo}
            onChange={e => set('custo', e.target.value)} placeholder="0.00" />
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
        <button type="submit" className="btn-primary">Salvar esfera</button>
      </div>
    </form>
  )
}

export default function Esferas() {
  const [esferas, setEsferas]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [current, setCurrent]   = useState(ESFERA_FORM)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [filterMat, setFilterMat] = useState('')

  const load = useCallback(async () => {
    const params = {}
    if (filterMat) params.material = filterMat
    const res = await getEsferas(params)
    setEsferas(res.data)
    setLoading(false)
  }, [filterMat])

  useEffect(() => { load() }, [load])

  const openNew  = ()  => { setCurrent(ESFERA_FORM); setError(''); setModal('new') }
  const openEdit = (e) => { setCurrent(e);            setError(''); setModal('edit') }
  const closeModal = () => setModal(null)

  async function handleSave() {
    setError('')
    try {
      if (modal === 'new') await createEsfera(current)
      else await updateEsfera(current.id, current)
      await load()
      closeModal()
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao salvar esfera')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta esfera?')) return
    await deleteEsfera(id)
    await load()
  }

  const filtered = esferas.filter(e =>
    e.codigo.toLowerCase().includes(search.toLowerCase()) ||
    (e.descricao || '').toLowerCase().includes(search.toLowerCase())
  )

  const MAT_COLOR = {
    'Rubi': 'badge-red', 'Cerâmica': 'badge-gray',
    'Inox': 'badge-blue', 'Metal Duro': 'badge-gray',
    'Nitreto de Silício': 'badge-yellow'
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Esferas"
        subtitle="Esferas de rubi, cerâmica e outros materiais"
        action={
          <button className="btn-primary" onClick={openNew}>
            <Plus size={16} /> Nova Esfera
          </button>
        }
      />

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-8" placeholder="Buscar por código ou descrição..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select w-auto" value={filterMat} onChange={e => setFilterMat(e.target.value)}>
          <option value="">Todos os materiais</option>
          {MATERIAIS_ESFERA.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Código', 'Descrição', 'Material', 'Ø (mm)', 'Custo', 'Cód. Bling', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhuma esfera encontrada</td></tr>
            ) : filtered.map(e => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-pink-700 whitespace-nowrap">{e.codigo}</td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-[260px]">
                  <span title={e.descricao}>
                    {e.descricao
                      ? (e.descricao.length > 55 ? e.descricao.substring(0, 55) + '…' : e.descricao)
                      : <span className="text-gray-300 italic">—</span>}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${MAT_COLOR[e.material] || 'badge-gray'}`}>{e.material}</span>
                </td>
                <td className="px-4 py-3 font-medium">Ø {num(e.diametro, 1)} mm</td>
                <td className="px-4 py-3 font-medium">{brl(e.custo)}</td>
                <td className="px-4 py-3 font-mono text-gray-500 text-xs">{e.bling_codigo || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(e)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={closeModal} title={modal === 'new' ? 'Nova Esfera' : 'Editar Esfera'}>
        <EsferaForm value={current} onChange={setCurrent} onSave={handleSave} onCancel={closeModal} error={error} />
      </Modal>
    </div>
  )
}
