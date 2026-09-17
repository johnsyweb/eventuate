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

const FIVE_K_VOLUNTEER_MILESTONES = [
  10, 25, 50, 100, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000,
] as const;

export function fiveKVolunteerIcon(milestone: number): IconHex {
  return FIVE_K_VOLUNTEER_ICONS[milestone];
}

export function fiveKVolunteerMilestoneNumbers(): number[] {
  return [...FIVE_K_VOLUNTEER_MILESTONES];
}
