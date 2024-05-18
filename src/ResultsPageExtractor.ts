type FactType = {
  finishers: number;
  finishes: number;
  pbs: number;
  volunteers: number;
};

type FinisherType = {
  name: string;
  runs?: string;
  achievement?: string;
  club?: string;
  time?: string;
};

class ResultsPageExtractor {
  eventName?: string;
  courseLength: number;
  eventDate?: string;
  eventNumber?: string;
  finishers: FinisherType[];
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
      resultsPageDocument.querySelector(".format-date")?.textContent || undefined;
    this.eventNumber =
      resultsPageDocument.querySelector(
        ".Results-header > h3 > span:last-child"
      )?.textContent || undefined;

    const timeElements: NodeListOf<HTMLElement> =
      resultsPageDocument.querySelectorAll(
        ".Results-table-row > .Results-table-td--time"
      );
    const rowElements: NodeListOf<HTMLElement> =
      resultsPageDocument.querySelectorAll(".Results-table-row");
    const times = Array.from(timeElements);
    this.finishers = Array.from(rowElements).map((d, i) => {
      return { time: times[i]?.innerText, name: "a parkrunner", ...d.dataset };
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
      new Set(this.finishers.map((p) => p?.club || "").filter((c) => c !== ""))
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
