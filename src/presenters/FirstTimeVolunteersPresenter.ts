import { sortAndConjoin } from '../stringFunctions';
import { VolunteerWithCount } from '../types/Volunteer';
import { getTranslations, interpolate } from '../translations';

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
    if (t.languageName === 'Deutsch') {
      // German: "an den Parkrunner" (singular) vs "an die Parkrunner" (plural)
      const countText =
        count === 1 ? `den ${t.parkrunner}` : `die ${count} ${t.parkrunners}`;
      return interpolate(t.firstTimeVolunteersTitle, {
        count: countText,
      });
    } else {
      // English: "to the parkrunner" (singular) vs "to the 2 parkrunners" (plural)
      const countText =
        count === 1 ? t.parkrunner : `${count} ${t.parkrunners}`;
      return interpolate(t.firstTimeVolunteersTitle, {
        count: countText,
      });
    }
  }

  details(): string {
    return sortAndConjoin(this._firstTimeVolunteers.map((v) => v.name));
  }

  hasFirstTimeVolunteers(): boolean {
    return this._firstTimeVolunteers.length > 0;
  }
}
