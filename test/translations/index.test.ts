import { formatCount } from '../../src/translations/index';

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
