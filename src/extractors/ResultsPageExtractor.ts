import { Finisher, IFinisher } from "../types/Finisher";
import { Volunteer } from "../types/Volunteer";

function athleteIDFromURI(uri: string): number {
  return Number(uri?.split("/")?.slice(-1));
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
  facts = { finishers: 0, finishes: 0, pbs: 0, volunteers: 0 };
  resultsPageDocument: Document;

  constructor(resultsPageDocument: Document) {
    this.resultsPageDocument = resultsPageDocument;
    this.eventName =
      resultsPageDocument.querySelector(".Results-header > h1")?.textContent ??
      undefined;
    this.courseLength = this.eventName?.includes("junior parkrun") ? 2 : 5;

    const rowElements: NodeListOf<HTMLElement> =
      resultsPageDocument.querySelectorAll(".Results-table-row");

    this.finishers = Array.from(rowElements).map(
      (d) =>
        new Finisher(
          this.removeSurenameFromJunior(d.dataset.name),
          d.dataset.agegroup,
          d.dataset.club,
          d.dataset.gender,
          d.dataset.position,
          d.dataset.runs,
          d.dataset.vols,
          d.dataset.agegrade,
          d.dataset.achievement,
          d.querySelector(".Results-table-td--time .compact")?.textContent ??
            undefined,
          athleteIDFromURI(
            (d.querySelector(".Results-table-td--name a") as HTMLAnchorElement)
              ?.href
          )
        )
    );

    this.populateVolunteerData();

    this.eventDate =
      resultsPageDocument.querySelector(".format-date")?.textContent ??
      undefined;

    this.eventNumber =
      resultsPageDocument.querySelector(
        ".Results-header > h3 > span:last-child"
      )?.textContent || undefined;

    this.unknowns = this.finishers
      .filter((p) => Number(p.runs) === 0)
      .map(() => "Unknown");

    
    this.newestParkrunners = this.finishers
      .filter((p) => Number(p.runs) === 1)
      .map((p) => p.name);

    this.firstTimers = Array.from(rowElements)
      ?.filter((tr) => tr.querySelector("td.Results-table-td--ft") && Number(tr.dataset.runs) > 1)
      ?.map((tr) => tr.dataset.name as string);

    this.finishersWithNewPBs = this.finishers
      .filter((p) => p.achievement === "New PB!")
      .map((p) => `${p.name} (${p.time})`);

    this.runningWalkingGroups = Array.from(
      new Set(this.finishers.map((p) => p?.club || "").filter((c) => c !== ""))
    );

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

  private volunteerElements(): NodeListOf<HTMLAnchorElement> | [] {
    return this.resultsPageDocument.querySelectorAll(
      ".Results + div h3:first-of-type + p:first-of-type a"
    );
  }

  removeSurenameFromJunior(name?: string): string {
    if (!name || this.courseLength == 5) {
      return name ?? "";
    } else {
      const parts = name.split(" ");
      if (parts.length === 2) {
        return parts[0];
      }
    }

    return name.replace(/[-' A-Z]+$/, "");
  }

  private populateVolunteerData() {
    this.volunteerElements().forEach((v) => {
      const athleteID = athleteIDFromURI(v.href);

      if (!v.dataset.athleteid) {
        v.dataset.athleteid = athleteID.toString();
      }

      if (!v.dataset.vols || !v.dataset.agegroup) {
        const finisher = this.finishers.find((f) => f.athleteID === athleteID);
        if (finisher) {
          v.dataset.vols = finisher?.vols?.toString();
          v.dataset.agegroup = finisher?.agegroup;
          v.dataset.vols_source = "finisher";
        }
      }
    });
  }

  volunteersList(): Volunteer[] {
    return Array.from(this.volunteerElements()).map((v) => {
      return {
        name: this.removeSurenameFromJunior(v.innerText),
        link: v.href,
        athleteID: Number(v.dataset.athleteid),
        agegroup: v.dataset.agegroup,
        vols: Number(v.dataset.vols),
      };
    });
  }
}
