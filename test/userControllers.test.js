const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const createUserController = require("../controllers/user/createUserController");
const User = require("../models/user");
const { config } = require("dotenv");
const loginUserController = require("../controllers/user/loginUserController");
const getUserInfoController = require("../controllers/user/getUserInfoController");
const listUsersController = require("../controllers/user/listUsersController");
const deleteUserController = require("../controllers/user/deleteUserController");
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
          permissions: null,
          criminalsList: [],
          mobile: "6666666666",
          creator: "639c971579cd39c18dab3527",
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
  describe("loginUserController", () => {
    before((done) => {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          const user = new User({
            imageData: {
              key: "test",
              url: "test",
            },
            password: "TEST",
            permissions: "root, read",
            email: "test",
            name: "test",
            criminalsList: [],
            mobile: "6666666666",
            creator: "639c971579cd39c18dab3527",
          });

          return user.save();
        })
        .then(() => {
          done();
        });
    });
    after((done) => {
      User.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done());
    });
    it("should throw an error if database refuses to connect.", (done) => {
      sinon.stub(User, "findOne");
      User.findOne.throws();
      const req = {
        body: {
          email: "test",
          password: "test",
        },
      };
      loginUserController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        User.findOne.restore();
        done();
      });
    });
    it("should throw an error if user not found.", (done) => {
      const req = {
        body: {
          email: "test2",
          password: "test2",
        },
      };

      loginUserController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should generate a jwt if user found.", (done) => {
      const req = {
        body: {
          password: "TEST",
          email: "test",
        },
      };
      const res = {
        json(obj) {
          expect(obj).to.have.property("authToken", "test-jwt-token");
          expect(obj).to.have.property("expiry");
          expect(obj).to.have.property("userId");
          return this;
        },
      };
      sinon.stub(jwt, "sign");
      jwt.sign.returns("test-jwt-token");

      loginUserController(req, res, () => {}).then((res) => {
        expect(res).to.be.equals(1);
        jwt.sign.restore();
        done();
      });
    });
  });
  describe("getUserInfoController", () => {
    let testUser = {};
    before((done) => {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          const user = new User({
            imageData: {
              key: "test",
              url: "test",
            },
            password: "TEST",
            permissions: "root",
            email: "test",
            name: "test",
            criminalsList: [],
            mobile: "6666666666",
            creator: "639c971579cd39c18dab3527",
          });

          return user.save();
        })
        .then((user) => {
          testUser = user;
          done();
        });
    });

    after((done) => {
      User.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done());
    });

    it("should throw an error if database refuses to connect.", (done) => {
      sinon.stub(User, "findById");
      User.findById.throws();
      const req = {
        params: {
          userId: "a-dummy-user-id",
        },
      };
      getUserInfoController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        User.findById.restore();
        done();
      });
    });
    it("should query a user document.", (done) => {
      const req = {
        params: {
          userId: testUser?._id,
        },
      };
      const res = {
        json(obj) {
          expect(obj).to.have.property("user");
          return this;
        },
      };
      getUserInfoController(req, res, () => {}).then((res) => {
        expect(res).to.be.equals(1);
        done();
      });
    });
  });
  describe("listUsersController", () => {
    before((done) => {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          const testUser = new User({
            imageData: {
              key: "test",
              url: "test",
            },
            password: "TEST",
            permissions: "root",
            email: "test",
            name: "test",
            criminalsList: [],
            mobile: "6666666666",
            creator: "639c971579cd39c18dab3527",
          });

          return testUser.save();
        })
        .then(() => done());
    });
    after((done) => {
      User.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done());
    });
    it("Should throw an error if database refuses connection.", (done) => {
      sinon.stub(User, "find");
      User.find.throws();
      listUsersController({}, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        User.find.restore();
        done();
      });
    });
    it("should return the list of users if all goes well.", (done) => {
      const res = {
        json(obj) {
          expect(obj).to.have.property("users");
        },
      };
      listUsersController({}, res, () => {}).then((res) => {
        expect(res).to.be.equals(1);
        done();
      });
    });
  });
  describe("deleteUserController", () => {
    let testUser = {};
    before((done) => {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          const user = new User({
            imageData: {
              key: "test",
              url: "test",
            },
            password: "TEST",
            permissions: "root",
            email: "test",
            name: "test",
            criminalsList: [],
            mobile: "6666666666",
            creator: "639c971579cd39c18dab3527",
          });

          return user.save();
        })
        .then((user) => {
          testUser = user;
          done();
        });
    });
    after((done) => {
      mongoose.disconnect().then(() => done());
    });
    it("should throw an error if userId not found.", (done) => {
      const req = {
        params: {
          userId: "",
        },
      };
      deleteUserController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should throw an error if database refuses connection.", (done) => {
      const req = {
        params: {
          userId: "xyz",
        },
      };
      sinon.stub(User, "findById");
      User.findById.throws();
      deleteUserController(req, {}, () => {}).then((res) => {
        User.findById.restore();
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should thrown an error if user not found.", (done) => {
      const req = {
        params: {
          userId: "xyz",
        },
      };
      deleteUserController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should throw an error if other than creator try to delete the user", (done) => {
      const req = {
        userId: "xyz",
        params: {
          userId: testUser?._id,
        },
      };
      deleteUserController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should delete a user if all goes fine", (done) => {
      const req = {
        userId: "639c971579cd39c18dab3527",
        params: {
          userId: testUser?._id,
        },
      };
      const res = {
        json(obj) {
          expect(obj).to.haveOwnProperty("message");
        },
      };
      deleteUserController(req, res, () => {}).then((res) => {
        expect(res).to.be.equals(1);
        done();
      });
    });
  });
});
