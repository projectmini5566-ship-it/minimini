import { AppSettings } from './types';
import { Save, Trash2, Building2, User, Calendar, Database, LogOut, ShieldCheck, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { cn } from './lib/utils';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClearData: () => void;
  isLoggedIn: boolean;
  isStudentLoggedIn: boolean;
  onLogout: () => void;
}

export const SettingsView = ({ settings, onUpdateSettings, onClearData, isLoggedIn, isStudentLoggedIn, onLogout }: SettingsViewProps) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
  };

  const isAnyLoggedIn = isLoggedIn || isStudentLoggedIn;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Settings</h2>
          <p className="text-zinc-500 text-sm">Customize your EduPulse experience and manage your data.</p>
        </div>
        {isAnyLoggedIn && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <LogOut size={14} />
            Logout
          </button>
        )}
      </div>

      {isLoggedIn ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <p className="text-emerald-900 font-bold">Faculty Verified</p>
            <p className="text-emerald-700/70 text-xs">You have full access to mark entry and curriculum settings.</p>
          </div>
        </div>
      ) : isStudentLoggedIn ? (
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <p className="text-blue-900 font-bold">Student Access</p>
            <p className="text-blue-700/70 text-xs">You can view your performance pulse and curriculum updates.</p>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-100 border border-zinc-200 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-300 rounded-2xl flex items-center justify-center">
            <User className="text-zinc-500" size={24} />
          </div>
          <div>
            <p className="text-zinc-900 font-bold">Guest Mode</p>
            <p className="text-zinc-500 text-xs">Login as faculty or student to enable features.</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm space-y-8">
        <div className="space-y-6">
          <h3 className="font-bold flex items-center gap-2 text-zinc-900">
            <Building2 size={18} />
            Institution Details
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Institution Name</label>
              <input 
                className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                value={localSettings.institutionName}
                onChange={(e) => setLocalSettings({ ...localSettings, institutionName: e.target.value })}
                placeholder="e.g. EduPulse Academy"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Teacher Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl pl-12 pr-4 py-3 font-medium transition-all"
                    value={localSettings.teacherName}
                    onChange={(e) => setLocalSettings({ ...localSettings, teacherName: e.target.value })}
                    placeholder="Ghadigaonkar Sir"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Academic Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl pl-12 pr-4 py-3 font-medium transition-all"
                    value={localSettings.academicYear}
                    onChange={(e) => setLocalSettings({ ...localSettings, academicYear: e.target.value })}
                    placeholder="2025-26"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoggedIn && (
          <div className="pt-8 border-t border-zinc-100 space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-zinc-900">
              <ShieldCheck size={18} />
              Faculty Credentials
            </h3>
            
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-6">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Master Credentials</p>
              <p className="text-zinc-900 text-sm font-medium">Username: <span className="font-bold">admin</span> | Password: <span className="font-bold">1234</span></p>
              <p className="text-zinc-400 text-[10px] mt-1 italic">Note: These master credentials always work even if you change the settings below.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Login Username</label>
                <input 
                  className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                  value={localSettings.facultyUsername}
                  onChange={(e) => setLocalSettings({ ...localSettings, facultyUsername: e.target.value })}
                  placeholder="ghadigaonkar sir"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Mobile Number (for login)</label>
                <input 
                  className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                  value={localSettings.facultyMobile}
                  onChange={(e) => setLocalSettings({ ...localSettings, facultyMobile: e.target.value })}
                  placeholder="9876543210"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Login Password</label>
                <input 
                  type="password"
                  className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                  value={localSettings.facultyPassword}
                  onChange={(e) => setLocalSettings({ ...localSettings, facultyPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Max Sports Marks</label>
                <input 
                  type="number"
                  className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                  value={localSettings.maxSportsMarks}
                  onChange={(e) => setLocalSettings({ ...localSettings, maxSportsMarks: parseInt(e.target.value) || 100 })}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Default Test Max Marks</label>
                <input 
                  type="number"
                  className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl px-4 py-3 font-medium transition-all"
                  value={localSettings.defaultTestMaxMarks}
                  onChange={(e) => setLocalSettings({ ...localSettings, defaultTestMaxMarks: parseInt(e.target.value) || 100 })}
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-zinc-100">
          <button 
            onClick={handleSave}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-black/5"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3 text-red-600">
          <Database size={20} />
          <h3 className="font-bold">Danger Zone</h3>
        </div>
        
        <p className="text-red-600/70 text-sm">
          Clearing all data will permanently remove all students, subjects, and test records from your local storage. This action cannot be undone.
        </p>

        {!showConfirmClear ? (
          <button 
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-100 px-4 py-2 rounded-xl transition-all"
          >
            <Trash2 size={16} />
            Clear All Data
          </button>
        ) : (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <button 
              onClick={onClearData}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Confirm Clear
            </button>
            <button 
              onClick={() => setShowConfirmClear(false)}
              className="text-zinc-500 font-bold text-sm hover:bg-zinc-100 px-4 py-2 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
