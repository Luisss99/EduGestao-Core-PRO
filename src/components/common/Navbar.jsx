import React from 'react';
import { Search, Sun, Moon, LogOut, User } from 'lucide-react';

export default function Navbar({ 
  user, 
  onLogout, 
  searchQuery, 
  setSearchQuery, 
  isDarkMode, 
  setIsDarkMode,
  onOpenStudentModal
}) {
  return (
    <header style={{
      marginLeft: '260px',
      height: '70px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Quick Search */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-muted)' 
          }} 
        />
        <input
          type="text"
          placeholder="Buscar aluno por Nome ou CPF..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
          style={{
            paddingLeft: '42px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-primary)',
            fontSize: '0.875rem'
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="btn-icon"
          title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--bg-input)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Admin User Chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 14px 6px 8px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <User size={16} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.2 }}>{user?.name || 'Administrador'}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role || 'Secretária'}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="btn-icon"
          title="Sair do sistema"
          style={{
            color: '#f87171',
            background: 'rgba(244, 63, 94, 0.1)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            fontWeight: 600
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </header>
  );
}
