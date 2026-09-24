import React from 'react';
import { Search, Sun, Moon, LogOut, User, Bell } from 'lucide-react';

export default function Navbar({ 
  user, 
  onLogout, 
  onOpenProfile,
  searchQuery, 
  setSearchQuery, 
  isDarkMode, 
  setIsDarkMode
}) {
  return (
    <header style={{
      marginLeft: '240px',
      height: '76px',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Title */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
        Students
      </h2>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Quick Search Input */}
        <div style={{ position: 'relative', width: '380px' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8' 
            }} 
          />
          <input
            type="text"
            placeholder="Search for students/teachers/documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: '9999px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              color: '#1e293b',
              outline: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          {isDarkMode ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell Badge */}
        <div style={{ position: 'relative' }}>
          <button style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}>
            <Bell size={18} />
          </button>
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: '#f43f5e',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 700,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-primary)'
          }}>
            4
          </span>
        </div>

        {/* User Profile Avatar Pill */}
        <div 
          onClick={onOpenProfile}
          title="Editar perfil do administrador"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff' }} 
            />
          ) : (
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <User size={18} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
