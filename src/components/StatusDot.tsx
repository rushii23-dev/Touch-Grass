import React from 'react';

export type StatusTone = 'emerald' | 'amber' | 'rose' | 'slate';

interface StatusDotProps {
  status?: StatusTone;
  pulse?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusDot({
  status = 'emerald',
  pulse = false,
  label,
  size = 'sm',
}: StatusDotProps) {
  const sizeClasses = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  const toneClasses: Record<StatusTone, { dot: string; ping: string }> = {
    emerald: {
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-400/40',
    },
    amber: {
      dot: 'bg-amber-400',
      ping: 'bg-amber-400/40',
    },
    rose: {
      dot: 'bg-rose-400',
      ping: 'bg-rose-400/40',
    },
    slate: {
      dot: 'bg-zinc-500',
      ping: 'bg-zinc-500/20',
    },
  };

  const currentTone = toneClasses[status];

  return (
    <span className="relative inline-flex items-center justify-center">
      {pulse && (
        <span
          className={`absolute inline-flex rounded-full ${sizeClasses} ${currentTone.ping} animate-ping`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full ${sizeClasses} ${currentTone.dot}`}
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
