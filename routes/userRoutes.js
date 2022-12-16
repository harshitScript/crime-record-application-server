const express = require("express");
const loginUserController = require("../controllers/user/loginUserController");
const userRoutes = express.Router();
const { json } = require("body-parser");
const s3Uploads = require("../multer/multer.s3");
const createUserController = require("../controllers/user/createUserController");
const uploadCheckerMiddleware = require("../middleware/uploadCheckerMiddleware");
const createUserValidations = require("../validations/createUserValidations");
const validationsResultMiddleware = require("../middleware/validationsResultMiddleware");
const deleteS3UploadMiddleware = require("../middleware/deleteS3UploadMiddleware");
const getUserInfoController = require("../controllers/user/getUserInfoController");
const authenticationCheckerMIddleware = require("../middleware/authenticationCheckerMIddleware");
const listUsersController = require("../controllers/user/listUsersController");

//* POST /user/login
userRoutes.post("/login", json(), loginUserController);

//* POST /user/create
userRoutes.post(
  "/create",
  s3Uploads("user").single("image"),
  uploadCheckerMiddleware,
  createUserValidations,
  deleteS3UploadMiddleware,
  validationsResultMiddleware,
  createUserController
);

//* GET /user/:user-id
userRoutes.get("/:userId", getUserInfoController);

//* GET /user/list/:page
userRoutes.get(
  "/list/:page",
  authenticationCheckerMIddleware,
  listUsersController
);

module.exports = userRoutes;
