import { sortAndConjoin } from '../stringFunctions';
import { getTranslations, interpolate } from '../translations';
import { FirstTimerWithFinishCount } from '../types/FirstTimer';

export class FirstTimersLaunchEventPresenter {
  _firstTimersWithCounts: FirstTimerWithFinishCount[];
  _eventName?: string;

  constructor(
    firstTimersWithCounts: FirstTimerWithFinishCount[],
    eventName?: string
  ) {
    this._firstTimersWithCounts = firstTimersWithCounts;
    this._eventName = eventName;
  }

  title(): string {
    const t = getTranslations();
    const count = this._firstTimersWithCounts.length;

    // Use singular form for 1, plural for others
    let countText: string;
    if (count === 1) {
      countText = 'parkrunner';
    } else {
      countText = `${count} parkrunners`;
    }

    return interpolate(t.firstTimersTitle, {
      count: countText,
      eventName: this._eventName || t.fallbackParkrunName,
    });
  }

  details(): string {
    const t = getTranslations();

    // Format names with finish counts in parentheses
    const namesWithCounts = this._firstTimersWithCounts
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((ft) => `${ft.name} (${ft.finishes})`);

    const namesText = sortAndConjoin(namesWithCounts);

    // Calculate total finishes
    const totalFinishes = this._firstTimersWithCounts.reduce(
      (sum, ft) => sum + ft.finishes,
      0
    );

    const closingMessage = interpolate(t.firstTimersLaunchEventClosing, {
      total: totalFinishes.toLocaleString(),
    });

    return `${namesText}. ${closingMessage}`;
  }
}
