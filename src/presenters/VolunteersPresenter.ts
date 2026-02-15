import { sortAndConjoin } from '../stringFunctions';
import { VolunteerWithCount } from '../types/Volunteer';
import { getTranslations, interpolate } from '../translations';
import { Presenter } from './Presenter';

export class VolunteersPresenter implements Presenter {
  _volunteers: VolunteerWithCount[];
  _eventName?: string;

  constructor(volunteers: VolunteerWithCount[], eventName?: string) {
    // Filter out first-time volunteers (they have their own section)
    this._volunteers = volunteers.filter((v) => v.vols !== 1);
    this._eventName = eventName;
  }

  title(): string {
    const t = getTranslations();
    return interpolate(t.volunteersTitle, {
      eventName: this._eventName || t.fallbackParkrunName,
    });
  }

  details(): string | undefined {
    if (!this.hasData()) {
      return undefined;
    }
    return sortAndConjoin(this._volunteers.map((v) => v.name));
  }

  private hasData(): boolean {
    return this._volunteers.length > 0;
  }
}
