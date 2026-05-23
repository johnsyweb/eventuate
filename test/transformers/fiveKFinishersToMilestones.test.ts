import { fiveKFinishersToMilestones } from '../../src/transformers/fiveKFinishersToMilestones';
import { Finisher } from '../../src/types/Finisher';

describe(fiveKFinishersToMilestones, () => {
  let mickey: Finisher;

  beforeEach(() => {
    mickey = new Finisher(
      'Mickey',
      'agegroup',
      'club',
      'gender',
      'position',
      'runs',
      'vols',
      'agegrade',
      'achievement',
      '59:59',
      9999999
    );
  });

  test('Adult 10', () => {
    mickey.name = 'Too Old!';
    mickey.agegroup = 'VM100';
    mickey.runs = '10';

    expect(fiveKFinishersToMilestones([mickey])).toEqual([]);
  });

  test('Junior 10', () => {
    mickey.name = 'Just right!';
    mickey.agegroup = 'JM10';
    mickey.runs = '10';
    expect(fiveKFinishersToMilestones([mickey])).toEqual([
      { clubName: '10', icon: '&#x26AA;', names: ['Just right!'] },
    ]);
  });

  test('49', () => {
    mickey.runs = '49';
    expect(fiveKFinishersToMilestones([mickey])).toEqual([]);
  });

  test('50', () => {
    mickey.runs = '50';
    expect(fiveKFinishersToMilestones([mickey])).toEqual([
      { clubName: '50', icon: '&#x1F534;', names: ['Mickey'] },
    ]);
  });

  test('51', () => {
    mickey.runs = '51';
    expect(fiveKFinishersToMilestones([mickey])).toEqual([]);
  });

  test('200 when milestone extensions are enabled', () => {
    mickey.runs = '200';
    expect(fiveKFinishersToMilestones([mickey], true)).toEqual([
      { clubName: '200', icon: '&#x26AB;', names: ['Mickey'] },
    ]);
  });

  test('200 when milestone extensions are disabled', () => {
    mickey.runs = '200';
    expect(fiveKFinishersToMilestones([mickey], false)).toEqual([]);
  });
});
