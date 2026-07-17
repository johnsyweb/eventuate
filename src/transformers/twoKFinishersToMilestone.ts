import { buildFinisherMilestoneCelebrations } from '../milestones/buildMilestoneCelebrations';
import {
  JUNIOR_FINISHER_MILESTONE_NUMBERS,
  juniorFinisherClubName,
  juniorFinisherIcon,
} from '../milestones/juniorFinisherIconLookup';
import { IFinisher } from '../types/Finisher';
import { MilestoneCelebrations } from '../types/Milestones';

export function twoKFinishersToMilestones(
  finishers: IFinisher[]
): MilestoneCelebrations[] {
  const milestones = Object.fromEntries(
    JUNIOR_FINISHER_MILESTONE_NUMBERS.map((milestone) => [
      milestone,
      { icon: juniorFinisherIcon(milestone), restricted_age: 'J' as const },
    ])
  );

  return buildFinisherMilestoneCelebrations(
    finishers,
    milestones,
    juniorFinisherClubName
  );
}
