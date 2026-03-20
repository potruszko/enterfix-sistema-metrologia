import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Play, CheckCircle, Link2, ChevronRight } from 'lucide-react'
import { getOPs, createOP, deleteOP, iniciarOP, concluirOP, getBlingPedidos } from '../lib/api'
import { brl } from '../lib/utils'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { Alert } from '../components/Alert'
import { Link } from 'react-router-dom'

const OP_FORM = {
  produto_codigo: '', produto_nome: '', quantidade: 1,
  bling_produto_id: '', bling_pedido_numero: '', custo_material: '', observacoes: ''
}

const STATUS = {
  planejada:    { label: 'Planejada',    bg: 'bg-gray-100 text-gray-600' },
  em_producao:  { label: 'Em Produção',  bg: 'bg-blue-100 text-blue-700' },
  pausada:      { label: 'Pausada',      bg: 'bg-amber-100 text-amber-700' },
  concluida:    { label: 'Concluída',    bg: 'bg-green-100 text-green-700' },
  cancelada:    { label: 'Cancelada',    bg: 'bg-red-100 text-red-600' },
}

function OPForm({ value, onChange, onSave, onCancel, error }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave() }} className="space-y-4">
      <Alert type="error" message={error} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Código do Produto *</label>
          <input className="input font-mono uppercase" value={value.produto_codigo}
            onChange={e => set('produto_codigo', e.target.value.toUpperCase())} placeholder="PM2-I0001" required />
        </div>
        <div>
          <label className="label">Quantidade *</label>
          <input className="input" type="number" min="1" value={value.quantidade}
            onChange={e => set('quantidade', e.target.value)} required />
        </div>
        <div className="col-span-2">
          <label className="label">Nome / Descrição do Produto</label>
          <input className="input" value={value.produto_nome}
            onChange={e => set('produto_nome', e.target.value)} placeholder="Ponta de medição M2 Rubi Ø1.0mm" />
        </div>
        <div>
          <label className="label">Custo Material (R$)</label>
          <input className="input" type="number" step="0.01" value={value.custo_material}
            onChange={e => set('custo_material', e.target.value)} placeholder="0.00" />
          <p className="text-xs text-gray-400 mt-0.5">Soma dos componentes do BOM</p>
        </div>
        <div>
          <label className="label">Nº Pedido Bling</label>
          <input className="input" value={value.bling_pedido_numero}
            onChange={e => set('bling_pedido_numero', e.target.value)} placeholder="12345" />
        </div>
        <div className="col-span-2">
          <label className="label">Observações</label>
          <textarea className="input resize-none" rows={2} value={value.observacoes}
            onChange={e => set('observacoes', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Criar OP</button>
      </div>
    </form>
  )
}

