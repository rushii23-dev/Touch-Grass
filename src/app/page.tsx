'use client';

import React, { useState, useCallback } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { PitchBlackScreen } from '@/components/PitchBlackScreen';
import { PermissionWaterfallModal } from '@/components/PermissionWaterfallModal';
import { SensorSimulatorDrawer } from '@/components/SensorSimulatorDrawer';
import { executePermissionWaterfall, WaterfallProgress } from '@/lib/sensors/permissionWaterfall';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useAudioStream } from '@/hooks/useAudioStream';
import { ScreenLookedAtEvent } from '@/types/sensors';

export default function Home() {
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [waterfallProgress, setWaterfallProgress] = useState<WaterfallProgress | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [isLookedAt, setIsLookedAt] = useState<boolean>(false);
  const [interruptCount, setInterruptCount] = useState<number>(0);
  const [lastInterruptEvent, setLastInterruptEvent] = useState<ScreenLookedAtEvent | null>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Manage Screen Wake Lock
  const { isLocked: isWakeLocked, isSupported: isWakeLockSupported } = useWakeLock(isWalking);

  // Manage Live Mic Level
  const { audioLevel, stopStream } = useAudioStream(micStream);

  // Handle the Gyroscope Interrupt: Pocket -> Viewing
  const handleScreenLookedAt = useCallback((event: ScreenLookedAtEvent) => {
    setIsLookedAt(true);
    setInterruptCount((prev) => prev + 1);
    setLastInterruptEvent(event);

    // Haptic buzz on supported mobile devices
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([120, 80, 120]);
      } catch (err) {
        console.warn('Haptic vibration not allowed:', err);
      }
    }

    console.warn(
      `[Canopy Interrupt] onScreenLookedAt fired! Beta: ${event.beta.toFixed(1)}°, Gamma: ${event.gamma.toFixed(1)}°`
    );
  }, []);

  // Handle Return to Pocket
  const handlePocketReturned = useCallback(() => {
    setIsLookedAt(false);
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
      const { micStream: stream } = await executePermissionWaterfall((progress) => {
        setWaterfallProgress(progress);
      });

      // Brief delay to allow the user to see the success checkmarks
      setTimeout(() => {
        setMicStream(stream);
        setIsWalking(true);
        setWaterfallProgress(null);
      }, 500);
    } catch (err) {
      console.error('[Canopy] Permission waterfall failed:', err);
      // waterfallProgress modal handles showing retry / error state
    }
  };

  // End Walk Trigger
  const endWalk = () => {
    stopStream();
    setMicStream(null);
    setIsWalking(false);
    setIsLookedAt(false);
    setInterruptCount(0);
    setLastInterruptEvent(null);
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

      {/* Permission Waterfall Overlay */}
      {waterfallProgress && (
        <PermissionWaterfallModal
          progress={waterfallProgress}
          onRetry={startWalk}
          onCancel={() => setWaterfallProgress(null)}
        />
      )}

      {/* Desktop / Testing Sensor Simulation Drawer (Shown during development / on landing page) */}
      {!isWalking && (
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
