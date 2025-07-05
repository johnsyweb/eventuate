/**
 * Safely creates a new URL based on the provided href
 */
function createUrlFromCurrent(currentHref: string): URL | null {
  try {
    return new URL(currentHref);
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

/**
 * Parses the URL path into segments for easier manipulation
 */
function getPathSegments(url: URL): string[] {
  return url.pathname.split('/');
}

/**
 * Changes a specific segment in the URL path
 */
function changePathSegment(
  url: URL,
  segmentIndex: number,
  newValue: string,
  pathSegments?: string[]
): URL {
  const segments = pathSegments || getPathSegments(url);
  if (segments.length > segmentIndex) {
    segments[segmentIndex] = newValue;
    url.pathname = segments.join('/');
  }
  return url;
}

export function futureRosterUrl(currentHref: string): string {
  const url = createUrlFromCurrent(currentHref);
  if (!url) return currentHref;

  const pathSegments = getPathSegments(url);
  const eventShortName = pathSegments[1];
  url.pathname = [eventShortName, 'futureroster', ''].join('/');
  return url.toString();
}

export function canonicalResultsPageUrl(
  eventNumber: string,
  currentHref: string
): string {
  const url = createUrlFromCurrent(currentHref);
  const normalisedEventNumber = eventNumber.replace('#', '');
  if (!url) return currentHref;

  const pathSegments = getPathSegments(url);
  if (pathSegments.length > 3 && pathSegments[2] === 'results') {
    return changePathSegment(
      url,
      3,
      normalisedEventNumber,
      pathSegments
    ).toString();
  }

  return currentHref;
}
