'use client';
import { useState, useEffect } from 'react';
import { employeeSchema } from '@/lib/validations';
import { X, UserPlus, UserCheck, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Finance',
  'Sales',
  'Marketing',
  'Operations',
  'Design',
  'Legal',
];

const STATUSES = ['Active', 'Inactive'];

const EMPTY = {
  name: '',
  employeeId: '',
  department: '',
  designation: '',
  email: '',
  phone: '',
  dateOfJoining: '',
  status: 'Active',
};

const formatDateForInput = (d) => {
  if (!d) return '';
  try {
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export default function EmployeeModal({ isOpen, onClose, onSave, employee }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (employee) {
        setForm({
          name: employee.name ?? '',
          employeeId: employee.employeeId ?? '',
          department: employee.department ?? '',
          designation: employee.designation ?? '',
          email: employee.email ?? '',
          phone: employee.phone ?? '',
          dateOfJoining: formatDateForInput(employee.dateOfJoining),
          status: employee.status ?? 'Active',
        });
      } else {
        setForm(EMPTY);
      }
      setError('');
      setFieldErrors({});
    }
  }, [isOpen, employee]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side Zod Validation
    const result = employeeSchema.safeParse(form);
    if (!result.success) {
      const errMap = {};
      const issues = result.error?.issues || result.error?.errors || [];
      issues.forEach((err) => {
        if (err.path && err.path[0]) {
          errMap[err.path[0]] = err.message;
        }
      });
      setFieldErrors(errMap);
      setError(issues[0]?.message || 'Please fix validation errors below.');
      return;
    }

    setLoading(true);
    try {
      await onSave(result.data);
      onClose();
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to save employee record.';
      setError(backendMessage);
      const backendErrors = err.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        const backendErrMap = {};
        backendErrors.forEach((e) => {
          if (e.field) backendErrMap[e.field] = e.message;
        });
        setFieldErrors(backendErrMap);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              {employee ? <UserCheck size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {employee ? 'Modify Employee Profile' : 'Register New Employee'}
              </h2>
              <p className="text-xs text-slate-500">
                {employee ? `Updating record for ${employee.employeeId}` : 'Add a team member to the company roster'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form id="employee-form" onSubmit={handleSubmit} noValidate className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emp-name" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="emp-name"
                name="name"
                className={`input-custom ${fieldErrors.name ? 'border-rose-400 focus:border-rose-500' : ''}`}
                placeholder="e.g. Arjun Mehta"
                value={form.name}
                onChange={handleChange}
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="emp-id" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <input
                id="emp-id"
                name="employeeId"
                className={`input-custom font-mono-code ${fieldErrors.employeeId ? 'border-rose-400 focus:border-rose-500' : ''}`}
                placeholder="e.g. EMP001"
                value={form.employeeId}
                onChange={handleChange}
              />
              {fieldErrors.employeeId && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.employeeId}</p>
              )}
            </div>

            <div>
              <label htmlFor="emp-dept" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                id="emp-dept"
                name="department"
                className={`input-custom cursor-pointer ${fieldErrors.department ? 'border-rose-400 focus:border-rose-500' : ''}`}
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {fieldErrors.department && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.department}</p>
              )}
            </div>

            <div>
              <label htmlFor="emp-desig" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Designation / Role <span className="text-rose-500">*</span>
              </label>
              <input
                id="emp-desig"
                name="designation"
                className={`input-custom ${fieldErrors.designation ? 'border-rose-400 focus:border-rose-500' : ''}`}
                placeholder="e.g. Senior Software Engineer"
                value={form.designation}
                onChange={handleChange}
              />
              {fieldErrors.designation && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.designation}</p>
              )}
            </div>

            <div>
              <label htmlFor="emp-email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Corporate Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="emp-email"
                name="email"
                type="email"
                className={`input-custom ${fieldErrors.email ? 'border-rose-400 focus:border-rose-500' : ''}`}
                placeholder="e.g. arjun.mehta@pramyan.com"
                value={form.email}
                onChange={handleChange}
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="emp-phone" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="emp-phone"
                name="phone"
                className={`input-custom font-mono-code ${fieldErrors.phone ? 'border-rose-400 focus:border-rose-500' : ''}`}
                placeholder="e.g. +91-9876543210"
                value={form.phone}
                onChange={handleChange}
              />
              {fieldErrors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="emp-doj" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Date of Joining <span className="text-rose-500">*</span>
              </label>
              <input
                id="emp-doj"
                name="dateOfJoining"
                type="date"
                className={`input-custom font-mono-code cursor-pointer ${fieldErrors.dateOfJoining ? 'border-rose-400 focus:border-rose-500' : ''}`}
                value={form.dateOfJoining}
                onChange={handleChange}
              />
              {fieldErrors.dateOfJoining && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.dateOfJoining}</p>
              )}
            </div>

            <div>
              <label htmlFor="emp-status" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code">
                Account Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="emp-status"
                name="status"
                className="input-custom cursor-pointer"
                value={form.status}
                onChange={handleChange}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button type="button" onClick={onClose} className="btn-secondary text-xs">
            Cancel
          </button>
          <button
            type="submit"
            form="employee-form"
            disabled={loading}
            className="btn-primary text-xs"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Record…</span>
              </>
            ) : employee ? (
              'Save Changes'
            ) : (
              'Register Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
