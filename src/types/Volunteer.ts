import { VolunteerPageExtractor } from "../extractors/VolunteerPageExtractor";

export interface Volunteer {
  name: string;
  link: string;
  athleteID: number;
  vols?: number;
  agegroup?: string;
}

export class VolunteerWithCount implements Volunteer {
  name: string;
  link: string;
  athleteID: number;
  vols: number;
  agegroup: string;
  volunteerDataSource: URL;
  promisedVols?: Promise<VolunteerPageExtractor>;

  constructor(volunteer: Volunteer) {
    this.name = volunteer.name;
    this.link = volunteer.link;
    const url = new URL(volunteer.link);
    this.volunteerDataSource = new URL(
      url.pathname.split("/").slice(2).join("/"),
      url.origin,
    );

    this.athleteID = volunteer.athleteID;
    this.vols = volunteer.vols ?? 0;
    this.agegroup = volunteer.agegroup ?? "";
    if (!this.vols) {
      this.promisedVols = this.fetchdata();
    }
  }

  fetchdata(): Promise<VolunteerPageExtractor> | undefined {
    const cached = sessionStorage.getItem(this.athleteID.toString());
    if (cached) {
      const data = JSON.parse(cached);
      this.vols = Number(data.vols);
      this.agegroup = data.agegroup;
    } else {
      return fetch(this.volunteerDataSource)
        .then((r) => r.text())
        .then((doc) => this.volsFromHtml(doc));
    }
    return undefined;
  }

  private volsFromHtml(html: string): VolunteerPageExtractor {
    const vpe = new VolunteerPageExtractor(
      new DOMParser().parseFromString(html, "text/html"),
    );

    this.vols = vpe.vols;
    this.agegroup = vpe.agegroup;

    sessionStorage.setItem(this.athleteID.toString(), JSON.stringify(vpe));

    return vpe;
  }
}
