import { sortAndConjoin } from '../stringFunctions';
import { VolunteerWithCount } from '../types/Volunteer';
import { getTranslations, interpolate, formatCountWithArticle } from '../translations';

export class FirstTimeVolunteersPresenter {
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

    // Handle different grammar for different languages
    const countText =
      t.languageName === 'Deutsch'
        ? formatCountWithArticle(count, t.parkrunner, t.parkrunners, 'den', 'die')
        : formatCountWithArticle(count, t.parkrunner, t.parkrunners);
    
    return interpolate(t.firstTimeVolunteersTitle, {
      count: countText,
    });
  }

  details(): string {
    return sortAndConjoin(this._firstTimeVolunteers.map((v) => v.name));
  }

  hasFirstTimeVolunteers(): boolean {
    return this._firstTimeVolunteers.length > 0;
  }
}
