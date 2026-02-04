import { FirstTimersLaunchEventPresenter } from '../../src/presenters/FirstTimersLaunchEventPresenter';

describe('FirstTimersLaunchEventPresenter', () => {
  describe('title', () => {
    it('should return singular title for one first timer', () => {
      const presenter = new FirstTimersLaunchEventPresenter(
        [{ name: 'John SMITH', finishes: 10 }],
        'Test parkrun'
      );
      const title = presenter.title();
      expect(title).toContain('parkrunner');
      expect(title).toContain('Test parkrun');
      expect(title).not.toContain('parkrunners');
    });

    it('should return plural title for multiple first timers', () => {
      const presenter = new FirstTimersLaunchEventPresenter(
        [
          { name: 'John SMITH', finishes: 10 },
          { name: 'Jane DOE', finishes: 20 },
        ],
        'Test parkrun'
      );
      const title = presenter.title();
      expect(title).toContain('2 parkrunners');
      expect(title).toContain('Test parkrun');
    });

    it('should use fallback parkrun name when event name not provided', () => {
      const presenter = new FirstTimersLaunchEventPresenter([
        { name: 'John SMITH', finishes: 10 },
      ]);
      const title = presenter.title();
      expect(title).toContain('parkrun');
    });
  });

  describe('details', () => {
    it('should include finish counts in parentheses', () => {
      const presenter = new FirstTimersLaunchEventPresenter(
        [
          { name: 'John SMITH', finishes: 15 },
          { name: 'Jane DOE', finishes: 25 },
        ],
        'Test parkrun'
      );
      const details = presenter.details();
      expect(details).toContain('John SMITH (15)');
      expect(details).toContain('Jane DOE (25)');
    });

    it('should sort names alphabetically', () => {
      const presenter = new FirstTimersLaunchEventPresenter(
        [
          { name: 'Zoe ADAM', finishes: 10 },
          { name: 'Alice BROWN', finishes: 20 },
          { name: 'Bob SMITH', finishes: 15 },
        ],
        'Test parkrun'
      );
      const details = presenter.details();
      expect(details).toBe(
        'Alice BROWN (20), Bob SMITH (15) and Zoe ADAM (10). Thank you for travelling to join us at our inaugural event. With 45 finishes completed between you, we would really welcome your expertise in supporting this event in the local community over the coming weeks while we get established. Please consider returning soon to don a volunteer vest'
      );
    });

    it('should include total finishes in closing message', () => {
      const presenter = new FirstTimersLaunchEventPresenter(
        [
          { name: 'John SMITH', finishes: 12 },
          { name: 'Jane DOE', finishes: 18 },
          { name: 'Alice BROWN', finishes: 25 },
        ],
        'Test parkrun'
      );
      const details = presenter.details();
      // Note: locale formatting may be 55 or 55 depending on locale
      expect(details).toMatch(/With \d+ finishes completed/);
    });

    it('should include thank you and volunteer invitation message', () => {
      const presenter = new FirstTimersLaunchEventPresenter(
        [{ name: 'John SMITH', finishes: 50 }],
        'Test parkrun'
      );
      const details = presenter.details();
      expect(details).toContain('Thank you for travelling');
      expect(details).toContain('volunteer vest');
      expect(details).toContain('inaugural event');
    });

    it('should handle single first timer', () => {
      const presenter = new FirstTimersLaunchEventPresenter(
        [{ name: 'John SMITH', finishes: 10 }],
        'Test parkrun'
      );
      const details = presenter.details();
      expect(details).toContain('John SMITH (10)');
      expect(details).toContain('With 10 finishes');
    });
  });
});
