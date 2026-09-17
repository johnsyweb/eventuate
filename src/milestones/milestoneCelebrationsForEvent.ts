import { ResultsPageExtractor } from '../extractors/ResultsPageExtractor';
import { fiveKFinishersToMilestones } from '../transformers/fiveKFinishersToMilestones';
import { fiveKVolunteersToMilestones } from '../transformers/fiveKVolunteersToMilestones';
import { twoKFinishersToMilestones } from '../transformers/twoKFinishersToMilestone';
import { MilestoneCelebrations } from '../types/Milestones';
import { sortMilestoneCelebrations } from './buildMilestoneCelebrations';

export function milestoneCelebrationsForEvent(
  extractor: ResultsPageExtractor
): MilestoneCelebrations[] {
  const volunteerCelebrations = fiveKVolunteersToMilestones(
    extractor.volunteersList()
  );

  if (extractor.courseLength === 2) {
    return sortMilestoneCelebrations([
      ...volunteerCelebrations,
      ...twoKFinishersToMilestones(extractor.finishers),
    ]);
  }

  return sortMilestoneCelebrations([
    ...volunteerCelebrations,
    ...fiveKFinishersToMilestones(extractor.finishers),
  ]);
}
