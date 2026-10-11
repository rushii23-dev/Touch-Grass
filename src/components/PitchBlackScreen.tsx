'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScreenLookedAtEvent, OrientationData } from '@/types/sensors';
import { EyeOff, PhoneOff, Compass } from 'lucide-react';

interface PitchBlackScreenProps {
  onEndWalk: () => void;
  orientationData: OrientationData;
  isLookedAt: boolean;
  interruptCount: number;
  lastInterruptEvent: ScreenLookedAtEvent | null;
  onSimulateTilt?: (beta: number, gamma: number) => void;
}

export function PitchBlackScreen({
  onEndWalk,
  orientationData,
  isLookedAt,
  interruptCount,
  lastInterruptEvent,
  onSimulateTilt,
}: PitchBlackScreenProps) {
  // Show a discreet developer HUD only if toggled or on triple tap
  const [showDevControls, setShowDevControls] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const tapCountRef = useRef<number>(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Triple-tap to reveal discreet exit/debug options without ruining screen-free immersion
  const handleScreenTap = () => {
    tapCountRef.current += 1;
    if (tapCountRef.current >= 3) {
      setShowExitConfirm(true);
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      return;
    }

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1500);
  };

  // Keyboard shortcut for desktop testing: press 'D' for debug, 'Escape' to end walk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDevControls((prev) => !prev);
      } else if (e.key === 'Escape') {
        onEndWalk();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEndWalk]);

  return (
    <div
      onClick={handleScreenTap}
      className="fixed inset-0 h-screen w-screen bg-black select-none overflow-hidden touch-none z-50 cursor-none flex flex-col items-center justify-center"
      style={{ backgroundColor: '#000000' }}
    >
      {/* 
        Strict Mission-Critical requirement: 
        100% black screen with no visible UI elements during normal walking pocket state.
      */}

      {/* Ephemeral warning when screen is looked at (Gyroscope Interrupt Triggered) */}
      {isLookedAt && (
        <div
          role="alert"
          className="cursor-default pointer-events-auto absolute inset-x-4 top-12 mx-auto max-w-sm rounded-3xl bg-[#12161E]/95 border border-[#D4A85C]/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-300 animate-slide-up"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#181D27] text-[#E8C98A] border border-[#D4A85C]/25 shadow-inner">
              <EyeOff className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#E8C98A]">
                  Screen Interruption #{interruptCount}
                </span>
                <span className="text-[10px] text-[#8B8577] font-mono">
                  β: {lastInterruptEvent?.beta.toFixed(1)}°
                </span>
              </div>
              <p className="mt-1 text-sm text-[#F5F0E8] font-medium leading-snug">
                Return phone to your pocket. Canopy is present.
              </p>
              <p className="mt-0.5 text-xs text-[#7A7468]">
                Voice companion actively listening in pocket mode.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Triple-tap confirmation or developer testing HUD */}
      {(showExitConfirm || showDevControls) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="cursor-default pointer-events-auto absolute inset-x-4 bottom-8 mx-auto max-w-md rounded-3xl bg-[#12161E]/95 border border-[#D4A85C]/25 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 animate-slide-up text-[#F5F0E8]"
        >
          <div className="flex items-center justify-between border-b border-[#D4A85C]/15 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A85C] animate-pulse" />
              <span className="font-semibold text-sm tracking-wide text-[#F5F0E8]">
                Canopy Pocket Mode Active
              </span>
            </div>
            <button
              onClick={() => {
                setShowExitConfirm(false);
                setShowDevControls(false);
              }}
              className="text-xs text-[#8B8577] hover:text-[#F5F0E8] px-2.5 py-1 rounded-lg bg-[#181D27] hover:bg-[#202735] transition"
            >
              Hide HUD
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#A7A196] mb-4 bg-black/60 p-3 rounded-2xl border border-white/5">
            <div>
              <span className="text-[#6A655B]">Pitch (β):</span>{' '}
              <span className="text-[#E8C98A] font-bold">
                {orientationData.beta !== null ? `${orientationData.beta.toFixed(1)}°` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[#6A655B]">Roll (γ):</span>{' '}
              <span className="text-[#E8C98A] font-bold">
                {orientationData.gamma !== null ? `${orientationData.gamma.toFixed(1)}°` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[#6A655B]">State:</span>{' '}
              <span className={isLookedAt ? 'text-amber-400 font-bold' : 'text-[#D4A85C] font-bold'}>
                {isLookedAt ? 'VIEWING (Looked At)' : 'POCKET (Screen Free)'}
              </span>
            </div>
            <div>
              <span className="text-[#6A655B]">Interrupts:</span>{' '}
              <span className="text-[#F5F0E8] font-bold">{interruptCount}</span>
            </div>
          </div>

          {/* Desktop Simulator Quick Buttons */}
          {onSimulateTilt && (
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-wider text-[#7A7468] font-medium mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#D4A85C]" /> Sensor Tilt Simulator (Dev Test)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSimulateTilt(85, 0)}
                  className="px-3 py-2 rounded-xl bg-[#181D27] hover:bg-[#202735] border border-white/5 text-xs font-medium text-[#F5F0E8] transition text-left"
                >
                  👖 Pocket Angle (β: 85°)
                </button>
                <button
                  type="button"
                  onClick={() => onSimulateTilt(35, 5)}
                  className="px-3 py-2 rounded-xl bg-[#1F1912] hover:bg-[#2C2114] border border-[#D4A85C]/30 text-xs font-medium text-[#E8C98A] transition text-left"
                >
                  👀 Viewing Angle (β: 35°)
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEndWalk}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-medium text-sm transition shadow-lg shadow-rose-950/40"
            >
              <PhoneOff className="w-4 h-4" /> End Walk
            </button>
            <button
              type="button"
              onClick={() => {
                setShowExitConfirm(false);
                setShowDevControls(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#181D27] hover:bg-[#202735] border border-white/5 text-[#A7A196] font-medium text-sm transition"
            >
              Resume Dark
            </button>
          </div>
          <p className="text-[10px] text-[#6A655B] text-center mt-2.5">
            Triple tap anywhere anytime to toggle this exit menu. Press &apos;D&apos; on keyboard.
          </p>
        </div>
      )}
    </div>
  );
}
