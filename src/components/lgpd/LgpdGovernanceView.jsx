import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  Download, 
  UserX, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Database
} from 'lucide-react';

export default function LgpdGovernanceView({ 
  students = [], 
  onExportStudentLgpd, 
  onAnonymizeStudent,
  onViewStudent 
}) {
  const totalStudents = students.length;
  const consentedStudents = students.filter(s => s.lgpdConsent?.consentAccepted).length;
  const anonymizedStudents = students.filter(s => s.isAnonymized).length;
  const activeStudentsWithData = totalStudents - anonymizedStudents;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner de Cabeçalho */}
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Governança & Conformidade LGPD</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
              Painel de gestão da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), bases legais e direitos dos titulares.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: 'rgba(52, 211, 153, 0.1)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: '#34d399',
          fontSize: '0.8125rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} /> Sistema em Conformidade
        </div>
      </div>

      {/* Cards de Métricas LGPD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>TOTAL DE TITULARES</span>
            <Users size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px' }}>{totalStudents}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Alunos cadastrados no sistema</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>BASES LEGAIS REGISTRADAS</span>
            <CheckCircle2 size={18} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px', color: '#34d399' }}>{consentedStudents}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {((consentedStudents / (totalStudents || 1)) * 100).toFixed(0)}% com aceite / base jurídica
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>TITULARES ANONIMIZADOS</span>
            <UserX size={18} style={{ color: '#f87171' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px', color: '#f87171' }}>{anonymizedStudents}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Direito ao esquecimento exercido</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>DADOS ATIVOS EM BASE</span>
            <Database size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px', color: '#a855f7' }}>{activeStudentsWithData}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Registros pessoais vigentes</div>
        </div>
      </div>

      {/* Relatório de Princípios e Diretrizes Aplicadas */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={20} style={{ color: '#818cf8' }} /> Princípios da LGPD Incorporados no EduGestão Core
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#818cf8', marginBottom: '6px' }}>1. Finalidade e Adequação (Art. 6º, I e II)</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Todos os dados coletados (CPF, Nome, E-mail) destinam-se exclusivamente para finalidades acadêmicas, emissão de boletins e controle de matrículas.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#a855f7', marginBottom: '6px' }}>2. Direito de Portabilidade (Art. 18, V)</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              O sistema permite a exportação integral do dossiê de dados pessoais e histórico escolar do aluno em formato aberto e estruturado JSON.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f87171', marginBottom: '6px' }}>3. Eliminação e Anonimização (Art. 16)</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Mecanismo irreversível de substituição de dados sensíveis e identificáveis por pseudônimos anônimos mediante solicitação do titular.
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Titulares & Status de Consentimento */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px' }}>
          Gestão de Titulares de Dados & Bases Legais
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Titular (Aluno)</th>
                <th>CPF</th>
                <th>Base Legal Selecionada</th>
                <th>Aceite dos Termos</th>
                <th>Data do Aceite</th>
                <th style={{ textAlign: 'right' }}>Ações LGPD</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{student.cpf}</td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: '#818cf8',
                      borderRadius: '4px',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                      {student.lgpdConsent?.legalBasis || 'Execução de Contrato'}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: student.lgpdConsent?.consentAccepted ? '#34d399' : '#f87171'
                    }}>
                      {student.lgpdConsent?.consentAccepted ? '✓ Aceito' : '✕ Pendente'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {student.lgpdConsent?.consentDate 
                      ? new Date(student.lgpdConsent.consentDate).toLocaleDateString('pt-BR')
                      : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => onExportStudentLgpd(student)}
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        title="Exportar JSON do Titular"
                      >
                        <Download size={14} /> JSON
                      </button>

                      {!student.isAnonymized && (
                        <button 
                          className="btn btn-danger"
                          onClick={() => onAnonymizeStudent(student)}
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          title="Anonimizar dados"
                        >
                          <UserX size={14} /> Anonimizar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
