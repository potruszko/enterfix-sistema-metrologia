import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getCentros, createCentro, updateCentro, deleteCentro } from '../lib/api'
import { brl } from '../lib/utils'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'

const FORM0 = { codigo: '', nome: '', custo_hora_maquina: '', custo_hora_operador: '', status: 'ativo', observacoes: '' }

function CentroForm({ value, onChange, onSave, onCancel, error }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave() }} className="space-y-4">
      <Alert type="error" message={error} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Código *</label>
          <input className="input font-mono uppercase" value={value.codigo}
            onChange={e => set('codigo', e.target.value.toUpperCase())} placeholder="CNC-01" required />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="select" value={value.status} onChange={e => set('status', e.target.value)}>
            <option value="ativo">Ativo</option>
            <option value="manutencao">Em manutenção</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Nome *</label>
          <input className="input" value={value.nome} onChange={e => set('nome', e.target.value)}
            placeholder="Torno CNC Nexturn, Bancada de Inspeção..." required />
        </div>
        <div>
          <label className="label">Custo/h Máquina (R$)</label>
          <input className="input" type="number" step="0.01" value={value.custo_hora_maquina}
            onChange={e => set('custo_hora_maquina', e.target.value)} placeholder="150.00" />
          <p className="text-xs text-gray-400 mt-0.5">Depreciação + energia</p>
        </div>
        <div>
          <label className="label">Custo/h Operador (R$)</label>
          <input className="input" type="number" step="0.01" value={value.custo_hora_operador}
            onChange={e => set('custo_hora_operador', e.target.value)} placeholder="35.00" />
          <p className="text-xs text-gray-400 mt-0.5">Salário + encargos</p>
        </div>
        <div className="col-span-2">
          <label className="label">Observações</label>
          <textarea className="input resize-none" rows={2} value={value.observacoes}
            onChange={e => set('observacoes', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar centro</button>
      </div>
    </form>
  )
}

const STATUS_BADGE = {
  ativo: 'bg-green-100 text-green-700',
  manutencao: 'bg-amber-100 text-amber-700',
  inativo: 'bg-gray-100 text-gray-500',
}

export default function CentrosTrabalho() {
  const [centros, setCentros] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [current, setCurrent] = useState(FORM0)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const res = await getCentros()
    setCentros(res.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew  = () => { setCurrent(FORM0); setError(''); setModal('new') }
  const openEdit = (c) => { setCurrent(c); setError(''); setModal('edit') }

  async function handleSave() {
    setError('')
    try {
      if (modal === 'new') await createCentro(current)
      else await updateCentro(current.id, current)
      await load()
      setModal(null)
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao salvar')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este centro de trabalho?')) return
    await deleteCentro(id)
    await load()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Centros de Trabalho"
        subtitle="Máquinas e bancadas com seus custos por hora"
        action={
          <button className="btn-primary" onClick={openNew}>
            <Plus size={16} /> Novo Centro
          </button>
        }
      />

      <div className="card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Código', 'Nome', 'Custo/h Máquina', 'Custo/h Operador', 'Total/h', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Carregando...</td></tr>
            ) : centros.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum centro cadastrado</td></tr>
            ) : centros.map(c => {
              const totalH = (c.custo_hora_maquina || 0) + (c.custo_hora_operador || 0)
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-blue-700">{c.codigo}</td>
                  <td className="px-4 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3 text-right">{brl(c.custo_hora_maquina || 0)}</td>
                  <td className="px-4 py-3 text-right">{brl(c.custo_hora_operador || 0)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{brl(totalH)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[c.status] || STATUS_BADGE.ativo}`}>
                      {c.status === 'ativo' ? 'Ativo' : c.status === 'manutencao' ? 'Manutenção' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'new' ? 'Novo Centro de Trabalho' : 'Editar Centro'}>
        <CentroForm value={current} onChange={setCurrent} onSave={handleSave} onCancel={() => setModal(null)} error={error} />
      </Modal>
    </div>
  )
}
