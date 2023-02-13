const chai = require("chai");
const chaiHTTP = require("chai-http");
const fs = require("fs");
const sinon = require("sinon");
const User = require("../models/user");
const Record = require("../models/record");
const createRecordController = require("../controllers/record/createRecordController");
const { default: mongoose } = require("mongoose");
const listRecordsController = require("../controllers/record/listRecordsController");
const recordImageUploadController = require("../controllers/record/recordImageUploadController");
const recordImageDeleteController = require("../controllers/record/recordImageDeleteController");
const s3 = require("../aws/s3");
const getRecordInfoController = require("../controllers/record/getRecordInfoController");
const listRecordsIdController = require("../controllers/record/listRecordsIdController");
const deleteRecordController = require("../controllers/record/deleteRecord/deleteRecordController");
const recordPdfController = require("../controllers/record/recordPdfController");
const { pdfUtils } = require("../utils/helper");
const editRecordController = require("../controllers/record/editRecordController");

chai.use(chaiHTTP);

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
          email: "test@gmail.com",
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
      })
      .catch(() => {});
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
        chai.expect(res).to.be.equals(0);
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
        chai.expect(res).to.be.equals(0);
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
          chai.expect(code).to.be.equals(201);
          return this;
        },
        json(resObj) {
          chai.expect(resObj).to.haveOwnProperty("message");
          return this;
        },
      };
      const next = () => {};
      createRecordController(req, res, next)
        .then((res) => {
          chai.expect(res).to.be.equals(1);
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
        sinon.stub(Record, "find");
        Record.find.throws();
        listRecordsController({}, {}, () => {}).then((res) => {
          chai.expect(res).to.be.equals(0);
          Record.find.restore();
          done();
        });
      });
      it("should return a list of records if all goes fine.", (done) => {
        const res = {
          json(obj) {
            chai.expect(obj).to.haveOwnProperty("records");
          },
        };
        listRecordsController({}, res, () => {}).then((res) => {
          chai.expect(res).to.be.equals(1);
          done();
        });
      });
    });
    describe("listRecordsIdController", () => {
      it("should throw an error if database refuses connection.", (done) => {
        const req = {
          query: {
            creator: "all",
          },
        };
        sinon.stub(Record, "find");
        Record.find.throws();
        listRecordsIdController(req, {}, () => {}).then((res) => {
          chai.expect(res).to.be.equals(0);
          Record.find.restore();
          done();
        });
      });
      it("should return a list of records id if all goes fine.", (done) => {
        const req = {
          query: {
            creator: testUser?._id,
          },
        };
        const res = {
          json(obj) {
            chai.expect(obj).to.haveOwnProperty("recordsId");
          },
        };
        listRecordsIdController(req, res, () => {}).then((res) => {
          chai.expect(res).to.be.equals(1);
          done();
        });
      });
      it("should return a list of records id made by a particular creator.", (done) => {
        const req = {
          query: {
            creator: "all",
          },
        };
        const res = {
          json(obj) {
            chai.expect(obj).to.haveOwnProperty("recordsId");
          },
        };
        listRecordsIdController(req, res, () => {}).then((res) => {
          chai.expect(res).to.be.equals(1);
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
        creator: testUser?._id,
      });

      record.save().then((record) => {
        testRecord = record;
        done();
      });
    });

    it("should throw an error if the type of image does not match.", (done) => {
      const req = {
        params: {
          recordId: "xyz",
          type: "rear",
        },
      };
      recordImageUploadController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
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
        chai.expect(res).to.be.equals(0);
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
        chai.expect(res).to.be.equals(0);
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
          chai.expect(code).to.be.equals(201);
          return this;
        },
        json(obj) {
          chai.expect(obj).to.haveOwnProperty("message");
          chai.expect(obj).to.haveOwnProperty("url");
          chai.expect(obj).to.haveOwnProperty("type");
        },
      };
      const next = () => {};
      recordImageUploadController(req, res, next).then((res) => {
        chai.expect(res).to.be.equals(0);
        done();
      });
    });
  });
  describe("recordImageDeleteController", () => {
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
        imageData: {
          urls: {
            front: "",
          },
          keys: {
            front: "xyz",
          },
        },
        creator: testUser?._id,
      });

      record.save().then((record) => {
        testRecord = record;
        done();
      });
    });

    it("should throw an error if the type of image does not match.", (done) => {
      const req = {
        params: {
          recordId: "xyz",
          type: "rear",
        },
      };
      recordImageDeleteController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        done();
      });
    });
    it("should throw an error id database refuses connection.", (done) => {
      const req = {
        params: {
          recordId: "xyz",
          type: "front",
        },
      };
      sinon.stub(Record, "findById");
      Record.findById.throws();
      recordImageDeleteController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        Record.findById.restore();
        done();
      });
    });
    it("should throw an error if record not found.", (done) => {
      const req = {
        params: {
          recordId: "xyz",
          type: "side",
        },
      };
      recordImageDeleteController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        done();
      });
    });
    it("should delete an image if all goes fine.", (done) => {
      const req = {
        params: {
          recordId: testRecord?._id,
          type: "front",
        },
      };
      const res = {
        json(obj) {
          chai.expect(obj).to.haveOwnProperty("message");
          chai.expect(obj).to.haveOwnProperty("type");
        },
      };
      const next = (error) => {
        console.log("The error is => ", error.message);
        return;
      };
      sinon.stub(s3, "deleteObject");
      s3.deleteObject.returns({
        promise: () => {
          return true;
        },
      });
      recordImageDeleteController(req, res, next).then((res) => {
        chai.expect(res).to.be.equals(1);
        s3.deleteObject.restore();
        done();
      });
    });
    it("should throw an error if a image is already deleted.", (done) => {
      const req = {
        params: {
          recordId: testRecord?._id,
          type: "front",
        },
      };
      recordImageDeleteController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        done();
      });
    });
  });
  describe("getRecordInfoController", () => {
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
        name: "test user 2",
        state: "test state",
        mobile: 9407541209,
        creator: "xyz",
        imageData: {
          urls: {
            front: "",
          },
          keys: {
            front: "xyz",
          },
        },
        creator: testUser?._id,
      });

      record
        .save()
        .then((record) => {
          testRecord = record;
          done();
        })
        .catch((error) => {
          console.log("The error => ", error.message);
        });
    });

    it("should throw an error if database refuses connection.", (done) => {
      const req = {
        params: {
          recordId: "xyz",
        },
      };
      sinon.stub(Record, "findById");
      Record.findById.throws();
      getRecordInfoController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        Record.findById.restore();
        done();
      });
    });
    it("should return a record if all goes fine.", (done) => {
      const req = {
        params: {
          recordId: testRecord?._id,
        },
      };
      const res = {
        json(obj) {
          chai.expect(obj).to.haveOwnProperty("record");
        },
      };
      getRecordInfoController(req, res, () => {}).then((res) => {
        chai.expect(res).to.be.equals(1);
        done();
      });
    });
  });
  describe("deleteRecordController", () => {
    let testRecord = {};
    before((done) => {
      const record = new Record({
        address: "xyz",
        city: "test",
        creator: testUser?._id,
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
        imageData: {
          urls: {
            front: "",
          },
          keys: {
            front: "xyz",
          },
        },
        name: "xyz abc",
        state: "test state",
        mobile: 3333333333,
      });

      record.save().then((record) => {
        testRecord = record;
        done();
      });
    });
    it("should throw an error if database refuses connection", (done) => {
      const req = {
        userId: "xyz",
        params: {
          recordId: "abc",
        },
      };
      sinon.stub(Record, "findById");
      Record.findById.throws();
      deleteRecordController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        Record.findById.restore();
        done();
      });
    });
    it("should throw an error if authenticated user not found.", (done) => {
      const req = {
        userId: "xyz",
        params: {
          recordId: "abc",
        },
      };
      deleteRecordController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        done();
      });
    });
    it("should throw an error if record not found.", (done) => {
      const req = {
        userId: testUser?._id,
        params: {
          recordId: "abc",
        },
      };
      deleteRecordController(req, {}, () => {}).then((res) => {
        chai.expect(res).to.be.equals(0);
        done();
      });
    });
    it("should delete a record if authorized user id  match with the creator of the record.", (done) => {
      const req = {
        userId: testUser?._id,
        params: {
          recordId: testRecord?._id,
        },
      };
      const res = {
        json(obj) {
          chai.expect(obj).to.haveOwnProperty("message");
        },
      };
      deleteRecordController(req, res, () => {}).then((res) => {
        chai.expect(res).to.be.equals(1);
        done();
      });
    });
  });
  describe("recordPdfController", () => {
    let testRecord = {};
    before((done) => {
      const record = new Record({
        address: "xyz",
        city: "test",
        creator: testUser?._id,
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
        imageData: {
          urls: {
            front: "",
          },
          keys: {
            front: "xyz",
          },
        },
        name: "xyz abc",
        state: "test state",
        mobile: 3333333333,
      });

      record.save().then((record) => {
        testRecord = record;
        done();
      });
    });
    it("should throw an error if database refuses connection.", (done) => {
      const req = {
        params: {
          recordId: "xyz",
        },
      };
      const next = () => {};
      sinon.stub(Record, "findById");
      Record.findById.throws();
      recordPdfController(req, {}, next).then((res) => {
        chai.expect(res).to.be.equals(0);
        Record.findById.restore();
        done();
      });
    });
    it("should throws an error if failed to generate the pdf.", (done) => {
      const req = {
        params: {
          recordId: testRecord?._id,
        },
      };
      const next = () => {};
      sinon.stub(pdfUtils, "generate");
      pdfUtils.generate.returns(false);
      recordPdfController(req, {}, next).then((res) => {
        chai.expect(res).to.be.equals(0);
        pdfUtils.generate.restore();
        done();
      });
    });
    it("should successfully return a pdf to the client.", (done) => {
      const req = {
        params: {
          recordId: testRecord?._id,
        },
      };
      const res = {
        end: () => {},
        setHeader: (key, value) => {
          chai
            .expect(key === "Content-Type" || key === "Content-Disposition")
            .to.be.equals(true);
          chai
            .expect(
              value === "application/pdf" ||
                value === `inline:filename=record_${testRecord?._id}.pdf`
            )
            .to.be.equals(true);
        },
      };
      const next = () => {};
      sinon.stub(pdfUtils, "generate");
      pdfUtils.generate.returns(true);
      sinon.stub(pdfUtils, "delete");
      pdfUtils.delete.returns(true);
      sinon.stub(fs, "createReadStream");
      fs.createReadStream.returns({
        pipe: (res) => {
          chai.expect(res).to.haveOwnProperty("end");
          chai.expect(res).to.haveOwnProperty("setHeader");
        },
        on: (event) => {
          chai.expect(event).to.be.equals("end");
        },
      });
      recordPdfController(req, res, next).then((res) => {
        chai.expect(res).to.be.equals(1);
        pdfUtils.generate.restore();
        pdfUtils.delete.restore();
        fs.createReadStream.restore();
        done();
      });
    });
  });
  describe("editRecordController", () => {
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
        creator: testUser?._id,
      });

      record.save().then((record) => {
        testRecord = record;
        done();
      });
    });

    /* it("should throw an error if database refuses to connect.", (done) => {
      const req = {
        params: {
          recordId: test,
        },
        body: {
          name: "",
          mobile: "",
          address: "",
          city: "",
          state: "",
        },
      };
      const res = {};
      const next = () => {};
      sinon.stub(Record, "findById");
      Record.findById.throws();
      editRecordController(req, res, next).then((res) => {
        chai.expect(res).to.be.equals(0);
        Record.findById.restore();
        done();
      });
    }); */
    it("should throw an error if record not found", (done) => {
      const req = {
        params: {
          recordId: "xyz",
        },
        body: {
          name: "",
          mobile: "",
          address: "",
          city: "",
          state: "",
        },
      };
      const res = {};
      const next = () => {};
      sinon.stub(Record, "findById");
      Record.findById.returns(null);
      editRecordController(req, res, next).then((res) => {
        chai.expect(res).to.be.equals(0);
        Record.findById.restore();
        done();
      });
    });
    it("should edit the record successfully.", (done) => {
      const req = {
        params: {
          recordId: testRecord?._id,
        },
        body: {
          name: "test one",
          mobile: "7777777778",
          address: "test address",
          city: "test city",
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
      };
      const res = {
        json(obj) {
          chai.expect(obj).to.haveOwnProperty("message");
        },
      };
      const next = (error) => {
        console.log("the error => ", error.message);
      };
      editRecordController(req, res, next).then((res) => {
        chai.expect(res).to.be.equals(1);
        done();
      });
    });
  });
});

