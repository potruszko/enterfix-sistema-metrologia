import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Wrench, Circle, Package, RefreshCw, Wand2, TrendingUp, AlertTriangle } from 'lucide-react'
import { getBlanks, getHashtes, getEsferas, getProdutos, getBlingStatus } from '../lib/api'
import { brl } from '../lib/utils'

function StatCard({ icon: Icon, label, value, color, to }) {
  const content = (
    <div className={`card flex items-center gap-4 hover:shadow-md transition-shadow ${to ? 'cursor-pointer' : ''}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

export default function Dashboard() {
  const [stats, setStats] = useState({ blanks: 0, hastes: 0, esferas: 0, produtos: 0, rascunhos: 0 })
  const [blingStatus, setBlingStatus] = useState(null)
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [b, h, e, p, ps, bs] = await Promise.all([
          getBlanks(),
          getHashtes(),
          getEsferas(),
          getProdutos(),
          getProdutos({ status: 'rascunho' }),
          getBlingStatus()
        ])
        setStats({
          blanks:    b.data.length,
          hastes:    h.data.length,
          esferas:   e.data.length,
          produtos:  p.data.length,
          rascunhos: ps.data.length
        })
        setBlingStatus(bs.data)
        setRecentProducts(p.data.slice(-5).reverse())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Visão geral do sistema de composição de pontas</p>
      </div>

      {/* Status do Bling */}
      {blingStatus && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          blingStatus.valido
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          {blingStatus.valido
            ? <RefreshCw size={18} className="text-green-600 shrink-0" />
            : <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
          }
          <div className="flex-1 text-sm">
            {blingStatus.valido
              ? <span className="text-green-700 font-medium">Bling conectado</span>
              : <span className="text-yellow-700 font-medium">Bling não configurado — </span>
            }
            {!blingStatus.valido && (
              <Link to="/configuracoes" className="text-blue-600 underline">
                configurar agora
              </Link>
            )}
          </div>
          {stats.rascunhos > 0 && blingStatus.valido && (
            <Link to="/bling" className="text-sm text-blue-600 font-medium hover:underline">
              {stats.rascunhos} produto(s) pendente(s) de sincronização →
            </Link>
          )}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Layers}  label="Blanks cadastrados" value={stats.blanks}  color="bg-slate-600"  to="/blanks" />
        <StatCard icon={Wrench}  label="Hastes cadastradas" value={stats.hastes}  color="bg-violet-600" to="/hastes" />
        <StatCard icon={Circle}  label="Esferas cadastradas" value={stats.esferas} color="bg-pink-600"   to="/esferas" />
        <StatCard icon={Package} label="Produtos cadastrados" value={stats.produtos} color="bg-blue-600"  to="/produtos" />
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/construir" className="card flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <Wand2 size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 group-hover:text-blue-700">Construir Novo Produto</p>
            <p className="text-sm text-gray-500">Wizard passo a passo para montar a composição</p>
          </div>
        </Link>

        <Link to="/bling" className="card flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
            <RefreshCw size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 group-hover:text-emerald-700">Sincronizar com Bling</p>
            <p className="text-sm text-gray-500">Enviar composições para a ficha técnica do Bling</p>
          </div>
        </Link>
      </div>

      {/* Últimos produtos */}
      {recentProducts.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Últimos produtos</h2>
            <Link to="/produtos" className="text-sm text-blue-600 hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-mono text-sm font-medium text-gray-900">{p.codigo}</span>
                  <p className="text-xs text-gray-500">{p.nome}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{brl(p.custo_total)}</span>
                  <span className={`badge ${p.status === 'sincronizado' ? 'badge-green' : 'badge-yellow'}`}>
                    {p.status === 'sincronizado' ? 'Sincronizado' : 'Rascunho'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
