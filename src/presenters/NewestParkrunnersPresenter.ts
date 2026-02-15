import { sortAndConjoin } from '../stringFunctions';
import { getTranslations, interpolate, formatCount } from '../translations';
import { Presenter } from './Presenter';

export class NewestParkrunnersPresenter implements Presenter {
  _newestParkrunners: string[];

  constructor(newestParkrunners: string[]) {
    this._newestParkrunners = newestParkrunners;
  }

  title(): string {
    const t = getTranslations();
    return interpolate(t.newestParkrunnersTitle, {
      count: formatCount(
        this._newestParkrunners.length,
        t.parkrunner,
        t.parkrunners
      ),
    });
  }

  details(): string | undefined {
    if (!this.hasData()) {
      return undefined;
    }
    return sortAndConjoin(this._newestParkrunners);
  }

  private hasData(): boolean {
    return this._newestParkrunners.length > 0;
  }
}
