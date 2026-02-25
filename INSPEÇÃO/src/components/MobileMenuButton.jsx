import React from 'react';
import { Menu, X } from 'lucide-react';

/**
 * Botão de hambúrguer para menu mobile
 * Componente reutilizável com animação
 */
const MobileMenuButton = ({ isOpen, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        lg:hidden fixed top-4 left-4 z-50 
        p-3 rounded-lg shadow-lg
        transition-all duration-200
        ${isOpen 
          ? 'bg-white text-industrial-800' 
          : 'bg-industrial-800 text-white'
        }
        hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X size={24} className="transition-transform duration-200" />
      ) : (
        <Menu size={24} className="transition-transform duration-200" />
      )}
    </button>
  );
};

export default MobileMenuButton;
