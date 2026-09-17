import { buildVolunteerMilestoneCelebrations } from '../milestones/buildMilestoneCelebrations';
import {
  fiveKVolunteerIcon,
  fiveKVolunteerMilestoneNumbers,
} from '../milestones/fiveKVolunteerIconLookup';
import { MilestoneCelebrations } from '../types/Milestones';
import { VolunteerWithCount } from '../types/VolunteerWithCount';

export function fiveKVolunteersToMilestones(
  volunteers: VolunteerWithCount[]
): MilestoneCelebrations[] {
  const milestones = Object.fromEntries(
    fiveKVolunteerMilestoneNumbers().map((milestone) => [
      milestone,
      { icon: fiveKVolunteerIcon(milestone) },
    ])
  );

  return buildVolunteerMilestoneCelebrations(volunteers, milestones);
}
