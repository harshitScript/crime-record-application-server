const express = require("express");

const configurationController = require("../controllers/general/configurationController");
const whoIAmController = require("../controllers/general/whoIAmController");
const generalRoutes = express.Router();

//* GET /general/who-i-am
generalRoutes.get("/who-i-am", whoIAmController);
//* GET /general/configuration/:tenant
generalRoutes.get("/configuration/:tenant", configurationController);

module.exports = generalRoutes;
