import React, { useState, useEffect } from 'react';
import { Award, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { calculateAverage } from '../../utils/storage';

export default function GradeEntryView({ 
  classes = [], 
  students = [], 
  grades = [], 
  onSaveGrades,
  onShowToast 
}) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [localGradesMap, setLocalGradesMap] = useState({});

  const currentClass = classes.find(c => c.id === selectedClassId);

  // Atualiza disciplina quando a turma muda
  useEffect(() => {
    if (currentClass && currentClass.subjects && currentClass.subjects.length > 0) {
      setSelectedSubject(currentClass.subjects[0]);
    } else {
      setSelectedSubject('');
    }
  }, [selectedClassId]);

  // Alunos matriculados na turma selecionada
  const enrolledStudents = students.filter(s => s.enrolledClassIds?.includes(selectedClassId));

  // Carrega ou inicializa as notas locais para a turma e disciplina selecionadas
  useEffect(() => {
    if (!selectedClassId || !selectedSubject) return;

    const map = {};
    enrolledStudents.forEach(student => {
      const existingRecord = grades.find(g => 
        g.studentId === student.id && 
        g.classId === selectedClassId && 
        g.subject === selectedSubject
      );

      map[student.id] = {
        n1: existingRecord?.evaluations?.n1 ?? '',
        n2: existingRecord?.evaluations?.n2 ?? '',
        n3: existingRecord?.evaluations?.n3 ?? '',
        absences: existingRecord?.absences ?? 0
      };
    });

    setLocalGradesMap(map);
  }, [selectedClassId, selectedSubject, grades, enrolledStudents.length]);

  const handleGradeChange = (studentId, field, val) => {
    let numVal = val;
    if (val !== '') {
      numVal = Math.min(10, Math.max(0, parseFloat(val) || 0));
    }

    setLocalGradesMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: numVal
      }
    }));
  };

  const handleSave = () => {
    if (!selectedClassId || !selectedSubject) return;

    const updatedGrades = [...grades];

    Object.entries(localGradesMap).forEach(([studentId, data]) => {
      const existingIdx = updatedGrades.findIndex(g => 
        g.studentId === studentId && 
        g.classId === selectedClassId && 
        g.subject === selectedSubject
      );

      const gradeRecord = {
        studentId,
        classId: selectedClassId,
        subject: selectedSubject,
        evaluations: {
          n1: data.n1 !== '' ? Number(data.n1) : null,
          n2: data.n2 !== '' ? Number(data.n2) : null,
          n3: data.n3 !== '' ? Number(data.n3) : null,
        },
        absences: Number(data.absences || 0)
      };

      if (existingIdx >= 0) {
        updatedGrades[existingIdx] = gradeRecord;
      } else {
        updatedGrades.push(gradeRecord);
      }
    });

    onSaveGrades(updatedGrades);
    onShowToast(`Notas de ${selectedSubject} salvas com sucesso!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Lançamento de Notas & Faltas</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Selecione a turma e disciplina para atualizar os boletins em tempo real
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={!selectedClassId || enrolledStudents.length === 0}>
          <Save size={18} /> Salvar Lançamento
        </button>
      </div>

      {/* Selector Toolbar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">1. Selecione a Turma</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="form-control"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">2. Selecione a Disciplina</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-control"
              disabled={!currentClass || !currentClass.subjects || currentClass.subjects.length === 0}
            >
              {currentClass?.subjects?.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th style={{ width: '110px' }}>Nota 1 (N1)</th>
                <th style={{ width: '110px' }}>Nota 2 (N2)</th>
                <th style={{ width: '110px' }}>Nota 3 (N3)</th>
                <th style={{ width: '100px' }}>Faltas (Horas)</th>
                <th style={{ width: '120px' }}>Média Parcial</th>
                <th style={{ width: '140px' }}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum aluno matriculado nesta turma ainda. Vá até o módulo de Turmas para matricular alunos.
                  </td>
                </tr>
              ) : (
                enrolledStudents.map(student => {
                  const studentData = localGradesMap[student.id] || { n1: '', n2: '', n3: '', absences: 0 };
                  const avg = calculateAverage(studentData);
                  const isApproved = avg !== null && avg >= 7.0;
                  const isExam = avg !== null && avg >= 5.0 && avg < 7.0;

                  return (
                    <tr key={student.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={student.photo} alt={student.fullName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{student.cpf}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="0.0"
                          value={studentData.n1}
                          onChange={(e) => handleGradeChange(student.id, 'n1', e.target.value)}
                          className="form-control"
                          style={{ fontFamily: 'var(--font-mono)', textAlign: 'center' }}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="0.0"
                          value={studentData.n2}
                          onChange={(e) => handleGradeChange(student.id, 'n2', e.target.value)}
                          className="form-control"
                          style={{ fontFamily: 'var(--font-mono)', textAlign: 'center' }}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="0.0"
                          value={studentData.n3}
                          onChange={(e) => handleGradeChange(student.id, 'n3', e.target.value)}
                          className="form-control"
                          style={{ fontFamily: 'var(--font-mono)', textAlign: 'center' }}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={studentData.absences}
                          onChange={(e) => handleGradeChange(student.id, 'absences', e.target.value)}
                          className="form-control"
                          style={{ fontFamily: 'var(--font-mono)', textAlign: 'center' }}
                        />
                      </td>

                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', textAlign: 'center' }}>
                        {avg !== null ? avg : '-'}
                      </td>

                      <td>
                        {avg === null ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Não Lançado</span>
                        ) : isApproved ? (
                          <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} /> Aprovado
                          </span>
                        ) : isExam ? (
                          <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={14} /> Recuperação
                          </span>
                        ) : (
                          <span style={{ color: '#f87171', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={14} /> Reprovado
                          </span>
                        )}
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
