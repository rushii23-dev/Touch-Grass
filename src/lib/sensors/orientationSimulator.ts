/**
 * Orientation simulator presets and dynamic walk wobble generator.
 * Used for desktop development and automated sensor testing.
 */

export interface TiltPreset {
  id: string;
  name: string;
  description: string;
  beta: number;
  gamma: number;
  expectedState: 'pocket' | 'viewing' | 'transitioning';
}

export const TILT_PRESETS: TiltPreset[] = [
  {
    id: 'pocket-upright',
    name: 'Vertical Pocket',
    description: 'Phone resting vertically in pocket (β: 85°)',
    beta: 85,
    gamma: 0,
    expectedState: 'pocket',
  },
  {
    id: 'viewing-face',
    name: 'Viewing Angle',
    description: 'Phone held up to check the screen (β: 35°)',
    beta: 35,
    gamma: 5,
    expectedState: 'viewing',
  },
  {
    id: 'pocket-inverted',
    name: 'Inverted Pocket',
    description: 'Phone placed upside-down in pocket (β: -85°)',
    beta: -85,
    gamma: 0,
    expectedState: 'pocket',
  },
  {
    id: 'flat-table',
    name: 'Flat Table',
    description: 'Resting flat on a horizontal surface (β: 0°)',
    beta: 0,
    gamma: 0,
    expectedState: 'transitioning',
  },
];

/**
 * Simulates the natural sinusoidal walking wobble of a phone in a pocket.
 */
export function generateWalkingWobble(
  stepCount: number,
  baseBeta: number = 85,
  wobbleIntensity: number = 4
): { beta: number; gamma: number } {
  const betaWobble = Math.sin(stepCount * 0.4) * wobbleIntensity;
  const gammaWobble = Math.cos(stepCount * 0.2) * (wobbleIntensity * 0.7);

  return {
    beta: baseBeta + betaWobble,
    gamma: gammaWobble,
  };
}
