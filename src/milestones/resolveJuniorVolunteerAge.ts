import { IFinisher } from '../types/Finisher';
import { VolunteerWithCount } from '../types/VolunteerWithCount';
import { isJuniorParticipantAgeCategory } from './juniorAgeCategory';
import {
  fetchParkrunnerAgeCategory,
  FetchLike,
} from './fetchParkrunnerAgeCategory';
import {
  ParkrunnerAgeStorage,
  readCachedParkrunnerAge,
  writeCachedParkrunnerAge,
} from './parkrunnerAgeCache';

export function ageCategoryFromFinishers(
  athleteID: number,
  finishers: IFinisher[]
): string | undefined {
  return finishers.find((f) => f.athleteID === athleteID)?.agegroup;
}

export async function resolveVolunteerAgeCategory(
  volunteer: VolunteerWithCount,
  finishers: IFinisher[],
  options: {
    fetchImpl?: FetchLike;
    storage?: ParkrunnerAgeStorage;
    now?: number;
  } = {}
): Promise<string | undefined> {
  const {
    fetchImpl = fetch,
    storage = localStorage,
    now = Date.now(),
  } = options;

  if (volunteer.athleteID === undefined) {
    console.log(
      `Eventuate: skipping junior volunteer age check for ${volunteer.name} (no athlete ID)`
    );
    return undefined;
  }

  const fromFinisher = ageCategoryFromFinishers(volunteer.athleteID, finishers);
  if (fromFinisher) {
    return fromFinisher;
  }

  const cached = readCachedParkrunnerAge(volunteer.athleteID, now, storage);
  if (cached) {
    return cached;
  }

  if (!volunteer.profileUrl) {
    console.log(
      `Eventuate: skipping junior volunteer age check for ${volunteer.name} (no profile URL)`
    );
    return undefined;
  }

  const fetched = await fetchParkrunnerAgeCategory(
    volunteer.profileUrl,
    fetchImpl
  );
  if (fetched) {
    writeCachedParkrunnerAge(volunteer.athleteID, fetched, now, storage);
  }
  return fetched;
}

export async function volunteerIsJuniorParticipant(
  volunteer: VolunteerWithCount,
  finishers: IFinisher[],
  options: {
    fetchImpl?: FetchLike;
    storage?: ParkrunnerAgeStorage;
    now?: number;
  } = {}
): Promise<boolean> {
  const ageCategory = await resolveVolunteerAgeCategory(
    volunteer,
    finishers,
    options
  );
  return isJuniorParticipantAgeCategory(ageCategory);
}
