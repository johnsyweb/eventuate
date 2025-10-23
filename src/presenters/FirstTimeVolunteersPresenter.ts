import { sortAndConjoin } from '../stringFunctions';
import { VolunteerWithCount } from '../types/Volunteer';
import {
  getTranslations,
  interpolate,
  pluralizeTranslated,
} from '../translations';

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
    return interpolate(t.firstTimeVolunteersTitle, {
      count: `${this._firstTimeVolunteers.length} ${pluralizeTranslated(
        t.parkrunner,
        t.parkrunners,
        this._firstTimeVolunteers.length
      )}`,
    });
  }

  details(): string {
    return sortAndConjoin(this._firstTimeVolunteers.map((v) => v.name));
  }

  hasFirstTimeVolunteers(): boolean {
    return this._firstTimeVolunteers.length > 0;
  }
}
