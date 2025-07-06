import { VolunteerPageExtractor } from '../extractors/VolunteerPageExtractor';

interface CachedVolunteerData {
  vols: number;
  agegroup: string;
  timestamp: number;
}

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
  private static CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(volunteer: Volunteer, origin: string) {
    this.name = volunteer.name;
    this.link = volunteer.link;
    const url = new URL(volunteer.link, origin);
    this.volunteerDataSource = new URL(
      url.pathname.split('/').slice(2).join('/'),
      url.origin
    );

    this.athleteID = volunteer.athleteID;
    this.vols = volunteer.vols ?? 0;
    this.agegroup = volunteer.agegroup ?? '';
    if (!this.vols) {
      this.promisedVols = this.fetchdata();
    }
  }

  private static getCacheKey(athleteID: number): string {
    return `volunteer_${athleteID}`;
  }

  private static isValidCache(data: CachedVolunteerData): boolean {
    return Date.now() - data.timestamp < VolunteerWithCount.CACHE_EXPIRY;
  }

  private fetchAndExtractData(): Promise<VolunteerPageExtractor> {
    return fetch(this.volunteerDataSource)
      .then((r) => r.text())
      .then((doc) => this.volsFromHtml(doc));
  }

  fetchdata(): Promise<VolunteerPageExtractor> | undefined {
    const cacheKey = VolunteerWithCount.getCacheKey(this.athleteID);
    let cached: string | null = null;

    try {
      cached = localStorage.getItem(cacheKey);
    } catch (err: unknown) {
      console.error('localStorage.getItem failed:', err);
      return this.fetchAndExtractData();
    }

    if (!cached) {
      return this.fetchAndExtractData();
    }

    let data: CachedVolunteerData;
    try {
      data = JSON.parse(cached) as CachedVolunteerData;
    } catch (err: unknown) {
      console.error('JSON.parse failed:', err);
      localStorage.removeItem(cacheKey);
      return this.fetchAndExtractData();
    }

    if (!VolunteerWithCount.isValidCache(data)) {
      localStorage.removeItem(cacheKey);
      return this.fetchAndExtractData();
    }

    this.vols = data.vols;
    this.agegroup = data.agegroup;
    return undefined;
  }

  private volsFromHtml(html: string): VolunteerPageExtractor {
    const vpe = new VolunteerPageExtractor(
      new DOMParser().parseFromString(html, 'text/html')
    );

    this.vols = vpe.vols;
    this.agegroup = vpe.agegroup;

    try {
      const cacheData: CachedVolunteerData = {
        vols: vpe.vols,
        agegroup: vpe.agegroup,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        VolunteerWithCount.getCacheKey(this.athleteID),
        JSON.stringify(cacheData)
      );
    } catch (err: unknown) {
      console.error('localStorage.setItem failed:', err);
    }

    return vpe;
  }
}
