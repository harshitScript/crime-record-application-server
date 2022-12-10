const { expect } = require("chai");
const mongoose = require("mongoose");
const createUserController = require("../controllers/user/createUserController");
const User = require("../models/user");
const { config } = require("dotenv");
config();

describe("USER CONTROLLERS TESTING SUITE >>>", () => {
  describe("createUserController", () => {
    before((done) => {
      mongoose.connect(process.env.MONGO_URI).then(() => done());
    });
    after((done) => {
      User.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done());
    });
    it("should add a user if all goes fine", (done) => {
      const req = {
        body: {
          name: "test",
          email: "test@test.com",
          password: "test@123",
          permissions: ["test"],
        },
        file: {
          location: "test",
          key: "test",
        },
      };
      const res = {
        status(code) {
          expect(code).to.be.equals(201);
          return this;
        },
        json(obj) {
          expect(obj).to.have.property("userId");
          return this;
        },
      };
      createUserController(req, res, () => {}).then((res) => {
        expect(res).to.be.equals(1);
        done();
      });
    });
  });
});
