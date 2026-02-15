import { getTranslations, interpolate } from '../translations';
import { Presenter } from './Presenter';

export class ClosingPresenter implements Presenter {
  private _courseLength: number;

  constructor(courseLength: number) {
    this._courseLength = courseLength;
  }

  title(): string {
    return '';
  }

  details(): string {
    const t = getTranslations();
    return interpolate(t.closing, {
      courseLength: this._courseLength,
    });
  }
}
