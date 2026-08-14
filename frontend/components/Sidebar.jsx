'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  LogOut,
  Building2,
  ChevronRight,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/employees', label: 'Employees', icon: Users },
  { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-slate-200 bg-white z-40">
      {/* Workspace Brand Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 text-white font-bold shrink-0 shadow-sm">
            <Building2 size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-slate-900 truncate">Pramyan</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                HR
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">Workforce Console</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-5 flex-1 overflow-y-auto space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono-code">
            Main Menu
          </p>
          <nav className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-slate-900 bg-slate-100 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-slate-400" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout / User Actions */}
      <div className="p-3 border-t border-slate-100">
        <button
          id="logout-btn"
          onClick={logout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut size={16} />
            <span>Sign Out</span>
          </div>
          <span className="text-xs text-slate-400 font-mono-code">
            {user?.role || 'Admin'}
          </span>
        </button>
      </div>
    </aside>
  );
}
