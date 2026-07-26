const CACHE_PREFIX = 'eventuate-parkrunner-age:';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface CachedParkrunnerAge {
  ageCategory: string;
  fetchedAt: number;
}

export interface ParkrunnerAgeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function cacheKey(athleteID: number): string {
  return `${CACHE_PREFIX}${athleteID}`;
}

export function readCachedParkrunnerAge(
  athleteID: number,
  now: number = Date.now(),
  storage: ParkrunnerAgeStorage = localStorage
): string | undefined {
  const raw = storage.getItem(cacheKey(athleteID));
  if (!raw) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(raw) as CachedParkrunnerAge;
    if (
      typeof parsed.ageCategory !== 'string' ||
      typeof parsed.fetchedAt !== 'number'
    ) {
      return undefined;
    }
    if (now - parsed.fetchedAt > CACHE_TTL_MS) {
      return undefined;
    }
    return parsed.ageCategory;
  } catch {
    return undefined;
  }
}

export function writeCachedParkrunnerAge(
  athleteID: number,
  ageCategory: string,
  fetchedAt: number = Date.now(),
  storage: ParkrunnerAgeStorage = localStorage
): void {
  const value: CachedParkrunnerAge = { ageCategory, fetchedAt };
  storage.setItem(cacheKey(athleteID), JSON.stringify(value));
}
