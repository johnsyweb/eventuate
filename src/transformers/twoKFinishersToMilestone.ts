import { buildFinisherMilestoneCelebrations } from '../milestones/buildMilestoneCelebrations';
import {
  JUNIOR_FINISHER_MILESTONE_NUMBERS,
  juniorFinisherIcon,
} from '../milestones/preview/juniorFinisherIconLookup';
import { IFinisher } from '../types/Finisher';
import { IconHex, MilestoneCelebrations } from '../types/Milestones';

export interface JuniorMilestoneDefinition {
  restricted_age?: 'J';
  icon: IconHex;
  name: string;
}

const LEGACY_JUNIOR_MILESTONES: Record<number, JuniorMilestoneDefinition> = {
  11: { icon: '&#x1F7E6;', restricted_age: 'J', name: 'Half marathon' },
  21: { icon: '&#x1F7E9;', restricted_age: 'J', name: 'Marathon' },
  50: { icon: '&#x1F7E7;', restricted_age: 'J', name: 'Ultra marathon' },
  100: { icon: '&#x2B1C;', restricted_age: 'J', name: 'junior parkrun 100' },
  250: { icon: '&#x1F7E8;', restricted_age: 'J', name: 'junior parkrun 250' },
};

function legacyTwoKFinishersToMilestones(
  finishers: IFinisher[]
): MilestoneCelebrations[] {
  const milestoneCelebrations: MilestoneCelebrations[] = [];

  for (const n in LEGACY_JUNIOR_MILESTONES) {
    const milestone = LEGACY_JUNIOR_MILESTONES[Number(n)];
    const names: string[] = finishers
      .filter(
        (f) =>
          Number(f.runs) === Number(n) &&
          (!milestone.restricted_age ||
            f.agegroup?.startsWith(milestone.restricted_age))
      )
      .map((f) => f.name);

    if (names.length > 0) {
      milestoneCelebrations.push({
        clubName: milestone.name,
        icon: milestone.icon,
        names,
      });
    }
  }
  return milestoneCelebrations;
}

export function twoKFinishersToMilestones(
  finishers: IFinisher[],
  usePreviewMilestones = false
): MilestoneCelebrations[] {
  if (!usePreviewMilestones) {
    return legacyTwoKFinishersToMilestones(finishers);
  }

  const milestones = Object.fromEntries(
    JUNIOR_FINISHER_MILESTONE_NUMBERS.map((milestone) => [
      milestone,
      { icon: juniorFinisherIcon(milestone), restricted_age: 'J' as const },
    ])
  );

  return buildFinisherMilestoneCelebrations(
    finishers,
    milestones,
    (milestone) => String(milestone)
  );
}
