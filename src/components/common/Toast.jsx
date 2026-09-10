import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
          {toast.type === 'error' && <AlertTriangle size={18} className="text-rose-400" />}
          {toast.type === 'info' && <Info size={18} className="text-cyan-400" />}
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
          <button 
            onClick={() => onDismiss(toast.id)} 
            className="btn-icon" 
            style={{ marginLeft: 'auto', padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
