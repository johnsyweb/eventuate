import { MilestoneCelebrations } from '../types/Milestones';
import { VolunteerWithCount } from '../types/Volunteer';

export function twoKVolunteersToMilestones(
  volunteers: VolunteerWithCount[]
): MilestoneCelebrations[] {
  const names = volunteers
    .filter((v) => v.vols === 5 && v.agegroup?.startsWith('J'))
    .map((v) => v.name);

  return names.length
    ? [
        {
          clubName: 'junior parkrun v5',
          icon: '&#x1F49E;',
          names,
        },
      ]
    : [];
}