export default function OrdensProducao() {
  const [ops, setOps] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [current, setCurrent] = useState(OP_FORM)
  const [error, setError] = useState('')
  const [blingModal, setBlingModal] = useState(false)
  const [blingPedidos, setBlingPedidos] = useState([])
  const [blingLoading, setBlingLoading] = useState(false)
  const [blingErro, setBlingErro] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [resultModal, setResultModal] = useState(null)

  const load = useCallback(async () => {
    const res = await getOPs()
    setOps(res.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave() {
    setError('')
    try {
      await createOP(current)
      await load()
      setModal(null)
    } catch (e) {
      setError(e.response?.data?.erro || 'Erro ao criar OP')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta OP?')) return
    await deleteOP(id)
    await load()
  }

  async function handleIniciar(id) {
    setActionLoading(id + '-iniciar')
    try { await iniciarOP(id); await load() }
    catch (e) { alert(e.response?.data?.erro || 'Erro ao iniciar') }
    finally { setActionLoading(null) }
  }

  async function handleConcluir(id) {
    if (!confirm('Concluir esta OP? O custo real será calculado com base nos apontamentos.')) return
    setActionLoading(id + '-concluir')
    try {
      const res = await concluirOP(id)
      await load()
      setResultModal(res.data)
    }
    catch (e) { alert(e.response?.data?.erro || 'Erro ao concluir') }
    finally { setActionLoading(null) }
  }

  async function buscarPedidosBling() {
    setBlingLoading(true)
    setBlingErro('')
    try {
      const res = await getBlingPedidos(6) // situacao 6 = Em aberto
      setBlingPedidos(res.data?.data || [])
    } catch (e) {
      setBlingErro(e.response?.data?.erro || 'Erro ao buscar pedidos do Bling')
    } finally {
      setBlingLoading(false)
    }
  }

  function criarOPDePedido(pedido) {
    const item = pedido.itens?.[0]
    setCurrent({
      ...OP_FORM,
      produto_codigo: item?.codigo || '',
      produto_nome: item?.descricao || pedido.contato?.nome || '',
      quantidade: item?.quantidade || 1,
      bling_pedido_id: String(pedido.id || ''),
      bling_pedido_numero: String(pedido.numero || ''),
    })
    setBlingModal(false)
    setError('')
    setModal('new')
  }

  const totais = ops.reduce((acc, op) => ({
    planejadas: acc.planejadas + (op.status === 'planejada' ? 1 : 0),
    em_producao: acc.em_producao + (op.status === 'em_producao' ? 1 : 0),
    concluidas: acc.concluidas + (op.status === 'concluida' ? 1 : 0),
    custo_real: acc.custo_real + (op.custo_real || 0),
  }), { planejadas: 0, em_producao: 0, concluidas: 0, custo_real: 0 })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ordens de Produção"
        subtitle="Controle o fluxo de fabricação integrado ao Bling"
        action={
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-1.5" onClick={() => { setBlingModal(true); setBlingPedidos([]); setBlingErro('') }}>
              <Link2 size={16} /> Pedidos Bling
            </button>
            <button className="btn-primary" onClick={() => { setCurrent(OP_FORM); setError(''); setModal('new') }}>
              <Plus size={16} /> Nova OP
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Planejadas',   value: totais.planejadas,   color: 'text-gray-600' },
          { label: 'Em Produção',  value: totais.em_producao,  color: 'text-blue-600' },
          { label: 'Concluídas',   value: totais.concluidas,   color: 'text-green-600' },
          { label: 'Custo Real Total', value: brl(totais.custo_real), color: 'text-purple-600' },
        ].map(k => (
          <div key={k.label} className="card">
            <p className="text-xs text-gray-500 font-medium">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Número', 'Produto', 'Qtd', 'Status', 'Mat.', 'Processo', 'Custo Real', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">Carregando...</td></tr>
            ) : ops.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">Nenhuma OP cadastrada</td></tr>
            ) : ops.map(op => {
              const st = STATUS[op.status] || STATUS.planejada
              return (
                <tr key={op.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-blue-700 whitespace-nowrap">{op.numero}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{op.produto_codigo}</p>
                      {op.produto_nome && <p className="text-xs text-gray-400 truncate max-w-[180px]">{op.produto_nome}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">{op.quantidade}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium w-fit ${st.bg}`}>{st.label}</span>
                      {op.apontamentos_ativos > 0 && <span className="text-xs text-blue-500 animate-pulse">● {op.apontamentos_ativos} em andamento</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{op.custo_material > 0 ? brl(op.custo_material) : '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{op.custo_processo > 0 ? brl(op.custo_processo) : '—'}</td>
                  <td className="px-4 py-3 text-right font-bold">{op.custo_real > 0 ? brl(op.custo_real) : <span className="text-amber-500 text-xs font-normal">Pendente</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      {op.status === 'planejada' && (
                        <button onClick={() => handleIniciar(op.id)} disabled={actionLoading === op.id + '-iniciar'}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Iniciar produção">
                          <Play size={14} />
                        </button>
                      )}
                      {op.status === 'em_producao' && (
                        <button onClick={() => handleConcluir(op.id)} disabled={actionLoading === op.id + '-concluir'}
                          className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Concluir OP">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <Link to="/operador" state={{ op_id: op.id, op_numero: op.numero }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Ir para operador">
                        <ChevronRight size={14} />
                      </Link>
                      <button onClick={() => handleDelete(op.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal nova OP */}
      <Modal open={!!modal} onClose={() => setModal(null)} title="Nova Ordem de Produção">
        <OPForm value={current} onChange={setCurrent} onSave={handleSave} onCancel={() => setModal(null)} error={error} />
      </Modal>

      {/* Modal resultado de conclusão */}
      <Modal open={!!resultModal} onClose={() => setResultModal(null)} title="OP Concluída">
        {resultModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Custo Material', value: brl(resultModal.custo_material || 0), color: 'text-blue-600' },
                { label: 'Custo Processo', value: brl(resultModal.custo_processo || 0), color: 'text-purple-600' },
                { label: 'Custo Real Total', value: brl(resultModal.custo_real || 0), color: 'text-green-600' },
              ].map(k => (
                <div key={k.label} className="card text-center">
                  <p className="text-xs text-gray-500">{k.label}</p>
                  <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">Custo calculado com base nos apontamentos de tempo × taxa horária dos centros de trabalho.</p>
            <div className="flex justify-end">
              <button className="btn-primary" onClick={() => setResultModal(null)}>Fechar</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal pedidos Bling */}
      <Modal open={blingModal} onClose={() => setBlingModal(false)} title="Pedidos de Venda – Bling">
        <div className="space-y-4">
          <Alert type="error" message={blingErro} />
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={buscarPedidosBling} disabled={blingLoading}>
              {blingLoading ? 'Buscando...' : 'Buscar Pedidos em Aberto'}
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            {blingPedidos.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">Clique em "Buscar" para carregar pedidos do Bling</p>
            ) : blingPedidos.map(p => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2.5 gap-3 hover:bg-gray-50">
                <div className="min-w-0">
                  <p className="font-semibold text-sm">Pedido #{p.numero}</p>
                  <p className="text-xs text-gray-500 truncate">{p.contato?.nome} — {p.itens?.length || 0} iten(s)</p>
                </div>
                <button className="btn-primary text-xs py-1 px-3 flex-shrink-0" onClick={() => criarOPDePedido(p)}>
                  Gerar OP
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">Pedidos com situação "Em Aberto" no Bling.</p>
        </div>
      </Modal>
    </div>
  )
}
