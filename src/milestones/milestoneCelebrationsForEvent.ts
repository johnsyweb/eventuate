import { ResultsPageExtractor } from '../extractors/ResultsPageExtractor';
import { fiveKFinishersToMilestones } from '../transformers/fiveKFinishersToMilestones';
import { fiveKVolunteersToMilestones } from '../transformers/fiveKVolunteersToMilestones';
import { twoKFinishersToMilestones } from '../transformers/twoKFinishersToMilestone';
import { twoKVolunteersToMilestones } from '../transformers/twoKVolunteersToMilestones';
import { MilestoneCelebrations } from '../types/Milestones';
import { sortMilestoneCelebrations } from './buildMilestoneCelebrations';
import {
  useFiveKMilestoneExtensions,
  useJuniorFinisherMilestones,
} from './milestoneMode';

export function milestoneCelebrationsForEvent(
  extractor: ResultsPageExtractor,
  search: string,
  referenceDate: Date = new Date()
): MilestoneCelebrations[] {
  if (extractor.courseLength === 2) {
    const finisherMilestones = twoKFinishersToMilestones(
      extractor.finishers,
      useJuniorFinisherMilestones(search, referenceDate)
    );
    return sortMilestoneCelebrations([
      ...twoKVolunteersToMilestones(extractor.volunteersList()),
      ...finisherMilestones,
    ]);
  }

  const useExtensions = useFiveKMilestoneExtensions(search, referenceDate);
  return sortMilestoneCelebrations([
    ...fiveKVolunteersToMilestones(extractor.volunteersList(), useExtensions),
    ...fiveKFinishersToMilestones(extractor.finishers, useExtensions),
  ]);
}
