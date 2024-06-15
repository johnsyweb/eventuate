interface IFinisher {
  name: string;
  agegroup?: string;
  club?: string;
  gender?: string;
  position?: string;
  runs: string;
  vols?: string;
  agegrade?: string;
  achievement?: string;
  time?: string;
}

export class Finisher implements IFinisher {
  name: string;
  agegroup?: string;
  club?: string;
  gender?: string;
  position?: string;
  runs: string;
  vols?: string;
  agegrade?: string;
  achievement?: string;
  time?: string;

  constructor(
    name: string | undefined,
    agegroup: string | undefined,
    club: string | undefined,
    gender: string | undefined,
    position: string | undefined,
    runs: string | undefined,
    vols: string | undefined,
    agegrade: string | undefined,
    achievement: string | undefined,
    time: string | undefined,
  ) {
    this.name = name ?? "a parkrunner";
    this.agegroup = agegroup;
    this.club = club;
    this.gender = gender;
    this.position = position;
    this.runs = runs ?? "0";
    this.vols = vols;
    this.agegrade = agegrade;
    this.achievement = achievement;
    this.time = time;
  }

  isUnknown(): boolean {
    return this.runs === "0";
  }
}

type FactType = {
  finishers: number;
  finishes: number;
  pbs: number;
  volunteers: number;
};

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
  volunteersList!: { name: string; link: string }[];

  facts = { finishers: 0, finishes: 0, pbs: 0, volunteers: 0 };

  constructor(resultsPageDocument: Document) {
    this.eventName =
      resultsPageDocument.querySelector(".Results-header > h1")?.textContent ||
      undefined;

    this.courseLength = this.eventName?.includes("junior parkrun") ? 2 : 5;
    this.eventDate =
      resultsPageDocument.querySelector(".format-date")?.textContent ??
      undefined;

    this.eventNumber =
      resultsPageDocument.querySelector(
        ".Results-header > h3 > span:last-child",
      )?.textContent || undefined;

    const timeElements: NodeListOf<HTMLElement> =
      resultsPageDocument.querySelectorAll(
        ".Results-table-row > .Results-table-td--time",
      );
    const rowElements: NodeListOf<HTMLElement> =
      resultsPageDocument.querySelectorAll(".Results-table-row");
    const times = Array.from(timeElements);
    this.finishers = Array.from(rowElements).map((d, i) => {
      var finisher = new Finisher(
        d.dataset.name,
        d.dataset.agegroup,
        d.dataset.club,
        d.dataset.gender,
        d.dataset.position,
        d.dataset.runs,
        d.dataset.vols,
        d.dataset.agegrade,
        d.dataset.achievement,
        times[i]?.innerText,
      );
      return finisher;
    });

    this.unknowns = this.finishers
      .filter((p) => Number(p.runs) === 0)
      .map((_) => "Unknown");

    this.newestParkrunners = this.finishers
      .filter((p) => Number(p.runs) === 1)
      .map((p) => p.name);

    this.firstTimers = this.finishers
      .filter((p) => p.achievement === "First Timer!" && Number(p.runs) > 1)
      .map((p) => p.name);

    this.finishersWithNewPBs = this.finishers
      .filter((p) => p.achievement === "New PB!")
      .map((p) => `${p.name} (${p.time})`);

    this.runningWalkingGroups = Array.from(
      new Set(this.finishers.map((p) => p?.club || "").filter((c) => c !== "")),
    );

    const volunteerElements: NodeListOf<HTMLAnchorElement> | undefined =
      resultsPageDocument
        ?.querySelector(".Results")
        ?.nextElementSibling?.querySelector("p")
        ?.querySelectorAll("a");

    this.volunteersList = Array.from(volunteerElements || []).map((v) => {
      return { name: v.innerText, link: v.href };
    });

    const statElements: NodeListOf<HTMLDivElement> =
      document.querySelectorAll(".aStat");

    statElements?.forEach((e) => {
      const key = e.firstChild?.textContent
        ?.trim()
        ?.toLocaleLowerCase()
        ?.replace(":", "");
      if (
        key !== undefined &&
        e.firstElementChild !== null &&
        Object.hasOwn(this.facts, key)
      ) {
        const value = Number(e.firstElementChild.textContent);
        switch (key) {
          case "finishers":
            this.facts.finishers = value;
            break;
          case "finishes":
            this.facts.finishes = value;
            break;
          case "pbs":
            this.facts.pbs = value;
            break;
          case "volunteers":
            this.facts.volunteers = value;
            break;
        }
      }
    });
  }
}
