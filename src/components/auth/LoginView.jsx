import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { formatCPF, cleanCPF } from '../../utils/cpfValidator';

export default function LoginView({ onLogin }) {
  const [identifier, setIdentifier] = useState('admin@edugestao.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    // Se parecer número/CPF, formata
    if (/^\d/.test(val)) {
      setIdentifier(formatCPF(val));
    } else {
      setIdentifier(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Por favor, informe seu E-mail ou CPF.');
      return;
    }

    if (!password) {
      setError('Informe sua senha de acesso.');
      return;
    }

    // Aceita admin@edugestao.com ou qualquer login de demonstração
    onLogin({
      name: 'Ana Cláudia Martins',
      email: identifier.includes('@') ? identifier : 'admin@edugestao.com',
      cpf: !identifier.includes('@') ? identifier : '000.000.000-00',
      role: 'Administradora / Secretária',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b 0%, #0b0f19 60%)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            marginBottom: '16px'
          }}>
            <GraduationCap size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>EduGestão <span style={{ color: '#818cf8' }}>PRO</span></h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Portal de Gestão Escolar & Cadastro de Alunos
          </p>
        </div>

        {/* Security Badge */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8125rem',
          color: '#818cf8',
          marginBottom: '24px'
        }}>
          <ShieldCheck size={18} />
          <span>Acesso Restrito: <strong>Secretaria & Administração</strong></span>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            color: '#f87171',
            fontSize: '0.8125rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail ou CPF</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="admin@edugestao.com ou 000.000.000-00"
                value={identifier}
                onChange={handleIdentifierChange}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Senha de Acesso</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            Acessar Sistema <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            Dica para teste: Utilize o e-mail ou CPF e qualquer senha.
          </p>
        </div>
      </div>
    </div>
  );
}
