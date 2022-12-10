const express = require("express");
const loginUserController = require("../controllers/user/loginUserController");
const userRoutes = express.Router();
const { json } = require("body-parser");
const s3Uploads = require("../multer/multer.s3");
const createUserController = require("../controllers/user/createUserController");
const uploadCheckerMiddleware = require("../middleware/uploadCheckerMiddleware");

//* POST /user/login
userRoutes.post("/login", json(), loginUserController);

//* POST /user/create
userRoutes.post(
  "/create",
  s3Uploads("user").single("image"),
  uploadCheckerMiddleware,
  createUserController
);

module.exports = userRoutes;
