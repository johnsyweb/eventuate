import { sortAndConjoin } from '../stringFunctions';
import { getTranslations, interpolate, formatCount } from '../translations';
import { Presenter } from './Presenter';

export class GroupsPresenter implements Presenter {
  _runningWalkingGroups: string[];

  constructor(runningWalkingGroups: string[]) {
    this._runningWalkingGroups = runningWalkingGroups;
  }

  title(): string {
    const t = getTranslations();
    return interpolate(t.runningWalkingGroupsTitle, {
      count: formatCount(
        this._runningWalkingGroups.length,
        t.activeGroup,
        t.walkingAndRunningGroups
      ),
    });
  }

  details(): string | undefined {
    if (!this.hasData()) {
      return undefined;
    }
    return sortAndConjoin(this._runningWalkingGroups);
  }

  private hasData(): boolean {
    return this._runningWalkingGroups.length > 0;
  }
}
