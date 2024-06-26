import { pluralize, sortAndConjoin } from "../stringFunctions";

type MilestoneCelebrations = {
  finished: number;
  icon: string;
  names: string[];
};

export class MilestonePresenter {
  _milestoneCelebrations: MilestoneCelebrations[];
  _milestoneCelebrationsAll: string[];

  constructor(milestoneCelebrations: MilestoneCelebrations[]) {
    this._milestoneCelebrations = milestoneCelebrations;
    this._milestoneCelebrationsAll = this._milestoneCelebrations.flatMap(
      (mc) => mc.names,
    );
  }

  title(): string {
    return `Three cheers to the ${pluralize(
      "parkrunner",
      "parkrunners",
      this._milestoneCelebrationsAll.length,
    )} who earned themselves a new parkrun club shirt this weekend:\n`;
  }

  details() {
    return this._milestoneCelebrations
      .map(
        (mc) =>
          `${mc.icon} ${sortAndConjoin(mc.names)} joined the ${
            mc.finished
          }-club`,
      )
      .join("\n");
  }
}
