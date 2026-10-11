'use client';

import React from 'react';
import { OrientationData, OrientationState } from '@/types/sensors';
import { Compass, Smartphone, Eye, Volume2, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

interface SensorSimulatorDrawerProps {
  orientation: OrientationData;
  state: OrientationState;
  audioLevel: number;
  isWakeLocked: boolean;
  onSimulate: (beta: number, gamma: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SensorSimulatorDrawer({
  orientation,
  state,
  audioLevel,
  isWakeLocked,
  onSimulate,
  isOpen,
  onToggle,
}: SensorSimulatorDrawerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#121822]/90 hover:bg-[#1A2230] border-2 border-[#E5B869]/40 hover:border-[#E5B869] text-xs font-semibold text-[#FAF6EF] shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(229,184,105,0.2)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#FCE8B3] animate-spin" style={{ animationDuration: '20s' }} />
          <span>Sensor Dev HUD</span>
          <span
            className={`w-2 h-2 rounded-full ${
              state === 'viewing'
                ? 'bg-amber-400 animate-ping'
                : state === 'pocket'
                ? 'bg-[#E5B869] shadow-[0_0_8px_#E5B869]'
                : 'bg-zinc-500'
            }`}
          />
        </button>
      ) : (
        <div className="w-84 rounded-3xl bg-[#0F141E]/95 border-2 border-[#E5B869]/35 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.9),0_0_30px_rgba(229,184,105,0.15)] backdrop-blur-2xl text-[#FAF6EF] animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5B869]/20 pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#FCE8B3]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FAF6EF]">
                Live Sensor Telemetry
              </span>
            </div>
            <button
              onClick={onToggle}
              className="text-xs text-[#A69E8F] hover:text-[#FAF6EF] px-2 py-0.5 rounded-md hover:bg-[#1A2230] transition cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Sensor Readings */}
          <div className="space-y-2 text-xs font-mono mb-4 bg-black/60 p-3.5 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[#8E8576]">Pitch (β tilt):</span>
              <span className="text-[#FCE8B3] font-bold">
                {orientation.beta !== null ? `${orientation.beta.toFixed(1)}°` : 'Calibrating...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8E8576]">Roll (γ tilt):</span>
              <span className="text-[#FCE8B3] font-bold">
                {orientation.gamma !== null ? `${orientation.gamma.toFixed(1)}°` : 'Calibrating...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8E8576]">Classification:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                  state === 'viewing'
                    ? 'bg-amber-950/80 text-amber-200 border border-amber-600/60 shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                    : state === 'pocket'
                    ? 'bg-[#2B2215] text-[#FCE8B3] border border-[#E5B869]/50 shadow-[0_0_10px_rgba(229,184,105,0.2)]'
                    : 'bg-[#18202C] text-[#8E8576]'
                }`}
              >
                {state}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-[#8E8576] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#E5B869]" /> Mic Signal:
              </span>
              <div className="w-28 bg-[#18202C] h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-[#D89843] via-[#E5B869] to-[#FCE8B3] h-full transition-all duration-75 shadow-[0_0_8px_#E5B869]"
                  style={{ width: `${Math.round(audioLevel * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8E8576] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E5B869]" /> Wake Lock:
              </span>
              <span className={isWakeLocked ? 'text-[#FCE8B3] font-semibold' : 'text-[#8E8576]'}>
                {isWakeLocked ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>

          {/* Quick Simulation Presets */}
          <div>
            <p className="text-[11px] font-semibold text-[#B5ADA0] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E5B869]" /> Tilt Presets (Dev Testing):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSimulate(85, 0)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#17202D] hover:bg-[#202C3D] border border-white/10 text-left text-xs transition cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#FCE8B3]" />
                <div>
                  <div className="font-semibold text-[#FAF6EF]">Vertical Pocket</div>
                  <div className="text-[10px] text-[#8E8576]">β: 85° (Pocket)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSimulate(35, 5)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#281E12] hover:bg-[#382B1A] border border-[#E5B869]/40 text-left text-xs transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <div>
                  <div className="font-semibold text-amber-200">Face Viewing</div>
                  <div className="text-[10px] text-amber-400/80">β: 35° (Interrupt)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSimulate(-85, 0)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#17202D] hover:bg-[#202C3D] border border-white/10 text-left text-xs transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#FCE8B3]" />
                <div>
                  <div className="font-semibold text-[#FAF6EF]">Inverted Pocket</div>
                  <div className="text-[10px] text-[#8E8576]">β: -85° (Upside)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSimulate(0, 0)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#17202D] hover:bg-[#202C3D] border border-white/10 text-left text-xs transition cursor-pointer"
              >
                <div className="w-3.5 h-3.5 rounded border border-[#8E8576] flex items-center justify-center text-[8px] text-[#A69E8F]">
                  _
                </div>
                <div>
                  <div className="font-semibold text-[#FAF6EF]">Flat Table</div>
                  <div className="text-[10px] text-[#8E8576]">β: 0° (Flat)</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
