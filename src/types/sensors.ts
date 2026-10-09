/**
 * Touch Grass / Canopy Sensor & Telemetry Type Definitions
 * Strictly typed interfaces for hardware orientation, wake lock, audio streaming, and session metrics.
 */

export type OrientationState = 'pocket' | 'viewing' | 'transitioning' | 'unknown';

export interface OrientationData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
  timestamp: number;
}

export interface PermissionStatus {
  microphone: 'prompt' | 'granted' | 'denied' | 'unsupported';
  wakeLock: 'prompt' | 'granted' | 'denied' | 'unsupported';
  orientation: 'prompt' | 'granted' | 'denied' | 'unsupported';
}

export interface WaterfallStep {
  id: 'microphone' | 'wakeLock' | 'orientation';
  label: string;
  description: string;
  status: 'pending' | 'requesting' | 'granted' | 'failed';
  error?: string;
}

export interface ScreenLookedAtEvent {
  beta: number;
  gamma: number;
  alpha: number | null;
  state: OrientationState;
  timestamp: number;
}

export interface WalkSessionMetrics {
  startTime: number;
  endTime: number | null;
  durationSeconds: number;
  interruptCount: number;
  screenOffPercentage: number;
  lastInterruptAt: number | null;
}

export interface AudioAnalyzerMetrics {
  audioLevel: number;
  isClipping: boolean;
  isActive: boolean;
}
