import { getTranslations } from '../translations';
import { Presenter } from './Presenter';

export class ClosingPresenter implements Presenter {
  title(): string {
    return '&#x1f333;';
  }

  details(): string {
    const t = getTranslations();
    return t.closing;
  }
}
