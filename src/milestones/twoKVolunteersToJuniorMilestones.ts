import { IFinisher } from '../types/Finisher';
import { MilestoneCelebrations } from '../types/Milestones';
import { VolunteerWithCount } from '../types/VolunteerWithCount';
import { FetchLike } from './fetchParkrunnerAgeCategory';
import { fiveKVolunteerMilestoneNumbers } from './fiveKVolunteerIconLookup';
import {
  isJuniorVolunteerMilestoneTotal,
  juniorVolunteerClubName,
  juniorVolunteerIcon,
  JUNIOR_VOLUNTEER_MILESTONE_NUMBERS,
} from './juniorVolunteerIconLookup';
import { ParkrunnerAgeStorage } from './parkrunnerAgeCache';
import { volunteerIsJuniorParticipant } from './resolveJuniorVolunteerAge';

export interface JuniorVolunteerCandidate {
  volunteer: VolunteerWithCount;
  milestone: number;
  usedCreditFallback: boolean;
}

function isVolunteerLadderMilestone(
  milestone: number,
  useExtensions: boolean
): boolean {
  return fiveKVolunteerMilestoneNumbers(useExtensions).includes(milestone);
}

export function juniorVolunteerMilestoneCandidates(
  volunteers: VolunteerWithCount[],
  useExtensions = false
): JuniorVolunteerCandidate[] {
  const candidates: JuniorVolunteerCandidate[] = [];

  for (const volunteer of volunteers) {
    if (!isJuniorVolunteerMilestoneTotal(volunteer.vols)) {
      continue;
    }
    const milestone = volunteer.vols;
    const hasMatchingIcon = volunteer.vClub === milestone;
    if (
      hasMatchingIcon &&
      isVolunteerLadderMilestone(milestone, useExtensions)
    ) {
      // Overlap totals with a volunteer-club icon are Volunteer milestones.
      continue;
    }
    if (!hasMatchingIcon) {
      console.log(
        `Eventuate: junior volunteer milestone credit fallback for ${volunteer.name} (${milestone} credits, no matching volunteer club icon)`
      );
    }
    candidates.push({
      volunteer,
      milestone,
      usedCreditFallback: !hasMatchingIcon,
    });
  }

  return candidates;
}

export async function twoKVolunteersToJuniorMilestones(
  volunteers: VolunteerWithCount[],
  finishers: IFinisher[],
  options: {
    fetchImpl?: FetchLike;
    storage?: ParkrunnerAgeStorage;
    now?: number;
    useExtensions?: boolean;
  } = {}
): Promise<MilestoneCelebrations[]> {
  const useExtensions = options.useExtensions ?? false;
  const candidates = juniorVolunteerMilestoneCandidates(
    volunteers,
    useExtensions
  );
  const eligible: { milestone: number; name: string }[] = [];

  for (const candidate of candidates) {
    if (!candidate.usedCreditFallback) {
      eligible.push({
        milestone: candidate.milestone,
        name: candidate.volunteer.name,
      });
      continue;
    }
    const isJunior = await volunteerIsJuniorParticipant(
      candidate.volunteer,
      finishers,
      options
    );
    if (isJunior) {
      eligible.push({
        milestone: candidate.milestone,
        name: candidate.volunteer.name,
      });
    }
  }

  const celebrations: MilestoneCelebrations[] = [];
  for (const milestone of JUNIOR_VOLUNTEER_MILESTONE_NUMBERS) {
    const names = eligible
      .filter((e) => e.milestone === milestone)
      .map((e) => e.name);
    if (names.length > 0) {
      celebrations.push({
        clubName: juniorVolunteerClubName(milestone),
        icon: juniorVolunteerIcon(milestone),
        names,
      });
    }
  }
  return celebrations;
}
