/**
 * Junior parkrun eligibility for milestones: age categories for participants
 * aged at most 14. Excludes JM15-17 / JW15-17.
 */
export function isJuniorParticipantAgeCategory(
  ageCategory: string | undefined
): boolean {
  if (!ageCategory?.startsWith('J')) {
    return false;
  }
  return !ageCategory.includes('15-17');
}
