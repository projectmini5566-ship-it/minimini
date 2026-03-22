import { useState, useEffect } from 'react';
import { Student, SubjectConfig, Test, AppSettings } from './types';
import { cn } from './lib/utils';
import { Save, Plus, Trash2, Users, BookOpen, Table2, ClipboardList, Trophy, CheckCircle, RefreshCw, Clock } from 'lucide-react';

interface TeacherInputProps {
  students: Student[];
  subjects: SubjectConfig[];
  tests: Test[];
  settings: AppSettings;
  onUpdateStudents: (students: Student[]) => void;
  onUpdateSubjects: (subjects: SubjectConfig[]) => void;
  onUpdateTests: (tests: Test[]) => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const TeacherInput = ({ 
  students, 
  subjects, 
  tests, 
  settings,
  onUpdateStudents, 
  onUpdateSubjects,
  onUpdateTests,
  onUpdateSettings
}: TeacherInputProps) => {
  const [view, setView] = useState<'marks' | 'manage' | 'tests' | 'sports'>('marks');
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [localSubjects, setLocalSubjects] = useState<SubjectConfig[]>(subjects);
  const [localTests, setLocalTests] = useState<Test[]>(tests);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [activeTestId, setActiveTestId] = useState<string | null>(tests[0]?.id || null);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(localStorage.getItem('edupulse_last_saved'));

  // Sync local state with props if they change (e.g. from polling)
  // But only if there are no unsaved changes to avoid overwriting user input
  useEffect(() => {
    const hasUnsavedChanges = 
      JSON.stringify(localStudents) !== JSON.stringify(students) ||
      JSON.stringify(localSubjects) !== JSON.stringify(subjects) ||
      JSON.stringify(localTests) !== JSON.stringify(tests) ||
      JSON.stringify(localSettings) !== JSON.stringify(settings);

    if (!hasUnsavedChanges) {
      setLocalStudents(students);
      setLocalSubjects(subjects);
      setLocalTests(tests);
      setLocalSettings(settings);
    }
  }, [students, subjects, tests, settings]);

  const handleSync = () => {
    setLocalStudents(students);
    setLocalSubjects(subjects);
    setLocalTests(tests);
    setLocalSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // --- Marks Handlers ---
  const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    
    const updated = localStudents.map(s => 
      s.id === studentId 
        ? { ...s, marks: { ...s.marks, [subjectId]: numValue } }
        : s
    );
    setLocalStudents(updated);
  };

  const handleSportMarkChange = (studentId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const updated = localStudents.map(s => 
      s.id === studentId ? { ...s, sportMarks: numValue } : s
    );
    setLocalStudents(updated);
  };

  // --- Student Management Handlers ---
  const handleStudentDetailChange = (studentId: string, field: keyof Student, value: string) => {
    const updated = localStudents.map(s => 
      s.id === studentId ? { ...s, [field]: value } : s
    );
    setLocalStudents(updated);
  };

  const addStudent = () => {
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Student',
      rollNo: '',
      div: '',
      marks: {},
      sportMarks: 0,
      nextExamDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setLocalStudents([...localStudents, newStudent]);
  };

  const deleteStudent = (id: string) => {
    setLocalStudents(localStudents.filter(s => s.id !== id));
  };

  // --- Subject Management Handlers ---
  const handleSubjectChange = (subjectId: string, field: keyof SubjectConfig, value: string | number) => {
    const updated = localSubjects.map(s => 
      s.id === subjectId ? { ...s, [field]: value } : s
    );
    setLocalSubjects(updated);
  };

  const addSubject = () => {
    const newSubject: SubjectConfig = {
      id: Math.random().toString(36).substr(2, 5),
      label: 'New Subject',
      maxMarks: 100
    };
    setLocalSubjects([...localSubjects, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setLocalSubjects(localSubjects.filter(s => s.id !== id));
  };

  // --- Test Management Handlers ---
  const addTest = () => {
    const newTest: Test = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Test',
      subjectId: localSubjects[0]?.id || '',
      maxMarks: localSettings.defaultTestMaxMarks || 100,
      date: new Date().toISOString().split('T')[0],
      marks: {}
    };
    const updated = [...localTests, newTest];
    setLocalTests(updated);
    setActiveTestId(newTest.id);
  };

  const handleTestChange = (testId: string, field: keyof Test, value: any) => {
    const updated = localTests.map(t => 
      t.id === testId ? { ...t, [field]: value } : t
    );
    setLocalTests(updated);
  };

  const handleTestMarkChange = (testId: string, studentId: string, value: string) => {
    const test = localTests.find(t => t.id === testId);
    if (!test) return;
    
    const numValue = parseInt(value) || 0;
    const updated = localTests.map(t => 
      t.id === testId 
        ? { ...t, marks: { ...t.marks, [studentId]: numValue } }
        : t
    );
    setLocalTests(updated);
  };

  const deleteTest = (id: string) => {
    const updated = localTests.filter(t => t.id !== id);
    setLocalTests(updated);
    if (activeTestId === id) {
      setActiveTestId(updated[0]?.id || null);
    }
  };

  const handleSave = () => {
    if (hasErrors) return;
    onUpdateStudents(localStudents);
    onUpdateSubjects(localSubjects);
    onUpdateTests(localTests);
    onUpdateSettings(localSettings);
    
    const now = new Date().toLocaleTimeString();
    setLastSaved(now);
    localStorage.setItem('edupulse_last_saved', now);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const hasErrors = localStudents.some(student => 
    localSubjects.some(subject => {
      const mark = student.marks[subject.id] || 0;
      return mark < 0 || mark > subject.maxMarks;
    }) || (student.sportMarks !== undefined && (student.sportMarks < 0 || student.sportMarks > localSettings.maxSportsMarks))
  ) || localTests.some(test => 
    (Object.values(test.marks) as number[]).some(mark => mark < 0 || mark > test.maxMarks)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Faculty Portal</h2>
          <p className="text-zinc-500 text-sm">Manage your classroom, subjects, and student performance.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setView('marks')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm",
              view === 'marks' ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Table2 size={18} />
            Marks Entry
          </button>
          <button 
            onClick={() => setView('manage')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm",
              view === 'manage' ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Users size={18} />
            Class Management
          </button>
          <button 
            onClick={() => setView('tests')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm",
              view === 'tests' ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <ClipboardList size={18} />
            Tests
          </button>
          <button 
            onClick={() => setView('sports')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm",
              view === 'sports' ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Trophy size={18} />
            Sports
          </button>
          <button 
            onClick={handleSave}
            disabled={hasErrors}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all font-bold text-sm shadow-sm",
              isSaved 
                ? "bg-emerald-500 text-white" 
                : hasErrors 
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-zinc-800 active:scale-95"
            )}
          >
            {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
            {isSaved ? "Saved!" : hasErrors ? "Fix Errors" : "Save All"}
          </button>
          <button 
            onClick={handleSync}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors font-medium text-sm"
            title="Sync with server"
          >
            <RefreshCw size={18} className={cn(isSaved && "animate-spin")} />
            Sync
          </button>
        </div>
      </div>

      {lastSaved && (
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-4">
          <Clock size={12} />
          Last Saved: {lastSaved}
        </div>
      )}

      {view === 'marks' ? (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-600 border-r border-zinc-200 w-16">Roll</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-600 border-r border-zinc-200 w-48">Student Name</th>
                  {localSubjects.map((subject) => (
                    <th key={subject.id} className="px-4 py-3 text-center font-semibold text-zinc-600 border-r border-zinc-200 min-w-[100px]">
                      <div className="flex flex-col">
                        <span className="italic serif">{subject.label}</span>
                        <span className="text-[10px] opacity-50 font-mono">Max: {subject.maxMarks}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {localStudents.map((student) => (
                  <tr key={student.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-2 border-r border-zinc-100 font-mono text-zinc-400">{student.rollNo}</td>
                    <td className="px-4 py-2 border-r border-zinc-100 font-medium">{student.name}</td>
                    {localSubjects.map((subject) => {
                      const mark = student.marks[subject.id] || 0;
                      const isInvalid = mark < 0 || mark > subject.maxMarks;
                      return (
                        <td key={subject.id} className={cn(
                          "px-2 py-2 border-r border-zinc-100 transition-colors",
                          isInvalid && "bg-red-50"
                        )}>
                          <input 
                            type="number" 
                            value={student.marks[subject.id] || 0}
                            onChange={(e) => handleMarkChange(student.id, subject.id, e.target.value)}
                            className={cn(
                              "w-full bg-transparent border-none text-center focus:ring-2 rounded px-1 py-1 font-mono",
                              isInvalid ? "text-red-600 focus:ring-red-500" : "focus:ring-black"
                            )}
                            min="0"
                            max={subject.maxMarks}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : view === 'sports' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sports Performance</h3>
                <p className="text-zinc-500 text-xs">Input extra-curricular achievements for all students.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100">
              <label className="text-xs font-bold uppercase text-zinc-400">Max Sports Marks:</label>
              <input 
                type="number"
                value={localSettings.maxSportsMarks}
                onChange={(e) => setLocalSettings({ ...localSettings, maxSportsMarks: parseInt(e.target.value) || 100 })}
                className="w-16 bg-white border border-zinc-200 rounded px-2 py-1 text-sm font-mono font-bold text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600 border-r border-zinc-200 w-16">Roll</th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600 border-r border-zinc-200 w-48">Student Name</th>
                    <th className="px-4 py-3 text-center font-semibold text-zinc-600">
                      Sports Marks (Max: {localSettings.maxSportsMarks})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {localStudents.map((student) => {
                    const mark = student.sportMarks || 0;
                    const isInvalid = mark < 0 || mark > localSettings.maxSportsMarks;
                    return (
                      <tr key={student.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-2 border-r border-zinc-100 font-mono text-zinc-400">{student.rollNo}</td>
                        <td className="px-4 py-2 border-r border-zinc-100 font-medium">{student.name}</td>
                        <td className={cn(
                          "px-4 py-2 transition-colors",
                          isInvalid && "bg-red-50"
                        )}>
                          <div className="flex items-center justify-center gap-4">
                            <input 
                              type="number" 
                              value={student.sportMarks || 0}
                              onChange={(e) => handleSportMarkChange(student.id, e.target.value)}
                              className={cn(
                                "w-24 bg-zinc-50 border border-zinc-100 text-center focus:ring-2 rounded-lg px-2 py-2 font-mono text-lg font-bold",
                                isInvalid ? "text-red-600 border-red-200 focus:ring-red-500" : "text-emerald-600 focus:ring-emerald-500"
                              )}
                              min="0"
                              max={localSettings.maxSportsMarks}
                            />
                            <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full transition-all duration-500",
                                  isInvalid ? "bg-red-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${Math.min(100, Math.max(0, (mark / localSettings.maxSportsMarks) * 100))}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 w-8">
                              {Math.round((mark / localSettings.maxSportsMarks) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : view === 'manage' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Management */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Users size={18} />
                Students List
              </h3>
              <button onClick={addStudent} className="p-1 hover:bg-zinc-100 rounded text-zinc-600">
                <Plus size={20} />
              </button>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="px-3 py-2 text-left">Roll</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Div</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {localStudents.map(student => (
                    <tr key={student.id} className="border-b border-zinc-100">
                      <td className="px-2 py-1">
                        <input 
                          className="w-12 bg-transparent border-none focus:ring-1 focus:ring-black rounded px-1"
                          value={student.rollNo}
                          onChange={(e) => handleStudentDetailChange(student.id, 'rollNo', e.target.value)}
                          placeholder="00"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-black rounded px-1 font-medium"
                          value={student.name}
                          onChange={(e) => handleStudentDetailChange(student.id, 'name', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input 
                          className="w-8 bg-transparent border-none focus:ring-1 focus:ring-black rounded px-1"
                          value={student.div}
                          onChange={(e) => handleStudentDetailChange(student.id, 'div', e.target.value)}
                          placeholder="A"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <button onClick={() => deleteStudent(student.id)} className="text-zinc-300 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={addStudent}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 border-t border-zinc-100"
              >
                <Plus size={14} />
                Add Student
              </button>
            </div>
          </div>

          {/* Subject Management */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <BookOpen size={18} />
                Subjects & Max Marks
              </h3>
              <button onClick={addSubject} className="p-1 hover:bg-zinc-100 rounded text-zinc-600">
                <Plus size={20} />
              </button>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="px-3 py-2 text-left">Subject Label</th>
                    <th className="px-3 py-2 text-left">Max Marks</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {localSubjects.map(subject => (
                    <tr key={subject.id} className="border-b border-zinc-100">
                      <td className="px-2 py-1">
                        <input 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-black rounded px-1 font-medium"
                          value={subject.label}
                          onChange={(e) => handleSubjectChange(subject.id, 'label', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input 
                          type="number"
                          className="w-20 bg-transparent border-none focus:ring-1 focus:ring-black rounded px-1 font-mono"
                          value={subject.maxMarks}
                          onChange={(e) => handleSubjectChange(subject.id, 'maxMarks', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <button onClick={() => deleteSubject(subject.id)} className="text-zinc-300 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={addSubject}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 border-t border-zinc-100"
              >
                <Plus size={14} />
                Add Subject
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <ClipboardList size={18} />
                Tests List
              </h3>
              <button onClick={addTest} className="p-1 hover:bg-zinc-100 rounded text-zinc-600">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {localTests.map(test => (
                <div 
                  key={test.id}
                  onClick={() => setActiveTestId(test.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all border cursor-pointer group relative",
                    activeTestId === test.id 
                      ? "bg-black text-white border-black shadow-md" 
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{test.name}</p>
                      <p className={cn("text-[10px]", activeTestId === test.id ? "text-zinc-400" : "text-zinc-400")}>
                        {localSubjects.find(s => s.id === test.subjectId)?.label || 'No Subject'} • Max: {test.maxMarks}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTest(test.id); }}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500 hover:text-white",
                        activeTestId === test.id && "text-zinc-400"
                      )}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {localTests.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400">
                  <p className="text-sm">No tests created yet.</p>
                  <button onClick={addTest} className="text-xs font-bold uppercase mt-2 hover:text-black">Create First Test</button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {activeTestId ? (
              <>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Test Name</label>
                      <input 
                        className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-lg px-3 py-2 font-bold"
                        value={localTests.find(t => t.id === activeTestId)?.name || ''}
                        onChange={(e) => handleTestChange(activeTestId, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Subject</label>
                      <select 
                        className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-lg px-3 py-2 font-medium"
                        value={localTests.find(t => t.id === activeTestId)?.subjectId || ''}
                        onChange={(e) => handleTestChange(activeTestId, 'subjectId', e.target.value)}
                      >
                        <option value="">Select Subject</option>
                        {localSubjects.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.label}</option>
                        ))}
                      </select>
                    </div>
                    {localTests.find(t => t.id === activeTestId)?.subjectId && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-zinc-400">Rename Subject</label>
                        <input 
                          className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-lg px-3 py-2 font-bold"
                          value={localSubjects.find(s => s.id === localTests.find(t => t.id === activeTestId)?.subjectId)?.label || ''}
                          onChange={(e) => handleSubjectChange(localTests.find(t => t.id === activeTestId)!.subjectId, 'label', e.target.value)}
                          placeholder="Subject Name"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Max Marks</label>
                      <input 
                        type="number"
                        className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-lg px-3 py-2 font-mono"
                        value={localTests.find(t => t.id === activeTestId)?.maxMarks || 0}
                        onChange={(e) => handleTestChange(activeTestId, 'maxMarks', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Test Date</label>
                      <input 
                        type="date"
                        className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-lg px-3 py-2 font-mono"
                        value={localTests.find(t => t.id === activeTestId)?.date.split('T')[0] || ''}
                        onChange={(e) => handleTestChange(activeTestId, 'date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-600">Roll</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-600">Student Name</th>
                        <th className="px-4 py-3 text-center font-semibold text-zinc-600 w-32">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localStudents.map(student => {
                        const test = localTests.find(t => t.id === activeTestId);
                        const mark = test?.marks[student.id] || 0;
                        const isInvalid = test ? (mark < 0 || mark > test.maxMarks) : false;
                        
                        return (
                          <tr key={student.id} className={cn("border-b border-zinc-100 hover:bg-zinc-50 transition-colors", isInvalid && "bg-red-50")}>
                            <td className="px-4 py-2 font-mono text-zinc-400">{student.rollNo}</td>
                            <td className="px-4 py-2 font-medium">{student.name}</td>
                            <td className="px-4 py-2">
                              <input 
                                type="number"
                                value={mark}
                                onChange={(e) => handleTestMarkChange(activeTestId, student.id, e.target.value)}
                                className={cn(
                                  "w-full bg-transparent border-none text-center focus:ring-2 rounded px-2 py-1 font-mono",
                                  isInvalid ? "text-red-600 focus:ring-red-500" : "focus:ring-black"
                                )}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] bg-white border border-dashed border-zinc-200 rounded-3xl text-zinc-400">
                <ClipboardList size={48} className="mb-4 opacity-20" />
                <p className="font-medium">Select or create a test to enter marks</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
