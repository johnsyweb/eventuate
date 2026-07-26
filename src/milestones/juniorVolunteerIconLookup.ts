import { IconHex } from '../types/Milestones';
import { JUNIOR_FINISHER_MILESTONE_NUMBERS } from './juniorFinisherIconLookup';

/**
 * Junior volunteer heart icons approximating parkrun wristband colours.
 * Unicode has no teal/peach/grey hearts; nearest colours are used.
 */
const JUNIOR_VOLUNTEER_ICONS: Record<number, IconHex> = {
  10: '&#x1F499;', // teal → blue
  25: '&#x1F9E1;', // peach → orange
  50: '&#x1F499;', // dark blue → blue
  75: '&#x1F49A;', // green
  100: '&#x1F9E1;', // orange
  150: '&#x1F497;', // pink
  200: '&#x1F49B;', // yellow
  250: '&#x1F90D;', // pale blue → white
  300: '&#x1F5A4;', // grey → black
};

export const JUNIOR_VOLUNTEER_MILESTONE_NUMBERS =
  JUNIOR_FINISHER_MILESTONE_NUMBERS;

export function juniorVolunteerIcon(milestone: number): IconHex {
  return JUNIOR_VOLUNTEER_ICONS[milestone];
}

export function juniorVolunteerClubName(milestone: number): string {
  return `junior parkrun volunteer ${milestone}`;
}

export function isJuniorVolunteerMilestoneTotal(vols: number): boolean {
  return (JUNIOR_VOLUNTEER_MILESTONE_NUMBERS as readonly number[]).includes(
    vols
  );
}
