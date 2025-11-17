import { ResultsPageExtractor } from '../extractors/ResultsPageExtractor';
import { IFinisher } from '../types/Finisher';
import { getTranslations, interpolate } from '../translations';

const ARM_REACH_SECONDS = 15;

function timeToSeconds(timeStr?: string): number | null {
  if (!timeStr) {
    return null;
  }

  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  if (parts.some(isNaN) || (parts.length !== 2 && parts.length !== 3)) {
    return null;
  }

  const [hours = 0, minutes, seconds] =
    parts.length === 2 ? [0, ...parts] : parts;
  return hours * 3600 + minutes * 60 + seconds;
}

function isUnder11(agegroup?: string): boolean {
  if (!agegroup) {
    return false;
  }
  return agegroup === 'JM10' || agegroup === 'JW10';
}

function isAdult18Plus(agegroup?: string): boolean {
  return !!(agegroup?.startsWith('S') || agegroup?.startsWith('V'));
}

interface NearestAdult {
  finisher: IFinisher;
  timeDelta: number;
}

function findNearestAdult(
  child: IFinisher,
  allFinishers: IFinisher[]
): NearestAdult | null {
  const childTime = timeToSeconds(child.time);
  if (childTime === null) {
    return null;
  }

  const adults = allFinishers.filter(
    (f) => isAdult18Plus(f.agegroup) && timeToSeconds(f.time) !== null
  );

  if (adults.length === 0) {
    return null;
  }

  let nearest: NearestAdult | null = null;
  let minDelta = Infinity;

  for (const adult of adults) {
    const adultTime = timeToSeconds(adult.time);
    if (adultTime === null) {
      continue;
    }

    const delta = Math.abs(adultTime - childTime);
    if (delta < minDelta) {
      minDelta = delta;
      nearest = { finisher: adult, timeDelta: delta };
    }
  }

  return nearest;
}

interface ChildCheckResult {
  child: IFinisher;
  nearest: NearestAdult | null;
}

export class JuniorSupervisionPresenter {
  _extractor: ResultsPageExtractor;
  _hasSupervisionIssue: boolean;
  _childCheckResults: ChildCheckResult[];

  constructor(extractor: ResultsPageExtractor) {
    this._extractor = extractor;
    const result = this.checkSupervision();
    this._hasSupervisionIssue = result.hasIssue;
    this._childCheckResults = result.checkResults;
  }

  private checkSupervision(): {
    hasIssue: boolean;
    checkResults: ChildCheckResult[];
  } {
    if (this._extractor.courseLength !== 5) {
      return { hasIssue: false, checkResults: [] };
    }

    const children = this._extractor.finishers.filter((f) =>
      isUnder11(f.agegroup)
    );

    if (children.length === 0) {
      return { hasIssue: false, checkResults: [] };
    }

    const checkResults: ChildCheckResult[] = children.map((child) => ({
      child,
      nearest: findNearestAdult(child, this._extractor.finishers),
    }));

    const hasIssue = checkResults.some((result) => {
      if (!result.nearest) {
        return true;
      }
      return result.nearest.timeDelta > ARM_REACH_SECONDS;
    });

    if (hasIssue) {
      this.logDiagnostics(checkResults);
    }

    return { hasIssue, checkResults };
  }

  protected getSearchString(): string {
    return typeof window !== 'undefined' ? window.location.search : '';
  }

  private logDiagnostics(checkResults: ChildCheckResult[]): void {
    const urlParams = new URLSearchParams(this.getSearchString());
    const shouldLog =
      urlParams.has('debug-juniors') || urlParams.has('log-juniors');

    if (!shouldLog) {
      return;
    }

    for (const result of checkResults) {
      if (result.nearest) {
        console.log('Junior supervision check:', {
          child: {
            name: result.child.name,
            agegroup: result.child.agegroup,
            time: result.child.time,
            position: result.child.position,
          },
          nearestAdult: {
            name: result.nearest.finisher.name,
            agegroup: result.nearest.finisher.agegroup,
            time: result.nearest.finisher.time,
            position: result.nearest.finisher.position,
          },
          timeDeltaSeconds: result.nearest.timeDelta,
        });
      } else {
        console.log('Junior supervision check:', {
          child: {
            name: result.child.name,
            agegroup: result.child.agegroup,
            time: result.child.time,
            position: result.child.position,
          },
          nearestAdult: null,
          timeDeltaSeconds: null,
        });
      }
    }
  }

  hasSupervisionIssue(): boolean {
    return this._hasSupervisionIssue;
  }

  details(): string {
    if (!this._hasSupervisionIssue) {
      return '';
    }

    const t = getTranslations();
    return interpolate(t.juniorSupervisionReminder, {
      eventName: this._extractor.eventName || t.fallbackParkrunName,
    });
  }
}

