import React from 'react';

export function LandingHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
      {/* Minimal status chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-300 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="font-medium text-zinc-200">Zero Screen-Time Walk Sanctuary</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-4 leading-[1.12]">
        Walk free.{' '}
        <span className="text-zinc-400">Eyes forward.</span>
      </h1>

      {/* Understated Subtitle */}
      <p className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed font-normal">
        Your voice-first outdoor companion. Once you begin, your screen fades to complete pitch black and slips safely into your pocket.
      </p>
    </div>
  );
}
