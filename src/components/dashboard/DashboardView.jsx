import React, { useState } from 'react';
import MetricCard from './MetricCard';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
  UserPlus, 
  Plus, 
  ArrowRight, 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle 
} from 'lucide-react';
import { calculateAverage } from '../../utils/storage';

export default function DashboardView({ 
  students, 
  courses, 
  classes, 
  grades,
  onNavigate,
  onViewStudent,
  onOpenNewStudent
}) {
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Métricas
  const activeStudentsCount = students.filter(s => s.status === 'Ativo').length;
  const lockedStudentsCount = students.filter(s => s.status === 'Trancado').length;
  const completedStudentsCount = students.filter(s => s.status === 'Concluído').length;
  const canceledStudentsCount = students.filter(s => s.status === 'Cancelado').length;

  const totalCourses = courses.length;
  const totalClasses = classes.length;

  // Cálculo de Média Geral da Escola
  const allGradesList = grades.flatMap(g => Object.values(g.evaluations).filter(v => typeof v === 'number'));
  const overallAvg = allGradesList.length > 0 
    ? (allGradesList.reduce((a, b) => a + b, 0) / allGradesList.length).toFixed(1)
    : '8.5';

  // Alunos filtrados para busca rápida no dashboard
  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
    s.cpf.includes(dashboardSearch)
  ).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        position: 'relative'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
          Bem-vindo ao Portal de Gestão Escolar 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '600px' }}>
          Gerencie matrículas, turmas, cursos e boletins de notas de maneira simplificada e segura.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={onOpenNewStudent}>
            <UserPlus size={18} /> Novo Aluno
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('grades')}>
            <Award size={18} /> Lançar Notas
          </button>
        </div>
      </div>

      {/* Grid de Métricas Rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        <MetricCard 
          title="Alunos Ativos" 
          value={activeStudentsCount} 
          subtext={`Total de ${students.length} cadastrados`}
          icon={Users}
          color="#10b981"
          trend="+12%"
        />
        <MetricCard 
          title="Cursos Ativos" 
          value={totalCourses} 
          subtext="Cargas horárias de 800h a 3600h"
          icon={BookOpen}
          color="#6366f1"
        />
        <MetricCard 
          title="Turmas em Andamento" 
          value={totalClasses} 
          subtext="Período letivo 2026.1"
          icon={GraduationCap}
          color="#06b6d4"
        />
        <MetricCard 
          title="Média Geral da Escola" 
          value={`${overallAvg} / 10`} 
          subtext="Desempenho acadêmico global"
          icon={Award}
          color="#a855f7"
        />
      </div>

      {/* Status Breakdown Bar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)' }}>
          DISTRIBUIÇÃO DE STATUS DE MATRÍCULA
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
            <CheckCircle2 size={24} className="text-emerald-400" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{activeStudentsCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ativos</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
            <Clock size={24} className="text-amber-400" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{lockedStudentsCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trancados</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
            <GraduationCap size={24} className="text-indigo-400" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{completedStudentsCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Concluídos</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
            <XCircle size={24} className="text-rose-400" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{canceledStudentsCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cancelados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Busca Rápida e Tabela Recente */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Alunos Recentes & Busca Rápida</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Pesquise por nome ou CPF para acessar a ficha completa</p>
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Nome ou CPF..."
              value={dashboardSearch}
              onChange={(e) => setDashboardSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.8125rem' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>CPF</th>
                <th>E-mail / Telefone</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Nenhum aluno encontrado para "{dashboardSearch}".
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={student.photo} 
                          alt={student.fullName} 
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cadastrado em {student.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{student.cpf}</td>
                    <td>
                      <div>{student.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.phone}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${student.status.toLowerCase()}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => onViewStudent(student)}
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} /> Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate('students')}
            style={{ fontSize: '0.8125rem' }}
          >
            Ver Todos os Alunos ({students.length}) <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
