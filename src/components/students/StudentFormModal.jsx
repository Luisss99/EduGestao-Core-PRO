import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Camera, User, AlertCircle, Save } from 'lucide-react';
import { formatCPF, validateCPF } from '../../utils/cpfValidator';

export default function StudentFormModal({ isOpen, onClose, onSave, studentToEdit = null, existingCpfs = [] }) {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photo, setPhoto] = useState('');
  const [status, setStatus] = useState('Ativo');
  const [address, setAddress] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studentToEdit) {
      setFullName(studentToEdit.fullName || '');
      setCpf(studentToEdit.cpf || '');
      setEmail(studentToEdit.email || '');
      setPhone(studentToEdit.phone || '');
      setBirthDate(studentToEdit.birthDate || '');
      setPhoto(studentToEdit.photo || '');
      setStatus(studentToEdit.status || 'Ativo');
      setAddress(studentToEdit.address || '');
    } else {
      setFullName('');
      setCpf('');
      setEmail('');
      setPhone('');
      setBirthDate('');
      setPhoto('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80');
      setStatus('Ativo');
      setAddress('');
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errs = {};

    if (!fullName.trim()) {
      errs.fullName = 'O nome completo é obrigatório.';
    }

    if (!cpf) {
      errs.cpf = 'O CPF é obrigatório.';
    } else if (!validateCPF(cpf)) {
      errs.cpf = 'CPF inválido! Por favor, verifique os números digitados.';
    } else {
      // Verifica se o CPF já existe para outro aluno
      const isDuplicate = existingCpfs.some(existingCpf => 
        existingCpf === cpf && (!studentToEdit || studentToEdit.cpf !== cpf)
      );
      if (isDuplicate) {
        errs.cpf = 'Este CPF já está cadastrado para outro aluno.';
      }
    }

    if (!email.trim()) {
      errs.email = 'E-mail é obrigatório.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      id: studentToEdit ? studentToEdit.id : `aln-${Date.now()}`,
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      photo: photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      status,
      address,
      enrolledClassIds: studentToEdit ? studentToEdit.enrolledClassIds : [],
      createdAt: studentToEdit ? studentToEdit.createdAt : new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={studentToEdit ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        {/* Upload de Foto / Avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '16px',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'} 
              alt="Foto do Aluno" 
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--primary)'
              }} 
            />
            <label style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'var(--primary)',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }} title="Alterar foto">
              <Camera size={14} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Foto de Perfil do Aluno</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Envie uma imagem do computador ou informe uma URL pública.
            </p>
            <input
              type="text"
              placeholder="Cole a URL da foto (opcional)"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="form-control"
              style={{ marginTop: '8px', fontSize: '0.75rem', height: '32px' }}
            />
          </div>
        </div>

        {/* Form Fields Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Nome Completo *</label>
            <input
              type="text"
              placeholder="Ex: João da Silva Santos"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`form-control ${errors.fullName ? 'error' : ''}`}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">CPF (Validação Oficial) *</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
              className={`form-control ${errors.cpf ? 'error' : ''}`}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {errors.cpf && <span className="error-text">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Status da Matrícula *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-control"
            >
              <option value="Ativo">Ativo</option>
              <option value="Trancado">Trancado</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">E-mail *</label>
            <input
              type="email"
              placeholder="aluno@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-control ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Telefone / WhatsApp</label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data de Nascimento</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Endereço Residencial</label>
            <input
              type="text"
              placeholder="Rua, Número, Bairro, Cidade - UF"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          justify: 'flex-end',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> {studentToEdit ? 'Salvar Alterações' : 'Cadastrar Aluno'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
