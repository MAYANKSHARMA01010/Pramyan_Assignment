'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import { useDashboard } from '@/context/DashboardContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  Plus,
  RefreshCw,
  ArrowRight,
  Building,
  TrendingUp,
  Clock,
} from 'lucide-react';

const DEPT_COLORS = [
  '#0f172a', // Slate-900
  '#2563eb', // Blue-600
  '#059669', // Emerald-600
  '#d97706', // Amber-600
  '#7c3aed', // Violet-600
  '#0891b2', // Cyan-600
  '#db2777', // Pink-600
  '#475569', // Slate-600
];

const CustomDeptTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-md text-xs space-y-1">
        <p className="font-semibold text-slate-900">{label} Department</p>
        <div className="flex items-center gap-2 text-slate-700 font-mono-code font-medium">
          <span className="w-2 h-2 rounded-full bg-slate-900" />
          <span>
            {payload[0].value} Team Member{payload[0].value !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomWeeklyTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-md text-xs space-y-1.5 min-w-[160px]">
        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-mono-code">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}:</span>
            </div>
            <span className="font-bold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { stats, employees, loading, error, fetchStats, fetchEmployees } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // '7d' (default) | '28d' | 'department'

  useEffect(() => {
    fetchStats();
    fetchEmployees();
  }, [fetchStats, fetchEmployees]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchEmployees()]);
    setRefreshing(false);
  };

  if (loading.stats && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        <p className="text-xs font-mono-code text-slate-500">
          Loading workforce telemetry from database…
        </p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center max-w-lg mx-auto my-12 space-y-3">
        <p className="text-sm font-semibold text-rose-700">{error}</p>
        <button onClick={handleManualRefresh} className="btn-secondary text-xs">
          <RefreshCw size={14} /> Retry Connection
        </button>
      </div>
    );
  }

  const attendance = stats?.todayAttendance ?? {};
  const pastWeek = stats?.pastWeekData ?? {
    trend: [],
    weeklyAvgRate: 0,
    totalPresentWeek: 0,
    totalLeavesWeek: 0,
    totalAbsentWeek: 0,
    peakDay: '—',
  };
  const past28d = stats?.past28DaysData ?? {
    trend: [],
    avgRate28: 0,
    totalPresent28: 0,
    totalLeaves28: 0,
    totalAbsent28: 0,
    peakDay: '—',
  };

  const totalMarked =
    (attendance.Present ?? 0) + (attendance.Absent ?? 0) + (attendance['On Leave'] ?? 0);
  const recentEmployees = employees.slice(0, 6);

  const activeTrendData = timeRange === '7d' ? pastWeek.trend : past28d.trend;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Workforce telemetry & attendance trends for{' '}
            <span className="text-slate-700 font-semibold font-mono-code">{stats?.today}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="btn-secondary text-xs"
            title="Refresh database statistics"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing…' : 'Refresh'}</span>
          </button>

          <Link href="/dashboard/employees" className="btn-primary text-xs">
            <Plus size={14} />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Headcount"
          value={stats?.totalEmployees}
          sub="Registered staff in DB"
          icon={<Users size={20} />}
        />
        <StatCard
          label="Active Workforce"
          value={stats?.activeEmployees}
          sub={`${stats?.activeRate ?? 0}% active compliance`}
          icon={<UserCheck size={20} />}
        />
        <StatCard
          label="Inactive / Offboarded"
          value={stats?.inactiveEmployees}
          sub={`${stats?.inactiveRate ?? 0}% archived`}
          icon={<UserX size={20} />}
        />
        <StatCard
          label="Present Today"
          value={attendance.Present ?? 0}
          sub={`${stats?.todayAttendanceRate ?? 0}% today's check-ins`}
          icon={<CalendarCheck size={20} />}
        />
      </div>

      {/* Analytics Charts & Today's Attendance Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Analytics Container with Tabs (Past 7 Days default, Past 28 Days, Department Distribution) */}
        <div className="card-saas p-6 xl:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                {timeRange === 'department' ? <Building size={16} /> : <TrendingUp size={16} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {timeRange === '7d'
                    ? 'Past 7-Day Attendance Trend'
                    : timeRange === '28d'
                    ? 'Past 28-Day Attendance Trend'
                    : 'Department Headcount Breakdown'}
                </h3>
                <p className="text-xs text-slate-500">
                  {timeRange === 'department'
                    ? 'Employee headcount across 8 business departments'
                    : 'Daily Present, On Leave, and Absent trends across company'}
                </p>
              </div>
            </div>

            {/* Segmented View Switcher */}
            <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200 p-1 gap-1 self-start sm:self-auto">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  timeRange === '7d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past 7 Days
              </button>
              <button
                onClick={() => setTimeRange('28d')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  timeRange === '28d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past 28 Days
              </button>
              <button
                onClick={() => setTimeRange('department')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  timeRange === 'department'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Departments
              </button>
            </div>
          </div>

          {/* Chart Rendering Area */}
          <div className="py-5">
            {timeRange !== 'department' ? (
              activeTrendData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={activeTrendData}
                    margin={{ top: 10, right: 25, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="leaveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#be123c" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#be123c" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey={timeRange === '28d' ? 'shortLabel' : 'dayLabel'}
                      tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      interval={timeRange === '28d' ? 3 : 0}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomWeeklyTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Present"
                      name="Present"
                      stroke="#059669"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#presentGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="On Leave"
                      name="On Leave"
                      stroke="#d97706"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#leaveGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Absent"
                      name="Absent"
                      stroke="#be123c"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#absentGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-xs">
                  <Clock size={24} className="mb-2 opacity-50" />
                  No attendance logs found for this period
                </div>
              )
            ) : stats?.departmentBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={stats.departmentBreakdown}
                  barSize={32}
                  margin={{ top: 10, right: 25, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="department"
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomDeptTooltip />} cursor={{ fill: 'rgba(15,23,42,0.03)' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.departmentBreakdown.map((_, i) => (
                      <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-xs">
                <Building size={24} className="mb-2 opacity-50" />
                No department records found in database
              </div>
            )}
          </div>

          {/* Chart Legends */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4">
            {timeRange !== 'department' ? (
              <>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>On Leave</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>Absent</span>
                </div>
              </>
            ) : (
              stats?.departmentBreakdown?.map((dept, i) => (
                <div
                  key={dept.department}
                  className="flex items-center gap-1.5 text-xs text-slate-600"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: DEPT_COLORS[i % DEPT_COLORS.length] }}
                  />
                  <span>{dept.department}:</span>
                  <span className="font-mono-code font-bold text-slate-900">{dept.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Attendance Card */}
        <div className="card-saas p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <CalendarCheck size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Attendance</h3>
                <p className="text-xs text-slate-500">Live database check-in count</p>
              </div>
            </div>
            <Link
              href="/dashboard/attendance"
              className="text-xs text-slate-900 hover:text-blue-600 font-semibold flex items-center gap-1"
            >
              Log Sheet <ArrowRight size={12} />
            </Link>
          </div>

          {/* Progress / Status metrics */}
          <div className="py-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">Recorded Today</span>
                <span className="font-mono-code font-bold text-slate-900">
                  {totalMarked} / {stats?.totalEmployees ?? 0} Employees
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex gap-0.5 border border-slate-200/50">
                <div
                  className="bg-emerald-600 transition-all duration-500"
                  style={{
                    width: stats?.totalEmployees
                      ? `${((attendance.Present ?? 0) / stats.totalEmployees) * 100}%`
                      : '0%',
                  }}
                  title={`Present: ${attendance.Present ?? 0}`}
                />
                <div
                  className="bg-amber-500 transition-all duration-500"
                  style={{
                    width: stats?.totalEmployees
                      ? `${((attendance['On Leave'] ?? 0) / stats.totalEmployees) * 100}%`
                      : '0%',
                  }}
                  title={`On Leave: ${attendance['On Leave'] ?? 0}`}
                />
                <div
                  className="bg-rose-500 transition-all duration-500"
                  style={{
                    width: stats?.totalEmployees
                      ? `${((attendance.Absent ?? 0) / stats.totalEmployees) * 100}%`
                      : '0%',
                  }}
                  title={`Absent: ${attendance.Absent ?? 0}`}
                />
              </div>
            </div>

            {/* Individual Breakdown Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-center">
                <p className="text-[11px] font-semibold text-emerald-700">Present</p>
                <p className="text-xl font-bold font-mono-code text-slate-900 mt-0.5">
                  {attendance.Present ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 text-center">
                <p className="text-[11px] font-semibold text-amber-700">On Leave</p>
                <p className="text-xl font-bold font-mono-code text-slate-900 mt-0.5">
                  {attendance['On Leave'] ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 text-center">
                <p className="text-[11px] font-semibold text-rose-700">Absent</p>
                <p className="text-xl font-bold font-mono-code text-slate-900 mt-0.5">
                  {attendance.Absent ?? 0}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Pending check-in</span>
              <span className="font-mono-code font-bold text-slate-900">
                {Math.max(0, (stats?.totalEmployees ?? 0) - totalMarked)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/dashboard/attendance"
              className="w-full btn-secondary text-xs justify-center"
            >
              Open Daily Attendance Sheet
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Team Members Section */}
      <div className="card-saas overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Employee Roster</h3>
            <p className="text-xs text-slate-500">Live records from employee database ({employees.length} total staff)</p>
          </div>
          <Link href="/dashboard/employees" className="btn-secondary text-xs">
            <span>View Full Directory</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono-code">
                <th className="px-6 py-3">Team Member</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono-code text-xs text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">
                      {emp.employeeId}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">{emp.department}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{emp.designation}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === 'Active' ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-xs font-mono-code text-slate-500">
                    {new Date(emp.dateOfJoining).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
