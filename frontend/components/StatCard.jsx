'use client';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  label,
  value,
  sub,
  change,
  isPositive = true,
  icon,
}) {
  return (
    <div className="card-saas p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono-code">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight font-mono-code">
            {value ?? '—'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {sub || 'Current count'}
        </span>
        {change && (
          <div
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono-code font-semibold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
