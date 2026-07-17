import { IconHex } from '../types/Milestones';

/**
 * Junior finisher square icons approximating parkrun wristband colours.
 * Unicode has no teal/peach/pink/grey squares; nearest colours are used.
 */
const JUNIOR_FINISHER_ICONS: Record<number, IconHex> = {
  10: '&#x1F7E6;', // teal → blue
  25: '&#x1F7E7;', // peach → orange
  50: '&#x1F7E6;', // dark blue → blue
  75: '&#x1F7E9;', // green
  100: '&#x1F7E7;', // orange
  150: '&#x1F7EA;', // pink → purple
  200: '&#x1F7E8;', // yellow
  250: '&#x2B1C;', // pale blue → white
  300: '&#x2B1B;', // grey → black
};

export const JUNIOR_FINISHER_MILESTONE_NUMBERS = [
  10, 25, 50, 75, 100, 150, 200, 250, 300,
] as const;

export function juniorFinisherIcon(milestone: number): IconHex {
  return JUNIOR_FINISHER_ICONS[milestone];
}

export function juniorFinisherClubName(milestone: number): string {
  return `junior parkrun ${milestone}`;
}
