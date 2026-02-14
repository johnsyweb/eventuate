import { getTranslations, interpolate } from '../translations';

export class UnknownsPresenter {
  _unknowns: string[];
  _eventName?: string;

  constructor(unknowns: string[], eventName?: string) {
    this._unknowns = unknowns;
    this._eventName = eventName;
  }

  title(): string {
    return '';
  }

  details(): string {
    if (!this.hasUnknowns()) {
      return '';
    }

    const t = getTranslations();
    return interpolate(t.unknowns, {
      eventName: this._eventName || t.fallbackParkrunName,
    });
  }

  hasUnknowns(): boolean {
    return this._unknowns.length > 0;
  }
}
