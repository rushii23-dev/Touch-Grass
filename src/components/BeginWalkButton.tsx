'use client';

import React from 'react';
import { ArrowRight, Footprints, Loader2 } from 'lucide-react';

interface BeginWalkButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function BeginWalkButton({ onClick, isLoading = false }: BeginWalkButtonProps) {
  return (
    <div className="relative my-8 flex items-center justify-center">
      {/* Calm, quiet meditative breathing halo */}
      <div className="absolute w-56 h-14 rounded-full bg-emerald-500/15 blur-xl pointer-events-none animate-breathe" />

      {/* Tactile primary button */}
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="group relative z-10 flex items-center gap-3 px-8 py-4 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/40 cursor-pointer disabled:opacity-60"
      >
        <div className="w-7 h-7 rounded-full bg-zinc-950 flex items-center justify-center text-white">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          ) : (
            <Footprints className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </div>

        <span>{isLoading ? 'Calibrating Sensors...' : 'Begin Walk'}</span>

        <ArrowRight className="w-4 h-4 text-zinc-950 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
