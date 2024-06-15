import {
  IFinisher,
  fiveKFinishersToMilestones,
} from "../../src/transformers/fiveKFinishersToMilestones";
import { Finisher } from "../../src/extractors/ResultsPageExtractor";

describe(fiveKFinishersToMilestones, () => {
  var mickey: IFinisher;

  beforeEach(() => {
    mickey = new Finisher(
      "Mickey",
      "agegroup",
      "club",
      "gender",
      "position",
      "runs",
      "vols",
      "agegrade",
      "achievement",
      "59:59",
    );
  });

  test("Adult 10", () => {
    mickey.name = "Too Old!";
    mickey.agegroup = "VM100";
    mickey.runs = "10";

    expect(fiveKFinishersToMilestones([mickey])).toEqual([]);
  });

  test("Junior 10", () => {
    mickey.name = "Just right!";
    mickey.agegroup = "JM10";
    mickey.runs = "10";
    expect(fiveKFinishersToMilestones([mickey])).toEqual([
      { finished: 10, icon: "⚪︎", names: ["Just right!"] },
    ]);
  });

  test("49", () => {
    mickey.runs = "49";
    expect(fiveKFinishersToMilestones([mickey])).toEqual([]);
  });

  test("50", () => {
    mickey.runs = "50";
    expect(fiveKFinishersToMilestones([mickey])).toEqual([
      { finished: 50, icon: "🔴", names: ["Mickey"] },
    ]);
  });

  test("51", () => {
    mickey.runs = "51";
    expect(fiveKFinishersToMilestones([mickey])).toEqual([]);
  });
});
