import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    text: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded font-semibold ${
              badge.trend === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : badge.trend === 'down'
                ? 'bg-red-50 text-red-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
