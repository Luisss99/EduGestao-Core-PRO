import React from 'react';
import Modal from '../common/Modal';
import { FileText, ShieldCheck, CheckCircle, Scale, Lock, BookOpen } from 'lucide-react';

export default function TermsOfUseModal({ isOpen, onClose }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Termos de Uso & Política de Privacidade - EduGestão Core" 
      maxWidth="750px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '6px' }}>
        
        {/* Banner de Apresentação */}
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Scale size={28} style={{ color: '#818cf8', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Contrato de Licença e Uso da Plataforma EduGestão
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              Última atualização: 24 de Setembro de 2026 • Em conformidade com a LGPD (Lei nº 13.709/2018)
            </p>
          </div>
        </div>

        {/* Cláusula 1 */}
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={16} /> 1. Objeto e Aceitação dos Termos
          </h5>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Ao acessar e utilizar o <strong>EduGestão Core (PRO)</strong>, o usuário (administrador, secretária ou operador institucional) declara concordar integralmente com as condições estipuladas neste instrumento legal para fins de gestão acadêmica, controle de matrículas e lançamento de notas.
          </p>
        </div>

        {/* Cláusula 2 */}
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={16} /> 2. Responsabilidades do Operador de Dados
          </h5>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            O usuário administrador é responsável por manter a confidencialidade de suas credenciais de acesso, bem como por garantir a veracidade dos dados cadastrais dos alunos e a correta aplicação das bases legais previstas na Lei Geral de Proteção de Dados (LGPD).
          </p>
        </div>

        {/* Cláusula 3 */}
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={16} /> 3. Tratamento de Dados Pessoais & Direitos do Titular (LGPD)
          </h5>
          <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <strong>Finalidade Acadêmica:</strong> Os dados armazenados destinam-se exclusivamente à gestão de cursos, emissão de boletins e controle regulatório educacional.
            </li>
            <li>
              <strong>Portabilidade (Art. 18, V):</strong> O sistema disponibiliza funcionalidade nativa para emissão e download do dossiê de dados pessoais do aluno em formato JSON.
            </li>
            <li>
              <strong>Anonimização e Eliminação (Art. 16):</strong> Mediante solicitação de esquecimento pelo aluno, o sistema permite a substituição irreversível dos dados identificáveis por pseudônimos.
            </li>
          </ul>
        </div>

        {/* Cláusula 4 */}
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FileText size={16} /> 4. Armazenamento e Propriedade Intelectual
          </h5>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Todos os registros e estados salvos no EduGestão Core são armazenados localmente e criptografados pela infraestrutura do navegador do usuário (`localStorage`). O código-fonte e o design da plataforma são protegidos pelas leis de propriedade intelectual vigentes.
          </p>
        </div>

      </div>

      {/* Botões do Rodapé */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.8125rem', fontWeight: 600 }}>
          <CheckCircle size={16} /> Documento Homologado LGPD
        </div>

        <button className="btn btn-primary" onClick={onClose}>
          Entendido / Fechar
        </button>
      </div>
    </Modal>
  );
}
