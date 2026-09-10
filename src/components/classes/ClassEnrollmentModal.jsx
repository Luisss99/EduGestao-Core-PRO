import React, { useState } from 'react';
import Modal from '../common/Modal';
import { UserCheck, UserPlus, UserMinus, Search, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClassEnrollmentModal({ 
  isOpen, 
  onClose, 
  targetClass, 
  students = [], 
  onEnrollStudent, 
  onUnenrollStudent 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!targetClass) return null;

  // Alunos matriculados nesta turma
  const enrolledStudents = students.filter(s => s.enrolledClassIds?.includes(targetClass.id));

  // Alunos não matriculados nesta turma
  const availableStudents = students.filter(s => 
    !s.enrolledClassIds?.includes(targetClass.id) &&
    (s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.cpf.includes(searchTerm))
  );

  const handleEnroll = (studentId) => {
    onEnrollStudent(studentId, targetClass.id);
    // Efeito celebração leve
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Gestão de Matrículas - ${targetClass.name}`}
      maxWidth="750px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Alunos Já Matriculados */}
        <div>
          <h4 style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            marginBottom: '12px',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <UserCheck size={18} /> ALUNOS MATRICULADOS NESTA TURMA ({enrolledStudents.length})
          </h4>

          {enrolledStudents.length === 0 ? (
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Nenhum aluno matriculado nesta turma ainda.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '10px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {enrolledStudents.map(student => (
                <div key={student.id} style={{
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={student.photo} alt={student.fullName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{student.fullName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{student.cpf}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onUnenrollStudent(student.id, targetClass.id)}
                    className="btn btn-danger"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    title="Remover da turma"
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adicionar Novos Alunos */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <UserPlus size={18} /> DISPONÍVEIS PARA MATRÍCULA
            </h4>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filtrar aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '32px', height: '32px', fontSize: '0.75rem' }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '10px',
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            {availableStudents.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                Todos os alunos já estão nesta turma ou nenhum aluno corresponde à busca.
              </div>
            ) : (
              availableStudents.map(student => (
                <div key={student.id} style={{
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={student.photo} alt={student.fullName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{student.fullName}</div>
                      <span className={`badge badge-${student.status.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                        {student.status}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleEnroll(student.id)}
                    className="btn btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    <UserPlus size={14} /> Matricular
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Concluir Matrículas
          </button>
        </div>
      </div>
    </Modal>
  );
}
