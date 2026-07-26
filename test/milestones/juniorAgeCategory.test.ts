import { isJuniorParticipantAgeCategory } from '../../src/milestones/juniorAgeCategory';

describe(isJuniorParticipantAgeCategory, () => {
  it.each(['JW10', 'JM10', 'JW11-14', 'JM11-14', 'JW5-6'])(
    'accepts %s',
    (ageCategory) => {
      expect(isJuniorParticipantAgeCategory(ageCategory)).toBe(true);
    }
  );

  it.each(['JM15-17', 'JW15-17', 'SM30-34', 'VM40-44', '', undefined])(
    'rejects %s',
    (ageCategory) => {
      expect(isJuniorParticipantAgeCategory(ageCategory)).toBe(false);
    }
  );
});
