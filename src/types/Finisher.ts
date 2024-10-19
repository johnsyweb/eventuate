import { IFinisher } from "./IFinisher";

export interface IFinisher {
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
}export interface IFinisher {
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
  athleteID?: number;
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
  athleteID?: number;

  constructor(
    name?: string,
    agegroup?: string,
    club?: string,
    gender?: string,
    position?: string,
    runs?: string,
    vols?: string,
    agegrade?: string,
    achievement?: string,
    time?: string,
    athleteID?: number
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
    this.athleteID = athleteID;
  }

  isUnknown(): boolean {
    return this.runs === "0";
  }
}

