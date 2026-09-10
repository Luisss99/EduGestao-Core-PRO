import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Excluir', cancelText = 'Cancelar' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirmar Ação'} maxWidth="450px">
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.15)',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <AlertTriangle size={28} />
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9375rem' }}>
          {message || 'Tem certeza que deseja prosseguir? Esta ação não poderá ser desfeita.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1 }}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
