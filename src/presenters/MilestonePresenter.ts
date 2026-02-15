import { sortAndConjoin } from '../stringFunctions';
import { MilestoneCelebrations } from '../types/Milestones';
import { getTranslations, interpolate, formatCount } from '../translations';
import { Presenter } from './Presenter';

export class MilestonePresenter implements Presenter {
  _milestoneCelebrations: MilestoneCelebrations[];
  _milestoneCelebrationsAll: string[];

  constructor(milestoneCelebrations: MilestoneCelebrations[]) {
    this._milestoneCelebrations = milestoneCelebrations;
    this._milestoneCelebrationsAll = this._milestoneCelebrations.flatMap(
      (mc) => mc.names
    );
  }

  title(): string {
    const t = getTranslations();
    const count = this._milestoneCelebrationsAll.length;
    const countText = formatCount(count, t.parkrunner, t.parkrunners);
    return interpolate(t.milestoneCelebrations.title, {
      count: countText,
    });
  }

  details(): string {
    const t = getTranslations();
    return this._milestoneCelebrations
      .map((mc) => {
        const clubName = t.milestoneClubs[mc.clubName] || mc.clubName;
        return `${mc.icon} ${interpolate(t.milestoneCelebrations.joinedClub, {
          names: sortAndConjoin(mc.names),
          clubName: clubName,
        })}`;
      })
      .join('<br>');
  }

  hasData(): boolean {
    return this._milestoneCelebrations.length > 0;
  }
}
