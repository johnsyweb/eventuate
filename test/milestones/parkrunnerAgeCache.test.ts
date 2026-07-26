import {
  readCachedParkrunnerAge,
  writeCachedParkrunnerAge,
  ParkrunnerAgeStorage,
} from '../../src/milestones/parkrunnerAgeCache';

function memoryStorage(
  initial: Record<string, string> = {}
): ParkrunnerAgeStorage {
  const data = { ...initial };
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

describe('parkrunnerAgeCache', () => {
  it('round-trips a cached age category', () => {
    const storage = memoryStorage();
    const now = 1_000_000;
    writeCachedParkrunnerAge(42, 'JM11-14', now, storage);
    expect(readCachedParkrunnerAge(42, now, storage)).toBe('JM11-14');
  });

  it('expires entries after seven days', () => {
    const storage = memoryStorage();
    const fetchedAt = 1_000_000;
    writeCachedParkrunnerAge(42, 'JW10', fetchedAt, storage);
    const eightDaysLater = fetchedAt + 8 * 24 * 60 * 60 * 1000;
    expect(
      readCachedParkrunnerAge(42, eightDaysLater, storage)
    ).toBeUndefined();
  });
});
