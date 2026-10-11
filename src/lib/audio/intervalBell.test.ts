import { IntervalBellScheduler } from './intervalBell';

export function runIntervalBellTests(): { passed: number; failed: number } {
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

  // Test 1: Instantiation with default configuration
  const scheduler = new IntervalBellScheduler();
  assert(!scheduler.isRunning(), 'Scheduler starts in inactive state');
  assert(scheduler.getSecondsUntilNextChime() === 0, 'Returns 0 seconds when not running');

  // Test 2: Start and stop lifecycle
  const started = scheduler.start();
  assert(started === true, 'Scheduler successfully starts');
  assert(scheduler.isRunning() === true, 'Scheduler indicates running state');

  scheduler.stop();
  assert(scheduler.isRunning() === false, 'Scheduler stops cleanly');

  // Test 3: Custom interval configuration
  const custom = new IntervalBellScheduler({ intervalSeconds: 60, enabled: true });
  custom.start();
  const remaining = custom.getSecondsUntilNextChime();
  assert(remaining <= 60 && remaining >= 58, 'Computes seconds until next chime accurately');
  custom.stop();

  // Test 4: Disabled config cannot start
  const disabled = new IntervalBellScheduler({ enabled: false });
  assert(disabled.start() === false, 'Cannot start when enabled is false');

  return { passed, failed };
}
