import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Layers, Wrench, Circle,
  UserCog, Package, Wand2, RefreshCw, Settings, Upload,
  Factory, ClipboardList, MonitorPlay, Cpu
} from 'lucide-react'

const nav = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/construir',     icon: Wand2,           label: 'Construir Produto' },
  { label: 'COMPONENTES', divider: true },
  { to: '/blanks',        icon: Layers,          label: 'Blanks' },
  { to: '/hastes',        icon: Wrench,          label: 'Hastes' },
  { to: '/esferas',       icon: Circle,          label: 'Esferas' },
  { to: '/mao-de-obra',   icon: UserCog,         label: 'Mão de Obra' },
  { label: 'PRODUTOS', divider: true },
  { to: '/produtos',      icon: Package,         label: 'Todos os Produtos' },
  { label: 'PRODUÇÃO (MES)', divider: true },
  { to: '/ordens',        icon: ClipboardList,   label: 'Ordens de Produção' },
  { to: '/operador',      icon: MonitorPlay,     label: 'Operador / Apontamento' },
  { to: '/centros',       icon: Cpu,             label: 'Centros de Trabalho' },
  { label: 'BLING / DADOS', divider: true },
  { to: '/importar',      icon: Upload,          label: 'Importar do Bling' },
  { to: '/bling',         icon: RefreshCw,       label: 'Sincronizar Bling' },
  { to: '/configuracoes', icon: Settings,        label: 'Configurações' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 flex flex-col
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">PM</span>
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm">Pontas de Medição</p>
            <p className="text-xs text-gray-400">Gestão de Composição</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {nav.map((item, i) => {
            if (item.divider) {
              return (
                <p key={i} className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 pt-4 pb-1">
                  {item.label}
                </p>
              )
            }
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="px-4 py-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">Enterfix MES © {new Date().getFullYear()}</p>
        </div>
      </aside>
    </>
  )
}
