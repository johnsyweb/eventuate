import { pluralize } from "../src/stringFunctions";

describe("stringFunctions", () => {
  describe("pluralize", () => {
    it("is plural when there is nothing to pluralize", () => {
      expect(pluralize("mouse", "mice", 0)).toBe("0 mice");
    });

    it("is singular when there is one to pluralize", () => {
      expect(pluralize("mouse", "mice", 1)).toBe("mouse");
    });

    it("is plural when there are two to pluralize", () => {
      expect(pluralize("mouse", "mice", 2)).toBe("2 mice");
    });
  });
});
