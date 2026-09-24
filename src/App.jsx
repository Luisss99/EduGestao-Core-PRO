import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Toast from './components/common/Toast';
import ConfirmDialog from './components/common/ConfirmDialog';

import LoginView from './components/auth/LoginView';
import DashboardView from './components/dashboard/DashboardView';
import StudentList from './components/students/StudentList';
import StudentFormModal from './components/students/StudentFormModal';
import StudentDetailModal from './components/students/StudentDetailModal';

import CourseList from './components/courses/CourseList';
import CourseFormModal from './components/courses/CourseFormModal';

import ClassList from './components/classes/ClassList';
import ClassFormModal from './components/classes/ClassFormModal';
import ClassEnrollmentModal from './components/classes/ClassEnrollmentModal';

import GradeEntryView from './components/grades/GradeEntryView';
import LgpdGovernanceView from './components/lgpd/LgpdGovernanceView';
import AdminProfileModal from './components/auth/AdminProfileModal';
import TermsOfUseModal from './components/common/TermsOfUseModal';

import { loadStoredData, saveAllState, resetStorageToDefaults, STORAGE_KEYS, saveStateToStorage } from './utils/storage';

export default function App() {
  const [data, setData] = useState(() => loadStoredData());
  const [currentUser, setCurrentUser] = useState(data.user);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Notifications / Toasts
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);

  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);

  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);

  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [targetClassForEnrollment, setTargetClassForEnrollment] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Sync state to LocalStorage
  useEffect(() => {
    saveAllState(data);
    if (currentUser) {
      saveStateToStorage(STORAGE_KEYS.AUTH, currentUser);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [data, currentUser]);

  // Handle Theme
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth & Admin Profile Handlers
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    showToast(`Bem-vindo, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Você saiu do sistema.', 'info');
  };

  const handleSaveAdminProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    setData(prev => ({ ...prev, user: updatedUser }));
    setIsAdminProfileOpen(false);
    showToast('Perfil do administrador atualizado com sucesso!', 'success');
  };

  const handleDeleteAdminAccount = () => {
    setCurrentUser(null);
    setIsAdminProfileOpen(false);
    showToast('Sua conta de administrador foi excluída e você foi desconectado.', 'info');
  };

  const handleResetData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restaurar Dados Demonstrativos',
      message: 'Deseja restaurar todos os cursos, turmas, alunos e notas para o estado padrão de demonstração? Seus dados editados serão substituídos.',
      onConfirm: () => {
        const fresh = resetStorageToDefaults();
        setData(fresh);
        setCurrentUser(fresh.user);
        setConfirmDialog({ isOpen: false });
        showToast('Dados demonstrativos restaurados com sucesso!', 'info');
      }
    });
  };

  // --- CRUD ALUNOS ---
  const handleSaveStudent = (studentData) => {
    const isEdit = data.students.some(s => s.id === studentData.id);

    let updatedStudents;
    if (isEdit) {
      updatedStudents = data.students.map(s => s.id === studentData.id ? studentData : s);
      showToast(`Aluno ${studentData.fullName} atualizado com sucesso!`, 'success');
    } else {
      updatedStudents = [studentData, ...data.students];
      showToast(`Aluno ${studentData.fullName} cadastrado com sucesso!`, 'success');
    }

    setData(prev => ({ ...prev, students: updatedStudents }));
    setIsStudentFormOpen(false);
    setStudentToEdit(null);
  };

  const handleDeleteStudent = (student) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Registro de Aluno',
      message: `Tem certeza que deseja excluir permanentemente o cadastro do aluno "${student.fullName}" (CPF: ${student.cpf})?`,
      onConfirm: () => {
        const updatedStudents = data.students.filter(s => s.id !== student.id);
        const updatedGrades = data.grades.filter(g => g.studentId !== student.id);

        setData(prev => ({
          ...prev,
          students: updatedStudents,
          grades: updatedGrades
        }));

        setConfirmDialog({ isOpen: false });
        showToast(`Aluno ${student.fullName} removido com sucesso.`, 'info');
      }
    });
  };

  // --- LGPD RECURSOS (PORTABILIDADE & DIREITO AO ESQUECIMENTO) ---
  const handleExportStudentLgpd = (student) => {
    const studentGrades = data.grades.filter(g => g.studentId === student.id);
    const studentClasses = data.classes.filter(c => student.enrolledClassIds?.includes(c.id));

    const exportPayload = {
      termoLGPD: 'Relatório Dossiê do Titular de Dados (Portabilidade LGPD - Lei nº 13.709/2018)',
      dataEmissao: new Date().toISOString(),
      titular: student,
      historicoTurmas: studentClasses.map(c => ({ id: c.id, codigo: c.code, nome: c.name, periodo: c.period })),
      desempenhoAcademico: studentGrades
    };

    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lgpd_dossie_${student.fullName.replace(/\s+/g, '_')}_${student.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Dossiê de dados pessoais do aluno ${student.fullName} exportado em JSON.`, 'success');
  };

  const handleAnonymizeStudent = (student) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Anonimizar Dados Pessoais (LGPD - Direito ao Esquecimento)',
      message: `Atenção: A anonimização do aluno "${student.fullName}" substituirá permanentemente nome, CPF, e-mail, telefone e endereço por identificadores anônimos irreversíveis (ex: ALUNO_ANONIMIZADO_xxx), mantendo apenas o histórico acadêmico para fins regulatórios e estatísticos. Deseja prosseguir?`,
      onConfirm: () => {
        const anonymizedStudent = {
          ...student,
          fullName: `Aluno Anonimizado #${student.id.replace('aln-', '')}`,
          cpf: '000.***.***-00',
          email: `anonimo_${student.id}@lgpd-privacidade.com`,
          phone: '(00) 00000-0000',
          address: '[DADO PESSOAL SUPRIMIDO EM ATENDIMENTO À LGPD]',
          photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
          status: 'Cancelado',
          isAnonymized: true,
          lgpdConsent: {
            ...student.lgpdConsent,
            anonymizedDate: new Date().toISOString()
          }
        };

        const updatedStudents = data.students.map(s => s.id === student.id ? anonymizedStudent : s);
        setData(prev => ({ ...prev, students: updatedStudents }));
        setConfirmDialog({ isOpen: false });
        if (isStudentDetailOpen) setIsStudentDetailOpen(false);
        showToast(`Dados pessoais do aluno anonimizados conforme exigência da LGPD.`, 'info');
      }
    });
  };

  // --- CRUD CURSOS ---
  const handleSaveCourse = (courseData) => {
    const isEdit = data.courses.some(c => c.id === courseData.id);
    let updatedCourses;
    if (isEdit) {
      updatedCourses = data.courses.map(c => c.id === courseData.id ? courseData : c);
      showToast(`Curso ${courseData.name} atualizado!`, 'success');
    } else {
      updatedCourses = [...data.courses, courseData];
      showToast(`Curso ${courseData.name} criado com sucesso!`, 'success');
    }

    setData(prev => ({ ...prev, courses: updatedCourses }));
    setIsCourseFormOpen(false);
    setCourseToEdit(null);
  };

  const handleDeleteCourse = (course) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Curso',
      message: `Deseja excluir o curso "${course.name}"? As turmas e matrículas vinculadas poderão ser afetadas.`,
      onConfirm: () => {
        const updatedCourses = data.courses.filter(c => c.id !== course.id);
        setData(prev => ({ ...prev, courses: updatedCourses }));
        setConfirmDialog({ isOpen: false });
        showToast(`Curso ${course.name} excluído.`, 'info');
      }
    });
  };

  // --- CRUD TURMAS ---
  const handleSaveClass = (classData) => {
    const isEdit = data.classes.some(c => c.id === classData.id);
    let updatedClasses;
    if (isEdit) {
      updatedClasses = data.classes.map(c => c.id === classData.id ? classData : c);
      showToast(`Turma ${classData.name} atualizada!`, 'success');
    } else {
      updatedClasses = [...data.classes, classData];
      showToast(`Turma ${classData.name} aberta com sucesso!`, 'success');
    }

    setData(prev => ({ ...prev, classes: updatedClasses }));
    setIsClassFormOpen(false);
    setClassToEdit(null);
  };

  const handleDeleteClass = (cls) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Turma',
      message: `Deseja encerrar e excluir a turma "${cls.name}"?`,
      onConfirm: () => {
        const updatedClasses = data.classes.filter(c => c.id !== cls.id);
        // Desvincula alunos da turma
        const updatedStudents = data.students.map(s => ({
          ...s,
          enrolledClassIds: s.enrolledClassIds?.filter(id => id !== cls.id) || []
        }));

        setData(prev => ({
          ...prev,
          classes: updatedClasses,
          students: updatedStudents
        }));
        setConfirmDialog({ isOpen: false });
        showToast(`Turma ${cls.name} excluída.`, 'info');
      }
    });
  };

  // --- MATRÍCULAS EM TURMA ---
  const handleEnrollStudent = (studentId, classId) => {
    const updatedStudents = data.students.map(s => {
      if (s.id === studentId) {
        const currentClasses = s.enrolledClassIds || [];
        if (!currentClasses.includes(classId)) {
          return { ...s, enrolledClassIds: [...currentClasses, classId] };
        }
      }
      return s;
    });

    setData(prev => ({ ...prev, students: updatedStudents }));
    showToast('Aluno matriculado na turma com sucesso!', 'success');
  };

  const handleUnenrollStudent = (studentId, classId) => {
    const updatedStudents = data.students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          enrolledClassIds: (s.enrolledClassIds || []).filter(id => id !== classId)
        };
      }
      return s;
    });

    setData(prev => ({ ...prev, students: updatedStudents }));
    showToast('Aluno removido da turma.', 'info');
  };

  // --- NOTAS ---
  const handleSaveGrades = (updatedGrades) => {
    setData(prev => ({ ...prev, grades: updatedGrades }));
  };

  // Se não estiver autenticado, exibe a tela de login
  if (!currentUser) {
    return (
      <>
        <LoginView 
          onLogin={handleLogin} 
          onOpenTerms={() => setIsTermsOpen(true)}
        />
        <TermsOfUseModal 
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Toast Feedback Manager */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Confirm Dialog */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onResetData={handleResetData}
        onOpenProfile={() => setIsAdminProfileOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          user={currentUser}
          onLogout={handleLogout}
          onOpenProfile={() => setIsAdminProfileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (activeTab !== 'students' && activeTab !== 'dashboard') {
              setActiveTab('students');
            }
          }}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <main style={{ marginLeft: '240px', padding: '24px 32px', flex: 1 }}>
          {activeTab === 'dashboard' && (
            <DashboardView 
              students={data.students}
              courses={data.courses}
              classes={data.classes}
              grades={data.grades}
              onNavigate={(tab) => setActiveTab(tab)}
              onViewStudent={(student) => {
                setSelectedStudentForDetail(student);
                setIsStudentDetailOpen(true);
              }}
              onOpenNewStudent={() => {
                setStudentToEdit(null);
                setIsStudentFormOpen(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentList 
              students={data.students}
              courses={data.courses}
              classes={data.classes}
              grades={data.grades}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenNewStudent={() => {
                setStudentToEdit(null);
                setIsStudentFormOpen(true);
              }}
              onViewStudent={(student) => {
                setSelectedStudentForDetail(student);
                setIsStudentDetailOpen(true);
              }}
              onEditStudent={(student) => {
                setStudentToEdit(student);
                setIsStudentFormOpen(true);
              }}
              onDeleteStudent={handleDeleteStudent}
              onExportStudentLgpd={handleExportStudentLgpd}
              onAnonymizeStudent={handleAnonymizeStudent}
            />
          )}

          {activeTab === 'courses' && (
            <CourseList 
              courses={data.courses}
              classes={data.classes}
              onOpenNewCourse={() => {
                setCourseToEdit(null);
                setIsCourseFormOpen(true);
              }}
              onEditCourse={(course) => {
                setCourseToEdit(course);
                setIsCourseFormOpen(true);
              }}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === 'classes' && (
            <ClassList 
              classes={data.classes}
              courses={data.courses}
              students={data.students}
              onOpenNewClass={() => {
                setClassToEdit(null);
                setIsClassFormOpen(true);
              }}
              onEditClass={(cls) => {
                setClassToEdit(cls);
                setIsClassFormOpen(true);
              }}
              onDeleteClass={handleDeleteClass}
              onManageEnrollment={(cls) => {
                setTargetClassForEnrollment(cls);
                setIsEnrollmentOpen(true);
              }}
            />
          )}

          {activeTab === 'grades' && (
            <GradeEntryView 
              classes={data.classes}
              students={data.students}
              grades={data.grades}
              onSaveGrades={handleSaveGrades}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'lgpd' && (
            <LgpdGovernanceView 
              students={data.students}
              onExportStudentLgpd={handleExportStudentLgpd}
              onAnonymizeStudent={handleAnonymizeStudent}
              onViewStudent={(student) => {
                setSelectedStudentForDetail(student);
                setIsStudentDetailOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* MODAIS DO SISTEMA */}

      {/* Modal de Termos de Uso (LGPD) */}
      <TermsOfUseModal 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Modal de Perfil do Administrador */}
      <AdminProfileModal 
        isOpen={isAdminProfileOpen}
        onClose={() => setIsAdminProfileOpen(false)}
        user={currentUser}
        onSaveProfile={handleSaveAdminProfile}
        onDeleteAccount={handleDeleteAdminAccount}
      />

      {/* Modal de Formulário de Aluno */}
      <StudentFormModal 
        isOpen={isStudentFormOpen}
        onClose={() => setIsStudentFormOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        existingCpfs={data.students.map(s => s.cpf)}
      />

      {/* Modal Ficha do Aluno / Boletim Escolar */}
      <StudentDetailModal 
        isOpen={isStudentDetailOpen}
        onClose={() => setIsStudentDetailOpen(false)}
        student={selectedStudentForDetail}
        classes={data.classes}
        courses={data.courses}
        grades={data.grades}
        onEditStudent={(student) => {
          setStudentToEdit(student);
          setIsStudentFormOpen(true);
        }}
        onExportStudentLgpd={handleExportStudentLgpd}
        onAnonymizeStudent={handleAnonymizeStudent}
      />

      {/* Modal Formulário de Curso */}
      <CourseFormModal 
        isOpen={isCourseFormOpen}
        onClose={() => setIsCourseFormOpen(false)}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      {/* Modal Formulário de Turma */}
      <ClassFormModal 
        isOpen={isClassFormOpen}
        onClose={() => setIsClassFormOpen(false)}
        onSave={handleSaveClass}
        courses={data.courses}
        classToEdit={classToEdit}
      />

      {/* Modal Vinculação de Alunos a Turma */}
      <ClassEnrollmentModal 
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        targetClass={targetClassForEnrollment}
        students={data.students}
        onEnrollStudent={handleEnrollStudent}
        onUnenrollStudent={handleUnenrollStudent}
      />
    </div>
  );
}
