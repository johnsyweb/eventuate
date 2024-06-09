import { MilestonePresenter } from "../../src/presenters/MilestonePresenter";

describe("MilestonePresenter", () => {
  it("is empty when nothing to celebrate", () => {
    expect(new MilestonePresenter([]).details()).toBe("");
  });
});
