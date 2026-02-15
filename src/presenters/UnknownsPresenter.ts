import { getTranslations, interpolate } from '../translations';
import { Presenter } from './Presenter';

export class UnknownsPresenter implements Presenter {
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
    if (!this.hasData()) {
      return '';
    }

    const t = getTranslations();
    return interpolate(t.unknowns, {
      eventName: this._eventName || t.fallbackParkrunName,
    });
  }

  hasData(): boolean {
    return this._unknowns.length > 0;
  }

  hasUnknowns(): boolean {
    return this.hasData();
  }
}
