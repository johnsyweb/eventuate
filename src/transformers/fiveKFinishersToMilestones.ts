import { buildFinisherMilestoneCelebrations } from '../milestones/buildMilestoneCelebrations';
import {
  fiveKFinisherIcon,
  fiveKFinisherMilestoneNumbers,
} from '../milestones/fiveKFinisherIconLookup';
import { IFinisher } from '../types/Finisher';
import { MilestoneCelebrations } from '../types/Milestones';

export function fiveKFinishersToMilestones(
  finishers: IFinisher[],
  useExtensions = false
): MilestoneCelebrations[] {
  const milestones = Object.fromEntries(
    fiveKFinisherMilestoneNumbers(useExtensions).map((milestone) => [
      milestone,
      {
        icon: fiveKFinisherIcon(milestone),
        ...(milestone === 10 ? { restricted_age: 'J' as const } : {}),
      },
    ])
  );

  return buildFinisherMilestoneCelebrations(
    finishers,
    milestones,
    (milestone) => String(milestone)
  );
}
