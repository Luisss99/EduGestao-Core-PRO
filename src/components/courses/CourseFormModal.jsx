import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Save, BookOpen } from 'lucide-react';

export default function CourseFormModal({ isOpen, onClose, onSave, courseToEdit = null }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [workload, setWorkload] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (courseToEdit) {
      setName(courseToEdit.name || '');
      setCode(courseToEdit.code || '');
      setWorkload(courseToEdit.workload || '');
      setDescription(courseToEdit.description || '');
    } else {
      setName('');
      setCode('');
      setWorkload('');
      setDescription('');
    }
    setErrors({});
  }, [courseToEdit, isOpen]);

  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nome do curso é obrigatório.';
    if (!code.trim()) errs.code = 'Código do curso é obrigatório.';
    if (!workload) errs.workload = 'Carga horária é obrigatória.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      id: courseToEdit ? courseToEdit.id : `crs-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      workload: Number(workload),
      description,
      createdAt: courseToEdit ? courseToEdit.createdAt : new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={courseToEdit ? 'Editar Curso' : 'Cadastrar Novo Curso'}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nome do Curso *</label>
          <input
            type="text"
            placeholder="Ex: Engenharia de Software"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`form-control ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Código Único *</label>
            <input
              type="text"
              placeholder="Ex: ENG-SOFT"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={`form-control ${errors.code ? 'error' : ''}`}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {errors.code && <span className="error-text">{errors.code}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Carga Horária (Horas) *</label>
            <input
              type="number"
              placeholder="Ex: 1200"
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
              className={`form-control ${errors.workload ? 'error' : ''}`}
            />
            {errors.workload && <span className="error-text">{errors.workload}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Descrição do Curso</label>
          <textarea
            rows={4}
            placeholder="Descreva a ementa, objetivos e perfil dos formandos..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> {courseToEdit ? 'Salvar Alterações' : 'Criar Curso'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
