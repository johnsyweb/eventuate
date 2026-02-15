import { FirstTimersPresenter } from '../../src/presenters/FirstTimersPresenter';

describe('FirstTimersPresenter', () => {
  describe('title', () => {
    it('should return singular title for one first timer', () => {
      const presenter = new FirstTimersPresenter(
        [{ name: 'John SMITH', finishes: 2 }],
        'Test parkrun'
      );
      const title = presenter.title();
      expect(title).toContain('parkrunner');
      expect(title).not.toContain('1 parkrunner');
      expect(title).toContain('Test parkrun');
    });

    it('should return plural title for multiple first timers', () => {
      const presenter = new FirstTimersPresenter(
        [
          { name: 'John SMITH', finishes: 2 },
          { name: 'Jane DOE', finishes: 3 },
        ],
        'Test parkrun'
      );
      const title = presenter.title();
      expect(title).toContain('2 parkrunners');
      expect(title).toContain('Test parkrun');
    });

    it('should use fallback parkrun name when event name not provided', () => {
      const presenter = new FirstTimersPresenter([
        { name: 'John SMITH', finishes: 2 },
      ]);
      const title = presenter.title();
      expect(title).toContain('parkrun');
    });

    it('should handle empty first timers list', () => {
      const presenter = new FirstTimersPresenter([], 'Test parkrun');
      const title = presenter.title();
      expect(title).toContain('0 parkrunners');
    });
  });

  describe('details', () => {
    it('should return sorted and conjoined names for single first timer', () => {
      const presenter = new FirstTimersPresenter([
        { name: 'John SMITH', finishes: 2 },
      ]);
      const details = presenter.details();
      expect(details).toBe('John SMITH');
    });

    it('should return sorted and conjoined names for multiple first timers', () => {
      const presenter = new FirstTimersPresenter([
        { name: 'Jane DOE', finishes: 3 },
        { name: 'John SMITH', finishes: 2 },
        { name: 'Alice BROWN', finishes: 4 },
      ]);
      const details = presenter.details();
      expect(details).toBe('Alice BROWN, Jane DOE and John SMITH');
    });

    it('should handle empty first timers list', () => {
      const presenter = new FirstTimersPresenter([]);
      const details = presenter.details();
      expect(details).toBeUndefined();
    });
  });
});
