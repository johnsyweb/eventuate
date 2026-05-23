import { IconHex } from '../../types/Milestones';

/**
 * Junior finisher square icons for the numerical milestone system.
 * Placeholder colours for milestones without a legacy club; update when parkrun releases official colours.
 */
const JUNIOR_FINISHER_ICONS: Record<number, IconHex> = {
  10: '&#x1F7E6;',
  25: '&#x1F7E9;',
  50: '&#x1F7E7;',
  75: '&#x1F7E6;',
  100: '&#x2B1C;',
  150: '&#x1F7E8;',
  200: '&#x1F7E9;',
  250: '&#x1F7E8;',
  300: '&#x2B1C;',
};

export const JUNIOR_FINISHER_MILESTONE_NUMBERS = [
  10, 25, 50, 75, 100, 150, 200, 250, 300,
] as const;

export function juniorFinisherIcon(milestone: number): IconHex {
  return JUNIOR_FINISHER_ICONS[milestone];
}
