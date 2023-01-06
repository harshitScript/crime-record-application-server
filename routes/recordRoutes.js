const express = require("express");
const { json } = require("body-parser");
const recordRoutes = express.Router();
const createRecordController = require("../controllers/record/createRecordController");
const authenticationCheckerMIddleware = require("../middleware/authenticationCheckerMIddleware");
const createRecordValidations = require("../validations/createRecordValidations");
const validationsResultMiddleware = require("../middleware/validationsResultMiddleware");
const listRecordsController = require("../controllers/record/listRecordsController");
const s3Uploads = require("../multer/multer.s3");
const recordImageUploadController = require("../controllers/record/recordImageUploadController");
const uploadCheckerMiddleware = require("../middleware/uploadCheckerMiddleware");
const recordImageDeleteController = require("../controllers/record/recordImageDeleteController");
const getRecordInfoController = require("../controllers/record/getRecordInfoController");
const listRecordsIdController = require("../controllers/record/listRecordsIdController");

//* POST /record/create
recordRoutes.post(
  "/create",
  authenticationCheckerMIddleware,
  json(),
  createRecordValidations,
  validationsResultMiddleware,
  createRecordController
);

//* GET /record/list/:page
recordRoutes.get(
  "/list/:page",
  authenticationCheckerMIddleware,
  listRecordsController
);

//* GET /record/list-ids/:page
recordRoutes.get(
  "/list/:page",
  authenticationCheckerMIddleware,
  listRecordsIdController
);

//* POST /record/:recordId/uploads/:type
recordRoutes.post(
  "/:recordId/uploads/:type",
  s3Uploads("records").single("image"),
  uploadCheckerMiddleware,
  recordImageUploadController
);

//* DELETE /record/:recordId/delete-image/:type
recordRoutes.delete(
  "/:recordId/delete/:type",
  authenticationCheckerMIddleware,
  recordImageDeleteController
);

//* GET /record/:recordId
recordRoutes.get(
  "/:recordId",
  authenticationCheckerMIddleware,
  getRecordInfoController
);

module.exports = recordRoutes;
