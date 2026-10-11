/**
 * Sensory haptic vibration feedback engine for Touch Grass.
 * Provides subtle tactile affirmations and pocket-boundary alert pulses.
 */

export type HapticPatternType = 'subtle_tap' | 'pocket_entry' | 'screen_interrupt' | 'walk_complete';

export const HAPTIC_PATTERNS: Record<HapticPatternType, number[]> = {
  // Delicate single tap when starting calibration or toggling mode
  subtle_tap: [40],

  // Soft double pulse confirming phone safely entered the pocket
  pocket_entry: [50, 60, 50],

  // Distinct warning pulse notifying the user to return phone to pocket
  screen_interrupt: [120, 80, 120],

  // Triumphant grounding rhythm upon completing a nature walk
  walk_complete: [60, 80, 100, 80, 150],
};

export function triggerHaptic(pattern: HapticPatternType | number[]): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return false;
  }

  try {
    const pulseSequence = Array.isArray(pattern) ? pattern : HAPTIC_PATTERNS[pattern];
    return navigator.vibrate(pulseSequence);
  } catch (err) {
    console.warn('[Haptics] Failed to trigger vibration pulse:', err);
    return false;
  }
}

export function isHapticSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function';
}
