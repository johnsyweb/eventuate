import { getTranslations, interpolate } from '../translations';
import { futureRosterUrl } from '../urlFunctions';
import { Presenter } from './Presenter';

export class VolunteerInvitationPresenter implements Presenter {
  _eventName?: string;
  _currentUrl: string;

  constructor(eventName: string | undefined, currentUrl: string) {
    this._eventName = eventName;
    this._currentUrl = currentUrl;
  }

  title(): string {
    return '';
  }

  details(): string {
    const t = getTranslations();
    return interpolate(t.volunteerInvitation, {
      eventName: this._eventName || t.fallbackParkrunName,
      url: futureRosterUrl(this._currentUrl),
    });
  }
}
