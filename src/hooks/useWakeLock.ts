'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock(isActive: boolean) {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator && !!navigator.wakeLock);
  }, []);

  const requestLock = useCallback(async () => {
    if (!('wakeLock' in navigator) || !navigator.wakeLock) return null;
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      setIsLocked(true);

      sentinel.addEventListener('release', () => {
        setIsLocked(false);
        sentinelRef.current = null;
      });

      return sentinel;
    } catch (err) {
      console.warn('[useWakeLock] Failed to acquire wake lock:', err);
      setIsLocked(false);
      return null;
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (sentinelRef.current) {
      try {
        await sentinelRef.current.release();
      } catch (err) {
        console.warn('[useWakeLock] Error releasing lock:', err);
      }
      sentinelRef.current = null;
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      requestLock();
    } else {
      releaseLock();
    }

    return () => {
      releaseLock();
    };
  }, [isActive, requestLock, releaseLock]);

  // Re-acquire wake lock if tab becomes visible again while active
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive && !sentinelRef.current) {
        await requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, requestLock]);

  return { isLocked, isSupported, requestLock, releaseLock };
}
