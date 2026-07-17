import { twoKFinishersToMilestones } from '../../src/transformers/twoKFinishersToMilestone';
import { Finisher } from '../../src/types/Finisher';

describe(twoKFinishersToMilestones, () => {
  let finisher: Finisher;

  beforeEach(() => {
    finisher = new Finisher(
      'Alex',
      'JW10',
      '',
      'Female',
      '10',
      '25',
      '1',
      '60%',
      '',
      '10:00',
      1
    );
  });

  it('celebrates numerical junior finisher milestones for junior participants', () => {
    expect(twoKFinishersToMilestones([finisher])).toEqual([
      {
        clubName: 'junior parkrun 25',
        icon: '&#x1F7E7;',
        names: ['Alex'],
      },
    ]);
  });

  it('ignores finishers without a junior age group', () => {
    finisher.agegroup = 'VM40';
    expect(twoKFinishersToMilestones([finisher])).toEqual([]);
  });
});
