import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, GraduationCap } from 'lucide-react';
import { Student } from './types';

interface StudentLoginProps {
  onLogin: (studentId: string) => void;
  students: Student[];
}

export const StudentLogin = ({ onLogin, students }: StudentLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Find student by name and roll number
      const student = students.find(s => 
        s.name.toLowerCase() === username.trim().toLowerCase() && 
        s.rollNo === password.trim()
      );
      
      if (student) {
        onLogin(student.id);
      } else {
        setError('Invalid credentials. Please enter your Name as username and Roll Number as password.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] border border-zinc-200 shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg -rotate-3">
              <GraduationCap className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Student Login</h2>
            <p className="text-zinc-500 text-sm">Enter your Name and Roll Number to view your marks.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Student Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none focus:ring-2 focus:ring-blue-600 rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Roll Number (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. 201"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none focus:ring-2 focus:ring-blue-600 rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-blue-600/10"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  View My Pulse
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-zinc-100 text-center space-y-4">
            <p className="text-xs text-zinc-400">
              Students can view their performance and curriculum updates here.
            </p>
            <p className="text-xs text-zinc-400">
              Forgot password? <a href="#" className="text-blue-600 font-bold hover:underline">Contact Office</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
