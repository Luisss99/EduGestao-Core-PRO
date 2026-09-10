import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
  RotateCcw, 
  ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onResetData }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Gestão de Alunos', icon: Users },
    { id: 'courses', label: 'Cursos', icon: BookOpen },
    { id: 'classes', label: 'Turmas', icon: GraduationCap },
    { id: 'grades', label: 'Lançamento de Notas', icon: Award },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px 16px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 8px 24px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.1 }}>
            EduGestão <span style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: 600 }}>PRO</span>
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gestão Escolar & Matrículas</span>
        </div>
      </div>

      {/* Access Badge */}
      <div style={{
        margin: '0 4px 20px',
        padding: '8px 12px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem',
        color: '#818cf8',
        fontWeight: 600
      }}>
        <ShieldCheck size={16} />
        <span>Perfil: Secretária / Admin</span>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} style={{ color: isActive ? '#818cf8' : 'currentColor' }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer Reset Data Button */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onResetData}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            padding: '8px 12px',
            background: 'transparent',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-subtle)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Restaura os dados demonstrativos de fábrica"
        >
          <RotateCcw size={14} />
          Restaurar Dados Demo
        </button>
      </div>
    </aside>
  );
}
