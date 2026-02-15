import { UnknownsPresenter } from '../../src/presenters/UnknownsPresenter';

describe('UnknownsPresenter', () => {
  describe('constructor', () => {
    it('should store unknowns array and event name', () => {
      const unknowns = ['Unknown', 'Unknown'];
      const presenter = new UnknownsPresenter(unknowns, 'Test parkrun');
      expect(presenter['_unknowns']).toEqual(unknowns);
      expect(presenter['_eventName']).toBe('Test parkrun');
    });

    it('should handle undefined event name', () => {
      const unknowns = ['Unknown'];
      const presenter = new UnknownsPresenter(unknowns);
      expect(presenter['_unknowns']).toEqual(unknowns);
      expect(presenter['_eventName']).toBeUndefined();
    });

    it('should handle empty unknowns array', () => {
      const presenter = new UnknownsPresenter([], 'Test parkrun');
      expect(presenter['_unknowns']).toEqual([]);
      expect(presenter['_eventName']).toBe('Test parkrun');
    });
  });

  describe('title', () => {
    it('should always return empty string', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      expect(presenter.title()).toBe('');
    });

    it('should return empty string even when there are unknowns', () => {
      const presenter = new UnknownsPresenter(
        ['Unknown', 'Unknown'],
        'Test parkrun'
      );
      expect(presenter.title()).toBe('');
    });

    it('should return empty string when there are no unknowns', () => {
      const presenter = new UnknownsPresenter([], 'Test parkrun');
      expect(presenter.title()).toBe('');
    });
  });

  describe('hasUnknowns', () => {
    it('should return true when there are unknowns', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      expect(presenter.hasUnknowns()).toBe(true);
    });

    it('should return true when there are multiple unknowns', () => {
      const presenter = new UnknownsPresenter(
        ['Unknown', 'Unknown', 'Unknown'],
        'Test parkrun'
      );
      expect(presenter.hasUnknowns()).toBe(true);
    });

    it('should return false when there are no unknowns', () => {
      const presenter = new UnknownsPresenter([], 'Test parkrun');
      expect(presenter.hasUnknowns()).toBe(false);
    });
  });

  describe('details', () => {
    it('should return interpolated message when unknowns exist', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      const details = presenter.details();
      expect(details).toContain('Test parkrun');
      expect(details).toContain('barcode');
      expect(details).toContain('scannable');
    });

    it('should return undefined when there are no unknowns', () => {
      const presenter = new UnknownsPresenter([], 'Test parkrun');
      const details = presenter.details();
      expect(details).toBeUndefined();
    });

    it('should use fallback parkrun name when event name is not provided', () => {
      const presenter = new UnknownsPresenter(['Unknown']);
      const details = presenter.details();
      expect(details).toContain('parkrun');
      expect(details).not.toContain('undefined');
    });

    it('should use provided event name in message', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Brimbank parkrun');
      const details = presenter.details();
      expect(details).toContain('Brimbank parkrun');
    });

    it('should return same message regardless of number of unknowns', () => {
      const presenter1 = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      const presenter2 = new UnknownsPresenter(
        ['Unknown', 'Unknown', 'Unknown'],
        'Test parkrun'
      );
      const details1 = presenter1.details();
      const details2 = presenter2.details();
      expect(details1).toBe(details2);
    });

    it('should include barcode reminder message', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      const details = presenter.details();
      expect(details).toContain("don't forget");
      expect(details).toContain('barcode');
      expect(details).toContain('time recorded');
    });

    it('should include passport message', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      const details = presenter.details();
      expect(details).toContain('passport');
      expect(details).toContain('free');
      expect(details).toContain('fun');
    });

    it('should include emergency contact details message', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      const details = presenter.details();
      expect(details).toContain('contact details');
      expect(details).toContain('emergency');
    });
  });

  describe('integration', () => {
    it('should work correctly with hasUnknowns check before details', () => {
      const presenter = new UnknownsPresenter(['Unknown'], 'Test parkrun');
      if (presenter.hasUnknowns()) {
        const details = presenter.details();
        expect(details).not.toBe('');
        expect(details).toContain('Test parkrun');
      } else {
        fail('hasUnknowns should return true');
      }
    });

    it('should work correctly when no unknowns exist', () => {
      const presenter = new UnknownsPresenter([], 'Test parkrun');
      if (presenter.hasUnknowns()) {
        fail('hasUnknowns should return false');
      } else {
        const details = presenter.details();
        expect(details).toBeUndefined();
      }
    });
  });
});
