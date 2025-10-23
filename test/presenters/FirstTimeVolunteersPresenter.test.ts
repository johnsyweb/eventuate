import { FirstTimeVolunteersPresenter } from '../../src/presenters/FirstTimeVolunteersPresenter';
import { VolunteerWithCount } from '../../src/types/Volunteer';

// Create a simple mock volunteer for testing
function createMockVolunteer(name: string, vols: number): VolunteerWithCount {
  const mockVolunteer = {
    name,
    link: `https://example.com/athlete/${name}`,
    athleteID: Math.floor(Math.random() * 1000),
    vols,
    agegroup: 'SM',
    volunteerDataSource: new URL(`https://example.com/athlete/${name}`),
    promisedVols: undefined,
    fetchAndExtractData: jest.fn(),
    fetchdata: jest.fn(),
    volsFromHtml: jest.fn(),
  } as unknown as VolunteerWithCount;

  return mockVolunteer;
}

describe('FirstTimeVolunteersPresenter', () => {
  describe('constructor', () => {
    it('should filter volunteers with exactly 1 volunteer count', () => {
      const volunteers = [
        createMockVolunteer('John SMITH', 1),
        createMockVolunteer('Jane DOE', 2),
        createMockVolunteer('Alice BROWN', 1),
        createMockVolunteer('Bob WILSON', 0),
      ];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      expect(presenter['_firstTimeVolunteers']).toHaveLength(2);
      expect(presenter['_firstTimeVolunteers'][0].name).toBe('John SMITH');
      expect(presenter['_firstTimeVolunteers'][1].name).toBe('Alice BROWN');
    });

    it('should handle empty volunteers list', () => {
      const presenter = new FirstTimeVolunteersPresenter([]);
      expect(presenter['_firstTimeVolunteers']).toHaveLength(0);
    });

    it('should handle volunteers with no first-time volunteers', () => {
      const volunteers = [
        createMockVolunteer('John SMITH', 2),
        createMockVolunteer('Jane DOE', 5),
        createMockVolunteer('Alice BROWN', 3),
      ];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      expect(presenter['_firstTimeVolunteers']).toHaveLength(0);
    });
  });

  describe('title', () => {
    it('should return singular title for one first-time volunteer', () => {
      const volunteers = [createMockVolunteer('John SMITH', 1)];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      const title = presenter.title();
      expect(title).toContain('parkrunner');
      expect(title).not.toContain('1 parkrunner');
      expect(title).toContain('first time');
    });

    it('should return plural title for multiple first-time volunteers', () => {
      const volunteers = [
        createMockVolunteer('John SMITH', 1),
        createMockVolunteer('Jane DOE', 1),
      ];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      const title = presenter.title();
      expect(title).toContain('2 parkrunners');
      expect(title).toContain('first time');
    });

    it('should handle empty first-time volunteers list', () => {
      const presenter = new FirstTimeVolunteersPresenter([]);
      const title = presenter.title();
      expect(title).toContain('0 parkrunners');
    });
  });

  describe('details', () => {
    it('should return sorted and conjoined names for single first-time volunteer', () => {
      const volunteers = [createMockVolunteer('John SMITH', 1)];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      const details = presenter.details();
      expect(details).toBe('John SMITH');
    });

    it('should return sorted and conjoined names for multiple first-time volunteers', () => {
      const volunteers = [
        createMockVolunteer('Jane DOE', 1),
        createMockVolunteer('John SMITH', 1),
        createMockVolunteer('Alice BROWN', 1),
      ];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      const details = presenter.details();
      expect(details).toBe('Alice BROWN, Jane DOE and John SMITH');
    });

    it('should handle empty first-time volunteers list', () => {
      const presenter = new FirstTimeVolunteersPresenter([]);
      const details = presenter.details();
      expect(details).toBe('');
    });
  });

  describe('hasFirstTimeVolunteers', () => {
    it('should return true when there are first-time volunteers', () => {
      const volunteers = [createMockVolunteer('John SMITH', 1)];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      expect(presenter.hasFirstTimeVolunteers()).toBe(true);
    });

    it('should return false when there are no first-time volunteers', () => {
      const volunteers = [
        createMockVolunteer('John SMITH', 2),
        createMockVolunteer('Jane DOE', 3),
      ];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      expect(presenter.hasFirstTimeVolunteers()).toBe(false);
    });

    it('should return false for empty volunteers list', () => {
      const presenter = new FirstTimeVolunteersPresenter([]);
      expect(presenter.hasFirstTimeVolunteers()).toBe(false);
    });
  });
});
