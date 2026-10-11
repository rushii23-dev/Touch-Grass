import { runOrientationTests } from '../src/lib/sensors/orientationClassifier.test';
import { runIntervalBellTests } from '../src/lib/audio/intervalBell.test';
import { runHapticTests } from '../src/lib/sensors/hapticFeedback.test';

console.log('🌿 Touch Grass — Running Unit Test Suites...\n');

let totalPassed = 0;
let totalFailed = 0;

// 1. Orientation Math Suite
console.log('📐 [1/3] Testing Orientation Angle & Hysteresis Classifier...');
const orientationResults = runOrientationTests();
totalPassed += orientationResults.passed;
totalFailed += orientationResults.failed;
console.log(`   ✓ Passed: ${orientationResults.passed}, Failed: ${orientationResults.failed}\n`);

// 2. Interval Bell Suite
console.log('🔔 [2/3] Testing Mindfulness Interval Bell Scheduler...');
const bellResults = runIntervalBellTests();
totalPassed += bellResults.passed;
totalFailed += bellResults.failed;
console.log(`   ✓ Passed: ${bellResults.passed}, Failed: ${bellResults.failed}\n`);

// 3. Haptic Feedback Suite
console.log('📳 [3/3] Testing Haptic Vibration Feedback Engine...');
const hapticResults = runHapticTests();
totalPassed += hapticResults.passed;
totalFailed += hapticResults.failed;
console.log(`   ✓ Passed: ${hapticResults.passed}, Failed: ${hapticResults.failed}\n`);

console.log('──────────────────────────────────────────────────');
if (totalFailed === 0) {
  console.log(`✨ All ${totalPassed} tests passed successfully! Zero regressions.`);
  process.exit(0);
} else {
  console.error(`❌ ${totalFailed} tests failed out of ${totalPassed + totalFailed}.`);
  process.exit(1);
}
