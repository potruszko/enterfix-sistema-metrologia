import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import MobileMenuButton from './components/MobileMenuButton';
import Dashboard from './components/Dashboard';
import RelatorioForm from './components/RelatorioForm';
import Historico from './components/Historico';
import Configuracoes from './components/Configuracoes';
import GestaoEquipamentos from './components/GestaoEquipamentos';
import PerfilUsuario from './components/PerfilUsuario';
import { AlertProvider } from './components/AlertSystem';
import { useMobileMenu } from './hooks/useMobileMenu';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingRelatorioId, setEditingRelatorioId] = useState(null);
  const { isOpen, toggle, close, isMobile } = useMobileMenu();

  useEffect(() => {
    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEditRelatorio = (relatorioId) => {
    setEditingRelatorioId(relatorioId);
    setCurrentPage('novo-relatorio');
  };

  const handleDuplicarRelatorio = (relatorioId) => {
    setEditingRelatorioId(relatorioId);
    setCurrentPage('novo-relatorio');
  };

  const handleNavigate = (page) => {
    if (page === 'novo-relatorio') {
      setEditingRelatorioId(null); // Resetar ao criar novo
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'novo-relatorio':
        return <RelatorioForm relatorioId={editingRelatorioId} onSaveComplete={() => handleNavigate('historico')} />;
      case 'historico':
        return <Historico onEditRelatorio={handleEditRelatorio} onDuplicarRelatorio={handleDuplicarRelatorio} />;
      case 'equipamentos':
        return <GestaoEquipamentos />;
      case 'perfil':
        return <PerfilUsuario />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar tela de login
  if (!session) {
    return <Auth />;
  }

  // Usuário autenticado - mostrar aplicação
  return (
    <AlertProvider>
      <div className="min-h-screen bg-industrial-50">
        {/* Botão do Menu Mobile */}
        {isMobile && (
          <MobileMenuButton 
            isOpen={isOpen} 
            onClick={toggle}
          />
        )}
        
        {/* Sidebar */}
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          isOpen={isOpen}
          onClose={close}
        />
        
        {/* Conteúdo Principal */}
        <div className="lg:ml-64 transition-all duration-300">
          <main className="min-h-screen p-4 lg:p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </AlertProvider>
  );
}

export default App;
