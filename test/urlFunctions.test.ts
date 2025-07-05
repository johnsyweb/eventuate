import { futureRosterUrl, canonicalResultsPageUrl } from '../src/urlFunctions';

describe('URL Functions', () => {
  const testHref = 'https://www.parkrun.org.uk/beeston/results/latestresults/';

  test('futureRosterUrl should return the future roster URL', () => {
    const result = futureRosterUrl(testHref);
    expect(result).toBe('https://www.parkrun.org.uk/beeston/futureroster/');
  });

  test('canonicalResultsPageUrl should return the canonical results page URL', () => {
    const result = canonicalResultsPageUrl('#123', testHref);
    expect(result).toBe('https://www.parkrun.org.uk/beeston/results/123/');
  });

  test('canonicalResultsPageUrl should handle invalid event numbers gracefully', () => {
    const result = canonicalResultsPageUrl('invalid', testHref);
    expect(result).toBe('https://www.parkrun.org.uk/beeston/results/invalid/');
  });
});
