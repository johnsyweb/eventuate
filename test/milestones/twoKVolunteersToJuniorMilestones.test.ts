import { Finisher } from '../../src/types/Finisher';
import { VolunteerWithCount } from '../../src/types/VolunteerWithCount';
import {
  juniorVolunteerMilestoneCandidates,
  twoKVolunteersToJuniorMilestones,
} from '../../src/milestones/twoKVolunteersToJuniorMilestones';
import { ParkrunnerAgeStorage } from '../../src/milestones/parkrunnerAgeCache';

function memoryStorage(): ParkrunnerAgeStorage {
  const data: Record<string, string> = {};
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

describe(juniorVolunteerMilestoneCandidates, () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('includes icon-matched volunteers without logging fallback', () => {
    const volunteers: VolunteerWithCount[] = [
      { name: 'Alex', vols: 25, vClub: 25, athleteID: 1 },
    ];
    expect(juniorVolunteerMilestoneCandidates(volunteers)).toEqual([
      {
        volunteer: volunteers[0],
        milestone: 25,
        usedCreditFallback: false,
      },
    ]);
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('includes credit-only matches and logs the fallback', () => {
    const volunteers: VolunteerWithCount[] = [
      { name: 'Alex', vols: 25, athleteID: 1 },
    ];
    expect(juniorVolunteerMilestoneCandidates(volunteers)).toEqual([
      {
        volunteer: volunteers[0],
        milestone: 25,
        usedCreditFallback: true,
      },
    ]);
    expect(logSpy).toHaveBeenCalled();
  });
});

describe(twoKVolunteersToJuniorMilestones, () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('celebrates when age is on the finisher list', async () => {
    const volunteers: VolunteerWithCount[] = [
      {
        name: 'Alex',
        vols: 25,
        vClub: 25,
        athleteID: 7,
        profileUrl: 'https://example.test/parkrunner/7',
      },
    ];
    const finishers = [new Finisher('Alex', 'JW10', '', '', '', '10', '25')];
    finishers[0].athleteID = 7;

    await expect(
      twoKVolunteersToJuniorMilestones(volunteers, finishers, {
        storage: memoryStorage(),
        fetchImpl: async () => {
          throw new Error('should not fetch');
        },
      })
    ).resolves.toEqual([
      {
        clubName: 'junior parkrun volunteer 25',
        icon: '&#x1F9E1;',
        names: ['Alex'],
      },
    ]);
  });

  it('fetches and caches profile age when not on the finisher list', async () => {
    const storage = memoryStorage();
    const volunteers: VolunteerWithCount[] = [
      {
        name: 'Alex',
        vols: 10,
        athleteID: 9,
        profileUrl: 'https://example.test/event/parkrunner/9',
      },
    ];

    const celebrations = await twoKVolunteersToJuniorMilestones(
      volunteers,
      [],
      {
        storage,
        now: 1_000_000,
        fetchImpl: async () => ({
          ok: true,
          text: async () => '<p>Most recent age category was JM11-14</p>',
        }),
      }
    );

    expect(celebrations).toEqual([
      {
        clubName: 'junior parkrun volunteer 10',
        icon: '&#x1F499;',
        names: ['Alex'],
      },
    ]);
    expect(storage.getItem('eventuate-parkrunner-age:9')).toContain('JM11-14');
  });

  it('does not celebrate adults after profile fetch', async () => {
    const volunteers: VolunteerWithCount[] = [
      {
        name: 'Sam',
        vols: 25,
        athleteID: 3,
        profileUrl: 'https://example.test/parkrunner/3',
      },
    ];

    await expect(
      twoKVolunteersToJuniorMilestones(volunteers, [], {
        storage: memoryStorage(),
        fetchImpl: async () => ({
          ok: true,
          text: async () => '<p>Most recent age category was SM30-34</p>',
        }),
      })
    ).resolves.toEqual([]);
  });
});
