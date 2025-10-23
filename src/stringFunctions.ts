export function conjoin(elements: string[]): string {
  if (elements.length === 0) return '';
  return elements.length > 1
    ? `${elements.slice(0, -1).join(', ')} and ${elements.slice(-1)}`
    : elements[0];
}

export function alphabetize(names: string[]): string[] {
  return names.sort((a, b) => a.localeCompare(b));
}

export function sortAndConjoin(names: string[]): string {
  return conjoin(alphabetize(names));
}
