import React from 'react';
import { Briefcase, Search } from 'lucide-react';

interface IntentStatusBadgeProps {
  status: 'Hiring' | 'Looking';
  size?: 'sm' | 'md';
  className?: string;
}

export const IntentStatusBadge: React.FC<IntentStatusBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  const isHiring = status === 'Hiring';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold tracking-tight rounded-md select-none shrink-0 ${
        size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
      } ${
        isHiring
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/50'
          : 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-950/50'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isHiring ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
        }`}
      />
      {isHiring ? (
        <Briefcase className="w-3 h-3 shrink-0" />
      ) : (
        <Search className="w-3 h-3 shrink-0" />
      )}
      <span>{status}</span>
    </span>
  );
};
