'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { PitchBlackScreen } from '@/components/PitchBlackScreen';
import { PermissionWaterfallModal } from '@/components/PermissionWaterfallModal';
import { SensorSimulatorDrawer } from '@/components/SensorSimulatorDrawer';
import { WalkSummaryModal } from '@/components/WalkSummaryModal';
import { executePermissionWaterfall, WaterfallProgress } from '@/lib/sensors/permissionWaterfall';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useAudioStream } from '@/hooks/useAudioStream';
import { triggerHaptic } from '@/lib/sensors/hapticFeedback';
import { IntervalBellScheduler } from '@/lib/audio/intervalBell';
import { registerServiceWorker } from '@/lib/pwa/registerServiceWorker';
import { ScreenLookedAtEvent } from '@/types/sensors';

interface WalkSummaryData {
  durationSeconds: number;
  interruptCount: number;
}

export default function Home() {
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [waterfallProgress, setWaterfallProgress] = useState<WaterfallProgress | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [isLookedAt, setIsLookedAt] = useState<boolean>(false);
  const [interruptCount, setInterruptCount] = useState<number>(0);
  const [lastInterruptEvent, setLastInterruptEvent] = useState<ScreenLookedAtEvent | null>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<WalkSummaryData | null>(null);

  const walkStartTimeRef = useRef<number | null>(null);
  const bellSchedulerRef = useRef<IntervalBellScheduler | null>(null);

  // Register offline PWA service worker on client mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Manage Screen Wake Lock
  const { isLocked: isWakeLocked, isSupported: isWakeLockSupported } = useWakeLock(isWalking);

  // Manage Live Mic Level
  const { audioLevel, stopStream } = useAudioStream(micStream);

  // Handle the Gyroscope Interrupt: Pocket -> Viewing
  const handleScreenLookedAt = useCallback((event: ScreenLookedAtEvent) => {
    setIsLookedAt(true);
    setInterruptCount((prev) => prev + 1);
    setLastInterruptEvent(event);

    // Haptic warning pattern
    triggerHaptic('screen_interrupt');

    console.warn(
      `[Canopy Interrupt] onScreenLookedAt fired! Beta: ${event.beta.toFixed(1)}°, Gamma: ${event.gamma.toFixed(1)}°`
    );
  }, []);

  // Handle Return to Pocket
  const handlePocketReturned = useCallback(() => {
    setIsLookedAt(false);
    triggerHaptic('pocket_entry');
    console.log('[Canopy] Phone returned to pocket angle.');
  }, []);

  // Orientation Sensor Engine
  const {
    orientation,
    state: orientationState,
    isSupported: isOrientationSupported,
    simulateOrientation,
  } = useDeviceOrientation({
    enabled: isWalking,
    onScreenLookedAt: handleScreenLookedAt,
    onPocketReturned: handlePocketReturned,
    debounceMs: 250,
  });

  // Start Walk Trigger: Sequential Permission Waterfall
  const startWalk = async () => {
    try {
      triggerHaptic('subtle_tap');
      const { micStream: stream } = await executePermissionWaterfall((progress) => {
        setWaterfallProgress(progress);
      });

      // Brief delay to allow the user to see the success checkmarks
      setTimeout(() => {
        setMicStream(stream);
        setIsWalking(true);
        setWaterfallProgress(null);
        setSummaryData(null);
        walkStartTimeRef.current = Date.now();

        // Start periodic mindfulness chime bell (every 5 minutes)
        bellSchedulerRef.current = new IntervalBellScheduler({
          intervalSeconds: 300,
          enabled: true,
        });
        bellSchedulerRef.current.start();
      }, 500);
    } catch (err) {
      console.error('[Canopy] Permission waterfall failed:', err);
    }
  };

  // End Walk Trigger
  const endWalk = () => {
    const elapsedSeconds = walkStartTimeRef.current
      ? Math.max(1, Math.round((Date.now() - walkStartTimeRef.current) / 1000))
      : 0;

    // Trigger walk completion grounding haptic
    triggerHaptic('walk_complete');

    // Stop interval bell scheduler
    if (bellSchedulerRef.current) {
      bellSchedulerRef.current.stop();
      bellSchedulerRef.current = null;
    }

    stopStream();
    setMicStream(null);
    setIsWalking(false);
    setIsLookedAt(false);

    // Present mindful walk summary session
    setSummaryData({
      durationSeconds: elapsedSeconds,
      interruptCount,
    });

    setInterruptCount(0);
    setLastInterruptEvent(null);
    walkStartTimeRef.current = null;
  };

  const handleCloseSummary = () => {
    setSummaryData(null);
  };

  const handleStartNewWalkFromSummary = () => {
    setSummaryData(null);
    startWalk();
  };

  return (
    <>
      {/* 
        Phase 1 Core Requirement:
        Once permissions are granted, transition UI to isWalking = true.
        Render 100% black screen with no visible UI elements.
      */}
      {isWalking ? (
        <PitchBlackScreen
          onEndWalk={endWalk}
          orientationData={orientation}
          isLookedAt={isLookedAt}
          interruptCount={interruptCount}
          lastInterruptEvent={lastInterruptEvent}
          onSimulateTilt={simulateOrientation}
        />
      ) : (
        <LandingPage
          onStartWalk={startWalk}
          isLoading={!!waterfallProgress && waterfallProgress.status === 'running'}
          isWakeLockSupported={isWakeLockSupported}
          isOrientationSupported={isOrientationSupported}
        />
      )}

      {/* Mindful Walk Completion Summary */}
      {summaryData && !isWalking && (
        <WalkSummaryModal
          durationSeconds={summaryData.durationSeconds}
          interruptCount={summaryData.interruptCount}
          onClose={handleCloseSummary}
          onStartNewWalk={handleStartNewWalkFromSummary}
        />
      )}

      {/* Permission Waterfall Overlay */}
      {waterfallProgress && (
        <PermissionWaterfallModal
          progress={waterfallProgress}
          onRetry={startWalk}
          onCancel={() => setWaterfallProgress(null)}
        />
      )}

      {/* Desktop / Testing Sensor Simulation Drawer (Shown during development / on landing page) */}
      {!isWalking && !summaryData && (
        <SensorSimulatorDrawer
          orientation={orientation}
          state={orientationState}
          audioLevel={audioLevel}
          isWakeLocked={isWakeLocked}
          onSimulate={simulateOrientation}
          isOpen={showSimulator}
          onToggle={() => setShowSimulator((prev) => !prev)}
        />
      )}
    </>
  );
}
