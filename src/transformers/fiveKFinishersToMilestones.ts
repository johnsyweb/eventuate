import { FinisherType } from "./extractors/ResultsPageExtractor";
import { MilestoneCelebrations } from "./presenters/MilestonePresenter";

export function fiveKFinishersToMilestones(
  finishers: FinisherType[]
): MilestoneCelebrations[] {
  type MilestoneDefinition = {
    restricted_age: string;
    p_icon: string;
    v_icon: string;
  };

  const milestones: Record<number, MilestoneDefinition> = {
    10: { restricted_age: "J", p_icon: "⚪︎", v_icon: "🤍" },
    25: { restricted_age: "", p_icon: "🟣", v_icon: "💜" },
    50: { restricted_age: "", p_icon: "🔴", v_icon: "❤️" },
    100: { restricted_age: "", p_icon: "⚫", v_icon: "🖤" },
    250: { restricted_age: "", p_icon: "🟢", v_icon: "💚" },
    500: { restricted_age: "", p_icon: "🔵", v_icon: "💙" },
    1000: { restricted_age: "", p_icon: "🟡", v_icon: "💛" },
  };

  let milestoneCelebrations: MilestoneCelebrations[] = [];

  for (const n in milestones) {
    const milestone: MilestoneDefinition = milestones[n];
    const names: string[] = finishers
      .filter(
        (f) => Number(f.runs) === Number(n) &&
          f.agegroup.startsWith(milestone.restricted_age)
      )
      .map((f) => f.name);

    if (names.length > 0) {
      milestoneCelebrations.push({
        finished: Number(n),
        icon: milestone.p_icon,
        names,
      });
    }
  }
  return milestoneCelebrations;
}
