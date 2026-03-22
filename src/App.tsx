/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar, BottomNav } from './Navigation';
import { StudentPulse } from './StudentPulse';
import { TeacherInput } from './TeacherInput';
import { GraphView } from './GraphView';
import { FacultyLogin } from './FacultyLogin';
import { StudentLogin } from './StudentLogin';
import { Student, SubjectConfig, Test, AppSettings, DEFAULT_SUBJECTS, DEFAULT_SETTINGS } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { SettingsView } from './SettingsView';
import { CheckoutForm } from './CheckoutForm';

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    rollNo: '201',
    div: 'A',
    marks: { em: 85, ds: 92, dsgt: 78, dlca: 88, dbms: 70, os: 95 },
    nextExamDate: '2026-04-15T09:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    rollNo: '202',
    div: 'A',
    marks: { em: 72, ds: 68, dsgt: 95, dlca: 92, dbms: 98, os: 65 },
    nextExamDate: '2026-04-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'David Chen',
    rollNo: '203',
    div: 'B',
    marks: { em: 98, ds: 96, dsgt: 82, dlca: 75, dbms: 60, os: 99 },
    nextExamDate: '2026-04-15T09:00:00Z',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    rollNo: '204',
    div: 'B',
    marks: { em: 88, ds: 85, dsgt: 88, dlca: 85, dbms: 88, os: 85 },
    nextExamDate: '2026-04-18T11:00:00Z',
  }
];

const BASE_URL = '/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('pulse');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<SubjectConfig[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [loggedInStudentId, setLoggedInStudentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [studentsRes, subjectsRes, testsRes, settingsRes] = await Promise.all([
          fetch(`${BASE_URL}/students`),
          fetch(`${BASE_URL}/subjects`),
          fetch(`${BASE_URL}/tests`),
          fetch(`${BASE_URL}/settings`)
        ]);

        if (studentsRes.ok) setStudents(await studentsRes.json());
        if (subjectsRes.ok) setSubjects(await subjectsRes.json());
        if (testsRes.ok) setTests(await testsRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());

      } catch (error) {
        console.error("Failed to fetch data from backend", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Check login status from local storage (or session)
    const savedLogin = localStorage.getItem('edupulse_is_logged_in');
    if (savedLogin === 'true') setIsLoggedIn(true);
    
    const savedStudentLogin = localStorage.getItem('edupulse_is_student_logged_in');
    if (savedStudentLogin === 'true') {
      setIsStudentLoggedIn(true);
      setLoggedInStudentId(localStorage.getItem('edupulse_student_id'));
    }

    // Set up polling to keep data in sync with backend
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStudents = async (updated: Student[]) => {
    setStudents(updated);
    try {
      await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error("Failed to update students on backend", e);
    }
  };

  const handleUpdateSubjects = async (updated: SubjectConfig[]) => {
    setSubjects(updated);
    try {
      await fetch(`${BASE_URL}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error("Failed to update subjects on backend", e);
    }
  };

  const handleUpdateTests = async (updated: Test[]) => {
    setTests(updated);
    try {
      await fetch(`${BASE_URL}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error("Failed to update tests on backend", e);
    }
  };

  const handleUpdateSettings = async (updated: AppSettings) => {
    setSettings(updated);
    try {
      await fetch(`${BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error("Failed to update settings on backend", e);
    }
  };

  const handleClearData = async () => {
    try {
      await fetch(`${BASE_URL}/clear`, { method: 'POST' });
      // Refresh local state
      window.location.reload();
    } catch (e) {
      console.error("Failed to clear data on backend", e);
    }
    localStorage.clear();
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('edupulse_is_logged_in', 'true');
  };

  const handleStudentLogin = (studentId: string) => {
    setIsStudentLoggedIn(true);
    setLoggedInStudentId(studentId);
    localStorage.setItem('edupulse_is_student_logged_in', 'true');
    localStorage.setItem('edupulse_student_id', studentId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsStudentLoggedIn(false);
    setLoggedInStudentId(null);
    localStorage.removeItem('edupulse_is_logged_in');
    localStorage.removeItem('edupulse_is_student_logged_in');
    localStorage.removeItem('edupulse_student_id');
    setActiveTab('pulse');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pulse':
        if (!isStudentLoggedIn && !isLoggedIn) {
          return <StudentLogin onLogin={handleStudentLogin} students={students} />;
        }
        return (
          <StudentPulse 
            students={students} 
            subjects={subjects} 
            settings={settings} 
            tests={tests}
            loggedInStudentId={loggedInStudentId}
          />
        );
      case 'input':
        if (!isLoggedIn) {
          return <FacultyLogin onLogin={handleLogin} settings={settings} />;
        }
        return (
          <TeacherInput 
            students={students} 
            subjects={subjects}
            tests={tests}
            settings={settings}
            onUpdateStudents={handleUpdateStudents} 
            onUpdateSubjects={handleUpdateSubjects}
            onUpdateTests={handleUpdateTests}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      case 'graph':
        if (!isStudentLoggedIn && !isLoggedIn) {
          return <StudentLogin onLogin={handleStudentLogin} students={students} />;
        }
        return <GraphView students={students} subjects={subjects} tests={tests} settings={settings} />;
      case 'settings':
        return (
          <SettingsView 
            settings={settings} 
            onUpdateSettings={handleUpdateSettings} 
            onClearData={handleClearData} 
            isLoggedIn={isLoggedIn}
            isStudentLoggedIn={isStudentLoggedIn}
            onLogout={handleLogout}
          />
        );
      case 'checkout':
        return <CheckoutForm />;
      default:
        return (
          <StudentPulse 
            students={students} 
            subjects={subjects} 
            settings={settings} 
            tests={tests}
            loggedInStudentId={loggedInStudentId}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">Syncing with EduPulse Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9F9F9] text-zinc-900 font-sans selection:bg-black selection:text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isLoggedIn={isLoggedIn} isStudentLoggedIn={isStudentLoggedIn} />
      
      <main className="flex-1 pb-24 md:pb-8">
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <h1 className="font-bold text-lg">EduPulse</h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isLoggedIn={isLoggedIn} isStudentLoggedIn={isStudentLoggedIn} />
    </div>
  );
}

