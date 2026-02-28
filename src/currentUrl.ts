export function getCurrentHref(): string {
  return typeof window !== 'undefined' ? window.location.href : '';
}
