'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { LandingHero } from '@/components/LandingHero';
import { BeginWalkButton } from '@/components/BeginWalkButton';
import { FeatureCards } from '@/components/FeatureCards';
import { TelemetryFooter } from '@/components/TelemetryFooter';
import { playZenChime } from '@/lib/audio/chimeSynthesizer';

interface LandingPageProps {
  onStartWalk: () => void;
  isLoading: boolean;
  isWakeLockSupported: boolean;
  isOrientationSupported: boolean;
}

export function LandingPage({
  onStartWalk,
  isLoading,
  isWakeLockSupported,
  isOrientationSupported,
}: LandingPageProps) {
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  const handlePlayChime = useCallback(async () => {
    setIsPlayingChime(true);
    await playZenChime();
    setIsPlayingChime(false);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#090A0D] text-[#F5F5F7] flex flex-col justify-between overflow-hidden">
      {/* Subtle, soft ambient center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/[0.04] blur-[120px]"
      />

      {/* Header */}
      <Header onPlayChime={handlePlayChime} isPlayingChime={isPlayingChime} />

      {/* Hero Body */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center my-auto animate-soft-in">
        <LandingHero />

        <BeginWalkButton onClick={onStartWalk} isLoading={isLoading} />

        <FeatureCards />
      </div>

      {/* Telemetry Footer */}
      <TelemetryFooter
        isWakeLockSupported={isWakeLockSupported}
        isOrientationSupported={isOrientationSupported}
      />
    </main>
  );
}
