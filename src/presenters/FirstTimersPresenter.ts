import { sortAndConjoin } from '../stringFunctions';
import { getTranslations, interpolate, formatCount } from '../translations';
import { FirstTimerWithFinishCount } from '../types/FirstTimer';

export class FirstTimersPresenter {
  _firstTimers: FirstTimerWithFinishCount[];
  _eventName?: string;

  constructor(firstTimers: FirstTimerWithFinishCount[], eventName?: string) {
    this._firstTimers = firstTimers;
    this._eventName = eventName;
  }

  title(): string {
    const t = getTranslations();
    return interpolate(t.firstTimersTitle, {
      count: formatCount(this._firstTimers.length, t.parkrunner, t.parkrunners),
      eventName: this._eventName || t.fallbackParkrunName,
    });
  }

  details(): string {
    const names = this._firstTimers.map((firstTimer) => firstTimer.name);
    return sortAndConjoin(names);
  }
}
