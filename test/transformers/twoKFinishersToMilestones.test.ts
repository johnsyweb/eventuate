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

  it('uses legacy named clubs by default', () => {
    expect(twoKFinishersToMilestones([finisher])).toEqual([]);
  });

  it('celebrates numerical preview milestones when enabled', () => {
    expect(twoKFinishersToMilestones([finisher], true)).toEqual([
      { clubName: '25', icon: '&#x1F7E9;', names: ['Alex'] },
    ]);
  });
});
