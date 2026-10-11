'use client';

import React, { useEffect } from 'react';
import { Sparkles, Clock, EyeOff, RotateCcw, ArrowRight, Heart } from 'lucide-react';
import { playZenChime } from '@/lib/audio/chimeSynthesizer';

export interface WalkSummaryModalProps {
  durationSeconds: number;
  interruptCount: number;
  onClose: () => void;
  onStartNewWalk: () => void;
}

export function WalkSummaryModal({
  durationSeconds,
  interruptCount,
  onClose,
  onStartNewWalk,
}: WalkSummaryModalProps) {
  // Format seconds into MM:SS or human readable text
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const formattedDuration = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  // Focus rating
  const isPureFocus = interruptCount === 0;
  const focusScore = Math.max(
    0,
    Math.round(100 - (interruptCount * 15) / Math.max(1, minutes + 1))
  );

  // Play a gentle grounding celebration chime on open
  useEffect(() => {
    try {
      playZenChime({ duration: 3.5 });
    } catch (err) {
      console.warn('Could not auto-play completion chime:', err);
    }
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#12161E]/95 border border-[#D4A85C]/25 p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#F5F0E8] animate-slide-up">
        {/* Glow ambient accent */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#D4A85C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Walk Completed</span>
          </div>
          <span className="text-[11px] font-mono text-[#8B8577]">Session Summary</span>
        </div>

        {/* Title */}
        <h2 id="summary-title" className="text-2xl font-serif text-[#F5F0E8] tracking-tight">
          You Touched Grass 🌿
        </h2>
        <p className="mt-1 text-sm text-[#A7A196] leading-relaxed">
          {isPureFocus
            ? 'Complete screen-free presence achieved. Your mind was fully attuned to your outdoor surroundings.'
            : 'You stepped outside and connected with nature. Every moment away from glowing glass restores balance.'}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-[#8B8577] mb-1">
              <Clock className="w-3.5 h-3.5 text-[#D4A85C]" />
              <span>Time Outdoors</span>
            </div>
            <span className="text-2xl font-semibold text-[#F5F0E8] font-mono">
              {formattedDuration}
            </span>
            <span className="text-[10px] text-[#6A655B] mt-1">Screen dark & active</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-[#8B8577] mb-1">
              <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
              <span>Screen Glances</span>
            </div>
            <span className="text-2xl font-semibold font-mono text-[#F5F0E8]">
              {interruptCount}
            </span>
            <span className="text-[10px] text-emerald-400/90 mt-1">
              {isPureFocus ? 'Pure zero-look walk' : `${focusScore}% focus estimate`}
            </span>
          </div>
        </div>

        {/* Grounding prompt */}
        <div className="p-4 rounded-2xl bg-[#181D27]/80 border border-[#D4A85C]/15 mb-6 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#202735] text-[#D4A85C]">
            <Heart className="w-4 h-4 text-[#E8C98A]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
              Mindful Breath
            </h3>
            <p className="text-xs text-[#A7A196] mt-0.5 leading-snug">
              Inhale deeply for four seconds. Notice the temperature of the air before checking notifications.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D4A85C] to-[#C29548] hover:from-[#E8C98A] hover:to-[#D4A85C] text-[#090A0D] font-semibold text-sm transition shadow-lg shadow-[#D4A85C]/20 cursor-pointer"
          >
            <span>Return to Sanctuary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onStartNewWalk}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#181D27] hover:bg-[#202735] border border-white/5 text-[#A7A196] hover:text-[#F5F0E8] font-medium text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Begin Another Trail Walk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
