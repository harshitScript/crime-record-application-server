const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Configuration = require("../models/configuration");
const configurationController = require("../controllers/general/configurationController");
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
          expect(obj).to.have.property("phase", "TEST");
          expect(obj).to.have.property("author", "HARSHIT BHAWSAR");
        },
      };
      whoIAmController({}, res);
    });
  });
  describe("configurationController", () => {
    before((done) => {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          const configuration = new Configuration({
            config: {},
            tenant: "test",
            theme: {
              primaryColor: "1111111",
              secondaryColor: "1111111",
              primaryShade: "1111111",
              secondaryShade: "1111111",
            },
          });
          return configuration.save();
        })
        .then(() => done())
        .catch((error) => console.log("The error => ", error));
    });
    after((done) => {
      Configuration.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done());
    });
    it("should throw error if tenant configuration not found.", (done) => {
      const req = {
        params: {
          tenant: "xyz",
        },
      };
      sinon.stub(Configuration, "findOne");
      Configuration.findOne.returns(null);

      configurationController(req, {}, () => {}).then((res) => {
        Configuration.findOne.restore();
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should throw error if database refused connection.", (done) => {
      const req = {
        params: {
          tenant: "xyz",
        },
      };
      sinon.stub(Configuration, "findOne");
      Configuration.findOne.throws();

      configurationController(req, {}, () => {}).then((res) => {
        Configuration.findOne.restore();
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should return the response if all goes well.", (done) => {
      const req = {
        params: {
          tenant: "test",
        },
      };
      const res = {
        json() {},
      };
      configurationController(req, res, () => {}).then((res) => {
        expect(res).to.be.equals(1);
        done();
      });
    });
  });
});
