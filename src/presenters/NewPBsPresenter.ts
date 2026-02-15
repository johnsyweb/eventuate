import { sortAndConjoin } from '../stringFunctions';
import { getTranslations, interpolate, formatCount } from '../translations';
import { Presenter } from './Presenter';

export class NewPBsPresenter implements Presenter {
  _finishersWithNewPBs: string[];
  _eventName?: string;

  constructor(finishersWithNewPBs: string[], eventName?: string) {
    this._finishersWithNewPBs = finishersWithNewPBs;
    this._eventName = eventName;
  }

  title(): string {
    const t = getTranslations();
    return interpolate(t.finishersWithNewPBsTitle, {
      eventName: this._eventName || t.fallbackParkrunName,
      count: formatCount(
        this._finishersWithNewPBs.length,
        t.parkrunner,
        t.parkrunners
      ),
    });
  }

  details(): string | undefined {
    if (!this.hasData()) {
      return undefined;
    }
    return sortAndConjoin(this._finishersWithNewPBs);
  }

  private hasData(): boolean {
    return this._finishersWithNewPBs.length > 0;
  }
}
