import { getTranslations, interpolate } from '../translations';
import { IResultsPageStats } from '../types/IResultsPageStats';
import { Presenter } from './Presenter';

export class FactsPresenter implements Presenter {
  _eventName?: string;
  _courseLength: number;
  _facts: IResultsPageStats;
  _isLaunchEvent: boolean;

  constructor(
    eventName: string | undefined,
    courseLength: number,
    facts: IResultsPageStats,
    isLaunchEvent: boolean
  ) {
    this._eventName = eventName;
    this._courseLength = courseLength;
    this._facts = facts;
    this._isLaunchEvent = isLaunchEvent;
  }

  details(): string | undefined {
    // Don't show facts for launch events
    if (this._isLaunchEvent) {
      return undefined;
    }

    const t = getTranslations();

    return [
      interpolate(t.facts.sinceStarted, {
        eventName: this._eventName || t.fallbackParkrunName,
      }),
      interpolate(t.facts.brilliantParkrunners, {
        count: this._facts.finishers?.toLocaleString() || '0',
      }),
      interpolate(t.facts.grandTotal, {
        count: this._facts.finishes?.toLocaleString() || '0',
      }),
      interpolate(t.facts.coveredDistance, {
        distance: (
          (this._facts.finishes || 0) * this._courseLength
        ).toLocaleString(),
      }),
      interpolate(t.facts.celebratingPBs, {
        count: this._facts.pbs?.toLocaleString() || '0',
      }),
      interpolate(t.facts.gratefulToVolunteers, {
        count: this._facts.volunteers?.toLocaleString() || '0',
      }),
    ].join('');
  }

  title(): string {
    return '';
  }
}
