const express = require("express");
const configurationController = require("../controllers/general/configurationController");
const generalRoutes = express.Router();

//* GET /general/configuration/:tenant
generalRoutes.get("/configuration/:tenant", configurationController);

module.exports = generalRoutes;
