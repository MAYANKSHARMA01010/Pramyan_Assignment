'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginSchema } from '@/lib/validations';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const { login, error: authError, clearError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    clearError();
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleFillDemo = () => {
    setForm({
      email: 'admin@pramyan.com',
      password: 'Admin@123',
    });
    setError('');
    clearError();
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    clearError();
    setFieldErrors({});

    // Client-side Zod validation
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const errMap = {};
      result.error.errors.forEach((err) => {
        errMap[err.path[0]] = err.message;
      });
      setFieldErrors(errMap);
      setError(result.error.errors[0]?.message || 'Please check your inputs.');
      return;
    }

    setLoading(true);
    const res = await login(result.data.email, result.data.password);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
    }
    setLoading(false);
  };

  const displayError = error || authError;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-sm mb-1">
            <Building2 size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pramyan HR
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to manage employee records and attendance
          </p>
        </div>

        {/* Login Card */}
        <div className="card-saas p-8 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-mono-code"
              >
                Work Email
              </label>
              <div
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border bg-white shadow-2xs transition-all ${
                  fieldErrors.email
                    ? 'border-rose-400 ring-2 ring-rose-500/10'
                    : 'border-slate-300 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10'
                }`}
              >
                <Mail size={16} className="text-slate-400 shrink-0 select-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@pramyan.com"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 uppercase font-mono-code"
                >
                  Password
                </label>
              </div>
              <div
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border bg-white shadow-2xs transition-all ${
                  fieldErrors.password
                    ? 'border-rose-400 ring-2 ring-rose-500/10'
                    : 'border-slate-300 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10'
                }`}
              >
                <Lock size={16} className="text-slate-400 shrink-0 select-none" />
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 cursor-pointer shrink-0"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Error Message Banner */}
            {displayError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                <AlertCircle size={15} className="shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 text-xs justify-center"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Banner */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Demo Credentials:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-mono-code font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Sparkles size={12} /> Auto-fill
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono-code text-[11px] text-slate-600 space-y-0.5">
              <p>
                Email: <span className="text-slate-900 font-semibold">admin@pramyan.com</span>
              </p>
              <p>
                Pass: <span className="text-slate-900 font-semibold">Admin@123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
