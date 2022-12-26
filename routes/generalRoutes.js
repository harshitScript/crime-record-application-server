const express = require("express");
const { json } = require("body-parser");
const { body } = require("express-validator");

const configurationController = require("../controllers/general/configurationController");
const whoIAmController = require("../controllers/general/whoIAmController");
const addConfigurationController = require("../controllers/general/addConfigurationController");
const addConfigurationValidations = require("../validations/addConfigurationValidations");
const validationsResultMiddleware = require("../middleware/validationsResultMiddleware");
const findPinCodeDataController = require("../controllers/general/findPinCodeDataController");
const generalRoutes = express.Router();

//* GET /general/who-i-am
generalRoutes.get("/who-i-am", whoIAmController);

//* GET /general/configuration/:tenant
generalRoutes.get("/configuration/:tenant", configurationController);

//* POST /general/add-configuration/:tenant
generalRoutes.post(
  "/add-configuration/:tenant",
  json(),
  addConfigurationValidations,
  validationsResultMiddleware,
  addConfigurationController
);

//* POST /general/find-pinCode-data
generalRoutes.post("/find-pinCode-data", json(), findPinCodeDataController);

module.exports = generalRoutes;
