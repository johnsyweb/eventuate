import { IFinisher } from '../types/Finisher';
import {
  MilestoneCelebrations,
  MilestoneDefinition,
} from '../types/Milestones';

export function fiveKFinishersToMilestones(
  finishers: IFinisher[]
): MilestoneCelebrations[] {
  const milestones: Record<number, MilestoneDefinition> = {
    10: { icon: "⚪︎", restricted_age: "J" },
    25: { icon: "🟣" },
    50: { icon: "🔴" },
    100: { icon: "⚫" },
    250: { icon: "🟢" },
    500: { icon: "🔵" },
    1000: { icon: "🟡" },
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
