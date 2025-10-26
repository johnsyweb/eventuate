import { sortAndConjoin } from '../stringFunctions';
import {
  getTranslations,
  interpolate,
  formatCount,
} from '../translations';

export class FirstTimersPresenter {
  _firstTimers: string[];
  _eventName?: string;

  constructor(firstTimers: string[], eventName?: string) {
    this._firstTimers = firstTimers;
    this._eventName = eventName;
  }

  title(): string {
    const t = getTranslations();
    return interpolate(t.firstTimersTitle, {
      count: formatCount(
        this._firstTimers.length,
        t.parkrunner,
        t.parkrunners
      ),
      eventName: this._eventName || t.fallbackParkrunName,
    });
  }

  details(): string {
    return sortAndConjoin(this._firstTimers);
  }
}
