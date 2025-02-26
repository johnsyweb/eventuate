import { IFinisher } from '../types/Finisher';
import {
  MilestoneCelebrations,
  MilestoneDefinition,
} from '../types/Milestones';

export function fiveKFinishersToMilestones(
  finishers: IFinisher[]
): MilestoneCelebrations[] {
  const milestones: Record<number, MilestoneDefinition> = {
    10: { icon: '&#x26AA;', restricted_age: 'J' }, // white circle
    25: { icon: '&#x1F7E3;' }, // purple circle
    50: { icon: '&#x1F534;' }, // red circle
    100: { icon: '&#x26AB;' }, // black circle
    250: { icon: '&#x1F7E2;' }, // green circle
    500: { icon: '&#x1F535;' }, // blue circle
    1000: { icon: '&#x1F7E1;' }, // yellow circle
  };

  const milestoneCelebrations: MilestoneCelebrations[] = [];

  for (const n in milestones) {
    const milestone: MilestoneDefinition = milestones[n];
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
        clubName: n,
        icon: milestone.icon,
        names,
      });
    }
  }
  return milestoneCelebrations;
}
