const { expect } = require("chai");
const sinon = require("sinon");
const User = require("../models/user");
const Record = require("../models/record");
const createRecordController = require("../controllers/record/createRecordController");
const { default: mongoose } = require("mongoose");
const listRecordsController = require("../controllers/record/listRecordsController");
const recordImageUploadController = require("../controllers/record/recordImageUploadController");

describe("RECORD CONTROLLERS TESTING SUITE >>>", () => {
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
          records: [],
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
      .then(() => Record.deleteMany({}))
      .then(() => mongoose.disconnect())
      .then(() => done())
      .catch((error) => console.log(error.message));
  });
  describe("createRecordController", () => {
    it("should throw an error if database refuses connection", (done) => {
      const req = {
        body: {
          name: "test test",
          mobile: 7974792317,
          address: "test test",
          crimes: ["NO"],
        },
      };
      sinon.stub(User, "findById");
      User.findById.throws();
      createRecordController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        User.findById.restore();
        done();
      });
    });
    it("should throw throw an error if the authenticated user not found", (done) => {
      const req = {
        body: {
          name: "test test",
          mobile: 7974792317,
          address: "test test",
          crimes: ["NO"],
        },
      };
      sinon.stub(User, "findById");
      User.findById.returns(null);
      createRecordController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        User.findById.restore();
        done();
      });
    });
    it("Should add a record successfully and its Object it to authenticated user if all goes well", (done) => {
      const req = {
        body: {
          name: "test test",
          mobile: "77777777777",
          address: "test test test",
          city: "test",
          state: "test state",
          crimes: [
            {
              place: {
                city: "xyz",
                state: "xyz",
                address: "xyz",
              },
              timeStamp: 12345678,
              description: "test description",
              category: "A",
            },
          ],
        },
        userId: testUser._id,
      };
      const res = {
        status(code) {
          expect(code).to.be.equals(201);
          return this;
        },
        json(resObj) {
          expect(resObj).to.haveOwnProperty("message");
          return this;
        },
      };
      const next = (error) => {
        console.log("The error message => ", error.message);
      };
      createRecordController(req, res, next)
        .then((res) => {
          expect(res).to.be.equals(1);
          return User.findById(testUser?._id);
        })
        .then((user) => {
          if (user.records.length) {
            done();
          }
        });
    });
    describe("listRecordsController", () => {
      it("should throw an error if database refuses connection.", (done) => {
        sinon.stub(Record, "findById");
        Record.findById.throws();
        listRecordsController({}, {}, () => {}).then((res) => {
          expect(res).to.be.equals(0);
          Record.findById.restore();
          done();
        });
      });
      it("should return a list of records if all goes fine.", (done) => {
        const res = {
          json(obj) {
            expect(obj).to.haveOwnProperty("records");
          },
        };
        listRecordsController({}, res, () => {}).then((res) => {
          expect(res).to.be.equals(1);
          done();
        });
      });
    });
  });
  describe("recordImageUploadController", () => {
    let testRecord = {};
    before((done) => {
      const record = new Record({
        address: "test address",
        city: "test city",
        crimes: [
          {
            place: {
              city: "xyz",
              state: "xyz",
              address: "xyz",
            },
            timeStamp: 12345678,
            description: "test description",
            category: "A",
          },
        ],
        name: "test user",
        state: "test state",
        mobile: 9407541209,
        imageData: {},
      });

      record.save().then((record) => {
        testRecord = record;
        done();
      });
    });
    it("should throw an error if database refuse connection.", (done) => {
      const req = {
        params: {
          requestId: "xyz",
          type: "front",
        },
        file: {},
      };
      sinon.stub(Record, "findById");
      Record.findById.throws();
      recordImageUploadController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        Record.findById.restore();
        done();
      });
    });
    it("should throw an error if the matched record not found.", (done) => {
      const req = {
        params: {
          requestId: "xyz",
          type: "front",
        },
        file: {},
      };
      recordImageUploadController(req, {}, () => {}).then((res) => {
        expect(res).to.be.equals(0);
        done();
      });
    });
    it("should add a image successfully to the record document.", (done) => {
      const req = {
        params: {
          requestId: testRecord._id,
          type: "front",
        },
        file: {
          location: "xyc",
          Key: "test file",
        },
      };
      const res = {
        status(code) {
          expect(code).to.be.equals(201);
          return this;
        },
        json(obj) {
          expect(obj).to.haveOwnProperty("message");
          expect(obj).to.haveOwnProperty("url");
          expect(obj).to.haveOwnProperty("type");
        },
      };
      const next = (error) => {
        console.log("The error message => ", error.message);
      };
      recordImageUploadController(req, res, next).then((res) => {
        expect(res).to.be.equals(0);
        done();
      });
    });
  });
});
