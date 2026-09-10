import React from 'react';
import { BookOpen, Plus, Clock, GraduationCap, Edit, Trash2 } from 'lucide-react';

export default function CourseList({ 
  courses, 
  classes, 
  onOpenNewCourse, 
  onEditCourse, 
  onDeleteCourse 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Gestão de Cursos</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Cadastre os cursos da instituição, definições de carga horária e matriz curricular
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewCourse}>
          <Plus size={18} /> Novo Curso
        </button>
      </div>

      {/* Grid de Cards de Cursos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {courses.map(course => {
          const linkedClasses = classes.filter(c => c.courseId === course.id);
          return (
            <div key={course.id} className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '4px 10px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {course.code}
                  </span>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="btn-icon" 
                      onClick={() => onEditCourse(course)}
                      title="Editar Curso"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => onDeleteCourse(course)}
                      title="Excluir Curso"
                      style={{ color: '#f87171' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>{course.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {course.description || 'Sem descrição cadastrada.'}
                </p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Clock size={16} /> <span><strong>{course.workload}</strong> horas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <GraduationCap size={16} /> <span><strong>{linkedClasses.length}</strong> turmas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
