import { pluralize, sortAndConjoin } from '../stringFunctions';
import { MilestoneCelebrations } from '../types/Milestones';

export class MilestonePresenter {
  _milestoneCelebrations: MilestoneCelebrations[];
  _milestoneCelebrationsAll: string[];

  constructor(milestoneCelebrations: MilestoneCelebrations[]) {
    this._milestoneCelebrations = milestoneCelebrations;
    this._milestoneCelebrationsAll = this._milestoneCelebrations.flatMap(
      (mc) => mc.names
    );
  }

  title(): string {
    return `Three cheers to the ${pluralize(
      'parkrunner',
      'parkrunners',
      this._milestoneCelebrationsAll.length
    )} who joined a new parkrun milestone club this weekend:<br>`;
  }

  details(): string {
    return this._milestoneCelebrations
      .map(
        (mc) =>
          `${mc.icon} ${sortAndConjoin(mc.names)} joined the ${mc.clubName} club`
      )
      .join('<br>');
  }
}
