import { classifyOrientation } from './orientationClassifier';

/**
 * Self-verifying test suite for orientation classification and hysteresis logic.
 */
export function runOrientationTests(): { passed: number; failed: number } {
  const tests: Array<{
    name: string;
    actual: string;
    expected: string;
  }> = [
    {
      name: 'Classifies upright vertical phone as pocket',
      actual: classifyOrientation(85, 0),
      expected: 'pocket',
    },
    {
      name: 'Classifies inverted vertical phone as pocket',
      actual: classifyOrientation(-85, 0),
      expected: 'pocket',
    },
    {
      name: 'Classifies tilted face viewing angle as viewing',
      actual: classifyOrientation(35, 10),
      expected: 'viewing',
    },
    {
      name: 'Classifies flat table angle as transitioning',
      actual: classifyOrientation(0, 0),
      expected: 'transitioning',
    },
    {
      name: 'Handles missing sensor beta as unknown',
      actual: classifyOrientation(null, 0),
      expected: 'unknown',
    },
    {
      name: 'Handles missing sensor gamma as unknown',
      actual: classifyOrientation(45, null),
      expected: 'unknown',
    },
    {
      name: 'Preserves pocket state under moderate wobble via hysteresis',
      actual: classifyOrientation(62, 0, 'pocket'),
      expected: 'pocket',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    if (t.actual === t.expected) {
      passed++;
    } else {
      console.error(`[FAIL] ${t.name}: expected ${t.expected}, got ${t.actual}`);
      failed++;
    }
  }

  return { passed, failed };
}
