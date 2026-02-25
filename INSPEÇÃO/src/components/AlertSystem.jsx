import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Contexto para gerenciar alertas globalmente
const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert deve ser usado dentro de AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = ({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    const alert = { id, type, title, message };
    
    setAlerts(prev => [...prev, alert]);

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Métodos de conveniência
  const success = (message, title = 'Sucesso!') => {
    return showAlert({ type: 'success', title, message });
  };

  const error = (message, title = 'Erro!') => {
    return showAlert({ type: 'error', title, message, duration: 6000 });
  };

  const warning = (message, title = 'Atenção!') => {
    return showAlert({ type: 'warning', title, message, duration: 5000 });
  };

  const info = (message, title = 'Informação') => {
    return showAlert({ type: 'info', title, message });
  };

  const confirm = (message, title = 'Confirmar') => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random();
      const alert = { 
        id, 
        type: 'confirm', 
        title, 
        message,
        onConfirm: () => {
          removeAlert(id);
          resolve(true);
        },
        onCancel: () => {
          removeAlert(id);
          resolve(false);
        }
      };
      
      setAlerts(prev => [...prev, alert]);
    });
  };

  return (
    <AlertContext.Provider value={{ success, error, warning, info, confirm }}>
      {children}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};

const AlertContainer = ({ alerts, removeAlert }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md w-full pointer-events-none">
      {alerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
};

const AlertCard = ({ alert, onClose }) => {
  const { type, title, message, onConfirm, onCancel } = alert;

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-700'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700'
    },
    confirm: {
      icon: AlertTriangle,
      bgColor: 'bg-industrial-50',
      borderColor: 'border-industrial-600',
      iconColor: 'text-industrial-600',
      titleColor: 'text-industrial-900',
      textColor: 'text-industrial-700'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  if (type === 'confirm') {
    return (
      <div 
        className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-2xl p-4 pointer-events-auto animate-slide-in-right`}
      >
        <div className="flex items-start gap-3">
          <Icon className={config.iconColor} size={24} />
          <div className="flex-1">
            <h4 className={`font-bold text-lg ${config.titleColor} mb-2`}>
              {title}
            </h4>
            <p className={`${config.textColor} mb-4 text-sm`}>
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                Confirmar
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-industrial-200 text-industrial-700 rounded-lg hover:bg-industrial-300 transition font-medium text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-2xl p-4 pointer-events-auto animate-slide-in-right`}
    >
      <div className="flex items-start gap-3">
        <Icon className={config.iconColor} size={24} />
        <div className="flex-1">
          <h4 className={`font-bold text-lg ${config.titleColor}`}>
            {title}
          </h4>
          {message && (
            <p className={`${config.textColor} mt-1 text-sm`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`${config.iconColor} hover:opacity-70 transition`}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;
document.head.appendChild(style);
