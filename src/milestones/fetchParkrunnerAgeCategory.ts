const AGE_CATEGORY_PATTERN = /Most recent age category was\s+([A-Za-z0-9-]+)/i;

export function parseAgeCategoryFromParkrunnerProfileHtml(
  html: string
): string | undefined {
  const match = AGE_CATEGORY_PATTERN.exec(html);
  return match?.[1];
}

export type FetchLike = (input: string) => Promise<{
  ok: boolean;
  status?: number;
  text: () => Promise<string>;
}>;

export async function fetchParkrunnerAgeCategory(
  profileUrl: string,
  fetchImpl: FetchLike = fetch
): Promise<string | undefined> {
  try {
    const response = await fetchImpl(profileUrl);
    if (!response.ok) {
      console.log(
        `Eventuate: failed to fetch parkrunner profile ${profileUrl}`
      );
      return undefined;
    }
    const html = await response.text();
    return parseAgeCategoryFromParkrunnerProfileHtml(html);
  } catch (error) {
    console.log(
      `Eventuate: error fetching parkrunner profile ${profileUrl}:`,
      error
    );
    return undefined;
  }
}
