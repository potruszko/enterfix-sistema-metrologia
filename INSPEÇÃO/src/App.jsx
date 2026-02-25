import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RelatorioForm from './components/RelatorioForm';
import Historico from './components/Historico';
import Configuracoes from './components/Configuracoes';
import GestaoEquipamentos from './components/GestaoEquipamentos';
import { AlertProvider } from './components/AlertSystem';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingRelatorioId, setEditingRelatorioId] = useState(null);

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
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AlertProvider>
      <div className="min-h-screen bg-industrial-50">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="ml-64">
          <main className="min-h-screen">
            {renderPage()}
          </main>
        </div>
      </div>
    </AlertProvider>
  );
}

export default App;
