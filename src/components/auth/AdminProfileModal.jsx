import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Camera, User, Mail, Shield, Save, Trash2, AlertTriangle } from 'lucide-react';
import { formatCPF, validateCPF } from '../../utils/cpfValidator';

export default function AdminProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  onSaveProfile, 
  onDeleteAccount 
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');

  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCpf(user.cpf || '');
      setRole(user.role || 'Administradora / Secretária');
      setAvatar(user.avatar || '');
    }
    setErrors({});
    setShowDeleteConfirm(false);
  }, [user, isOpen]);

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'O nome do perfil é obrigatório.';
    if (!email.trim()) errs.email = 'O e-mail é obrigatório.';
    if (cpf && !validateCPF(cpf)) errs.cpf = 'CPF inválido.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSaveProfile({
      ...user,
      name,
      email,
      cpf,
      role,
      avatar: avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Perfil do Administrador & Configurações de Conta" 
      maxWidth="620px"
    >
      {!showDeleteConfirm ? (
        <form onSubmit={handleSubmit}>
          {/* Avatar Upload */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '16px',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} 
                alt="Foto de Perfil" 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)'
                }} 
              />
              <label style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'var(--primary)',
                color: '#ffffff',
                padding: '6px',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }} title="Alterar Foto">
                <Camera size={14} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Foto de Perfil do Administrador</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Envie uma imagem do seu computador ou cole a URL abaixo.
              </p>
              <input
                type="text"
                placeholder="Cole a URL da foto (opcional)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="form-control"
                style={{ marginTop: '8px', fontSize: '0.75rem', height: '32px' }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Nome Completo *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`form-control ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">E-mail de Acesso *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-control ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className={`form-control ${errors.cpf ? 'error' : ''}`}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              {errors.cpf && <span className="error-text">{errors.cpf}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Cargo / Nível de Acesso</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-control"
                placeholder="Ex: Administradora / Secretária"
              />
            </div>
          </div>

          {/* Danger Zone - Excluir Conta */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f87171', margin: 0 }}>Zona de Perigo</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Excluir permanentemente sua conta de administrador e desconectar do sistema.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={14} /> Excluir Conta
            </button>
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Salvar Perfil
            </button>
          </div>
        </form>
      ) : (
        /* Confirmação de Exclusão da Conta */
        <div style={{ textAlign: 'center', padding: '16px 8px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
            Tem certeza que deseja excluir sua conta?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
            Esta ação encerrará sua sessão atual e removerá os dados de acesso da conta de administrador do sistema local.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Voltar ao Perfil
            </button>
            <button
              className="btn btn-danger"
              onClick={onDeleteAccount}
            >
              <Trash2 size={16} /> Sim, Excluir Minha Conta
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
