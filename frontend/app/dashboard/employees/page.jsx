'use client';
import { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import EmployeeModal from '@/components/EmployeeModal';
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  X,
  RefreshCw,
  Building,
} from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Legal',
];

export default function EmployeesPage() {
  const {
    employees,
    loading,
    filters,
    toast,
    setFilter,
    resetFilters,
    fetchEmployees,
    saveEmployee,
    deleteEmployee,
  } = useDashboard();

  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }

  // Filter employees locally for instant responsive UI
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(query);
        const matchEmail = emp.email.toLowerCase().includes(query);
        const matchEmpId = emp.employeeId.toLowerCase().includes(query);
        const matchRole = emp.designation.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchEmpId && !matchRole) return false;
      }

      // Department filter
      if (filters.department && emp.department !== filters.department) {
        return false;
      }

      // Status filter
      if (filters.status && emp.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [employees, filters]);

  // Statistics summaries
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const inactiveCount = employees.filter((e) => e.status === 'Inactive').length;

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteEmployee(deleteConfirm.id, deleteConfirm.name);
    setDeleteConfirm(null);
  };

  const exportToCSV = () => {
    if (!employees.length) return;
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Status', 'Date of Joining'];
    const rows = employees.map((e) => [
      e.employeeId,
      `"${e.name}"`,
      e.email,
      `"${e.department}"`,
      `"${e.designation}"`,
      e.status,
      e.dateOfJoining ? new Date(e.dateOfJoining).toISOString().split('T')[0] : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openAdd = () => {
    setEditEmployee(null);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditEmployee(emp);
    setModalOpen(true);
  };

  const hasActiveFilters = Boolean(filters.search || filters.department || filters.status);

  return (
    <div className="space-y-6">
      {/* Floating Toast Notification */}
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {employees.length} Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, search, and filter all registered team members
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            disabled={!employees.length}
            className="btn-secondary text-xs"
            title="Download CSV export"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button id="add-employee-btn" onClick={openAdd} className="btn-primary text-xs">
            <Plus size={15} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card-saas p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Clean Flex Search Input Container with zero overlap */}
        <div className="flex-1 min-w-[260px] flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white shadow-2xs focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all">
          <Search size={15} className="text-slate-400 shrink-0 pointer-events-none" />
          <input
            id="search-employees"
            type="text"
            placeholder="Search by employee name or ID…"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <div className="relative min-w-[180px]">
          <select
            id="filter-department"
            value={filters.department}
            onChange={(e) => setFilter('department', e.target.value)}
            className="input-custom text-xs cursor-pointer py-2"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Segmented Buttons */}
        <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200 p-1 gap-1">
          <button
            onClick={() => setFilter('status', '')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filters.status === ''
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('status', 'Active')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filters.status === 'Active'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('status', 'Inactive')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filters.status === 'Inactive'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inactive
          </button>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn-ghost text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 self-center"
          >
            <X size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Directory Table Card */}
      <div className="card-saas overflow-hidden">
        {loading.employees && !employees.length ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
            <p className="text-xs font-mono-code text-slate-500">Querying employee database…</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <Users size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No employees match criteria</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Try adjusting your search terms or filter selections.
            </p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="btn-secondary text-xs mt-4">
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono-code">
                  <th className="px-6 py-3.5">Staff Member</th>
                  <th className="px-4 py-3.5">Employee ID</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Designation</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date of Joining</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name + Avatar + Email */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{emp.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-mono-code">
                            <Mail size={11} className="text-slate-400" />
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono-code text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                        {emp.employeeId}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Building size={13} className="text-slate-400" />
                        {emp.department}
                      </span>
                    </td>

                    {/* Designation */}
                    <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                      {emp.designation}
                    </td>

                    {/* Status Badge */}
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

                    {/* Date of Joining */}
                    <td className="px-4 py-3.5 font-mono-code text-xs text-slate-500">
                      {new Date(emp.dateOfJoining).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit employee details"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ id: emp._id, name: emp.name })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete employee"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      {modalOpen && (
        <EmployeeModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditEmployee(null);
          }}
          onSave={async (data) => {
            await saveEmployee(data, editEmployee?._id);
          }}
          employee={editEmployee}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 size={20} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Employee?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900">{deleteConfirm.name}</span>? This
                will also remove their associated attendance logs.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary text-xs flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary text-xs flex-1 justify-center bg-rose-600 hover:bg-rose-700 focus:ring-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
