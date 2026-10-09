'use client';

import React from 'react';
import { StatusDot } from './StatusDot';
import { Wind } from 'lucide-react';

interface TelemetryFooterProps {
  isWakeLockSupported: boolean;
  isOrientationSupported: boolean;
}

export function TelemetryFooter({
  isWakeLockSupported,
  isOrientationSupported,
}: TelemetryFooterProps) {
  return (
    <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
      <div className="flex items-center flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <StatusDot status="emerald" pulse />
          <span className="text-zinc-300 font-medium">Audio Engine: Active</span>
        </div>

        <div className="flex items-center gap-2">
          <StatusDot status={isWakeLockSupported ? 'emerald' : 'amber'} />
          <span>
            Wake Lock:{' '}
            <strong className="text-zinc-300 font-normal">
              {isWakeLockSupported ? 'Hardware Active' : 'Fallback'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusDot status={isOrientationSupported ? 'emerald' : 'slate'} />
          <span>
            Gyroscope:{' '}
            <strong className="text-zinc-300 font-normal">
              {isOrientationSupported ? 'Ready' : 'Simulated'}
            </strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
        <Wind className="w-3.5 h-3.5 text-emerald-400/80" />
        <span>Outdoor Walk Sync</span>
      </div>
    </footer>
  );
}
