import { sortMilestoneCelebrations } from '../../src/milestones/buildMilestoneCelebrations';
import { MilestoneCelebrations } from '../../src/types/Milestones';

describe(sortMilestoneCelebrations, () => {
  it('sorts volunteer milestones before finisher milestones, ascending by number', () => {
    const input: MilestoneCelebrations[] = [
      { clubName: '100', icon: '&#x26AB;', names: ['A'] },
      { clubName: 'Volunteer 50', icon: '&#x2764;', names: ['B'] },
      { clubName: '25', icon: '&#x1F7E3;', names: ['C'] },
      { clubName: 'Volunteer 100', icon: '&#x1F5A4;', names: ['D'] },
    ];

    expect(sortMilestoneCelebrations(input).map((m) => m.clubName)).toEqual([
      'Volunteer 50',
      'Volunteer 100',
      '25',
      '100',
    ]);
  });
});
