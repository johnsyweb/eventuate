import { sortAndConjoin } from '../stringFunctions';
import { VolunteerWithCount } from '../types/Volunteer';
import {
  getTranslations,
  interpolate,
  formatCount,
  formatCountWithArticle,
} from '../translations';
import { Presenter } from './Presenter';

export class FirstTimeVolunteersPresenter implements Presenter {
  _firstTimeVolunteers: VolunteerWithCount[];
  _eventName?: string;

  constructor(volunteers: VolunteerWithCount[], eventName?: string) {
    // Filter volunteers with exactly 1 volunteer count
    this._firstTimeVolunteers = volunteers.filter((v) => v.vols === 1);
    this._eventName = eventName;
  }

  title(): string {
    const t = getTranslations();
    const count = this._firstTimeVolunteers.length;

    const countText =
      t.parkrunnerSingularArticle && t.parkrunnerPluralArticle
        ? formatCountWithArticle(
            count,
            t.parkrunner,
            t.parkrunners,
            t.parkrunnerSingularArticle,
            t.parkrunnerPluralArticle
          )
        : formatCount(count, t.parkrunner, t.parkrunners);

    return interpolate(t.firstTimeVolunteersTitle, {
      count: countText,
    });
  }

  details(): string {
    return sortAndConjoin(this._firstTimeVolunteers.map((v) => v.name));
  }

  hasData(): boolean {
    return this._firstTimeVolunteers.length > 0;
  }

  hasFirstTimeVolunteers(): boolean {
    return this.hasData();
  }
}
