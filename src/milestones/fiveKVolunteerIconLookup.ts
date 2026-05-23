import { IconHex } from '../types/Milestones';

/** Explicit volunteer heart icons; update when parkrun publishes new colours. */
const FIVE_K_VOLUNTEER_ICONS: Record<number, IconHex> = {
  10: '&#x1F90D;',
  25: '&#x1F49C;',
  50: '&#x2764;',
  100: '&#x1F5A4;',
  200: '&#x1F5A4;',
  250: '&#x1F49A;',
  300: '&#x1F49A;',
  400: '&#x1F49A;',
  500: '&#x1F499;',
  600: '&#x1F499;',
  700: '&#x1F499;',
  800: '&#x1F499;',
  900: '&#x1F499;',
  1000: '&#x1F49B;',
};

const PRODUCTION_MILESTONES = [10, 25, 50, 100, 250, 500, 1000] as const;
const EXTENSION_MILESTONES = [200, 300, 400, 600, 700, 800, 900] as const;

export function fiveKVolunteerIcon(milestone: number): IconHex {
  return FIVE_K_VOLUNTEER_ICONS[milestone];
}

export function fiveKVolunteerMilestoneNumbers(
  useExtensions: boolean
): number[] {
  if (!useExtensions) {
    return [...PRODUCTION_MILESTONES];
  }
  return [...PRODUCTION_MILESTONES, ...EXTENSION_MILESTONES].sort(
    (a, b) => a - b
  );
}
