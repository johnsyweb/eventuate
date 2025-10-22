import { conjoin, alphabetize, sortAndConjoin } from '../src/stringFunctions';

describe('stringFunctions', () => {
  describe('conjoin', () => {
    it('returns single element as-is', () => {
      expect(conjoin(['Alice'])).toBe('Alice');
    });

    it('joins two elements with "and"', () => {
      expect(conjoin(['Alice', 'Bob'])).toBe('Alice and Bob');
    });

    it('joins multiple elements with commas and "and"', () => {
      expect(conjoin(['Alice', 'Bob', 'Charlie'])).toBe(
        'Alice, Bob and Charlie'
      );
    });
  });

  describe('alphabetize', () => {
    it('sorts names alphabetically', () => {
      expect(alphabetize(['Charlie', 'Alice', 'Bob'])).toEqual([
        'Alice',
        'Bob',
        'Charlie',
      ]);
    });
  });

  describe('sortAndConjoin', () => {
    it('sorts and joins names', () => {
      expect(sortAndConjoin(['Charlie', 'Alice', 'Bob'])).toBe(
        'Alice, Bob and Charlie'
      );
    });
  });
});
