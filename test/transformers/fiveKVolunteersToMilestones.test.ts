import { fiveKVolunteersToMilestones } from '../../src/transformers/fiveKVolunteersToMilestones';
import { VolunteerWithCount } from '../../src/types/VolunteerWithCount';

describe(fiveKVolunteersToMilestones, () => {
  it('celebrates Volunteer 200 when extensions are enabled', () => {
    const volunteer: VolunteerWithCount = {
      name: 'Sam',
      vols: 200,
      vClub: 200,
    };

    expect(fiveKVolunteersToMilestones([volunteer], true)).toEqual([
      { clubName: 'Volunteer 200', icon: '&#x1F5A4;', names: ['Sam'] },
    ]);
  });
});
