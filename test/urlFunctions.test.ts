import {
  futureRosterUrl,
  canonicalResultsPageUrl,
  isSupportedResultsPageUrl,
  eventDateFromResultsPageUrl,
} from '../src/urlFunctions';

describe('isSupportedResultsPageUrl', () => {
  test('returns true for YYYY-MM-DD date path', () => {
    expect(
      isSupportedResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/2026-02-21'
      )
    ).toBe(true);
    expect(
      isSupportedResultsPageUrl(
        'https://www.parkrun.com.au/cruickshankpark/results/2026-02-28/'
      )
    ).toBe(true);
  });

  test('returns false for results segment that is not YYYY-MM-DD date', () => {
    expect(
      isSupportedResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/latestresults/'
      )
    ).toBe(false);
    expect(
      isSupportedResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/200'
      )
    ).toBe(false);
    expect(
      isSupportedResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/eventhistory'
      )
    ).toBe(false);
    expect(
      isSupportedResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/clublist'
      )
    ).toBe(false);
  });

  test('returns false when path has no segment after results', () => {
    expect(
      isSupportedResultsPageUrl('https://www.parkrun.com.au/parkville/results/')
    ).toBe(false);
  });

  test('returns false for invalid URL', () => {
    expect(isSupportedResultsPageUrl('not-a-url')).toBe(false);
  });
});

describe('eventDateFromResultsPageUrl', () => {
  test('returns YYYY-MM-DD for date path', () => {
    expect(
      eventDateFromResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/2026-02-07/'
      )
    ).toBe('2026-02-07');
    expect(
      eventDateFromResultsPageUrl(
        'https://www.parkrun.com.au/cruickshankpark/results/2026-02-28'
      )
    ).toBe('2026-02-28');
  });

  test('returns undefined for non-date results path', () => {
    expect(
      eventDateFromResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/eventhistory'
      )
    ).toBeUndefined();
  });

  test('returns undefined for invalid URL', () => {
    expect(eventDateFromResultsPageUrl('not-a-url')).toBeUndefined();
  });
});

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

  test('futureRosterUrl should remove query parameters', () => {
    const result = futureRosterUrl(
      'https://www.parkrun.org.uk/beeston/results/latestresults/?log-juniors=true'
    );
    expect(result).toBe('https://www.parkrun.org.uk/beeston/futureroster/');
  });

  test('canonicalResultsPageUrl should remove query parameters', () => {
    const result = canonicalResultsPageUrl(
      '#123',
      'https://www.parkrun.org.uk/beeston/results/latestresults/?debug-juniors=true'
    );
    expect(result).toBe('https://www.parkrun.org.uk/beeston/results/123/');
  });
});
