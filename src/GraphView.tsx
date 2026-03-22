import { Student, SubjectConfig, Test, AppSettings } from './types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
  LineChart, Line
} from 'recharts';
import { useState } from 'react';
import { cn } from './lib/utils';
import { ClipboardList, BookOpen, TrendingUp, BarChart3, Trophy } from 'lucide-react';

interface GraphViewProps {
  students: Student[];
  subjects: SubjectConfig[];
  tests: Test[];
  settings: AppSettings;
}

const COLORS = ['#000000', '#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a'];

export const GraphView = ({ students, subjects, tests, settings }: GraphViewProps) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | 'all'>('all');
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const subjectChartData = selectedStudent ? [
    ...subjects.map(sub => {
      const classAvg = students.reduce((acc, s) => acc + (s.marks[sub.id] || 0), 0) / students.length;
      return {
        subject: sub.label,
        score: selectedStudent.marks[sub.id] || 0,
        classAvg: parseFloat(classAvg.toFixed(1)),
        max: sub.maxMarks,
        isSport: false
      };
    }),
    {
      subject: 'Sports',
      score: selectedStudent.sportMarks || 0,
      classAvg: parseFloat((students.reduce((acc, s) => acc + (s.sportMarks || 0), 0) / students.length).toFixed(1)),
      max: settings.maxSportsMarks,
      isSport: true
    }
  ] : [];

  const testChartData = selectedStudent ? tests
    .filter(t => selectedSubjectId === 'all' || t.subjectId === selectedSubjectId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => {
      const scores = Object.values(t.marks);
      const classAvg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const studentScore = t.marks[selectedStudent.id] || 0;
      
      // Normalize to percentage for "normal" comparison
      return {
        name: t.name,
        date: new Date(t.date).toLocaleDateString(),
        score: parseFloat(((studentScore / t.maxMarks) * 100).toFixed(1)),
        classAvg: parseFloat(((classAvg / t.maxMarks) * 100).toFixed(1)),
        rawScore: studentScore,
        max: t.maxMarks,
        subject: subjects.find(s => s.id === t.subjectId)?.label || 'N/A'
      };
    }) : [];

  const [selectedTestId, setSelectedTestId] = useState(tests[0]?.id);
  const selectedTest = tests.find(t => t.id === selectedTestId);
  const classTestPerformanceData = selectedTest ? students.map(s => ({
    name: s.name,
    score: selectedTest.marks[s.id] || 0,
    percentage: parseFloat((( (selectedTest.marks[s.id] || 0) / selectedTest.maxMarks) * 100).toFixed(1))
  })).sort((a, b) => b.score - a.score) : [];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Performance Analysis</h2>
          <p className="text-zinc-500 text-sm">Comparing individual progress and class-wide test results.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <BookOpen size={12} />
              Select Student
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {students.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all border",
                    selectedStudentId === student.id 
                      ? "bg-black text-white border-black shadow-md" 
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  )}
                >
                  <p className="font-bold text-sm">{student.name}</p>
                  <p className={cn("text-[10px]", selectedStudentId === student.id ? "text-zinc-100/50" : "text-zinc-400")}>
                    Roll: {student.rollNo} • Div: {student.div}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <ClipboardList size={12} />
              Analyze Specific Test
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {tests.map(test => (
                <button
                  key={test.id}
                  onClick={() => setSelectedTestId(test.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all border",
                    selectedTestId === test.id 
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md" 
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  )}
                >
                  <p className="font-bold text-sm">{test.name}</p>
                  <p className={cn("text-[10px]", selectedTestId === test.id ? "text-emerald-50" : "text-zinc-400")}>
                    {subjects.find(s => s.id === test.subjectId)?.label} • {new Date(test.date).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Class-wide Test Analysis Section */}
          {selectedTest && (
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" />
                    Class Performance: {selectedTest.name}
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Subject: {subjects.find(s => s.id === selectedTest.subjectId)?.label} | Max Marks: {selectedTest.maxMarks}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Class Avg</p>
                  <p className="text-xl font-mono font-bold">
                    {(Object.values(selectedTest.marks).reduce((a, b) => a + b, 0) / students.length).toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classTestPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      interval={0}
                      tick={{ fontSize: 9, fontWeight: 500, fill: '#71717a' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: 'Marks', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#71717a' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-xl border border-zinc-100">
                              <p className="text-sm font-bold text-black mb-1">{label}</p>
                              <div className="space-y-1">
                                <div className="flex justify-between gap-4">
                                  <span className="text-xs text-zinc-500">Marks:</span>
                                  <span className="text-xs font-bold">{payload[0].value} / {selectedTest.maxMarks}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-xs text-zinc-500">Percentage:</span>
                                  <span className="text-xs font-bold text-emerald-600">{payload[0].payload.percentage}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar name="Marks" dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25}>
                      {classTestPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.percentage >= 75 ? '#10b981' : entry.percentage >= 40 ? '#3b82f6' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedStudent ? (
            <>
              {/* Header Info */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h4 className="text-3xl font-bold">{selectedStudent.name}</h4>
                  <p className="text-zinc-400 text-sm">Roll No: {selectedStudent.rollNo} | Division: {selectedStudent.div}</p>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Avg Score %</p>
                    <p className="text-2xl font-mono font-bold">
                      {subjects.length > 0 
                        ? ((Object.values(selectedStudent.marks).reduce((a, b) => a + b, 0) / subjects.reduce((a, b) => a + b.maxMarks, 0)) * 100).toFixed(1)
                        : "0.0"}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Class Rank</p>
                    <p className="text-2xl font-bold">
                      #{students.map(s => ({
                        id: s.id,
                        avg: Object.values(s.marks).reduce((a, b) => a + b, 0) / subjects.length
                      })).sort((a, b) => b.avg - a.avg).findIndex(s => s.id === selectedStudent.id) + 1}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Subject Performance */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <BarChart3 size={18} />
                    Subject Performance (%)
                  </h3>
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectChartData.map(d => ({
                          ...d,
                          score: parseFloat(((d.score / d.max) * 100).toFixed(1)),
                          classAvg: parseFloat(((d.classAvg / d.max) * 100).toFixed(1))
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="subject" 
                          angle={-45} 
                          textAnchor="end" 
                          interval={0}
                          tick={{ fontSize: 10, fontWeight: 500, fill: '#71717a' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: '#71717a' }}
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f9fafb' }}
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 rounded-xl shadow-xl border border-zinc-100">
                                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{label}</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-xs text-zinc-500">Student:</span>
                                      <span className="text-xs font-bold">{payload[0].value}%</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-xs text-zinc-500">Class Avg:</span>
                                      <span className="text-xs font-bold text-zinc-400">{payload[1].value}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                        <Bar name="Student" dataKey="score" radius={[4, 4, 0, 0]} barSize={20}>
                          {subjectChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isSport ? '#10b981' : '#000000'} />
                          ))}
                        </Bar>
                        <Bar name="Class Avg" dataKey="classAvg" fill="#e4e4e7" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Performance Trend (Line) */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <TrendingUp size={18} />
                    Test Trend (%)
                  </h3>
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={testChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10, fill: '#71717a' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: '#71717a' }}
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 rounded-xl shadow-xl border border-zinc-100">
                                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{payload[0].payload.name}</p>
                                  <p className="text-xs font-bold mb-2">{label}</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-xs text-zinc-500">Percentage:</span>
                                      <span className="text-xs font-bold">{payload[0].value}%</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-xs text-zinc-500">Class Avg:</span>
                                      <span className="text-xs font-bold text-zinc-400">{payload[1].value}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                        <Line 
                          type="monotone" 
                          name="Student" 
                          dataKey="score" 
                          stroke="#000000" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line 
                          type="monotone" 
                          name="Class Avg" 
                          dataKey="classAvg" 
                          stroke="#e4e4e7" 
                          strokeWidth={2} 
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Test Performance Bar Chart */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <ClipboardList size={18} />
                    Test History (Normalized %)
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Filter Subject:</label>
                    <select 
                      className="bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-lg px-3 py-1 text-xs font-medium"
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                    >
                      <option value="all">All Subjects</option>
                      {subjects.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {testChartData.length > 0 ? (
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={testChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          interval={0}
                          tick={{ fontSize: 10, fontWeight: 500, fill: '#71717a' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: '#71717a' }}
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f9fafb' }}
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 rounded-xl shadow-xl border border-zinc-100">
                                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{payload[0].payload.subject}</p>
                                  <p className="text-sm font-bold text-black mb-2">{label}</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-xs text-zinc-500">Student:</span>
                                      <span className="text-xs font-bold">{payload[0].value}% ({payload[0].payload.rawScore} / {payload[0].payload.max})</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-xs text-zinc-500">Class Avg:</span>
                                      <span className="text-xs font-bold text-zinc-400">{payload[1].value}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                        <Bar name="Student" dataKey="score" fill="#000000" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar name="Class Avg" dataKey="classAvg" fill="#e4e4e7" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-400 border-2 border-dashed border-zinc-100 rounded-2xl">
                    <ClipboardList size={32} className="mb-2 opacity-20" />
                    <p className="text-sm italic">No test data available for this selection</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white border border-dashed border-zinc-200 rounded-3xl text-zinc-400">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p className="font-medium italic">Select a student to view analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

