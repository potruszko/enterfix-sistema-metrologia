import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check, RefreshCw, Info } from 'lucide-react'
import {
  getBlanks, getHashtes, getEsferas, getMaoDeObra,
  sugerirBlank, calcularHaste, createProduto
} from '../lib/api'
import {
  TIPOS, ROSCAS, MATERIAIS_HASTE, MATERIAIS_ESFERA, DIAMETROS_ESFERA,
  brl, num, gerarCodigo
} from '../lib/utils'
import { Alert } from '../components/Alert'

const ETAPAS = [
  { num: 1, label: 'Tipo & Rosca' },
  { num: 2, label: 'Esfera' },
  { num: 3, label: 'Haste & Blank' },
  { num: 4, label: 'Mão de Obra' },
  { num: 5, label: 'Revisão' },
]

// ─── Componente de progresso ──────────────────────────────────────────────────
function ProgressBar({ etapa }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {ETAPAS.map((e, i) => (
        <div key={e.num} className="flex items-center flex-1">
          <div className={`flex items-center gap-2 ${i > 0 ? 'flex-1 justify-center' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0
              ${etapa > e.num ? 'bg-green-600 text-white'
                : etapa === e.num ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'}`}>
              {etapa > e.num ? <Check size={14} /> : e.num}
            </div>
            <span className={`text-xs hidden sm:block ${etapa === e.num ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
              {e.label}
            </span>
          </div>
          {i < ETAPAS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${etapa > e.num ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Etapa 1: Tipo e Rosca ────────────────────────────────────────────────────
function Etapa1({ form, onChange }) {
  const set = (k, v) => onChange({ ...form, [k]: v })

  const codigoGerado = gerarCodigo({
    tipo: form.tipo,
    rosca: form.rosca,
    materialEsfera: form.materialEsfera,
    diametroEsfera: form.diametroEsfera,
    comprimentoTotal: form.comprimentoTotal
  })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">1. Tipo e Rosca da Ponta</h2>
        <p className="text-sm text-gray-500 mt-1">
          Selecione o tipo de produto e a rosca de conexão com o CMM.
        </p>
      </div>

      <div>
        <label className="label">Tipo de produto *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TIPOS.map(t => (
            <button key={t.value} type="button"
              onClick={() => set('tipo', t.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all
                ${form.tipo === t.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <p className="font-bold text-gray-900 font-mono">{t.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.label.split(' – ')[1]}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Rosca *</label>
        <div className="flex flex-wrap gap-2">
          {ROSCAS.map(r => (
            <button key={r} type="button"
              onClick={() => set('rosca', r)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-mono font-semibold transition-all
                ${form.rosca === r
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 text-gray-700 hover:border-blue-300'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Nome descritivo</label>
        <input className="input" value={form.nome} onChange={e => set('nome', e.target.value)}
          placeholder="Ex: Ponta de medição com esfera de rubi 2mm" />
      </div>

      <div>
        <label className="label">Categoria do produto *</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'materia_prima', label: 'Matéria Prima',  desc: 'Blank, haste, esfera avulsa' },
            { value: 'componente',   label: 'Componente',     desc: 'Conjunto intermediário' },
            { value: 'semiacabado',  label: 'Semiacabado',    desc: 'Subconjunto com BOM própria' },
            { value: 'acabado',      label: 'Acabado',        desc: 'Produto final para venda' },
          ].map(c => (
            <button key={c.value} type="button"
              onClick={() => set('categoria', c.value)}
              className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                form.categoria === c.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-sm text-gray-900">{c.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {codigoGerado && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm">
          <Info size={15} className="text-blue-600 shrink-0" />
          <span className="text-blue-700">Código sugerido: <span className="font-mono font-bold">{codigoGerado}</span></span>
        </div>
      )}
    </div>
  )
}

// ─── Etapa 2: Esfera ──────────────────────────────────────────────────────────
function Etapa2({ form, onChange, esferas }) {
  const set = (k, v) => onChange({ ...form, [k]: v })

  const esferasFiltradas = esferas.filter(e =>
    (!form.materialEsfera || e.material === form.materialEsfera) &&
    (!form.diametroEsfera || parseFloat(e.diametro) === parseFloat(form.diametroEsfera))
  )

  const esferaSelecionada = esferas.find(e =>
    e.material === form.materialEsfera && parseFloat(e.diametro) === parseFloat(form.diametroEsfera)
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">2. Esfera de Contato</h2>
        <p className="text-sm text-gray-500 mt-1">Selecione o material e o diâmetro da esfera.</p>
      </div>

      <div>
        <label className="label">Material da esfera *</label>
        <div className="flex flex-wrap gap-2">
          {MATERIAIS_ESFERA.map(m => (
            <button key={m} type="button"
              onClick={() => set('materialEsfera', m)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${form.materialEsfera === m
                  ? 'border-pink-600 bg-pink-600 text-white'
                  : 'border-gray-200 text-gray-700 hover:border-pink-300'
                }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Diâmetro *</label>
        <div className="flex flex-wrap gap-2">
          {DIAMETROS_ESFERA.map(d => (
            <button key={d} type="button"
              onClick={() => set('diametroEsfera', d)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-mono font-semibold transition-all
                ${parseFloat(form.diametroEsfera) === d
                  ? 'border-pink-600 bg-pink-600 text-white'
                  : 'border-gray-200 text-gray-700 hover:border-pink-300'
                }`}
            >
              Ø {d}mm
            </button>
          ))}
        </div>
      </div>

      {esferaSelecionada ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-semibold text-green-700">✓ Esfera encontrada no catálogo</p>
          <p className="font-mono text-green-800 text-lg">{esferaSelecionada.codigo}</p>
          <p className="text-sm text-green-600">Custo: {brl(esferaSelecionada.custo)}</p>
        </div>
      ) : form.materialEsfera && form.diametroEsfera ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
          ⚠ Esfera {form.materialEsfera} Ø{form.diametroEsfera}mm não cadastrada. Você pode continuar, mas cadastre antes de sincronizar.
        </div>
      ) : null}

      <div>
        <label className="label">Comprimento total da ponta (mm) *</label>
        <input className="input" type="number" step="0.1" value={form.comprimentoTotal}
          onChange={e => set('comprimentoTotal', e.target.value)}
          placeholder="Ex: 50 (comprimento útil em mm)" />
        <p className="text-xs text-gray-400 mt-1">O sistema calculará o comprimento necessário da haste automaticamente.</p>
      </div>
    </div>
  )
}

