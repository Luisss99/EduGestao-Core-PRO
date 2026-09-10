import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Save } from 'lucide-react';

export default function ClassFormModal({ isOpen, onClose, onSave, courses = [], classToEdit = null }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [courseId, setCourseId] = useState('');
  const [period, setPeriod] = useState('2026.1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subjectsText, setSubjectsText] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (classToEdit) {
      setName(classToEdit.name || '');
      setCode(classToEdit.code || '');
      setCourseId(classToEdit.courseId || (courses[0]?.id || ''));
      setPeriod(classToEdit.period || '2026.1');
      setStartDate(classToEdit.startDate || '');
      setEndDate(classToEdit.endDate || '');
      setSubjectsText(classToEdit.subjects ? classToEdit.subjects.join(', ') : '');
    } else {
      setName('');
      setCode('');
      setCourseId(courses[0]?.id || '');
      setPeriod('2026.1');
      setStartDate('2026-02-01');
      setEndDate('2026-06-30');
      setSubjectsText('Algoritmos, Programação Web, Banco de Dados');
    }
    setErrors({});
  }, [classToEdit, isOpen, courses]);

  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nome da turma é obrigatório.';
    if (!code.trim()) errs.code = 'Código da turma é obrigatório.';
    if (!courseId) errs.courseId = 'Selecione o curso vinculado.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const subjectsArr = subjectsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    onSave({
      id: classToEdit ? classToEdit.id : `trm-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      courseId,
      period,
      startDate,
      endDate,
      subjects: subjectsArr.length > 0 ? subjectsArr : ['Disciplina Geral']
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={classToEdit ? 'Editar Turma' : 'Abertura de Nova Turma'}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Curso Vinculado *</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={`form-control ${errors.courseId ? 'error' : ''}`}
          >
            <option value="">Selecione um curso...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
            ))}
          </select>
          {errors.courseId && <span className="error-text">{errors.courseId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Nome da Turma *</label>
          <input
            type="text"
            placeholder="Ex: Turma A - Período Matutino"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`form-control ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Código da Turma *</label>
            <input
              type="text"
              placeholder="Ex: TURMA-2026.1-A"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={`form-control ${errors.code ? 'error' : ''}`}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {errors.code && <span className="error-text">{errors.code}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Período Letivo / Ano</label>
            <input
              type="text"
              placeholder="Ex: 2026.1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data de Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data de Término</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Disciplinas da Turma (separadas por vírgula)</label>
          <input
            type="text"
            placeholder="Algoritmos, Arquitetura de Software, Banco de Dados"
            value={subjectsText}
            onChange={(e) => setSubjectsText(e.target.value)}
            className="form-control"
          />
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
            <Save size={16} /> {classToEdit ? 'Salvar Alterações' : 'Criar Turma'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
