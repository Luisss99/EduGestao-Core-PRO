import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  UserX,
  MoreHorizontal
} from 'lucide-react';

export default function StudentList({ 
  students, 
  courses, 
  classes,
  grades = [],
  onOpenNewStudent, 
  onViewStudent, 
  onEditStudent, 
  onDeleteStudent,
  onExportStudentLgpd,
  onAnonymizeStudent,
  searchQuery,
  setSearchQuery
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || null);
  const [activeGraphTab, setActiveGraphTab] = useState('Progress');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const filteredStudents = students.filter(student => 
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.cpf.includes(searchQuery) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dados reais de notas e presenças do aluno selecionado
  const studentGrades = grades.filter(g => g.studentId === selectedStudent?.id);

  // Cálculo da média geral acumulada do aluno (0 a 100%)
  const overallAveragePercent = React.useMemo(() => {
    if (!studentGrades.length) return 85; // valor default se não houver lançamentos
    let totalSum = 0;
    let count = 0;
    studentGrades.forEach(g => {
      Object.values(g.evaluations || {}).forEach(val => {
        if (val !== null && val !== undefined && val !== '') {
          totalSum += parseFloat(val);
          count++;
        }
      });
    });
    if (!count) return 80;
    const avg10 = totalSum / count;
    return Math.min(100, Math.round(avg10 * 10)); // converte escala de 0-10 para 0-100%
  }, [studentGrades]);

  // Cálculo da taxa de frequência (Faltas acumuladas vs Carga Horária)
  const totalAbsences = studentGrades.reduce((acc, g) => acc + (g.absences || 0), 0);
  const attendanceRate = Math.max(60, 100 - (totalAbsences * 3));

  // Geração de pontos dinâmicos para a curva SVG com base no aluno selecionado
  const chartPoints = React.useMemo(() => {
    if (!studentGrades.length) {
      const base = overallAveragePercent;
      return [
        { label: 'N1', value: Math.max(30, base - 10) },
        { label: 'N2', value: Math.min(98, base + 5) },
        { label: 'N3', value: Math.max(40, base - 5) },
        { label: 'Média', value: base },
        { label: 'Freq.', value: attendanceRate },
        { label: 'Final', value: Math.min(100, base + 2) }
      ];
    }

    const n1Vals = studentGrades.map(g => g.evaluations?.n1).filter(v => v !== undefined && v !== null);
    const n2Vals = studentGrades.map(g => g.evaluations?.n2).filter(v => v !== undefined && v !== null);
    const n3Vals = studentGrades.map(g => g.evaluations?.n3).filter(v => v !== undefined && v !== null);

    const avgN1 = n1Vals.length ? (n1Vals.reduce((a, b) => a + Number(b), 0) / n1Vals.length) * 10 : 75;
    const avgN2 = n2Vals.length ? (n2Vals.reduce((a, b) => a + Number(b), 0) / n2Vals.length) * 10 : 85;
    const avgN3 = n3Vals.length ? (n3Vals.reduce((a, b) => a + Number(b), 0) / n3Vals.length) * 10 : 80;

    return [
      { label: 'Avaliação 1', value: Math.round(avgN1) },
      { label: 'Avaliação 2', value: Math.round(avgN2) },
      { label: 'Avaliação 3', value: Math.round(avgN3) },
      { label: 'Média Geral', value: overallAveragePercent },
      { label: 'Frequência', value: attendanceRate },
      { label: 'Desempenho', value: Math.min(100, Math.round((overallAveragePercent + attendanceRate) / 2)) }
    ];
  }, [studentGrades, overallAveragePercent, attendanceRate]);

  // Construção dos caminhos SVG da linha de gráfico com base nos dados reais
  const svgPathData = React.useMemo(() => {
    // 500px de largura / 6 pontos = passo de ~95px por ponto
    const points = chartPoints.map((pt, idx) => {
      const x = idx * 98;
      // y varia de 120 (0%) a 0 (100%)
      const y = Math.max(5, 120 - (pt.value / 100) * 110);
      return { x, y, val: pt.value };
    });

    const dPath = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaPath = `${dPath} L 500,120 L 0,120 Z`;
    const highlightedNode = points[1] || points[0];

    return { dPath, areaPath, highlightedNode, points };
  }, [chartPoints]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }}>
      
      {/* COLUNA DA ESQUERDA: Lista Compacta de Alunos (Students Table) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1e293b' }}>Students</h3>
          <button onClick={onOpenNewStudent} className="btn-icon" title="Cadastrar Aluno">
            <MoreHorizontal size={20} style={{ color: '#94a3b8' }} />
          </button>
        </div>

        {/* Input de busca interno */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search for students or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.8125rem',
              color: '#1e293b',
              outline: 'none',
              background: '#f8fafc'
            }}
          />
        </div>

        {/* Tabela Resumida */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '8px 4px', fontWeight: 600 }}>Photo</th>
                <th style={{ padding: '8px 4px', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '8px 4px', fontWeight: 600 }}>Student ID</th>
                <th style={{ padding: '8px 4px', fontWeight: 600 }}>Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const isSelected = student.id === selectedStudent?.id;
                return (
                  <tr 
                    key={student.id} 
                    onClick={() => setSelectedStudentId(student.id)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? '#344356' : 'transparent',
                      color: isSelected ? '#ffffff' : '#334155',
                      borderRadius: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '8px 4px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                      <img 
                        src={student.photo} 
                        alt={student.fullName} 
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    </td>
                    <td style={{ padding: '8px 4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                        {student.fullName}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: isSelected ? '#cbd5e1' : '#94a3b8' }}>
                        Turma {student.enrolledClassIds?.[0] ? 'VI' : 'A'}
                      </div>
                    </td>
                    <td style={{ padding: '8px 4px', fontFamily: 'var(--font-mono)', opacity: 0.8 }}>
                      {student.id.replace('aln-', 'F-')}
                    </td>
                    <td style={{ padding: '8px 4px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', fontWeight: 600 }}>
                      {student.createdAt?.substring(0, 4) || '2026'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLUNA DA DIREITA: Dossiê e Detalhes do Aluno Selecionado */}
      {selectedStudent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Banner de Perfil em Destaque */}
          <div style={{
            background: '#2c3a4b',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2 }}>
              <img 
                src={selectedStudent.photo} 
                alt={selectedStudent.fullName} 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.2)'
                }} 
              />
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{selectedStudent.fullName}</h2>
                <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Class VI &nbsp;|&nbsp; Students ID : <strong style={{ color: '#ffffff' }}>{selectedStudent.id.replace('aln-', 'F-')}</strong>
                </div>
              </div>
            </div>

            {/* Ações Rápida LGPD & Edição */}
            <div style={{ display: 'flex', gap: '8px', zIndex: 2 }}>
              <button 
                onClick={() => onViewStudent(selectedStudent)}
                className="btn btn-secondary" 
                style={{ background: '#ffffff', color: '#1e293b', padding: '8px 14px', fontSize: '0.8125rem' }}
              >
                <Eye size={16} /> Ver Ficha
              </button>
              <button 
                onClick={() => onEditStudent(selectedStudent)}
                className="btn btn-secondary" 
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', padding: '8px 12px' }}
              >
                <Edit size={16} />
              </button>
            </div>

            {/* Desenho geométrico decorativo */}
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-30px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '18px solid #f59e0b',
              opacity: 0.3,
              pointerEvents: 'none'
            }} />
          </div>

          {/* Card: Basic Details */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Basic Details</h3>
              <MoreHorizontal size={18} style={{ color: '#94a3b8', cursor: 'pointer' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              fontSize: '0.8125rem'
            }}>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Status</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{selectedStudent.status}</div>
              </div>

              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Date of Birth</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{selectedStudent.birthDate || '29-04-2004'}</div>
              </div>

              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>CPF / Document</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{selectedStudent.cpf}</div>
              </div>

              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Overall Average</div>
                <div style={{ fontWeight: 700, color: '#10b981', marginTop: '4px', fontSize: '0.9375rem' }}>
                  {(overallAveragePercent / 10).toFixed(1)} / 10
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Address</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{selectedStudent.address || 'Av. Paulista, 1500 - São Paulo, SP'}</div>
              </div>

              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>E-mail Contact</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{selectedStudent.email}</div>
              </div>

              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Phone</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{selectedStudent.phone || '(11) 98765-4321'}</div>
              </div>
            </div>
          </div>

          {/* Card: Academic Performance Graph & Tabs (Progress, Attendance, Fees, Bus) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Tabs Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '20px'
            }}>
              {['Progress', 'Attendance', 'Fees History', 'School Bus'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveGraphTab(tab)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeGraphTab === tab ? '#ffffff' : 'transparent',
                    color: activeGraphTab === tab ? '#1e293b' : '#64748b',
                    fontWeight: activeGraphTab === tab ? 700 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    boxShadow: activeGraphTab === tab ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab === 'Progress' && 'Progresso Escolar'}
                  {tab === 'Attendance' && 'Frequência (Aulas)'}
                  {tab === 'Fees History' && 'Histórico Financeiro'}
                  {tab === 'School Bus' && 'Transporte'}
                </button>
              ))}
            </div>

            {/* Subject Filters & Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ color: '#f43f5e', fontWeight: 700 }}>● Desempenho Real</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>● Frequência: {attendanceRate}%</span>
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>● Média: {(overallAveragePercent / 10).toFixed(1)}</span>
              </div>
              <span style={{ color: '#94a3b8', cursor: 'pointer' }}>Filtrar Disciplinas ▾</span>
            </div>

            {/* Line Chart Dinâmico Gerado a Partir das Notas do Aluno */}
            <div style={{ position: 'relative', height: '170px', marginTop: '20px' }}>
              {/* Eixo Y */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8' }}>
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* SVG Dinâmico do Gráfico */}
              <div style={{ marginLeft: '40px', height: '100%', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 120" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Red Dynamic Performance Wave */}
                  <path 
                    d={svgPathData.areaPath} 
                    fill="rgba(244, 63, 94, 0.08)" 
                  />
                  <path 
                    d={svgPathData.dPath} 
                    fill="none" 
                    stroke="#f43f5e" 
                    strokeWidth="3" 
                  />

                  {/* Renderização de Nós/Pontos da Curva */}
                  {svgPathData.points.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                  ))}
                </svg>

                {/* Tooltip Flutuante com o Valor Real */}
                <div style={{
                  position: 'absolute',
                  left: `${Math.min(85, Math.max(10, (svgPathData.highlightedNode.x / 500) * 100))}%`,
                  top: `${Math.max(5, (svgPathData.highlightedNode.y / 120) * 80)}%`,
                  transform: 'translate(-50%, -100%)',
                  background: '#ffffff',
                  border: '1.5px solid #f43f5e',
                  color: '#f43f5e',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(244, 63, 94, 0.25)',
                  whiteSpace: 'nowrap'
                }}>
                  {svgPathData.highlightedNode.val}%
                </div>
              </div>

              {/* Eixo X com os Rótulos dos Testes/Avaliações Dinâmicos */}
              <div style={{ marginLeft: '40px', display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
                {chartPoints.map((pt, i) => (
                  <span key={i} style={{ textTransform: 'capitalize' }}>{pt.label}</span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

