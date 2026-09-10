import React from 'react';
import Modal from '../common/Modal';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Award, 
  Printer, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { calculateAverage } from '../../utils/storage';

export default function StudentDetailModal({ 
  isOpen, 
  onClose, 
  student, 
  classes = [], 
  courses = [], 
  grades = [],
  onEditStudent
}) {
  if (!student) return null;

  // Turmas em que o aluno está matriculado
  const studentClasses = classes.filter(cls => student.enrolledClassIds?.includes(cls.id));

  // Lançamento de notas referente a este aluno
  const studentGrades = grades.filter(g => g.studentId === student.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ficha Cadastral & Boletim Escolar" maxWidth="800px">
      <div id="printable-boletim">
        {/* Header da Ficha do Aluno */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          padding: '20px',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          border: '1px solid var(--border-color)'
        }}>
          <img 
            src={student.photo} 
            alt={student.fullName} 
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
            }} 
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{student.fullName}</h3>
              <span className={`badge badge-${student.status.toLowerCase()}`}>
                {student.status}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px',
              marginTop: '12px',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> CPF: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{student.cpf}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> {student.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> {student.phone || 'Não informado'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Nasc.: {student.birthDate || 'Não informada'}
              </div>
            </div>

            {student.address && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> {student.address}
              </div>
            )}
          </div>
        </div>

        {/* Histórico de Turmas Cursadas */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#818cf8'
          }}>
            <GraduationCap size={18} /> HISTÓRICO DE TURMAS VINCULADAS
          </h4>

          {studentClasses.length === 0 ? (
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Este aluno ainda não está vinculado a nenhuma turma.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {studentClasses.map(cls => {
                const course = courses.find(c => c.id === cls.courseId);
                return (
                  <div key={cls.id} style={{
                    padding: '14px 18px',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cls.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Curso: <strong>{course?.name || 'Não especificado'}</strong> • Período: {cls.period}
                      </div>
                    </div>
                    <span className="badge badge-ativo" style={{ fontSize: '0.7rem' }}>Em Andamento</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Boletim de Notas */}
        <div>
          <h4 style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#a855f7'
          }}>
            <Award size={18} /> BOLETIM ESCOLAR & DESEMPENHO POR DISCIPLINA
          </h4>

          {studentGrades.length === 0 ? (
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Nenhuma nota lançada para este aluno até o momento.
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>Nota 1 (N1)</th>
                    <th>Nota 2 (N2)</th>
                    <th>Nota 3 (N3)</th>
                    <th>Faltas</th>
                    <th>Média Final</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.map((g, idx) => {
                    const avg = calculateAverage(g.evaluations);
                    const isApproved = avg !== null && avg >= 7.0;
                    const isExam = avg !== null && avg >= 5.0 && avg < 7.0;

                    return (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{g.subject}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{g.evaluations?.n1 ?? '-'}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{g.evaluations?.n2 ?? '-'}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{g.evaluations?.n3 ?? '-'}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{g.absences ?? 0}h</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9375rem' }}>
                          {avg !== null ? avg : '-'}
                        </td>
                        <td>
                          {avg === null ? (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pendente</span>
                          ) : isApproved ? (
                            <span style={{ color: '#34d399', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                              <CheckCircle2 size={14} /> Aprovado
                            </span>
                          ) : isExam ? (
                            <span style={{ color: '#fbbf24', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                              <AlertCircle size={14} /> Recuperação
                            </span>
                          ) : (
                            <span style={{ color: '#f87171', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                              <XCircle size={14} /> Reprovado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => {
            onClose();
            onEditStudent(student);
          }}
        >
          <Edit size={16} /> Editar Aluno
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Imprimir Boletim
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
