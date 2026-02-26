import React from 'react';

/**
 * Campo de informação para exibir valores auto-populados dos CONFIGs
 * @param {string} label - Rótulo do campo
 * @param {string|number} value - Valor a ser exibido
 * @param {boolean} highlight - Se true, destaca o valor em verde
 * @param {string} icon - Ícone opcional (emoji)
 */
const InfoField = ({ label, value, highlight = false, icon = null }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <span className="text-sm text-gray-600 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {label}:
      </span>
      <strong className={`text-sm ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </strong>
    </div>
  );
};

export default InfoField;
