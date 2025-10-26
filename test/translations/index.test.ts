import { formatCount, formatCountWithArticle } from '../../src/translations/index';

describe('formatCount', () => {
  describe('singular cases', () => {
    it('should return singular word without number for count of 1', () => {
      const result = formatCount(1, 'parkrunner', 'parkrunners');
      expect(result).toBe('parkrunner');
    });

    it('should return singular word without number for finisher', () => {
      const result = formatCount(1, 'finisher', 'finishers');
      expect(result).toBe('finisher');
    });

    it('should return singular word without number for volunteer', () => {
      const result = formatCount(1, 'volunteer', 'volunteers');
      expect(result).toBe('volunteer');
    });
  });

  describe('plural cases', () => {
    it('should return plural word with number for count of 2', () => {
      const result = formatCount(2, 'parkrunner', 'parkrunners');
      expect(result).toBe('2 parkrunners');
    });

    it('should return plural word with number for count of 100', () => {
      const result = formatCount(100, 'parkrunner', 'parkrunners');
      expect(result).toBe('100 parkrunners');
    });

    it('should return plural word with number for finishers', () => {
      const result = formatCount(45, 'finisher', 'finishers');
      expect(result).toBe('45 finishers');
    });

    it('should return plural word with number for volunteers', () => {
      const result = formatCount(12, 'volunteer', 'volunteers');
      expect(result).toBe('12 volunteers');
    });
  });

  describe('edge cases', () => {
    it('should return plural word with number for count of 0', () => {
      const result = formatCount(0, 'parkrunner', 'parkrunners');
      expect(result).toBe('0 parkrunners');
    });

    it('should handle very large numbers', () => {
      const result = formatCount(1000000, 'parkrunner', 'parkrunners');
      expect(result).toBe('1000000 parkrunners');
    });
  });
});

describe('formatCountWithArticle', () => {
  describe('singular cases', () => {
    it('should return singular word with article for count of 1', () => {
      const result = formatCountWithArticle(
        1,
        'parkrunner',
        'parkrunners',
        'den',
        'die'
      );
      expect(result).toBe('den parkrunner');
    });

    it('should return singular word with different article', () => {
      const result = formatCountWithArticle(
        1,
        'parkrunner',
        'parkrunners',
        'der',
        'die'
      );
      expect(result).toBe('der parkrunner');
    });
  });

  describe('plural cases', () => {
    it('should return plural word with article and number for count of 2', () => {
      const result = formatCountWithArticle(
        2,
        'parkrunner',
        'parkrunners',
        'den',
        'die'
      );
      expect(result).toBe('die 2 parkrunners');
    });

    it('should return plural word with article and number for count of 100', () => {
      const result = formatCountWithArticle(
        100,
        'parkrunner',
        'parkrunners',
        'den',
        'die'
      );
      expect(result).toBe('die 100 parkrunners');
    });

    it('should work with different articles', () => {
      const result = formatCountWithArticle(
        5,
        'finisher',
        'finishers',
        'der',
        'die'
      );
      expect(result).toBe('die 5 finishers');
    });
  });

  describe('edge cases', () => {
    it('should return plural with article for count of 0', () => {
      const result = formatCountWithArticle(
        0,
        'parkrunner',
        'parkrunners',
        'den',
        'die'
      );
      expect(result).toBe('die 0 parkrunners');
    });
  });
});
