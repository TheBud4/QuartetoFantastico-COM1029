import { createContext, useCallback, useMemo, useState } from 'react';
import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    toastIdCounter += 1;
    const id = toastIdCounter;
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container bottom-right">
        {toasts.map((toast) => {
          let Icon = Info;
          if (toast.type === 'success') Icon = CheckCircle2;
          if (toast.type === 'error') Icon = XCircle;
          if (toast.type === 'warning') Icon = TriangleAlert;

          return (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <Icon size={18} />
              <div className="toast-body">
                <strong className="toast-title">
                  {toast.type === 'success' && 'Sucesso'}
                  {toast.type === 'error' && 'Erro'}
                  {toast.type === 'warning' && 'Alerta'}
                  {toast.type === 'info' && 'Informação'}
                </strong>
                <p className="toast-message">{toast.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
