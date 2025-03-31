import { IResultsPageStats } from '../types/IResultsPageStats';
import { Finisher, IFinisher } from '../types/Finisher';
import { Volunteer } from '../types/Volunteer';

function athleteIDFromURI(uri: string): number {
  return Number(uri?.split('/')?.slice(-1));
}

export class ResultsPageExtractor {
  eventName?: string;
  courseLength: number;
  eventDate?: string;
  eventNumber?: string;
  finishers: IFinisher[];
  unknowns: string[];
  newestParkrunners: string[];
  firstTimers: string[];
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

    this.populateVolunteerData();

    this.eventDate =
      resultsPageDocument.querySelector('.format-date')?.textContent ??
      undefined;

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

    this.firstTimers = Array.from(rowElements)
      .filter(
        (tr) =>
          tr.querySelector('td.Results-table-td--ft') &&
          Number(tr.dataset.runs) > 1
      )
      .map((tr) => this.removeSurnameFromJunior(tr.dataset.name));

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

  private volunteerElements(): NodeListOf<HTMLAnchorElement> | [] {
    return this.resultsPageDocument.querySelectorAll(
      '.Results + div h3:first-of-type + p:first-of-type a'
    );
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

  private populateVolunteerData() {
    this.volunteerElements().forEach((v) => {
      const athleteID = athleteIDFromURI(v.href);

      v.dataset.athleteid ??= athleteID.toString();

      if (!v.dataset.vols || !v.dataset.agegroup) {
        const finisher = this.finishers.find((f) => f.athleteID === athleteID);
        if (finisher) {
          v.dataset.vols = finisher?.vols?.toString();
          v.dataset.agegroup = finisher?.agegroup;
          v.dataset.vols_source = 'finisher';
        }
      }
    });
  }

  volunteersList(): Volunteer[] {
    return Array.from(this.volunteerElements()).map((v) => {
      return {
        name: this.removeSurnameFromJunior(v.text),
        link: v.href,
        athleteID: Number(v.dataset.athleteid),
        agegroup: v.dataset.agegroup,
        vols: Number(v.dataset.vols),
      };
    });
  }

  private parseNumericString(value?: string): number {
    if (!value) {
      return NaN;
    }

    return parseInt(value.replace(/[^0-9]/g, ''), 10);
  }
}
