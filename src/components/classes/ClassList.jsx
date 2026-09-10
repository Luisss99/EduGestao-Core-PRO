import React from 'react';
import { GraduationCap, Plus, Users, Calendar, BookOpen, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function ClassList({ 
  classes, 
  courses, 
  students, 
  onOpenNewClass, 
  onEditClass, 
  onDeleteClass, 
  onManageEnrollment 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Gestão de Turmas</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Abertura de turmas, controle de ano letivo e vinculação de alunos matriculados
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewClass}>
          <Plus size={18} /> Abrir Nova Turma
        </button>
      </div>

      {/* Grid de Turmas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {classes.map(cls => {
          const course = courses.find(c => c.id === cls.courseId);
          const enrolledStudents = students.filter(s => s.enrolledClassIds?.includes(cls.id));

          return (
            <div key={cls.id} className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '4px 10px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: '#22d3ee',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {cls.code}
                  </span>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn-icon" onClick={() => onEditClass(cls)} title="Editar Turma">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => onDeleteClass(cls)} title="Excluir Turma" style={{ color: '#f87171' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>{cls.name}</h3>
                
                <div style={{ fontSize: '0.8125rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <BookOpen size={14} /> {course?.name || 'Curso não encontrado'}
                </div>

                {/* Período e Disciplinas */}
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Período Letivo: <strong style={{ color: 'var(--text-main)' }}>{cls.period}</strong>
                  </div>
                  <div>
                    Disciplinas ({cls.subjects?.length || 0}):{' '}
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                      {cls.subjects ? cls.subjects.join(', ') : 'Nenhuma'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Alunos e Ação de Matrícula */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} className="text-cyan-400" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {enrolledStudents.length} Aluno(s)
                  </span>
                </div>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => onManageEnrollment(cls)}
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <UserPlus size={14} /> Matrículas
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
