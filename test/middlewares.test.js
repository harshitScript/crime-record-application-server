const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const authenticationCheckerMIddleware = require("../middleware/authenticationCheckerMIddleware");
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
  describe("authenticationCheckerMIddleware", () => {
    it("Should throw an error if authorization header not found.", () => {
      const req = {
        headers: {},
      };
      expect(authenticationCheckerMIddleware(req, {}, () => {})).to.be.equals(
        0
      );
    });
    it("Should throw an error if authorization token expired.", () => {
      const req = {
        headers: { authorization: "Bearer some-dummy-auth-token" },
      };
      sinon.stub(jwt, "verify");
      jwt.verify.returns(null);
      expect(authenticationCheckerMIddleware(req, {}, () => {})).to.be.equals(
        0
      );
      jwt.verify.restore();
    });
    it("Should append the userId to the req object if authorization token is verified.", () => {
      const req = {
        headers: { authorization: "Bearer some-dummy-auth-token" },
      };
      sinon.stub(jwt, "verify");
      jwt.verify.returns({ userId: "a_dummy_user_id" });
      authenticationCheckerMIddleware(req, {}, () => {});
      expect(req).to.have.property("userId", "a_dummy_user_id");
      jwt.verify.restore();
    });
  });
});
