import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Chrome, Phone, HelpCircle } from 'lucide-react';
import { cn } from './lib/utils';
import { AppSettings } from './types';

interface FacultyLoginProps {
  onLogin: () => void;
  settings: AppSettings;
}

export const FacultyLogin = ({ onLogin, settings }: FacultyLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMobile, setForgotMobile] = useState('');
  const [recoveredPass, setRecoveredPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Fixed master credentials
      const isFixedAdmin = username === 'admin' && password === '1234';
      
      // Check against settings (username or mobile)
      const isUsernameMatch = username === settings.facultyUsername;
      const isMobileMatch = username === settings.facultyMobile;
      const isPasswordMatch = password === settings.facultyPassword;

      if (isFixedAdmin || ((isUsernameMatch || isMobileMatch) && isPasswordMatch)) {
        onLogin();
      } else {
        setError('Invalid faculty credentials. Please try again.');
      }
    }, 1500);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotMobile === settings.facultyMobile) {
      setRecoveredPass(settings.facultyPassword);
    } else {
      setError('Mobile number not found.');
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[32px] border border-zinc-200 shadow-2xl p-8 md:p-12 space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="text-zinc-900" size={32} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
            <p className="text-zinc-500 text-sm">Enter your registered mobile number to recover your password.</p>
          </div>

          <form onSubmit={handleForgot} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl text-center border border-red-100">
                {error}
              </div>
            )}

            {recoveredPass ? (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-2">
                <p className="text-emerald-900 font-bold text-sm uppercase tracking-wider">Your Password Is:</p>
                <p className="text-3xl font-black text-emerald-600 tracking-widest">{recoveredPass}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="tel" 
                    required
                    value={forgotMobile}
                    onChange={(e) => setForgotMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-2xl text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              {!recoveredPass && (
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10"
                >
                  Recover Password
                </button>
              )}
              <button 
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setRecoveredPass('');
                  setForgotMobile('');
                  setError('');
                }}
                className="w-full bg-zinc-100 text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
              >
                Back to Login
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] border border-zinc-200 shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Faculty Login</h2>
            <p className="text-zinc-500 text-sm">Enter your credentials to access the portal. (Default: admin / 1234)</p>
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
              <label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Username or Mobile</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username or 9876543210"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Password</label>
                <button 
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[10px] font-bold uppercase text-black hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-black/10"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Access Teacher Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-zinc-100 text-center space-y-4">
            <p className="text-xs text-zinc-400">
              Access is restricted to authorized faculty members only.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
