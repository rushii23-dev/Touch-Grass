import { HAPTIC_PATTERNS, triggerHaptic, isHapticSupported } from './hapticFeedback';

export function runHapticTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  };

  // Test 1: Pattern definitions exist and have positive durations
  assert(
    Array.isArray(HAPTIC_PATTERNS.subtle_tap) && HAPTIC_PATTERNS.subtle_tap.length > 0,
    'Defines subtle_tap pattern with duration values'
  );

  assert(
    Array.isArray(HAPTIC_PATTERNS.pocket_entry) && HAPTIC_PATTERNS.pocket_entry.length === 3,
    'Defines pocket_entry as a 3-stage pulse sequence'
  );

  assert(
    Array.isArray(HAPTIC_PATTERNS.screen_interrupt) && HAPTIC_PATTERNS.screen_interrupt[0] > 100,
    'Defines screen_interrupt with pronounced warning pulse'
  );

  assert(
    Array.isArray(HAPTIC_PATTERNS.walk_complete) && HAPTIC_PATTERNS.walk_complete.length === 5,
    'Defines walk_complete grounding pattern'
  );

  // Test 2: In Node / SSR environment, trigger returns false gracefully without throwing
  const result = triggerHaptic('subtle_tap');
  assert(typeof result === 'boolean', 'triggerHaptic returns boolean safely in non-browser context');

  const supported = isHapticSupported();
  assert(typeof supported === 'boolean', 'isHapticSupported returns boolean safely');

  return { passed, failed };
}
