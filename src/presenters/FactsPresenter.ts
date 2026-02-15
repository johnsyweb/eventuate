import { getTranslations, interpolate } from '../translations';
import { IResultsPageStats } from '../types/IResultsPageStats';
import { Presenter } from './Presenter';

export class FactsPresenter implements Presenter {
  _eventName?: string;
  _courseLength: number;
  _facts: IResultsPageStats;

  constructor(
    eventName: string | undefined,
    courseLength: number,
    facts: IResultsPageStats
  ) {
    this._eventName = eventName;
    this._courseLength = courseLength;
    this._facts = facts;
  }

  details(): string {
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

  hasData(): boolean {
    return true;
  }
}
