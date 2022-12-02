const { expect } = require("chai");
const whoIAmController = require("../controllers/general/whoIAmController");

describe("GENERAL CONTROLLERS TESTING SUITE >>>", () => {
  describe("whoIAmController", () => {
    it("should return the server config obj if executed.", () => {
      const res = {
        json(obj) {
          expect(obj).to.have.property(
            "name",
            "Crime Record Application Server"
          );
          expect(obj).to.have.property("phase", "DEV");
          expect(obj).to.have.property("author", "HARSHIT BHAWSAR");
        },
      };
      whoIAmController({}, res);
    });
  });
});
