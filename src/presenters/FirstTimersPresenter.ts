import { sortAndConjoin } from '../stringFunctions';
import { getTranslations, interpolate, formatCount } from '../translations';
import { FirstTimerWithFinishCount } from '../types/FirstTimer';

export class FirstTimersPresenter {
  protected _firstTimers: FirstTimerWithFinishCount[];
  protected _eventName?: string;

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
    return sortAndConjoin(this.getFirstTimerNames());
  }

  protected getFirstTimerNames(): string[] {
    return this._firstTimers.map((firstTimer) => firstTimer.name);
  }

  protected getSortedFirstTimers(): FirstTimerWithFinishCount[] {
    return [...this._firstTimers].sort((a, b) => a.name.localeCompare(b.name));
  }
}
