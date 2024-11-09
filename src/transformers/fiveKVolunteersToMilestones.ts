import {
  MilestoneCelebrations,
  MilestoneDefinition,
} from "../types/Milestones";
import { VolunteerWithCount } from "../types/Volunteer";

const VOLUNTEER_MILESTONE_CLUBS: Record<number, MilestoneDefinition> = {
  10: { icon: "🤍", restricted_age: "J" },
  25: { icon: "💜" },
  50: { icon: "❤️" },
  100: { icon: "🖤" },
  250: { icon: "💚" },
  500: { icon: "💙" },
  1000: { icon: "💛" },
};

export function fiveKVolunteersToMilestones(
  volunteers: VolunteerWithCount[]
): MilestoneCelebrations[] {
  const milestoneCelebrations: MilestoneCelebrations[] = [];

  for (const n in VOLUNTEER_MILESTONE_CLUBS) {
    const milestone: MilestoneDefinition = VOLUNTEER_MILESTONE_CLUBS[n];
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
        clubName: `v${n}`,
        icon: milestone.icon,
        names,
      });
    }
  }
  return milestoneCelebrations;
}