describe("RECORD CONTROLLERS END-TO-END TEST SUITE", () => {
  let testRecordId = "";
  describe("GET /record/list-ids/:page", () => {
    it("should return expected response.", (done) => {
      chai
        .request(process.env.LOCAL_BASE_URI)
        .get("/record/list-ids/1?creator=all")
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res?.status).to.be.equals(200);
          chai.expect(res?.body).to.haveOwnProperty("recordsId");
          testRecordId = res?.body?.recordsId?.[0]?._id;
          done();
        });
    });
    describe("GET /record/:recordId", () => {
      it("should return expected response.", (done) => {
        chai
          .request(process.env.LOCAL_BASE_URI)
          .get(`/record/${testRecordId}`)
          .end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res?.status).to.be.equals(200);
            chai.expect(res?.body?.record).to.haveOwnProperty("_id");
            chai.expect(res?.body?.record).to.haveOwnProperty("name");
            chai.expect(res?.body?.record).to.haveOwnProperty("mobile");
            chai.expect(res?.body?.record).to.haveOwnProperty("address");
            chai.expect(res?.body?.record).to.haveOwnProperty("city");
            chai.expect(res?.body?.record).to.haveOwnProperty("state");
            chai.expect(res?.body?.record).to.haveOwnProperty("crimes");
            chai.expect(res?.body?.record).to.haveOwnProperty("creator");
            chai.expect(res?.body?.record).to.haveOwnProperty("imageData");
            done();
          });
      });
    });
  });
  describe("GET /record/:recordId/pdf", () => {
    it("should return the expected response.", (done) => {
      chai
        .request(process.env.LOCAL_BASE_URI)
        .get(`/record/${testRecordId}/pdf`)
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res?.status).to.be.equals(200);
          chai
            .expect(res?.headers)
            .to.haveOwnProperty("content-type", "application/pdf");
          chai.expect(res?.headers).to.haveOwnProperty("content-disposition");
          done();
        });
    });
  });
  describe("GET /record/list/:page", () => {
    it("should return the expected response.", (done) => {
      chai
        .request(process.env.LOCAL_BASE_URI)
        .get("/record/list/1")
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res?.status).to.be.equals(200);
          chai.expect(res?.body).to.haveOwnProperty("records");
          done();
        });
    });
  });
});
