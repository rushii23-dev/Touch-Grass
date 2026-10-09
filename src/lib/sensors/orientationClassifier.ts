import { OrientationState } from '@/types/sensors';

export interface OrientationThresholds {
  pocketMinBeta: number;
  pocketMaxBeta: number;
  viewingMinBeta: number;
  viewingMaxBeta: number;
  viewingMaxGamma: number;
}

export const DEFAULT_THRESHOLDS: OrientationThresholds = {
  pocketMinBeta: 65,
  pocketMaxBeta: 115,
  viewingMinBeta: 15,
  viewingMaxBeta: 60,
  viewingMaxGamma: 50,
};

/**
 * Determines whether the phone is currently in pocket orientation,
 * viewing orientation, or transitioning between them.
 */
export function classifyOrientation(
  beta: number | null,
  gamma: number | null,
  previousState: OrientationState = 'unknown',
  thresholds: OrientationThresholds = DEFAULT_THRESHOLDS
): OrientationState {
  if (beta === null || gamma === null) {
    return 'unknown';
  }

  const absBeta = Math.abs(beta);
  const absGamma = Math.abs(gamma);

  // Check for pocket state: phone vertical (normal or inverted in pocket)
  const isPocket = absBeta >= thresholds.pocketMinBeta && absBeta <= thresholds.pocketMaxBeta;
  if (isPocket) {
    return 'pocket';
  }

  // Check for viewing state: tilted upright facing user with reasonable roll angle
  const isViewing =
    beta >= thresholds.viewingMinBeta &&
    beta <= thresholds.viewingMaxBeta &&
    absGamma <= thresholds.viewingMaxGamma;

  if (isViewing) {
    return 'viewing';
  }

  // If between thresholds, apply hysteresis: keep previous state if it was pocket or viewing
  if (previousState === 'pocket' && absBeta > 60) {
    return 'pocket';
  }
  if (previousState === 'viewing' && beta >= 10 && beta <= 65 && absGamma <= 55) {
    return 'viewing';
  }

  return 'transitioning';
}
