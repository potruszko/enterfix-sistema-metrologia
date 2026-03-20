import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getMaoDeObra, createMaoDeObra, updateMaoDeObra, deleteMaoDeObra } from '../lib/api'
import { brl } from '../lib/utils'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'

const FORM = { codigo: '', descricao: '', custo: '', unidade: 'UN', bling_codigo: '' }

function Form({ value, onChange, onSave, onCancel, error }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave() }} className="space-y-4">
      <Alert type="error" message={error} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Código *</label>
          <input className="input font-mono uppercase" value={value.codigo}
            onChange={e => set('codigo', e.target.value.toUpperCase())} placeholder="MO-SETUP" required />
        </div>
        <div>
          <label className="label">Unidade</label>
          <select className="select" value={value.unidade} onChange={e => set('unidade', e.target.value)}>
            <option value="UN">UN – Por peça</option>
            <option value="HR">HR – Por hora</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Descrição *</label>
          <input className="input" value={value.descricao}
            onChange={e => set('descricao', e.target.value)} placeholder="Setup Nexturn + Usinagem" required />
        </div>
        <div>
          <label className="label">Custo (R$)</label>
          <input className="input" type="number" step="0.01" value={value.custo}
            onChange={e => set('custo', e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="label">Cód. Bling</label>
          <input className="input font-mono" value={value.bling_codigo}
            onChange={e => set('bling_codigo', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar</button>
      </div>
    </form>
  )
}

export default function MaoDeObra() {
  const [items, setItems]     = useState([])
  const [modal, setModal]     = useState(null)
  const [current, setCurrent] = useState(FORM)
  const [error, setError]     = useState('')

  const load = async () => { const r = await getMaoDeObra(); setItems(r.data) }
  useEffect(() => { load() }, [])

  const openNew  = ()  => { setCurrent(FORM); setError(''); setModal('new') }
  const openEdit = (i) => { setCurrent(i);    setError(''); setModal('edit') }
  const close    = ()  => setModal(null)

  async function handleSave() {
    setError('')
    try {
      if (modal === 'new') await createMaoDeObra(current)
      else await updateMaoDeObra(current.id, current)
      await load(); close()
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao salvar')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este item?')) return
    await deleteMaoDeObra(id); await load()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mão de Obra"
        subtitle="Setup de máquina, usinagem e outros serviços internos"
        action={
          <button className="btn-primary" onClick={openNew}><Plus size={16} /> Novo item</button>
        }
      />

      <div className="card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Código', 'Descrição', 'Custo', 'Unidade', 'Cód. Bling', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0
              ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Nenhum item cadastrado</td></tr>
              : items.map(i => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-700">{i.codigo}</td>
                  <td className="px-4 py-3 text-gray-700">{i.descricao}</td>
                  <td className="px-4 py-3 font-medium">{brl(i.custo)}</td>
                  <td className="px-4 py-3"><span className="badge badge-gray">{i.unidade}</span></td>
                  <td className="px-4 py-3 font-mono text-gray-500 text-xs">{i.bling_codigo || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(i)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(i.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={close} title={modal === 'new' ? 'Nova Mão de Obra' : 'Editar'}>
        <Form value={current} onChange={setCurrent} onSave={handleSave} onCancel={close} error={error} />
      </Modal>
    </div>
  )
}
