'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';

function subscribeToWakeLock() {
  return () => {};
}

function getWakeLockSnapshot() {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator && !!navigator.wakeLock;
}

function getWakeLockServerSnapshot() {
  return false;
}

export function useWakeLock(isActive: boolean) {
  const [isLocked, setIsLocked] = useState(false);
  const isSupported = useSyncExternalStore(
    subscribeToWakeLock,
    getWakeLockSnapshot,
    getWakeLockServerSnapshot
  );
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  const requestLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator) || !navigator.wakeLock) {
      return null;
    }
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
    let isMounted = true;

    if (isActive) {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator && navigator.wakeLock) {
        navigator.wakeLock
          .request('screen')
          .then((sentinel) => {
            if (!isMounted) {
              sentinel.release().catch(() => {});
              return;
            }
            sentinelRef.current = sentinel;
            setIsLocked(true);

            sentinel.addEventListener('release', () => {
              if (isMounted) setIsLocked(false);
              sentinelRef.current = null;
            });
          })
          .catch((err) => {
            console.warn('[useWakeLock] Failed to acquire wake lock:', err);
            if (isMounted) setIsLocked(false);
          });
      }
    } else {
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
        setIsLocked(false);
      }
    }

    return () => {
      isMounted = false;
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
    };
  }, [isActive]);

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
