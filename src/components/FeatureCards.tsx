import React from 'react';
import { Mic, Moon, Compass } from 'lucide-react';
import { MinimalCard } from './MinimalCard';

export function VoiceSanctuaryCard() {
  return (
    <MinimalCard>
      <div className="flex flex-col items-start text-left">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
          <Mic className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Voice Sanctuary
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          Quiet conversational reflection. Zero reading, natural ambient voice capture.
        </p>
      </div>
    </MinimalCard>
  );
}

export function PitchBlackCard() {
  return (
    <MinimalCard>
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded">
            0% Light
          </span>
        </div>
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Pitch Black OLED
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          100% black screen in your pocket. Pure battery conservation and presence.
        </p>
      </div>
    </MinimalCard>
  );
}

export function PocketGuardCard() {
  return (
    <MinimalCard>
      <div className="flex flex-col items-start text-left">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
          <Compass className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Pocket Guard
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          Intelligent gyro tilt detection alerts if you glance at the phone.
        </p>
      </div>
    </MinimalCard>
  );
}

export function FeatureCards() {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      <VoiceSanctuaryCard />
      <PitchBlackCard />
      <PocketGuardCard />
    </div>
  );
}
