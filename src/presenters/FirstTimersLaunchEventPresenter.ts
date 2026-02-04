import { sortAndConjoin } from '../stringFunctions';
import { getTranslations, interpolate } from '../translations';
import { FirstTimersPresenter } from './FirstTimersPresenter';

export class FirstTimersLaunchEventPresenter extends FirstTimersPresenter {
  details(): string {
    const t = getTranslations();

    // Format names with finish counts in parentheses
    const namesWithCounts = this.getSortedFirstTimers().map(
      (ft) => `${ft.name} (${ft.finishes})`
    );

    const namesText = sortAndConjoin(namesWithCounts);

    // Calculate total finishes
    const totalFinishes = this._firstTimers.reduce(
      (sum, ft) => sum + ft.finishes,
      0
    );

    const closingMessage = interpolate(t.firstTimersLaunchEventClosing, {
      total: totalFinishes.toLocaleString(),
    });

    return `${namesText}. ${closingMessage}`;
  }
}
