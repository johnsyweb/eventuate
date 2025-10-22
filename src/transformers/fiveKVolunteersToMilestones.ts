import {
  MilestoneCelebrations,
  MilestoneDefinition,
} from '../types/Milestones';
import { VolunteerWithCount } from '../types/Volunteer';

export function fiveKVolunteersToMilestones(
  volunteers: VolunteerWithCount[]
): MilestoneCelebrations[] {
  const milestones: Record<number, MilestoneDefinition> = {
    10: { icon: '&#x1F90D;', restricted_age: 'J' },
    25: { icon: '&#x1F49C;' },
    50: { icon: '&#x2764;' },
    100: { icon: '&#x1F5A4;' },
    250: { icon: '&#x1F49A;' },
    500: { icon: '&#x1F499;' },
    1000: { icon: '&#x1F49B;' },
  };

  const milestoneCelebrations: MilestoneCelebrations[] = [];

  for (const n in milestones) {
    const milestone: MilestoneDefinition = milestones[n];
    const names: string[] = volunteers
      .filter(
        (v) =>
          v.vols === Number(n) &&
          (!milestone.restricted_age ||
            v.agegroup?.startsWith(milestone.restricted_age))
      )
      .map((v) => v.name);

    if (names.length > 0) {
      milestoneCelebrations.push({
        clubName: `Volunteer ${n}`,
        icon: milestone.icon,
        names,
      });
    }
  }
  return milestoneCelebrations;
}
