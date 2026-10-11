'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { OrientationData, OrientationState, ScreenLookedAtEvent } from '@/types/sensors';
import { classifyOrientation } from '@/lib/sensors/orientationClassifier';

function subscribeToOrientation() {
  return () => {};
}

function getOrientationSnapshot() {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

function getOrientationServerSnapshot() {
  return false;
}

interface UseDeviceOrientationOptions {
  enabled: boolean;
  onScreenLookedAt?: (event: ScreenLookedAtEvent) => void;
  onPocketReturned?: () => void;
  debounceMs?: number;
}

export function useDeviceOrientation({
  enabled,
  onScreenLookedAt,
  onPocketReturned,
  debounceMs = 300,
}: UseDeviceOrientationOptions) {
  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
    timestamp: 0,
  });

  const [state, setState] = useState<OrientationState>('unknown');
  const isSupported = useSyncExternalStore(
    subscribeToOrientation,
    getOrientationSnapshot,
    getOrientationServerSnapshot
  );

  // Keep references to prevent stale closures
  const prevStateRef = useRef<OrientationState>('unknown');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onScreenLookedAtRef = useRef(onScreenLookedAt);
  const onPocketReturnedRef = useRef(onPocketReturned);

  useEffect(() => {
    onScreenLookedAtRef.current = onScreenLookedAt;
    onPocketReturnedRef.current = onPocketReturned;
  }, [onScreenLookedAt, onPocketReturned]);

  const handleOrientationUpdate = useCallback((
    beta: number | null,
    gamma: number | null,
    alpha: number | null = null,
    absolute: boolean = false
  ) => {
    const timestamp = Date.now();
    setOrientation({ alpha, beta, gamma, absolute, timestamp });

    const detectedState = classifyOrientation(beta, gamma, prevStateRef.current);
    if (detectedState === 'unknown' || detectedState === 'transitioning') {
      return;
    }

    if (detectedState === prevStateRef.current) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    // If state is changing
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const priorState = prevStateRef.current;
      prevStateRef.current = detectedState;
      setState(detectedState);

      // Trigger transition logic
      if (detectedState === 'viewing' && (priorState === 'pocket' || priorState === 'unknown')) {
        onScreenLookedAtRef.current?.({
          beta: beta ?? 0,
          gamma: gamma ?? 0,
          alpha,
          state: 'viewing',
          timestamp: Date.now(),
        });
      } else if (detectedState === 'pocket' && priorState === 'viewing') {
        onPocketReturnedRef.current?.();
      }
    }, debounceMs);
  }, [debounceMs]);

  // Attach native DeviceOrientation event listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasOrientationEvent = 'DeviceOrientationEvent' in window;
    if (!enabled || !hasOrientationEvent) return;

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      handleOrientationUpdate(event.beta, event.gamma, event.alpha, event.absolute);
    };

    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });

    return () => {
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled, handleOrientationUpdate]);

  // Simulator helper for desktop testing
  const simulateOrientation = useCallback((beta: number, gamma: number, alpha: number = 0) => {
    handleOrientationUpdate(beta, gamma, alpha, true);
  }, [handleOrientationUpdate]);

  return {
    orientation,
    state,
    isSupported,
    simulateOrientation,
  };
}
