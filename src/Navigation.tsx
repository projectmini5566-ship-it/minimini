import React from 'react';
import { LayoutDashboard, Table2, PieChart, Settings, Lock, ShoppingCart } from 'lucide-react';
import { cn } from './lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  isLocked?: boolean;
}

const NavItem = ({ icon: Icon, label, active, onClick, isLocked }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left",
      active 
        ? "bg-black text-white shadow-lg" 
        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
    )}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-zinc-400")} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {isLocked && !active && <Lock size={12} className="text-zinc-300" />}
  </button>
);

export const Sidebar = ({ activeTab, setActiveTab, isLoggedIn, isStudentLoggedIn }: { activeTab: string, setActiveTab: (tab: string) => void, isLoggedIn: boolean, isStudentLoggedIn: boolean }) => {
  const isAnyLoggedIn = isLoggedIn || isStudentLoggedIn;
  
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-zinc-200 h-screen sticky top-0 bg-white p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
        </div>
        <h1 className="font-bold text-xl tracking-tight">EduPulse</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem 
          icon={LayoutDashboard} 
          label="Student Pulse" 
          active={activeTab === 'pulse'} 
          onClick={() => setActiveTab('pulse')} 
          isLocked={!isAnyLoggedIn}
        />
        <NavItem 
          icon={Table2} 
          label="Teacher Input" 
          active={activeTab === 'input'} 
          onClick={() => setActiveTab('input')} 
          isLocked={!isLoggedIn}
        />
        <NavItem 
          icon={PieChart} 
          label="Graph View" 
          active={activeTab === 'graph'} 
          onClick={() => setActiveTab('graph')} 
          isLocked={!isAnyLoggedIn}
        />
        <NavItem 
          icon={ShoppingCart} 
          label="Checkout" 
          active={activeTab === 'checkout'} 
          onClick={() => setActiveTab('checkout')} 
        />
      </nav>

      <div className="pt-6 border-t border-zinc-100">
        <NavItem 
          icon={Settings} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
        />
      </div>
    </aside>
  );
};

export const BottomNav = ({ activeTab, setActiveTab, isLoggedIn, isStudentLoggedIn }: { activeTab: string, setActiveTab: (tab: string) => void, isLoggedIn: boolean, isStudentLoggedIn: boolean }) => {
  const isAnyLoggedIn = isLoggedIn || isStudentLoggedIn;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-3 flex justify-between items-center z-50">
      <button 
        onClick={() => setActiveTab('pulse')}
        className={cn("flex flex-col items-center gap-1 relative", activeTab === 'pulse' ? "text-black" : "text-zinc-400")}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">Pulse</span>
        {!isAnyLoggedIn && activeTab !== 'pulse' && (
          <div className="absolute -top-1 -right-1">
            <Lock size={8} className="text-zinc-400" />
          </div>
        )}
      </button>
      <button 
        onClick={() => setActiveTab('input')}
        className={cn("flex flex-col items-center gap-1 relative", activeTab === 'input' ? "text-black" : "text-zinc-400")}
      >
        <Table2 size={20} />
        <span className="text-[10px] font-medium">Input</span>
        {!isLoggedIn && activeTab !== 'input' && (
          <div className="absolute -top-1 -right-1">
            <Lock size={8} className="text-zinc-400" />
          </div>
        )}
      </button>
      <button 
        onClick={() => setActiveTab('graph')}
        className={cn("flex flex-col items-center gap-1 relative", activeTab === 'graph' ? "text-black" : "text-zinc-400")}
      >
        <PieChart size={20} />
        <span className="text-[10px] font-medium">Graph</span>
        {!isAnyLoggedIn && activeTab !== 'graph' && (
          <div className="absolute -top-1 -right-1">
            <Lock size={8} className="text-zinc-400" />
          </div>
        )}
      </button>
      <button 
        onClick={() => setActiveTab('checkout')}
        className={cn("flex flex-col items-center gap-1 relative", activeTab === 'checkout' ? "text-black" : "text-zinc-400")}
      >
        <ShoppingCart size={20} />
        <span className="text-[10px] font-medium">Checkout</span>
      </button>
      <button 
        onClick={() => setActiveTab('settings')}
        className={cn("flex flex-col items-center gap-1", activeTab === 'settings' ? "text-black" : "text-zinc-400")}
      >
        <Settings size={20} />
        <span className="text-[10px] font-medium">Settings</span>
      </button>
    </nav>
  );
};
