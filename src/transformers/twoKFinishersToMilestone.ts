import { IFinisher } from "../types/Finisher";
import { MilestoneCelebrations } from "../types/Milestones";

export interface JuniorMilestoneDefinition {
  restricted_age?: string;
  icon: string;
  name: string;
}

export function twoKFinishersToMilestones(
  finishers: IFinisher[]
): MilestoneCelebrations[] {
  const milestones: Record<number, JuniorMilestoneDefinition> = {
    11: { icon: "🟦", restricted_age: "J", name: "Half marathon" },
    21: { icon: "🟩", restricted_age: "J", name: "Marathon" },
    50: { icon: "🟧", restricted_age: "J", name: "Ultra marathon" },
    100: { icon: "⬜", restricted_age: "J", name: "junior parkrun 100" },
    250: { icon: "🟨", restricted_age: "J", name: "junior parkrun 250" },
  };

  const milestoneCelebrations: MilestoneCelebrations[] = [];

  for (const n in milestones) {
    const milestone: JuniorMilestoneDefinition = milestones[n];
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
