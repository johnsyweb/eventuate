import { ResultsPageExtractor } from '../extractors/ResultsPageExtractor';
import { fiveKFinishersToMilestones } from '../transformers/fiveKFinishersToMilestones';
import { fiveKVolunteersToMilestones } from '../transformers/fiveKVolunteersToMilestones';
import { twoKFinishersToMilestones } from '../transformers/twoKFinishersToMilestone';
import { MilestoneCelebrations } from '../types/Milestones';
import { sortMilestoneCelebrations } from './buildMilestoneCelebrations';
import { useFiveKMilestoneExtensions } from './milestoneMode';

export function milestoneCelebrationsForEvent(
  extractor: ResultsPageExtractor,
  search: string,
  referenceDate: Date = new Date()
): MilestoneCelebrations[] {
  const useExtensions = useFiveKMilestoneExtensions(search, referenceDate);
  const volunteerCelebrations = fiveKVolunteersToMilestones(
    extractor.volunteersList(),
    useExtensions
  );

  if (extractor.courseLength === 2) {
    return sortMilestoneCelebrations([
      ...volunteerCelebrations,
      ...twoKFinishersToMilestones(extractor.finishers),
    ]);
  }

  return sortMilestoneCelebrations([
    ...volunteerCelebrations,
    ...fiveKFinishersToMilestones(extractor.finishers, useExtensions),
  ]);
}
