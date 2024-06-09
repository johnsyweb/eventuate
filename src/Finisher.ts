export class Finisher {
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
    time: string | undefined
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
