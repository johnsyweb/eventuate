import { IconHex } from '../types/Milestones';

/** Explicit finisher circle icons; update when parkrun publishes new colours. */
const FIVE_K_FINISHER_ICONS: Record<number, IconHex> = {
  10: '&#x26AA;',
  25: '&#x1F7E3;',
  50: '&#x1F534;',
  100: '&#x26AB;',
  200: '&#x26AB;',
  250: '&#x1F7E2;',
  300: '&#x1F7E2;',
  400: '&#x1F7E2;',
  500: '&#x1F535;',
  600: '&#x1F535;',
  700: '&#x1F535;',
  800: '&#x1F535;',
  900: '&#x1F535;',
  1000: '&#x1F7E1;',
};

const PRODUCTION_MILESTONES = [10, 25, 50, 100, 250, 500, 1000] as const;
const EXTENSION_MILESTONES = [200, 300, 400, 600, 700, 800, 900] as const;

export function fiveKFinisherIcon(milestone: number): IconHex {
  return FIVE_K_FINISHER_ICONS[milestone];
}

export function fiveKFinisherMilestoneNumbers(
  useExtensions: boolean
): number[] {
  if (!useExtensions) {
    return [...PRODUCTION_MILESTONES];
  }
  return [...PRODUCTION_MILESTONES, ...EXTENSION_MILESTONES].sort(
    (a, b) => a - b
  );
}
