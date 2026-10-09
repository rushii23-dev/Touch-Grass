'use client';

import React from 'react';
import { Footprints } from 'lucide-react';
import { ChimeButton } from './ChimeButton';

interface HeaderProps {
  onPlayChime?: () => void;
  isPlayingChime?: boolean;
}

export function Header({ onPlayChime, isPlayingChime = false }: HeaderProps) {
  return (
    <header className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
          <Footprints className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-lg text-white">
              Touch Grass
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              Companion
            </span>
          </div>
          <p className="text-xs text-zinc-400 tracking-wide font-normal">
            Screen-Free Outdoor Presence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onPlayChime && (
          <ChimeButton onPlay={onPlayChime} isPlaying={isPlayingChime} />
        )}
      </div>
    </header>
  );
}
