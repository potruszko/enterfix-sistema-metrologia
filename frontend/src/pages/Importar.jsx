import { useState, useRef } from 'react'
import { Upload, CheckCircle, AlertCircle, FileText, Package, Gem } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function ImportCard({ icon: Icon, titulo, descricao, endpoint, cor, exemplo }) {
  const [status, setStatus] = useState(null) // null | 'loading' | 'ok' | 'erro'
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState('')
  const inputRef = useRef()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setStatus('loading')
    setErro('')
    setResultado(null)

    try {
      const text = await file.text()
      const res = await axios.post(`${API}/importar/${endpoint}`, text, {
        headers: { 'Content-Type': 'text/csv; charset=utf-8' }
      })
      setResultado(res.data)
      setStatus('ok')
    } catch (err) {
      setErro(err.response?.data?.erro || err.message)
      setStatus('erro')
    } finally {
      // Limpa o input para permitir reimportar o mesmo arquivo
      e.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={`p-5 ${cor}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Icon size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{titulo}</h3>
            <p className="text-sm text-white/80">{descricao}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Instruções */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm text-gray-600">
          <p className="font-semibold text-gray-700 mb-2">Como exportar do Bling:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Acesse <strong>Produtos</strong> no Bling</li>
            <li>Filtre por grupo: <strong>{exemplo.grupo}</strong></li>
            <li>Clique em <strong>Exportar → CSV</strong></li>
            <li>Faça o upload do arquivo abaixo</li>
          </ol>
        </div>

        {/* Upload */}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={handleFile}
          />
          <button
            onClick={() => inputRef.current.click()}
            disabled={status === 'loading'}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed
              font-medium text-sm transition-all
              ${status === 'loading'
                ? 'border-gray-200 text-gray-400 cursor-wait'
                : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 cursor-pointer'
              }`}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Importando...
              </>
            ) : (
              <>
                <Upload size={16} />
                Selecionar arquivo CSV
              </>
            )}
          </button>
        </div>

        {/* Resultado de sucesso */}
        {status === 'ok' && resultado && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-green-800">{resultado.mensagem}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-green-700">
                  <span>📋 CSV: <strong>{resultado.total_csv}</strong> linhas</span>
                  <span>✅ Processados: <strong>{resultado.importados}</strong></span>
                  {resultado.ignorados > 0 && (
                    <span>⏭ Ignorados: <strong>{resultado.ignorados}</strong></span>
                  )}
                  {resultado.erros?.length > 0 && (
                    <span className="text-red-600">❌ Erros: <strong>{resultado.erros.length}</strong></span>
                  )}
                </div>
                {resultado.erros?.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-600 text-xs">Ver erros</summary>
                    <ul className="mt-1 text-xs text-red-700 list-disc list-inside space-y-0.5">
                      {resultado.erros.slice(0, 10).map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Erro */}
        {status === 'erro' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2">
            <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{erro || 'Erro ao importar. Verifique o arquivo.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Importar() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Importar do Bling</h1>
        <p className="text-sm text-gray-500 mt-1">
          Importe produtos diretamente dos arquivos CSV exportados do Bling.
          Os códigos do Bling serão mantidos como identificadores únicos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ImportCard
          icon={Package}
          titulo="Blanks"
          descricao="130 blanks inox cadastrados no Bling"
          endpoint="blanks"
          cor="bg-gradient-to-br from-blue-600 to-blue-700"
          exemplo={{ grupo: 'BLANKS' }}
        />
        <ImportCard
          icon={Gem}
          titulo="Esferas"
          descricao="62 esferas de rubi, cerâmica e metal duro"
          endpoint="esferas"
          cor="bg-gradient-to-br from-purple-600 to-purple-700"
          exemplo={{ grupo: 'ESFERAS' }}
        />
      </div>

      {/* Box informativo */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex gap-3">
          <FileText size={20} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800 space-y-1">
            <p className="font-semibold">Sobre os dados importados</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700">
              <li>O <strong>ID do Bling</strong> e o <strong>código SKU</strong> são preservados como identificadores</li>
              <li>Dimensões (Ø corpo, comprimento, Ø furo) são extraídas automaticamente da descrição</li>
              <li>O <strong>Preço de custo</strong> do Bling é importado — você pode ajustar depois</li>
              <li>Reimportar atualiza os dados sem duplicar registros</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
