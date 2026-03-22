import { useState } from 'react';
import { Student, SubjectConfig, Test } from './types';
import { cn } from './lib/utils';
import { Save, Plus, Trash2, Users, BookOpen, Table2, ClipboardList } from 'lucide-react';

interface TeacherInputProps {
  students: Student[];
  subjects: SubjectConfig[];
  tests: Test[];
  onUpdateStudents: (students: Student[]) => void;
  onUpdateSubjects: (subjects: SubjectConfig[]) => void;
  onUpdateTests: (tests: Test[]) => void;
}

export const TeacherInput = ({ 
  students, 
  subjects, 
  tests, 
  onUpdateStudents, 
  onUpdateSubjects,
  onUpdateTests 
}: TeacherInputProps) => {
  const [view, setView] = useState<'marks' | 'manage' | 'tests'>('marks');
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [localSubjects, setLocalSubjects] = useState<SubjectConfig[]>(subjects);
  const [localTests, setLocalTests] = useState<Test[]>(tests);
  const [activeTestId, setActiveTestId] = useState<string | null>(tests[0]?.id || null);

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
      maxMarks: 100,
      date: new Date().toISOString(),
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
  };

  const hasErrors = localStudents.some(student => 
    localSubjects.some(subject => {
      const mark = student.marks[subject.id] || 0;
      return mark < 0 || mark > subject.maxMarks;
    })
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
            onClick={handleSave}
            disabled={hasErrors}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm",
              hasErrors 
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" 
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
          >
            <Save size={18} />
            {hasErrors ? 'Fix Errors' : 'Save All'}
          </button>
        </div>
      </div>

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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Max Marks</label>
                      <input 
                        type="number"
                        className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-lg px-3 py-2 font-mono"
                        value={localTests.find(t => t.id === activeTestId)?.maxMarks || 0}
                        onChange={(e) => handleTestChange(activeTestId, 'maxMarks', parseInt(e.target.value) || 0)}
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
