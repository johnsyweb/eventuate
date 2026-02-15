import { getTranslations, interpolate } from '../translations';
import { canonicalResultsPageUrl } from '../urlFunctions';
import { Presenter } from './Presenter';

export class FullResultsPresenter implements Presenter {
  _eventName?: string;
  _eventNumber?: string;
  _currentUrl: string;

  constructor(
    eventName: string | undefined,
    eventNumber: string | undefined,
    currentUrl: string
  ) {
    this._eventName = eventName;
    this._eventNumber = eventNumber;
    this._currentUrl = currentUrl;
  }

  title(): string {
    return '';
  }

  details(): string {
    const t = getTranslations();
    return interpolate(t.fullResults, {
      eventName: this._eventName || t.fallbackParkrunName,
      eventNumber: this._eventNumber || '',
      url: canonicalResultsPageUrl(
        this._eventNumber ?? 'latestresults',
        this._currentUrl
      ),
    });
  }
}
