import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = (msg) => addToast(msg, 'success');
  const showError = (msg) => addToast(msg, 'error');
  const showWarning = (msg) => addToast(msg, 'warning');
  const showInfo = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div style={styles.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ ...styles.toast, ...styles[toast.type] }}>
            <div style={styles.iconWrapper}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="#15803D" />}
              {toast.type === 'error' && <XCircle size={18} color="#DC2626" />}
              {toast.type === 'warning' && <AlertTriangle size={18} color="#D97706" />}
              {toast.type === 'info' && <Info size={18} color="#0284C7" />}
            </div>
            <div style={styles.message}>{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} style={styles.closeBtn}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = {
  toastContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '420px',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(59, 73, 83, 0.15)',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D6E4C6',
    animation: 'slideIn 0.2s ease',
  },
  success: { borderLeft: '4px solid #15803D' },
  error: { borderLeft: '4px solid #DC2626' },
  warning: { borderLeft: '4px solid #D97706' },
  info: { borderLeft: '4px solid #0284C7' },
  iconWrapper: { marginRight: '10px', display: 'flex', alignItems: 'center' },
  message: { flex: 1, fontSize: '0.88rem', color: '#26333D', fontWeight: '500' },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#718290',
    padding: '4px',
    marginLeft: '8px',
  },
};
