import { Student, SubjectConfig, AppSettings } from './types';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, Award, Users, GraduationCap } from 'lucide-react';

interface StudentPulseProps {
  students: Student[];
  subjects: SubjectConfig[];
  settings: AppSettings;
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

export const StudentPulse = ({ students, subjects, settings }: StudentPulseProps) => {
  const averageGPA = students.length > 0 
    ? (students.reduce((acc, s) => acc + parseFloat(calculateGPA(s.marks, subjects)), 0) / students.length).toFixed(2)
    : "0.00";
    
  const upcomingExams = students.filter(s => new Date(s.nextExamDate) > new Date()).length;
  
  const topStudent = [...students].sort((a, b) => {
    const gpaA = parseFloat(calculateGPA(a.marks, subjects));
    const gpaB = parseFloat(calculateGPA(b.marks, subjects));
    return gpaB - gpaA;
  })[0];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Student Pulse</h2>
          <p className="text-zinc-500 text-sm">Real-time performance metrics across your classroom.</p>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <GraduationCap size={20} />
            {settings.institutionName}
          </div>
          <p className="text-zinc-400 text-xs">{settings.teacherName} • {settings.academicYear}</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {students.slice(0, 5).map((student) => (
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
            ))}
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-bold text-2xl mb-2">Academic Insight</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              The class is excelling in core subjects. Monitor the performance in newly added subjects to ensure a balanced learning curve.
            </p>
            <button className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
              View Curriculum
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700" />
        </div>
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
