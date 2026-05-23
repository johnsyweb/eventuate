import { IFinisher } from '../types/Finisher';
import { IconHex, MilestoneCelebrations } from '../types/Milestones';
import { VolunteerWithCount } from '../types/VolunteerWithCount';

export interface FinisherMilestoneDefinition {
  icon: IconHex;
  restricted_age?: 'J';
}

export interface VolunteerMilestoneDefinition {
  icon: IconHex;
}

export function buildFinisherMilestoneCelebrations(
  finishers: IFinisher[],
  milestones: Record<number, FinisherMilestoneDefinition>,
  clubNameFor: (milestone: number) => string
): MilestoneCelebrations[] {
  const celebrations: MilestoneCelebrations[] = [];

  for (const milestone of Object.keys(milestones)
    .map(Number)
    .sort((a, b) => a - b)) {
    const definition = milestones[milestone];
    const names = finishers
      .filter(
        (f) =>
          Number(f.runs) === milestone &&
          (!definition.restricted_age ||
            f.agegroup?.startsWith(definition.restricted_age))
      )
      .map((f) => f.name);

    if (names.length > 0) {
      celebrations.push({
        clubName: clubNameFor(milestone),
        icon: definition.icon,
        names,
      });
    }
  }

  return celebrations;
}

export function buildVolunteerMilestoneCelebrations(
  volunteers: VolunteerWithCount[],
  milestones: Record<number, VolunteerMilestoneDefinition>
): MilestoneCelebrations[] {
  const celebrations: MilestoneCelebrations[] = [];

  for (const milestone of Object.keys(milestones)
    .map(Number)
    .sort((a, b) => a - b)) {
    const definition = milestones[milestone];
    const names = volunteers
      .filter((v) => v.vols === milestone && v.vClub === milestone)
      .map((v) => v.name);

    if (names.length > 0) {
      celebrations.push({
        clubName: `Volunteer ${milestone}`,
        icon: definition.icon,
        names,
      });
    }
  }

  return celebrations;
}

export function sortMilestoneCelebrations(
  celebrations: MilestoneCelebrations[]
): MilestoneCelebrations[] {
  const volunteerNumeric = (clubName: string): number | null => {
    const match = /^Volunteer (\d+)$/.exec(clubName);
    return match ? Number(match[1]) : null;
  };

  const finisherNumeric = (clubName: string): number | null => {
    if (/^Volunteer /.test(clubName)) {
      return null;
    }
    const asNumber = Number(clubName);
    return Number.isNaN(asNumber) ? null : asNumber;
  };

  const sortKey = (clubName: string): [number, number] => {
    const volunteer = volunteerNumeric(clubName);
    if (volunteer !== null) {
      return [0, volunteer];
    }
    const finisher = finisherNumeric(clubName);
    if (finisher !== null) {
      return [1, finisher];
    }
    return [2, Number.MAX_SAFE_INTEGER];
  };

  return [...celebrations].sort(
    (a, b) =>
      sortKey(a.clubName)[0] - sortKey(b.clubName)[0] ||
      sortKey(a.clubName)[1] - sortKey(b.clubName)[1] ||
      a.clubName.localeCompare(b.clubName)
  );
}
