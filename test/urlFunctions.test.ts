import { futureRosterUrl, canonicalResultsPageUrl } from '../src/urlFunctions';

describe('URL Functions', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://www.parkrun.org.uk/beeston/results/latestresults/',
      },
      writable: false,
    });
  });

  test('futureRosterUrl should return the future roster URL', () => {
    const result = futureRosterUrl();
    expect(result).toBe('https://www.parkrun.org.uk/beeston/futureroster/');
  });

  test('canonicalResultsPageUrl should return the canonical results page URL', () => {
    const result = canonicalResultsPageUrl('#123');
    expect(result).toBe('https://www.parkrun.org.uk/beeston/results/123/');
  });

  test('canonicalResultsPageUrl should handle invalid event numbers gracefully', () => {
    const result = canonicalResultsPageUrl('invalid');
    expect(result).toBe('https://www.parkrun.org.uk/beeston/results/invalid/');
  });
});
