const PREVIEW_MILESTONES_PARAM = 'eventuate-preview-milestones';

export const JUNIOR_FINISHER_MILESTONES_GO_LIVE = new Date(2026, 6, 1);
export const FIVE_K_MILESTONE_EXTENSIONS_GO_LIVE = new Date(2026, 8, 1);

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isOnOrAfterGoLive(referenceDate: Date, goLive: Date): boolean {
  return startOfLocalDay(referenceDate) >= startOfLocalDay(goLive);
}

export function isPreviewMilestonesParamEnabled(search: string): boolean {
  return new URLSearchParams(search).get(PREVIEW_MILESTONES_PARAM) === 'true';
}

export function useJuniorFinisherMilestones(
  search: string,
  referenceDate: Date = new Date()
): boolean {
  if (isOnOrAfterGoLive(referenceDate, JUNIOR_FINISHER_MILESTONES_GO_LIVE)) {
    return true;
  }
  return isPreviewMilestonesParamEnabled(search);
}

export function useFiveKMilestoneExtensions(
  search: string,
  referenceDate: Date = new Date()
): boolean {
  if (isOnOrAfterGoLive(referenceDate, FIVE_K_MILESTONE_EXTENSIONS_GO_LIVE)) {
    return true;
  }
  return isPreviewMilestonesParamEnabled(search);
}

export function showPreviewMilestonesDisclaimer(
  courseLength: number,
  search: string,
  referenceDate: Date = new Date()
): boolean {
  if (!isPreviewMilestonesParamEnabled(search)) {
    return false;
  }
  if (
    courseLength === 2 &&
    !isOnOrAfterGoLive(referenceDate, JUNIOR_FINISHER_MILESTONES_GO_LIVE)
  ) {
    return true;
  }
  if (
    courseLength === 5 &&
    !isOnOrAfterGoLive(referenceDate, FIVE_K_MILESTONE_EXTENSIONS_GO_LIVE)
  ) {
    return true;
  }
  return false;
}
