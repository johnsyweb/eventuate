import { getTranslations, interpolate, formatCount } from '../translations';
import { Presenter } from './Presenter';

export class IntroductionPresenter implements Presenter {
  _finisherCount: number;
  _volunteerCount: number;
  _eventName?: string;
  _eventNumber?: string;

  constructor(
    finisherCount: number,
    volunteerCount: number,
    eventName?: string,
    eventNumber?: string
  ) {
    this._finisherCount = finisherCount;
    this._volunteerCount = volunteerCount;
    this._eventName = eventName;
    this._eventNumber = eventNumber;
  }

  title(): string {
    return '';
  }

  details(): string {
    const t = getTranslations();
    return interpolate(t.introduction, {
      finisherCount: formatCount(this._finisherCount, t.finisher, t.finishers),
      volunteerCount: formatCount(
        this._volunteerCount,
        t.volunteer,
        t.volunteers
      ),
      eventName: this._eventName || t.fallbackParkrunName,
      eventNumber: this._eventNumber || '',
    });
  }
}
