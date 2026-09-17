import { fiveKVolunteersToMilestones } from '../../src/transformers/fiveKVolunteersToMilestones';
import { VolunteerWithCount } from '../../src/types/VolunteerWithCount';

describe(fiveKVolunteersToMilestones, () => {
  it('celebrates Volunteer 200', () => {
    const volunteer: VolunteerWithCount = {
      name: 'Sam',
      vols: 200,
      vClub: 200,
    };

    expect(fiveKVolunteersToMilestones([volunteer])).toEqual([
      { clubName: 'Volunteer 200', icon: '&#x1FA75;', names: ['Sam'] },
    ]);
  });
});
