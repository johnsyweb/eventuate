function modifyUrlPath(segment: string, replacement: string): string {
  try {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathParts = url.pathname.split('/');
    if (pathParts.length > 3 && pathParts[2] === segment) {
      pathParts[3] = replacement;
      url.pathname = pathParts.join('/');
    }
    return url.toString();
  } catch (error) {
    console.error('Invalid URL:', error);
    return window.location.href;
  }
}

export function futureRosterUrl(): string {
  return modifyUrlPath('results', 'futureroster');
}

export function canonicalResultsPageUrl(eventNumber: string): string {
  const eventNum = eventNumber.replace('#', '');
  return modifyUrlPath('results', eventNum);
}
