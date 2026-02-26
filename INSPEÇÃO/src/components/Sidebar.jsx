import React, { useState, useEffect } from 'react';
import { Home, FileText, History, Settings, Wrench, LogOut, UserCircle, FileSignature } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useIsMobile } from '../hooks/useMediaQuery';

const Sidebar = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const [userEmail, setUserEmail] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Obter e-mail do usuário
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair do sistema?')) {
      setLoggingOut(true);
      await supabase.auth.signOut();
      // O App.jsx vai detectar a mudança e mostrar a tela de login
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'novo-relatorio', icon: FileText, label: 'Novo Relatório' },
    { id: 'historico', icon: History, label: 'Histórico' },
    { id: 'contratos', icon: FileSignature, label: 'Contratos' },
    { id: 'equipamentos', icon: Wrench, label: 'Equipamentos' },
    { id: 'perfil', icon: UserCircle, label: 'Meu Perfil' },
    { id: 'configuracoes', icon: Settings, label: 'Configurações' },
  ];

  const handleNavigation = (page) => {
    onNavigate(page);
    // Fechar menu mobile após navegação
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop Mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 bg-industrial-800 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl
        transition-transform duration-300 ease-in-out z-40
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        lg:translate-x-0
      `}>
      {/* Header */}
      <div className="p-6 border-b border-industrial-700">
        <img 
          src="/assets/images/Enterfix_ Dark_registered.png" 
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
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation min-h-[48px] ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-industrial-300 hover:bg-industrial-700 hover:text-white active:bg-industrial-600'
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
      <div className="p-4 border-t border-industrial-700 space-y-3">
        {/* User Info */}
        {userEmail && (
          <div className="px-3 py-2 bg-industrial-700 rounded-lg">
            <p className="text-xs text-industrial-400 mb-1">Conectado como:</p>
            <p className="text-sm text-white font-medium truncate">{userEmail}</p>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px]"
        >
          {loggingOut ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm font-medium">Saindo...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span className="text-sm font-medium">Sair do Sistema</span>
            </>
          )}
        </button>

        <p className="text-xs text-industrial-400 text-center">
          © 2026 Enterfix Metrologia
        </p>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
