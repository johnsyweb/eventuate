import { FirstTimeVolunteersPresenter } from '../../src/presenters/FirstTimeVolunteersPresenter';

describe('FirstTimeVolunteersPresenter', () => {
  describe('constructor', () => {
    it('should filter volunteers with exactly 1 volunteer count', () => {
      const volunteers = [
        { name: 'John SMITH', vols: 1, vClub: undefined },
        { name: 'Jane DOE', vols: 2, vClub: undefined },
        { name: 'Alice BROWN', vols: 1, vClub: undefined },
        { name: 'Bob WILSON', vols: 0, vClub: undefined },
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
        { name: 'John SMITH', vols: 2, vClub: undefined },
        { name: 'Jane DOE', vols: 5, vClub: undefined },
        { name: 'Alice BROWN', vols: 3, vClub: undefined },
      ];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      expect(presenter['_firstTimeVolunteers']).toHaveLength(0);
    });
  });

  describe('title', () => {
    it('should return singular title for one first-time volunteer', () => {
      const volunteers = [{ name: 'John SMITH', vols: 1, vClub: undefined }];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      const title = presenter.title();
      expect(title).toContain('parkrunner');
      expect(title).not.toContain('1 parkrunner');
      expect(title).toContain('first time');
    });

    it('should return plural title for multiple first-time volunteers', () => {
      const volunteers = [
        { name: 'John SMITH', vols: 1, vClub: undefined },
        { name: 'Jane DOE', vols: 1, vClub: undefined },
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
      const volunteers = [{ name: 'John SMITH', vols: 1, vClub: undefined }];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      const details = presenter.details();
      expect(details).toBe('John SMITH');
    });

    it('should return sorted and conjoined names for multiple first-time volunteers', () => {
      const volunteers = [
        { name: 'Jane DOE', vols: 1, vClub: undefined },
        { name: 'John SMITH', vols: 1, vClub: undefined },
        { name: 'Alice BROWN', vols: 1, vClub: undefined },
      ];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      const details = presenter.details();
      expect(details).toBe('Alice BROWN, Jane DOE and John SMITH');
    });

    it('should handle empty first-time volunteers list', () => {
      const presenter = new FirstTimeVolunteersPresenter([]);
      const details = presenter.details();
      expect(details).toBeUndefined();
    });
  });

  describe('hasFirstTimeVolunteers', () => {
    it('should return true when there are first-time volunteers', () => {
      const volunteers = [{ name: 'John SMITH', vols: 1, vClub: undefined }];
      const presenter = new FirstTimeVolunteersPresenter(volunteers);
      expect(presenter.hasFirstTimeVolunteers()).toBe(true);
    });

    it('should return false when there are no first-time volunteers', () => {
      const volunteers = [
        { name: 'John SMITH', vols: 2, vClub: undefined },
        { name: 'Jane DOE', vols: 3, vClub: undefined },
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
