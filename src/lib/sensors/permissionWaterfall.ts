export interface WaterfallProgress {
  step: 'microphone' | 'wakeLock' | 'orientation' | 'complete';
  status: 'idle' | 'running' | 'success' | 'error';
  errorMessage?: string;
  micStream?: MediaStream;
  wakeLockSentinel?: WakeLockSentinel;
}

export async function executePermissionWaterfall(
  onProgress?: (progress: WaterfallProgress) => void
): Promise<{
  micStream: MediaStream;
  wakeLockSentinel: WakeLockSentinel | null;
  orientationGranted: boolean;
}> {
  // 1. Microphone Request
  onProgress?.({
    step: 'microphone',
    status: 'running',
  });

  let micStream: MediaStream;
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is not supported by your browser.');
    }
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    onProgress?.({
      step: 'microphone',
      status: 'success',
      micStream,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Microphone access denied';
    onProgress?.({
      step: 'microphone',
      status: 'error',
      errorMessage: message,
    });
    throw new Error(`Microphone permission error: ${message}`);
  }

  // 2. Wake Lock Request
  onProgress?.({
    step: 'wakeLock',
    status: 'running',
    micStream,
  });

  let wakeLockSentinel: WakeLockSentinel | null = null;
  try {
    if ('wakeLock' in navigator && navigator.wakeLock) {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => {
        console.log('[Canopy] Screen Wake Lock was released');
      });
      onProgress?.({
        step: 'wakeLock',
        status: 'success',
        micStream,
        wakeLockSentinel,
      });
    } else {
      console.warn('[Canopy] Wake Lock API not supported in this browser. Falling back gracefully.');
      onProgress?.({
        step: 'wakeLock',
        status: 'success',
        micStream,
      });
    }
  } catch (err: unknown) {
    console.warn('[Canopy] Wake Lock request non-critical error:', err);
    // Wake Lock failures on some platforms shouldn't block the walk if unsupported
    onProgress?.({
      step: 'wakeLock',
      status: 'success',
      micStream,
    });
  }

  // 3. Device Orientation Permission (iOS 13+ requirement & check)
  onProgress?.({
    step: 'orientation',
    status: 'running',
    micStream,
    wakeLockSentinel: wakeLockSentinel ?? undefined,
  });

  let orientationGranted = true;
  try {
    const DeviceOrientation = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
    };

    if (typeof DeviceOrientation.requestPermission === 'function') {
      const response = await DeviceOrientation.requestPermission();
      if (response === 'granted') {
        orientationGranted = true;
      } else {
        orientationGranted = false;
        throw new Error('Device motion & orientation permission was denied.');
      }
    } else {
      // Standard browsers without explicit permission requirement
      orientationGranted = true;
    }

    onProgress?.({
      step: 'orientation',
      status: 'success',
      micStream,
      wakeLockSentinel: wakeLockSentinel ?? undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Orientation permission denied';
    onProgress?.({
      step: 'orientation',
      status: 'error',
      errorMessage: message,
    });
    throw new Error(`Device Orientation permission error: ${message}`);
  }

  onProgress?.({
    step: 'complete',
    status: 'success',
    micStream,
    wakeLockSentinel: wakeLockSentinel ?? undefined,
  });

  return {
    micStream,
    wakeLockSentinel,
    orientationGranted,
  };
}
