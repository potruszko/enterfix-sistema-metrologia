import { useState, useEffect, useRef } from 'react'
import { Play, Square, Pause, CheckCircle, AlertTriangle } from 'lucide-react'
import { getOPs, getCentros, getApontamentos, iniciarApontamento, concluirApontamento, pausarApontamento } from '../lib/api'
import { useLocation } from 'react-router-dom'
import { brl } from '../lib/utils'

function pad(n) { return String(n).padStart(2, '0') }
function formatTimer(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

const STATUS_COLORS = {
  planejada:   'bg-gray-100 text-gray-600',
  em_producao: 'bg-blue-100 text-blue-700',
  concluida:   'bg-green-100 text-green-700',
  cancelada:   'bg-red-100 text-red-600',
}

export default function Operador() {
  const location = useLocation()
  const preOP = location.state?.op_id || ''

  const [ops, setOps] = useState([])
  const [centros, setCentros] = useState([])
  const [apontamentos, setApontamentos] = useState([])
  const [selectedOP, setSelectedOP] = useState(preOP ? String(preOP) : '')
  const [selectedCentro, setSelectedCentro] = useState('')
  const [operacao, setOperacao] = useState('Produção')
  const [apontamentoAtivo, setApontamentoAtivo] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('idle') // idle | running | finishing
  const [qty, setQty] = useState('')
  const [refugo, setRefugo] = useState('')
  const [obs, setObs] = useState('')
  const [lastCusto, setLastCusto] = useState(null)
  const [erro, setErro] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    Promise.all([getOPs(), getCentros()]).then(([o, c]) => {
      setOps(o.data)
      setCentros(c.data)
    })
  }, [])

  useEffect(() => {
    if (selectedOP) {
      getApontamentos(selectedOP).then(r => setApontamentos(r.data))
    } else {
      setApontamentos([])
    }
  }, [selectedOP])

  useEffect(() => {
    if (apontamentoAtivo) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [apontamentoAtivo])

  async function handlePlay() {
    if (!selectedOP) return setErro('Selecione uma Ordem de Produção')
    setErro('')
    setLoading(true)
    try {
      const res = await iniciarApontamento({
        op_id: Number(selectedOP),
        centro_id: selectedCentro ? Number(selectedCentro) : null,
        operacao,
        tipo: 'producao'
      })
      setApontamentoAtivo(res.data.id)
      setElapsed(0)
      setStep('running')
      await getApontamentos(selectedOP).then(r => setApontamentos(r.data))
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao iniciar apontamento')
    } finally {
      setLoading(false)
    }
  }

  async function handleFinalizar() {
    setLoading(true)
    try {
      const res = await concluirApontamento(apontamentoAtivo, {
        qty_produzida: Number(qty) || 0,
        qty_refugo: Number(refugo) || 0,
        observacoes: obs
      })
      setLastCusto(res.data)
      setApontamentoAtivo(null)
      setStep('idle')
      setQty(''); setRefugo(''); setObs('')
      await getApontamentos(selectedOP).then(r => setApontamentos(r.data))
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao finalizar')
    } finally {
      setLoading(false)
    }
  }

  async function handlePausar() {
    setLoading(true)
    try {
      await pausarApontamento(apontamentoAtivo, { motivo_parada: obs || 'Parada manual' })
      setApontamentoAtivo(null)
      setStep('idle')
      setObs('')
      await getApontamentos(selectedOP).then(r => setApontamentos(r.data))
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao pausar')
    } finally {
      setLoading(false)
    }
  }

  const opAtual = ops.find(o => String(o.id) === String(selectedOP))
  const opStatus = opAtual ? (STATUS_COLORS[opAtual.status] || STATUS_COLORS.planejada) : ''

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Apontamento de Produção</h1>
        <p className="text-gray-500 text-sm mt-0.5">Interface do operador — registre o tempo de cada operação</p>
      </div>

      {/* Seleção */}
      <div className="card space-y-4">
        <div>
          <label className="label">Ordem de Produção</label>
          <select className="select" value={selectedOP} onChange={e => { setSelectedOP(e.target.value); setStep('idle'); setApontamentoAtivo(null) }}
            disabled={step === 'running'}>
            <option value="">— Selecione uma OP —</option>
            {ops.filter(o => o.status !== 'concluida' && o.status !== 'cancelada').map(o => (
              <option key={o.id} value={o.id}>{o.numero} – {o.produto_codigo} {o.produto_nome ? `| ${o.produto_nome}` : ''}</option>
            ))}
          </select>
          {opAtual && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${opStatus}`}>
                {opAtual.status}
              </span>
              <span className="text-xs text-gray-500">Qtd: {opAtual.quantidade} un.</span>
              {opAtual.custo_material > 0 && <span className="text-xs text-gray-500">Mat: {brl(opAtual.custo_material)}</span>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Centro de Trabalho</label>
            <select className="select" value={selectedCentro} onChange={e => setSelectedCentro(e.target.value)} disabled={step === 'running'}>
              <option value="">— Sem centro específico —</option>
              {centros.filter(c => c.status === 'ativo').map(c => (
                <option key={c.id} value={c.id}>{c.codigo} – {c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Operação</label>
            <select className="select" value={operacao} onChange={e => setOperacao(e.target.value)} disabled={step === 'running'}>
              {['Produção', 'Setup', 'Usinagem', 'Inspeção Metrológica', 'Montagem', 'Embalagem', 'Outros'].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timer + controles */}
      <div className="card text-center space-y-6">
        {/* Timer */}
        <div className={`text-6xl font-mono font-bold tracking-widest transition-colors ${step === 'running' ? 'text-blue-600' : 'text-gray-300'}`}>
          {formatTimer(elapsed)}
        </div>

        {erro && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
            <AlertTriangle size={16} />
            {erro}
          </div>
        )}

        {lastCusto && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
            <p className="font-semibold">Apontamento finalizado</p>
            <p>Tempo: {lastCusto.duracao_min?.toFixed(1)} min | Custo calculado: <strong>{brl(lastCusto.custo_calculado || 0)}</strong></p>
          </div>
        )}

        {step === 'idle' && (
          <button
            onClick={handlePlay}
            disabled={loading || !selectedOP}
            className="w-full py-5 text-xl font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Play size={28} fill="white" />
            Iniciar Produção
          </button>
        )}

        {step === 'running' && (
          <div className="space-y-3">
            <button onClick={() => setStep('finishing')} disabled={loading}
              className="w-full py-4 text-lg font-bold rounded-2xl bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center justify-center gap-3">
              <CheckCircle size={24} />
              Finalizar
            </button>
            <button onClick={handlePausar} disabled={loading}
              className="w-full py-3 text-base font-medium rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors flex items-center justify-center gap-2">
              <Pause size={18} />
              Pausar / Parada
            </button>
            <button onClick={() => { setApontamentoAtivo(null); setStep('idle') }}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2">
              <Square size={14} />
              Cancelar apontamento
            </button>
          </div>
        )}

        {step === 'finishing' && (
          <div className="space-y-4 text-left">
            <p className="text-sm font-medium text-gray-700 text-center">Registre a produção antes de finalizar</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Qtd Produzida *</label>
                <input className="input text-center text-2xl font-bold" type="number" min="0" value={qty}
                  onChange={e => setQty(e.target.value)} placeholder="0" autoFocus />
              </div>
              <div>
                <label className="label">Refugo (Scrap)</label>
                <input className="input text-center text-2xl font-bold text-red-600" type="number" min="0" value={refugo}
                  onChange={e => setRefugo(e.target.value)} placeholder="0" />
              </div>
            </div>
            <div>
              <label className="label">Observações</label>
              <textarea className="input resize-none" rows={2} value={obs} onChange={e => setObs(e.target.value)}
                placeholder="Problemas, ajustes, notas..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('running')} className="btn-secondary flex-1">Voltar</button>
              <button onClick={handleFinalizar} disabled={loading} className="btn-primary flex-1 py-3 text-base font-bold">
                Confirmar Finalização
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Histórico de apontamentos da OP */}
      {apontamentos.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Apontamentos desta OP</h3>
          <div className="space-y-2">
            {apontamentos.map(a => (
              <div key={a.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                <div>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium mr-2 ${a.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.operacao}
                  </span>
                  {a.centro_nome && <span className="text-gray-500 text-xs">{a.centro_nome}</span>}
                </div>
                <div className="text-right">
                  {a.duracao_min != null && <span className="text-gray-600">{a.duracao_min.toFixed(1)} min</span>}
                  {a.custo_calculado > 0 && <span className="text-green-600 ml-2">{brl(a.custo_calculado)}</span>}
                  {a.qty_produzida > 0 && <span className="text-blue-600 ml-2">{a.qty_produzida} un</span>}
                  {a.qty_refugo > 0 && <span className="text-red-500 ml-1">({a.qty_refugo} refugo)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
