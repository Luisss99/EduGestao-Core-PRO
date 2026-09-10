import { INITIAL_COURSES, INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_GRADES, MOCK_ADMIN_USER } from './mockData';

const STORAGE_KEYS = {
  COURSES: 'edugestao_courses_v1',
  CLASSES: 'edugestao_classes_v1',
  STUDENTS: 'edugestao_students_v1',
  GRADES: 'edugestao_grades_v1',
  AUTH: 'edugestao_auth_v1',
  THEME: 'edugestao_theme_v1'
};

export function loadStoredData() {
  try {
    const courses = localStorage.getItem(STORAGE_KEYS.COURSES);
    const classes = localStorage.getItem(STORAGE_KEYS.CLASSES);
    const students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const grades = localStorage.getItem(STORAGE_KEYS.GRADES);
    const auth = localStorage.getItem(STORAGE_KEYS.AUTH);

    return {
      courses: courses ? JSON.parse(courses) : INITIAL_COURSES,
      classes: classes ? JSON.parse(classes) : INITIAL_CLASSES,
      students: students ? JSON.parse(students) : INITIAL_STUDENTS,
      grades: grades ? JSON.parse(grades) : INITIAL_GRADES,
      user: auth ? JSON.parse(auth) : MOCK_ADMIN_USER
    };
  } catch (error) {
    console.error('Erro ao carregar dados do LocalStorage:', error);
    return {
      courses: INITIAL_COURSES,
      classes: INITIAL_CLASSES,
      students: INITIAL_STUDENTS,
      grades: INITIAL_GRADES,
      user: MOCK_ADMIN_USER
    };
  }
}

export function saveStateToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar ${key} no LocalStorage:`, error);
  }
}

export function saveAllState({ courses, classes, students, grades }) {
  saveStateToStorage(STORAGE_KEYS.COURSES, courses);
  saveStateToStorage(STORAGE_KEYS.CLASSES, classes);
  saveStateToStorage(STORAGE_KEYS.STUDENTS, students);
  saveStateToStorage(STORAGE_KEYS.GRADES, grades);
}

export function resetStorageToDefaults() {
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(INITIAL_GRADES));
  return {
    courses: INITIAL_COURSES,
    classes: INITIAL_CLASSES,
    students: INITIAL_STUDENTS,
    grades: INITIAL_GRADES
  };
}

export function calculateAverage(evaluations = {}) {
  const vals = Object.values(evaluations).filter(v => v !== null && v !== undefined && v !== '');
  if (vals.length === 0) return null;
  const sum = vals.reduce((acc, curr) => acc + parseFloat(curr), 0);
  return Number((sum / vals.length).toFixed(1));
}

export { STORAGE_KEYS };
