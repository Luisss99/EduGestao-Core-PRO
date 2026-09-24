import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
  RotateCcw, 
  ShieldCheck,
  FileText 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onResetData, onOpenProfile, onOpenTerms }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Gestão de Alunos', icon: Users },
    { id: 'courses', label: 'Cursos', icon: BookOpen },
    { id: 'classes', label: 'Turmas', icon: GraduationCap },
    { id: 'grades', label: 'Lançamento de Notas', icon: Award },
    { id: 'lgpd', label: 'Governança LGPD', icon: ShieldCheck },
  ];

  return (
    <aside style={{
      width: '240px',
      background: '#2d3b4d',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '24px 16px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      color: '#ffffff'
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 8px 32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '0.05em'
        }}>
          <span style={{ color: '#38bdf8', display: 'flex', gap: '2px' }}>
            <span style={{ width: '6px', height: '18px', background: '#f43f5e', borderRadius: '3px' }}></span>
            <span style={{ width: '6px', height: '24px', background: '#38bdf8', borderRadius: '3px' }}></span>
            <span style={{ width: '6px', height: '14px', background: '#fbbf24', borderRadius: '3px' }}></span>
          </span>
          SCHOOL
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
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
                gap: '14px',
                padding: '12px 18px',
                borderRadius: isActive ? '12px' : '10px',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#1e293b' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: isActive ? '0 10px 25px -5px rgba(0, 0, 0, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={20} style={{ color: isActive ? '#1e293b' : '#94a3b8' }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onOpenTerms}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
          title="Ver os Termos de Uso e Política de Privacidade"
        >
          <FileText size={14} />
          Termos de Uso (LGPD)
        </button>

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
