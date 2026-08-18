'use client';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Calendar, Search } from 'lucide-react';

export default function Topbar() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 z-30 px-8 flex items-center justify-between">
      {/* Search Input Placeholder */}
      <div className="flex items-center gap-3">
        <div className="relative w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, staff, or departments…"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
            readOnly
          />
        </div>
      </div>

      {/* Right User & Status Pill */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono-code">
          <Calendar size={13} className="text-slate-400" />
          <span>{today}</span>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />
        
        {/* Admin Avatar & Profile */}
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {user?.name || 'HR Admin'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono-code">
              {user?.email || 'admin@pramyan.com'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
