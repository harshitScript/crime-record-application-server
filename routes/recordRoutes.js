const express = require("express");
const { json } = require("body-parser");
const recordRoutes = express.Router();
const createRecordController = require("../controllers/record/createRecordController");
const authenticationCheckerMIddleware = require("../middleware/authenticationCheckerMIddleware");
const createRecordValidations = require("../validations/createRecordValidations");
const validationsResultMiddleware = require("../middleware/validationsResultMiddleware");

//* POST /record/create
recordRoutes.post(
  "/create",
  authenticationCheckerMIddleware,
  json(),
  createRecordValidations,
  validationsResultMiddleware,
  createRecordController
);

module.exports = recordRoutes;
