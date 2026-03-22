import { Student, SubjectConfig, AppSettings, Test } from './types';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, Award, Users, GraduationCap, ClipboardCheck, FileText, BarChart3, Trophy } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface StudentPulseProps {
  students: Student[];
  subjects: SubjectConfig[];
  settings: AppSettings;
  tests: Test[];
  loggedInStudentId: string | null;
}

const calculateGPA = (marks: Student['marks'], subjects: SubjectConfig[]) => {
  if (subjects.length === 0) return "0.00";
  
  let totalObtained = 0;
  let totalMax = 0;
  
  subjects.forEach(sub => {
    totalObtained += marks[sub.id] || 0;
    totalMax += sub.maxMarks;
  });
  
  const percentage = (totalObtained / totalMax) * 100;
  return ((percentage / 100) * 4).toFixed(2); // Scale to 4.0
};

export const StudentPulse = ({ students, subjects, settings, tests, loggedInStudentId }: StudentPulseProps) => {
  const loggedInStudent = students.find(s => s.id === loggedInStudentId);
  
  const averageGPA = students.length > 0 
    ? (students.reduce((acc, s) => acc + parseFloat(calculateGPA(s.marks, subjects)), 0) / students.length).toFixed(2)
    : "0.00";
    
  const upcomingExams = students.filter(s => new Date(s.nextExamDate) > new Date()).length;
  
  // Calculate overall percentage for the logged-in student
  const getOverallPercentage = () => {
    if (!loggedInStudent || subjects.length === 0) return 0;
    let totalObtained = 0;
    let totalMax = 0;
    subjects.forEach(sub => {
      totalObtained += loggedInStudent.marks[sub.id] || 0;
      totalMax += sub.maxMarks;
    });
    return (totalObtained / totalMax) * 100;
  };

  const overallPercentage = getOverallPercentage();
  const getPerformanceZone = () => {
    if (overallPercentage >= 75) return { label: 'Green Zone', color: 'bg-emerald-500', text: 'Excellent Performance', description: 'You are performing exceptionally well. Keep it up!' };
    if (overallPercentage >= 50) return { label: 'Yellow Zone', color: 'bg-amber-500', text: 'Average Performance', description: 'You are doing okay, but there is room for improvement in some subjects.' };
    return { label: 'Red Zone', color: 'bg-red-500', text: 'Needs Improvement', description: 'Your performance is currently below average. Please focus on your weak areas.' };
  };

  const zone = getPerformanceZone();

  const topStudent = [...students].sort((a, b) => {
    const gpaA = parseFloat(calculateGPA(a.marks, subjects));
    const gpaB = parseFloat(calculateGPA(b.marks, subjects));
    return gpaB - gpaA;
  })[0];

  // Filter tests for the logged-in student
  const studentTests = tests.filter(test => test.marks[loggedInStudentId || ''] !== undefined);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">
            {loggedInStudent ? `Welcome, ${loggedInStudent.name}` : 'Student Pulse'}
          </h2>
          <p className="text-zinc-500 text-sm">
            {loggedInStudent 
              ? `Viewing your academic performance for ${settings.academicYear}.` 
              : 'Real-time performance metrics across your classroom.'}
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <GraduationCap size={20} />
            {settings.institutionName}
          </div>
          <p className="text-zinc-400 text-xs">{settings.teacherName} • {settings.academicYear}</p>
        </div>
      </div>

      {loggedInStudent && (
        <div className="space-y-6">
          {/* Performance Zone Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-[32px] border border-white/10 shadow-xl flex flex-col md:flex-row items-center gap-6 text-white ${zone.color}`}
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Award size={32} />
            </div>
            <div className="text-center md:text-left space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{zone.label}</span>
                <span className="hidden md:block opacity-40">•</span>
                <h3 className="text-xl font-bold">{zone.text}</h3>
              </div>
              <p className="text-sm opacity-90 max-w-xl">{zone.description}</p>
            </div>
            <div className="md:ml-auto text-center md:text-right">
              <p className="text-4xl font-black">{overallPercentage.toFixed(0)}%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Overall Score</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Award} 
            label="Your GPA" 
            value={calculateGPA(loggedInStudent.marks, subjects)} 
            subValue="Overall academic standing"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard 
            icon={TrendingUp} 
            label="Class Average" 
            value={averageGPA} 
            subValue="Peer performance comparison"
            color="bg-zinc-50 text-zinc-600"
          />
          <StatCard 
            icon={ClipboardCheck} 
            label="Tests Taken" 
            value={studentTests.length.toString()} 
            subValue="Completed assessments"
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard 
            icon={Trophy} 
            label="Sports Score" 
            value={`${loggedInStudent.sportMarks || 0}/${settings.maxSportsMarks}`} 
            subValue="Extra-curricular performance"
            color="bg-amber-50 text-amber-600"
          />
        </div>
      </div>
    )}

      {!loggedInStudent && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={TrendingUp} 
            label="Class GPA" 
            value={averageGPA} 
            subValue="+0.2 from last month"
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard 
            icon={Calendar} 
            label="Next Exams" 
            value={upcomingExams.toString()} 
            subValue="Scheduled for next week"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard 
            icon={Award} 
            label="Top Performer" 
            value={topStudent?.name || 'N/A'} 
            subValue={`${calculateGPA(topStudent?.marks || {}, subjects)} GPA`}
            color="bg-amber-50 text-amber-600"
          />
          <StatCard 
            icon={Users} 
            label="Total Students" 
            value={students.length.toString()} 
            subValue="Active enrollment"
            color="bg-purple-50 text-purple-600"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject-wise Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Award size={20} className="text-zinc-400" />
            {loggedInStudent ? 'Subject-wise Performance' : 'Class Subject Averages'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-zinc-100">
                  <th className="pb-3 font-semibold text-zinc-500">Subject</th>
                  <th className="pb-3 font-semibold text-zinc-500 text-center">Main Marks</th>
                  <th className="pb-3 font-semibold text-zinc-500 text-center">Test Avg</th>
                  <th className="pb-3 font-semibold text-zinc-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(sub => {
                  const mainMark = loggedInStudent ? (loggedInStudent.marks[sub.id] || 0) : (students.reduce((acc, s) => acc + (s.marks[sub.id] || 0), 0) / students.length);
                  
                  // Calculate test average for this subject
                  const subjectTests = tests.filter(t => t.subjectId === sub.id);
                  let testAvg = 0;
                  if (loggedInStudent) {
                    const studentScores = subjectTests.map(t => t.marks[loggedInStudent.id]).filter(m => m !== undefined);
                    testAvg = studentScores.length > 0 ? studentScores.reduce((a, b) => a + b, 0) / studentScores.length : 0;
                  } else {
                    const allScores = subjectTests.flatMap(t => Object.values(t.marks));
                    testAvg = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
                  }

                  const percentage = (mainMark / sub.maxMarks) * 100;
                  let status = "Excellent";
                  let statusColor = "text-emerald-600 bg-emerald-50";
                  if (percentage < 50) { 
                    status = "Red Zone"; 
                    statusColor = "text-red-600 bg-red-50"; 
                  } else if (percentage < 75) { 
                    status = "Yellow Zone"; 
                    statusColor = "text-amber-600 bg-amber-50"; 
                  } else { 
                    status = "Green Zone"; 
                    statusColor = "text-emerald-600 bg-emerald-50"; 
                  }

                  return (
                    <tr key={sub.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
                      <td className="py-4 font-medium">{sub.label}</td>
                      <td className="py-4 text-center font-mono">{mainMark.toFixed(0)} / {sub.maxMarks}</td>
                      <td className="py-4 text-center font-mono text-zinc-500">{testAvg > 0 ? testAvg.toFixed(1) : '-'}</td>
                      <td className="py-4 text-right">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Scores Section */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText size={20} className="text-zinc-400" />
            {loggedInStudent ? 'Recent Test History' : 'Recent Class Activity'}
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {loggedInStudent ? (
              studentTests.length > 0 ? (
                [...studentTests].reverse().map((test) => (
                  <div key={test.id} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                    <div>
                      <p className="font-bold text-sm">{test.name}</p>
                      <p className="text-xs text-zinc-400">
                        {subjects.find(s => s.id === test.subjectId)?.label} • {new Date(test.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm">
                        {test.marks[loggedInStudentId || '']} / {test.maxMarks}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">
                        {((test.marks[loggedInStudentId || ''] / test.maxMarks) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-400">
                  <p className="text-sm">No specific test scores available yet.</p>
                </div>
              )
            ) : (
              students.slice(0, 10).map((student) => (
                <div key={student.id} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-zinc-400">Roll: {student.rollNo} • Div: {student.div}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded">
                    {calculateGPA(student.marks, subjects)} GPA
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {loggedInStudent && studentTests.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <BarChart3 size={20} className="text-zinc-400" />
            Test Performance Trend
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={studentTests.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => ({
                  name: t.name,
                  score: (t.marks[loggedInStudentId || ''] / t.maxMarks) * 100,
                  fullDate: new Date(t.date).toLocaleDateString()
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
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
                          <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{payload[0].payload.fullDate}</p>
                          <p className="text-sm font-bold text-black mb-1">{label}</p>
                          <div className="flex justify-between gap-4">
                            <span className="text-xs text-zinc-500">Percentage:</span>
                            <span className="text-xs font-bold text-black">{payload[0].value.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#000000" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-black text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-bold text-2xl mb-2">Academic Insight</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              {loggedInStudent 
                ? "Consistency is key. Focus on subjects where your score is below 75% to maintain a strong GPA."
                : "The class is excelling in core subjects. Monitor the performance in newly added subjects to ensure a balanced learning curve."}
            </p>
            <button className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
              View Curriculum
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700" />
        </div>
      </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subValue, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
  >
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <Icon size={20} />
    </div>
    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
    <h4 className="text-3xl font-bold text-zinc-900 mb-1">{value}</h4>
    <p className="text-zinc-400 text-[10px]">{subValue}</p>
  </motion.div>
);
