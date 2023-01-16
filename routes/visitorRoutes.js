const express = require("express");
const trackVisitorController = require("../controllers/visitor/trackVisitorController");
const visitorRoutes = express.Router();

//* GET /visitor
visitorRoutes.get("/track", trackVisitorController);

module.exports = visitorRoutes;
