import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  GraduationCap, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

export default function StudentList({ 
  students, 
  courses, 
  classes,
  onOpenNewStudent, 
  onViewStudent, 
  onEditStudent, 
  onDeleteStudent,
  searchQuery,
  setSearchQuery
}) {
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [courseFilter, setCourseFilter] = useState('Todos');

  // Filtragem combinada
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.cpf.includes(searchQuery) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || student.status === statusFilter;

    let matchesCourse = true;
    if (courseFilter !== 'Todos') {
      const studentClassObjs = classes.filter(c => student.enrolledClassIds?.includes(c.id));
      matchesCourse = studentClassObjs.some(c => c.courseId === courseFilter);
    }

    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Gestão de Alunos</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Cadastro, atualização de dados, matrículas e histórico acadêmico
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewStudent}>
          <UserPlus size={18} /> Cadastrar Novo Aluno
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Busca Rápida */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por Nome ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Filtro de Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Ativo">Status: Ativo</option>
              <option value="Trancado">Status: Trancado</option>
              <option value="Concluído">Status: Concluído</option>
              <option value="Cancelado">Status: Cancelado</option>
            </select>
          </div>

          {/* Filtro por Curso */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="form-control"
            >
              <option value="Todos">Todos os Cursos</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>CPF</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Turmas Vinculadas</th>
                <th style={{ textAlign: 'right' }}>Ações (CRUD)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum aluno encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const studentClassObjs = classes.filter(c => student.enrolledClassIds?.includes(c.id));
                  return (
                    <tr key={student.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={student.photo} 
                            alt={student.fullName} 
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {student.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                        {student.cpf}
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8125rem' }}>{student.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.phone || '-'}</div>
                      </td>

                      <td>
                        <span className={`badge badge-${student.status.toLowerCase()}`}>
                          {student.status}
                        </span>
                      </td>

                      <td>
                        {studentClassObjs.length === 0 ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Nenhuma</span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {studentClassObjs.map(c => (
                              <span key={c.id} style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: '4px',
                                color: '#818cf8'
                              }}>
                                {c.code}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => onViewStudent(student)}
                            title="Ver Ficha Detalhada / Boletim"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          >
                            <Eye size={14} /> Ficha
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => onEditStudent(student)}
                            title="Editar Aluno"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => onDeleteStudent(student)}
                            title="Excluir Aluno"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
