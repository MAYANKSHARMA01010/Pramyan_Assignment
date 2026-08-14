'use client';
import { useEffect, useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import api from '@/lib/api';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  History,
  Calendar,
  RotateCcw,
  X,
  User,
  Filter,
} from 'lucide-react';

const STATUS_CONFIG = {
  Present: {
    label: 'Present',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-600',
    btnActive: 'bg-emerald-600 text-white font-semibold shadow-xs',
    btnIdle: 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50',
  },
  Absent: {
    label: 'Absent',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-600',
    btnActive: 'bg-rose-600 text-white font-semibold shadow-xs',
    btnIdle: 'text-slate-600 hover:text-rose-700 hover:bg-rose-50',
  },
  'On Leave': {
    label: 'On Leave',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-600',
    btnActive: 'bg-amber-500 text-white font-semibold shadow-xs',
    btnIdle: 'text-slate-600 hover:text-amber-700 hover:bg-amber-50',
  },
};

function StatusPill({ status }) {
  const conf = STATUS_CONFIG[status];
  if (!conf) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono-code bg-slate-100 text-slate-500 border border-slate-200">
        Unmarked
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {conf.label}
    </span>
  );
}

// Sleek Slide-Over Drawer for Employee Attendance History
function AttendanceHistoryDrawer({ employee, isOpen, onClose, onUpdateStatus }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All'); // 'All' | 'Present' | 'On Leave' | 'Absent'

  useEffect(() => {
    if (!employee || !isOpen) return;

    let isMounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/attendance', {
          params: { employeeId: employee._id },
        });
        if (isMounted) {
          setHistory(data.sort((a, b) => b.date.localeCompare(a.date)));
        }
      } catch (err) {
        console.error('Failed to fetch employee history', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const presentCount = history.filter((h) => h.status === 'Present').length;
  const leaveCount = history.filter((h) => h.status === 'On Leave').length;
  const absentCount = history.filter((h) => h.status === 'Absent').length;
  const totalLogged = history.length;
  const attendanceRate = totalLogged > 0 ? Math.round((presentCount / totalLogged) * 100) : 0;

  const filteredHistory = history.filter((h) => {
    if (filter === 'All') return true;
    return h.status === filter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {employee.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono-code">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                      {employee.employeeId}
                    </span>
                    <span>•</span>
                    <span>{employee.department}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Performance Summary Pill Cards */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-center shadow-2xs">
                <p className="text-[10px] font-mono-code uppercase text-slate-400">Rate</p>
                <p className="text-base font-bold font-mono-code text-emerald-700">
                  {attendanceRate}%
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-center shadow-2xs">
                <p className="text-[10px] font-mono-code uppercase text-slate-400">Present</p>
                <p className="text-base font-bold font-mono-code text-slate-900">
                  {presentCount}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-center shadow-2xs">
                <p className="text-[10px] font-mono-code uppercase text-slate-400">Leave</p>
                <p className="text-base font-bold font-mono-code text-amber-600">
                  {leaveCount}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-center shadow-2xs">
                <p className="text-[10px] font-mono-code uppercase text-slate-400">Absent</p>
                <p className="text-base font-bold font-mono-code text-rose-600">
                  {absentCount}
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center rounded-lg bg-slate-200/70 p-1 gap-1 mt-4">
              {[
                { id: 'All', label: `All (${totalLogged})` },
                { id: 'Present', label: `Present (${presentCount})` },
                { id: 'On Leave', label: `Leave (${leaveCount})` },
                { id: 'Absent', label: `Absent (${absentCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    filter === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline List Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-2.5 text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono-code">Fetching attendance timeline from database…</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4 space-y-2 text-slate-400">
                <Clock size={28} className="opacity-40" />
                <p className="text-xs font-medium">No records match the selected filter</p>
              </div>
            ) : (
              filteredHistory.map((rec) => {
                const dateObj = new Date(rec.date + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const fullDateStr = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={rec._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200/60 border border-slate-200 flex flex-col items-center justify-center font-mono-code leading-none">
                        <span className="text-[9px] uppercase font-bold text-slate-500">{dayName}</span>
                        <span className="text-xs font-bold text-slate-800">{dateObj.getDate()}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 font-mono-code">
                          {rec.date}
                        </p>
                        <p className="text-[11px] text-slate-500">{fullDateStr}</p>
                      </div>
                    </div>

                    <StatusPill status={rec.status} />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-mono-code text-slate-500">
              {totalLogged} Total Days Logged
            </span>
            <button onClick={onClose} className="btn-secondary text-xs px-4">
              Close Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const {
    employees,
    attendanceMap,
    selectedDate,
    loading,
    toast,
    fetchEmployees,
    fetchAttendance,
    markAttendance,
    setDate,
  } = useDashboard();

  const [selectedDrawerEmp, setSelectedDrawerEmp] = useState(null);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    fetchEmployees({ status: 'Active' });
  }, [fetchEmployees]);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

  const activeEmployees = employees.filter((e) => e.status === 'Active');

  const handleMark = async (empId, status, empName) => {
    setSaving((s) => ({ ...s, [empId]: true }));
    try {
      await markAttendance(empId, status, empName);
    } finally {
      setSaving((s) => ({ ...s, [empId]: false }));
    }
  };

  const shiftDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  // Metrics computed from current attendanceMap
  const presentCount = Object.values(attendanceMap).filter((s) => s === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'Absent').length;
  const leaveCount = Object.values(attendanceMap).filter((s) => s === 'On Leave').length;
  const markedCount = Object.keys(attendanceMap).length;
  const totalEmployees = activeEmployees.length;
  const completionRate = totalEmployees > 0 ? Math.round((markedCount / totalEmployees) * 100) : 0;
  const presentRate = markedCount > 0 ? Math.round((presentCount / markedCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Floating Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold shadow-xl border transition-all ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Date Navigation & Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daily Attendance Tracking</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {presentCount} Present
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Live roll call for <span className="text-slate-700 font-semibold font-mono-code">{selectedDate}</span> across {totalEmployees} active team members
          </p>
        </div>

        {/* Date Selector Strip */}
        <div className="flex items-center rounded-xl bg-white border border-slate-200 p-1.5 shadow-xs">
          <button
            onClick={() => shiftDate(-1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2 px-3">
            <Calendar size={14} className="text-slate-600" />
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-xs font-mono-code font-bold text-slate-900 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => shiftDate(1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>

          {selectedDate !== todayStr && (
            <button
              onClick={() => setDate(todayStr)}
              className="ml-2 px-2.5 py-1 rounded-lg text-[11px] font-mono-code font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw size={11} /> Today
            </button>
          )}
        </div>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-saas p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 font-mono-code font-bold">
            {presentCount}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Present</p>
            <p className="text-sm font-bold text-slate-900 font-mono-code">
              {presentRate}% of logged
            </p>
          </div>
        </div>

        <div className="card-saas p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 font-mono-code font-bold">
            {leaveCount}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">On Leave</p>
            <p className="text-sm font-bold text-slate-900 font-mono-code">Approved PTO</p>
          </div>
        </div>

        <div className="card-saas p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 font-mono-code font-bold">
            {absentCount}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Absent</p>
            <p className="text-sm font-bold text-slate-900 font-mono-code">Unplanned</p>
          </div>
        </div>

        <div className="card-saas p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-mono-code font-bold">
            {completionRate}%
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Logged</p>
            <p className="text-sm font-bold text-slate-900 font-mono-code">
              {markedCount}/{totalEmployees} Staff
            </p>
          </div>
        </div>
      </div>

      {/* Main Full-Width Staff Roll Call Table */}
      <div className="card-saas overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Staff Roll Call • <span className="font-mono-code text-slate-700">{selectedDate}</span>
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono-code font-medium">
            {totalEmployees} Active Employees
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono-code">
                <th className="px-6 py-3.5">Employee Name & ID</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Current Status</th>
                <th className="px-4 py-3.5 text-center">Quick Toggle</th>
                <th className="px-6 py-3.5 text-right">Historical Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading.attendance ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-mono-code">Loading attendance sheet from database…</p>
                    </div>
                  </td>
                </tr>
              ) : activeEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 text-xs">
                    No active employees registered in database.
                  </td>
                </tr>
              ) : (
                activeEmployees.map((emp) => {
                  const currentStatus = attendanceMap[emp._id];
                  const isSaving = saving[emp._id];

                  return (
                    <tr
                      key={emp._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Name + ID */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{emp.name}</p>
                            <p className="text-xs font-mono-code text-slate-500">{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">
                        {emp.department}
                      </td>

                      {/* Status Pill */}
                      <td className="px-4 py-3.5">
                        <StatusPill status={currentStatus} />
                      </td>

                      {/* Segmented Quick Status Buttons */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex rounded-lg bg-slate-100 border border-slate-200 p-1 gap-1">
                          {Object.entries(STATUS_CONFIG).map(([st, conf]) => {
                            const isActive = currentStatus === st;
                            return (
                              <button
                                key={st}
                                onClick={() => handleMark(emp._id, st, emp.name)}
                                disabled={isSaving}
                                className={`px-3 py-1 rounded-md text-xs transition-all ${
                                  isActive ? conf.btnActive : conf.btnIdle
                                }`}
                                title={`Mark as ${st}`}
                              >
                                {conf.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* History Trigger Button */}
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedDrawerEmp(emp)}
                          className="btn-secondary text-xs px-3 py-1 gap-1.5"
                        >
                          <History size={13} />
                          <span>View History</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Drawer for Employee Attendance History */}
      <AttendanceHistoryDrawer
        employee={selectedDrawerEmp}
        isOpen={Boolean(selectedDrawerEmp)}
        onClose={() => setSelectedDrawerEmp(null)}
      />
    </div>
  );
}
