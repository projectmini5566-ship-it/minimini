export interface SubjectConfig {
  id: string;
  label: string;
  maxMarks: number;
}

export interface Test {
  id: string;
  name: string;
  subjectId: string;
  maxMarks: number;
  date: string;
  marks: Record<string, number>; // key is student id
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  div: string;
  marks: Record<string, number>; // key is subject id
  sportMarks?: number;
  nextExamDate: string;
}

export const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { id: 'em', label: 'Engineering Maths', maxMarks: 100 },
  { id: 'ds', label: 'Data Structures', maxMarks: 100 },
  { id: 'dsgt', label: 'Discrete Structures', maxMarks: 100 },
  { id: 'dlca', label: 'Digital Logic', maxMarks: 100 },
  { id: 'dbms', label: 'Database Management', maxMarks: 100 },
  { id: 'os', label: 'Operating Systems', maxMarks: 100 },
];

export interface AppSettings {
  institutionName: string;
  teacherName: string;
  academicYear: string;
  facultyUsername: string;
  facultyPassword: string;
  facultyMobile: string;
  maxSportsMarks: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  institutionName: 'EduPulse Academy',
  teacherName: 'Ghadigaonkar Sir',
  academicYear: '2025-26',
  facultyUsername: 'ghadigaonkar sir',
  facultyPassword: '5566',
  facultyMobile: '9876543210',
  maxSportsMarks: 100
};
