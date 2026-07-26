import { IResultsPageStats } from '../types/IResultsPageStats';
import { Finisher, IFinisher } from '../types/Finisher';
import { VolunteerWithCount } from '../types/VolunteerWithCount';
import { FirstTimerWithFinishCount } from '../types/FirstTimer';

function athleteIDFromURI(uri: string): number {
  return Number(uri?.split('/')?.slice(-1));
}

export class ResultsPageExtractor {
  eventName?: string;
  courseLength: number;
  eventNumber?: string;
  finishers: IFinisher[];
  unknowns: string[];
  newestParkrunners: string[];
  firstTimersWithFinishCounts: FirstTimerWithFinishCount[];
  finishersWithNewPBs: string[];
  runningWalkingGroups: string[];
  facts: IResultsPageStats;
  resultsPageDocument: Document;

  constructor(resultsPageDocument: Document) {
    this.resultsPageDocument = resultsPageDocument;
    this.eventName =
      resultsPageDocument.querySelector('.Results-header > h1')?.textContent ??
      undefined;
    this.courseLength = this.eventName?.includes('junior parkrun') ? 2 : 5;

    const rowElements: NodeListOf<HTMLElement> =
      resultsPageDocument.querySelectorAll('.Results-table-row');

    this.finishers = Array.from(rowElements).map(
      (d) =>
        new Finisher(
          this.removeSurnameFromJunior(d.dataset.name),
          d.dataset.agegroup,
          d.dataset.club,
          d.dataset.gender,
          d.dataset.position,
          d.dataset.runs,
          d.dataset.vols,
          d.dataset.agegrade,
          d.dataset.achievement,
          d.querySelector('.Results-table-td--time .compact')?.textContent ??
            undefined,
          athleteIDFromURI(
            (d.querySelector('.Results-table-td--name a') as HTMLAnchorElement)
              ?.href
          )
        )
    );

    this.eventNumber =
      resultsPageDocument.querySelector(
        '.Results-header > h3 > span:last-child'
      )?.textContent || undefined;

    this.unknowns = this.finishers
      .filter((p) => Number(p.runs) === 0)
      .map(() => 'Unknown');

    this.newestParkrunners = this.finishers
      .filter((p) => Number(p.runs) === 1)
      .map((p) => p.name);

    this.firstTimersWithFinishCounts = Array.from(rowElements)
      .filter(
        (tr) =>
          tr.querySelector('td.Results-table-td--ft') &&
          Number(tr.dataset.runs) > 1
      )
      .map((tr) => ({
        name: this.removeSurnameFromJunior(tr.dataset.name),
        finishes: Number(tr.dataset.runs),
      }));

    this.finishersWithNewPBs = Array.from(rowElements)
      .filter((tr) => tr.querySelector('td.Results-table-td--pb'))
      .map(
        (tr) =>
          `${this.removeSurnameFromJunior(tr.dataset.name)} (${tr.querySelector('.Results-table-td--time .compact')?.textContent})`
      );

    this.runningWalkingGroups = Array.from(
      new Set(this.finishers.map((p) => p?.club || '').filter((c) => c !== ''))
    );

    const [, finishers, finishes, volunteers, pbs, , ,] = Array.from(
      resultsPageDocument.querySelectorAll('.aStat .num')
    ).map((s) => this.parseNumericString(s.textContent?.trim()));

    this.facts = { finishers, finishes, volunteers, pbs };
  }

  isLaunchEvent(): boolean {
    const normalizedEventNumber = this.eventNumber?.trim().replace('#', '');
    return normalizedEventNumber === '1';
  }

  private volunteerElements(): NodeListOf<HTMLTableRowElement> | [] {
    return this.resultsPageDocument.querySelectorAll('.Volunteers-table-row');
  }

  removeSurnameFromJunior(name?: string): string {
    if (!name || this.courseLength == 5) {
      return name ?? '';
    } else {
      const parts = name.split(' ');
      if (parts.length === 2) {
        return parts[0];
      }
    }

    return name.replace(/[-' A-Z]+$/, '');
  }

  volunteersList(): VolunteerWithCount[] {
    return Array.from(this.volunteerElements()).map((row) => {
      const profileAnchor = row.querySelector(
        '.Volunteers-table-td--name a'
      ) as HTMLAnchorElement | null;
      const profileUrl = profileAnchor?.href;
      return {
        name: this.removeSurnameFromJunior(row.dataset.name),
        vols: Number(row.dataset.volunteercredits),
        vClub: this.volunteerClubFromRow(row),
        athleteID: profileUrl ? athleteIDFromURI(profileUrl) : undefined,
        profileUrl: profileUrl || undefined,
      };
    });
  }

  private volunteerClubFromRow(row: HTMLTableRowElement): number | undefined {
    const anchor = row.querySelector(
      'a.Results-table--clubIcon[class*="milestone-v"]'
    );
    if (!anchor) {
      return undefined;
    }
    for (const className of Array.from(anchor.classList)) {
      const fromClass = /^milestone-v(\d+)$/.exec(className);
      if (fromClass) {
        return Number(fromClass[1]);
      }
    }
    const text = anchor.textContent?.trim() ?? '';
    const fromText = /^v(\d+)$/.exec(text);
    return fromText ? Number(fromText[1]) : undefined;
  }

  private parseNumericString(value?: string): number {
    if (!value) {
      return NaN;
    }

    return parseInt(value.replace(/[^0-9]/g, ''), 10);
  }
}
