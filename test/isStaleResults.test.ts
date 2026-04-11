import { isStaleResults } from '../src/index';

function dateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('isStaleResults', () => {
  it('returns false when eventDate is undefined', () => {
    expect(isStaleResults(undefined)).toBe(false);
  });

  it('returns false when eventDate is not YYYY-MM-DD', () => {
    expect(isStaleResults('invalid')).toBe(false);
    expect(isStaleResults('21/02/2026')).toBe(false);
  });

  it('returns true when eventDate is more than 7 days ago', () => {
    expect(isStaleResults('2020-01-01')).toBe(true);
    expect(isStaleResults(dateString(8))).toBe(true);
  });

  it('returns false when eventDate is 7 days ago or less', () => {
    expect(isStaleResults(dateString(7))).toBe(false);
    expect(isStaleResults(dateString(6))).toBe(false);
    expect(isStaleResults(dateString(0))).toBe(false);
  });
});