// ─── Etapa 3: Haste & Blank ───────────────────────────────────────────────────
function Etapa3({ form, onChange, hastes, blanks, blanksSugeridos, setBlanks: setBlanksSug, loading }) {
  const set = (k, v) => onChange({ ...form, [k]: v })

  const hasteFiltrada = hastes.filter(h =>
    !form.materialHaste || h.material === form.materialHaste
  )

  const hasteSelecionada = hastes.find(h => h.id === form.hasteId)
  const blankSelecionado = blanksSugeridos.find(b => b.id === form.blankId)

  // Calcula custo da haste com o comprimento calculado
  const custoHaste = hasteSelecionada && form.comprimentoHaste
    ? hasteSelecionada.custo_por_mm * parseFloat(form.comprimentoHaste)
    : 0

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">3. Haste e Blank</h2>
        <p className="text-sm text-gray-500 mt-1">
          A haste conecta o blank à esfera. O sistema filtra os blanks compatíveis automaticamente.
        </p>
      </div>

      <div>
        <label className="label">Material da haste *</label>
        <div className="flex flex-wrap gap-2">
          {['Inox', 'Metal Duro', 'Fibra de Carbono', 'Cerâmica', 'Titânio'].map(m => (
            <button key={m} type="button"
              onClick={() => set('materialHaste', m)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${form.materialHaste === m
                  ? 'border-violet-600 bg-violet-600 text-white'
                  : 'border-gray-200 text-gray-700 hover:border-violet-300'
                }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {form.materialHaste && (
        <div>
          <label className="label">Selecionar haste específica</label>
          <select className="select" value={form.hasteId || ''} onChange={e => set('hasteId', parseInt(e.target.value) || null)}>
            <option value="">— sem haste (ponta direta no blank) —</option>
            {hasteFiltrada.map(h => (
              <option key={h.id} value={h.id}>
                {h.codigo} — Ø{h.diametro}mm — {brl(h.custo_por_mm)}/mm
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Blanks compatíveis */}
      {blanksSugeridos.length > 0 && (
        <div>
          <label className="label">
            Blank compatível *
            <span className="text-gray-400 font-normal ml-1">(filtrado por rosca {form.rosca} + Ø furo da haste)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {blanksSugeridos.map(b => (
              <button key={b.id} type="button"
                onClick={() => set('blankId', b.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all
                  ${form.blankId === b.id
                    ? 'border-slate-600 bg-slate-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <p className="font-mono font-bold text-gray-900 text-sm">{b.codigo}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ø furo {b.diametro_furo}mm · Comp. {b.comprimento}mm · {brl(b.custo)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {blanksSugeridos.length === 0 && form.hasteId && !loading && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          Nenhum blank encontrado para rosca {form.rosca} com Ø furo compatível com a haste selecionada.
          Cadastre o blank antes de continuar.
        </div>
      )}

      {/* Comprimento calculado da haste */}
      {form.comprimentoHaste && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
          <p className="text-sm font-semibold text-blue-700">Comprimento da haste calculado:</p>
          <p className="text-2xl font-bold text-blue-900 font-mono">{num(form.comprimentoHaste, 3)} mm</p>
          {hasteSelecionada && (
            <p className="text-sm text-blue-600">
              Custo da haste: {num(form.comprimentoHaste, 3)} mm × {brl(hasteSelecionada.custo_por_mm)}/mm = <strong>{brl(custoHaste)}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Etapa 4: Mão de Obra ─────────────────────────────────────────────────────
function Etapa4({ form, onChange, maoDeObra }) {
  const selected = form.maoDeObraIds || []
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]
    onChange({ ...form, maoDeObraIds: next })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">4. Mão de Obra</h2>
        <p className="text-sm text-gray-500 mt-1">
          Selecione os processos internos que serão aplicados a este produto.
        </p>
      </div>

      <div className="space-y-2">
        {maoDeObra.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum item de mão de obra cadastrado.</p>
        ) : maoDeObra.map(m => (
          <label key={m.id}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
              ${selected.includes(m.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggle(m.id)}
              className="w-4 h-4 rounded text-indigo-600" />
            <div className="flex-1">
              <p className="font-mono font-semibold text-sm text-gray-900">{m.codigo}</p>
              <p className="text-xs text-gray-500">{m.descricao}</p>
            </div>
            <span className="font-medium text-sm">{brl(m.custo)}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ─── Etapa 5: Revisão ─────────────────────────────────────────────────────────
function Etapa5({ form, esferas, hastes, blanks, maoDeObra }) {
  const esfera  = esferas.find(e => e.material === form.materialEsfera && parseFloat(e.diametro) === parseFloat(form.diametroEsfera))
  const haste   = hastes.find(h => h.id === form.hasteId)
  const blank   = blanks.find(b => b.id === form.blankId)
  const mos     = maoDeObra.filter(m => (form.maoDeObraIds || []).includes(m.id))

  const custoHaste = haste && form.comprimentoHaste
    ? haste.custo_por_mm * parseFloat(form.comprimentoHaste) : 0
  const custoEsfera = (esfera && esfera.custo) || 0
  const custoBlank  = (blank && blank.custo)  || 0
  const custoMO     = mos.reduce((s, m) => s + m.custo, 0)
  const custoTotal  = custoBlank + custoHaste + custoEsfera + custoMO

  const codigo = form.codigo || gerarCodigo({
    tipo: form.tipo, rosca: form.rosca,
    materialEsfera: form.materialEsfera, diametroEsfera: form.diametroEsfera,
    comprimentoTotal: form.comprimentoTotal
  })

  const rows = [
    { tipo: 'Blank',      comp: blank,  custo: custoBlank,  qtd: 1 },
    { tipo: 'Haste',      comp: haste,  custo: custoHaste,  qtd: form.comprimentoHaste ? parseFloat(form.comprimentoHaste) : 1, unid: 'mm' },
    { tipo: 'Esfera',     comp: esfera, custo: custoEsfera, qtd: 1 },
    ...mos.map(m => ({ tipo: 'M.O.', comp: m, custo: m.custo, qtd: 1 }))
  ].filter(r => r.comp)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">5. Revisão da Composição</h2>
        <p className="text-sm text-gray-500 mt-1">Confirme os dados antes de salvar o produto.</p>
      </div>

      {/* Código e nome */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Código do produto</label>
          <p className="input bg-gray-50 font-mono font-bold text-blue-700">{codigo}</p>
        </div>
        <div>
          <label className="label">Nome</label>
          <p className="input bg-gray-50 text-gray-700">{form.nome || '—'}</p>
        </div>
      </div>

      {/* Tabela de componentes */}
      <div className="card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Tipo</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Código</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Qtd</th>
              <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Custo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-2"><span className="badge badge-gray">{r.tipo}</span></td>
                <td className="px-4 py-2 font-mono text-xs text-gray-700">{r.comp.codigo}</td>
                <td className="px-4 py-2 text-gray-600">{num(r.qtd, 3)}{r.unid ? ` ${r.unid}` : ' un'}</td>
                <td className="px-4 py-2 text-right font-medium">{brl(r.custo)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2" colSpan={3}>Custo Total</td>
              <td className="px-4 py-2 text-right text-blue-700 text-base">{brl(custoTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Preço de venda (R$)</label>
          <p className="text-xs text-gray-400 mb-1">Defina após salvar, na tela de Produtos</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 pt-5">
            Margem estimada será calculada automaticamente após definir o preço.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Wizard principal ─────────────────────────────────────────────────────────
const FORM_INIT = {
  tipo: 'PM', rosca: 'M2', nome: '', codigo: '',
  categoria: 'acabado',
  materialEsfera: '', diametroEsfera: '',
  comprimentoTotal: '',
  materialHaste: '', hasteId: null,
  blankId: null,
  comprimentoHaste: '',
  maoDeObraIds: []
}

export default function ConstruirProduto() {
  const navigate = useNavigate()
  const [etapa, setEtapa]               = useState(1)
  const [form, setForm]                 = useState(FORM_INIT)
  const [error, setError]               = useState('')
  const [saving, setSaving]             = useState(false)
  const [loading, setLoading]           = useState(false)

  const [esferas, setEsferas]           = useState([])
  const [hastes, setHashtes]            = useState([])
  const [blanks, setBlanks]             = useState([])
  const [blanksSugeridos, setBlanksSug] = useState([])
  const [maoDeObra, setMaoDeObra]       = useState([])

  // Carrega catálogos
  useEffect(() => {
    Promise.all([getEsferas(), getHashtes(), getMaoDeObra()])
      .then(([e, h, m]) => {
        setEsferas(e.data)
        setHashtes(h.data)
        setMaoDeObra(m.data)
      })
  }, [])

  // Quando muda haste, busca blanks sugeridos
  useEffect(() => {
    async function fetchBlanks() {
      if (!form.rosca) return
      setLoading(true)
      setBlanksSug([])
      const haste = hastes.find(h => h.id === form.hasteId)
      if (haste) {
        try {
          const res = await sugerirBlank({ rosca: form.rosca, diametro_haste: haste.diametro })
          setBlanksSug(res.data)
        } catch {}
      } else {
        // Sem haste: busca todos os blanks da rosca
        const res = await getBlanks({ rosca: form.rosca })
        setBlanksSug(res.data)
      }
      setLoading(false)
    }
    fetchBlanks()
  }, [form.hasteId, form.rosca, hastes])

  // Calcula comprimento da haste
  useEffect(() => {
    async function calcular() {
      if (!form.blankId || !form.comprimentoTotal) return
      try {
        const res = await calcularHaste({
          comprimento_total: parseFloat(form.comprimentoTotal),
          blank_id: form.blankId,
          diametro_esfera: form.diametroEsfera ? parseFloat(form.diametroEsfera) : 0
        })
        setForm(f => ({ ...f, comprimentoHaste: res.data.comprimento_haste }))
      } catch (e) {
        setForm(f => ({ ...f, comprimentoHaste: '' }))
      }
    }
    calcular()
  }, [form.blankId, form.comprimentoTotal, form.diametroEsfera])

  function validarEtapa() {
    if (etapa === 1 && (!form.tipo || !form.rosca)) {
      setError('Selecione o tipo e a rosca'); return false
    }
    if (etapa === 2 && (!form.materialEsfera || !form.diametroEsfera || !form.comprimentoTotal)) {
      setError('Preencha material, diâmetro e comprimento total'); return false
    }
    if (etapa === 3 && !form.blankId) {
      setError('Selecione um blank'); return false
    }
    setError(''); return true
  }

  function avancar() {
    if (!validarEtapa()) return
    setEtapa(e => e + 1)
  }

  function voltar() {
    setError(''); setEtapa(e => e - 1)
  }

  async function salvar() {
    if (!validarEtapa()) return
    setSaving(true)
    setError('')

    try {
      const esfera  = esferas.find(e => e.material === form.materialEsfera && parseFloat(e.diametro) === parseFloat(form.diametroEsfera))
      const haste   = hastes.find(h => h.id === form.hasteId)
      const blank   = blanksSugeridos.find(b => b.id === form.blankId)
      const mos     = maoDeObra.filter(m => form.maoDeObraIds.includes(m.id))

      const componentes = []

      if (blank) componentes.push({
        tipo_componente: 'blank', ref_id: blank.id,
        codigo_componente: blank.codigo, nome_componente: `Blank ${blank.rosca} - Ø${blank.diametro_furo}mm`,
        quantidade: 1, custo_unitario: blank.custo,
        bling_codigo: blank.bling_codigo || blank.codigo
      })

      if (haste && form.comprimentoHaste) componentes.push({
        tipo_componente: 'haste', ref_id: haste.id,
        codigo_componente: haste.codigo, nome_componente: `Haste ${haste.material} Ø${haste.diametro}mm`,
        quantidade: parseFloat(form.comprimentoHaste),
        custo_unitario: haste.custo_por_mm,
        bling_codigo: haste.bling_codigo || haste.codigo
      })

      if (esfera) componentes.push({
        tipo_componente: 'esfera', ref_id: esfera.id,
        codigo_componente: esfera.codigo, nome_componente: `Esfera ${esfera.material} Ø${esfera.diametro}mm`,
        quantidade: 1, custo_unitario: esfera.custo,
        bling_codigo: esfera.bling_codigo || esfera.codigo
      })

      for (const m of mos) {
        componentes.push({
          tipo_componente: 'mao_de_obra', ref_id: m.id,
          codigo_componente: m.codigo, nome_componente: m.descricao,
          quantidade: 1, custo_unitario: m.custo,
          bling_codigo: m.bling_codigo || m.codigo
        })
      }

      const codigo = form.codigo || gerarCodigo({
        tipo: form.tipo, rosca: form.rosca,
        materialEsfera: form.materialEsfera, diametroEsfera: form.diametroEsfera,
        comprimentoTotal: form.comprimentoTotal
      })

      const payload = {
        codigo, nome: form.nome || codigo,
        tipo: form.tipo, rosca: form.rosca,
        categoria: form.categoria || 'acabado',
        comprimento_total: parseFloat(form.comprimentoTotal),
        diametro_esfera:   parseFloat(form.diametroEsfera) || null,
        componentes
      }

      await createProduto(payload)
      navigate('/produtos')
    } catch (e) {
      setError((e.response && e.response.data && e.response.data.erro) || 'Erro ao salvar produto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Construir Produto</h1>
        <p className="text-sm text-gray-500 mt-0.5">Wizard de composição de pontas de medição</p>
      </div>

      <div className="card">
        <ProgressBar etapa={etapa} />

        {/* Conteúdo da etapa */}
        {etapa === 1 && <Etapa1 form={form} onChange={setForm} />}
        {etapa === 2 && <Etapa2 form={form} onChange={setForm} esferas={esferas} />}
        {etapa === 3 && (
          <Etapa3
            form={form} onChange={setForm}
            hastes={hastes} blanks={blanks}
            blanksSugeridos={blanksSugeridos}
            setBlanks={setBlanksSug}
            loading={loading}
          />
        )}
        {etapa === 4 && <Etapa4 form={form} onChange={setForm} maoDeObra={maoDeObra} />}
        {etapa === 5 && (
          <Etapa5
            form={form}
            esferas={esferas} hastes={hastes}
            blanks={blanksSugeridos} maoDeObra={maoDeObra}
          />
        )}

        {error && (
          <div className="mt-4">
            <Alert type="error" message={error} />
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between mt-6 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={voltar}
            disabled={etapa === 1}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Voltar
          </button>

          {etapa < 5 ? (
            <button type="button" onClick={avancar} className="btn-primary">
              Próximo <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={salvar} disabled={saving} className="btn-success">
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? 'Salvando...' : 'Criar Produto'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
