import React from 'react';
import { Home, FileText, History, Settings, Wrench } from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'novo-relatorio', icon: FileText, label: 'Novo Relatório' },
    { id: 'historico', icon: History, label: 'Histórico' },
    { id: 'equipamentos', icon: Wrench, label: 'Equipamentos' },
    { id: 'configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="w-64 bg-industrial-800 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-industrial-700">
        <img 
          src="/src/assets/images/Enterfix_ Dark_registered.png" 
          alt="Enterfix" 
          className="w-full max-w-[180px] h-auto"
        />
        <p className="text-sm text-industrial-300 mt-3">Sistema de Metrologia</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-industrial-300 hover:bg-industrial-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-industrial-700">
        <p className="text-xs text-industrial-400 text-center">
          © 2026 Enterfix Metrologia
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
