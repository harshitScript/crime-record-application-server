const { expect } = require("chai");
const errorHandlingMiddleware = require("../middleware/errorHandlingMiddleware");
const notFoundMiddleware = require("../middleware/notFoundMiddleware");

describe("MIDDLEWARE TESTING SUITE >>>", () => {
  describe("notFoundMiddleware", () => {
    it("should return the 404 status if executed.", () => {
      const res = {
        status(arg) {
          expect(arg).to.be.equals(404);
          return this;
        },
        json() {},
      };

      notFoundMiddleware({}, res);
    });
  });
  describe("errorHandlingMiddleware", () => {
    it("should return the custom error status if passed.", () => {
      const error = {
        customStatus: 403,
        message: "dummy error",
      };
      const res = {
        status(arg) {
          expect(arg).to.be.equals(403);
          return this;
        },
        json({ message }) {
          expect(message).to.be.equals("dummy error");
        },
      };
      errorHandlingMiddleware(error, {}, res, () => {});
    });
    it("should return a 500 status code if no custom status if passed. ", () => {
      const error = {
        message: "dummy error",
      };
      const res = {
        status(arg) {
          expect(arg).to.be.equals(500);
          return this;
        },
        json({ message }) {
          expect(message).to.be.equals("dummy error");
        },
      };
      errorHandlingMiddleware(error, {}, res, () => {});
    });
  });
});
