'use client';

import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

interface ChimeButtonProps {
  onPlay: () => void;
  isPlaying?: boolean;
}

export function ChimeButton({ onPlay, isPlaying = false }: ChimeButtonProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      disabled={isPlaying}
      title="Preview ambient nature chime"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-75"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-medium">Chime Ringing...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400/80" />
          <span>Sound Preview</span>
        </>
      )}
    </button>
  );
}
