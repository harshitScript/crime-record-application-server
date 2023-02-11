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
const deleteUserController = require("../controllers/user/deleteUserController");
const userImageDeleteMiddleware = require("../middleware/userImageDeleteMiddleware");
const userImageReplaceController = require("../controllers/user/userImageReplaceController");
const resetPasswordRequestController = require("../controllers/user/resetPasswordRequestController");
const updateUserController = require("../controllers/user/updateUserController");
const editUserValidations = require("../validations/editUserValidations");

//* POST /user/login
userRoutes.post("/login", json(), loginUserController);

//* POST /user/create
userRoutes.post(
  "/create",
  authenticationCheckerMIddleware,
  s3Uploads("user").single("image"),
  uploadCheckerMiddleware,
  createUserValidations,
  deleteS3UploadMiddleware,
  validationsResultMiddleware,
  createUserController
);

// PUT /user/edit
userRoutes.put(
  "/edit",
  authenticationCheckerMIddleware,
  json(),
  editUserValidations,
  validationsResultMiddleware,
  updateUserController
);

//* GET /user/:user-id
userRoutes.get("/:userId", getUserInfoController);

//* GET /user/list/:page
userRoutes.get(
  "/list/:page",
  authenticationCheckerMIddleware,
  listUsersController
);

//* DELETE /user/:userId/delete
userRoutes.delete(
  "/:userId/delete",
  authenticationCheckerMIddleware,
  deleteUserController
);

//* POST /user/:userId/replace-image
userRoutes.post(
  "/:userId/replace-image",
  authenticationCheckerMIddleware,
  userImageDeleteMiddleware,
  s3Uploads("user").single("image"),
  uploadCheckerMiddleware,
  userImageReplaceController
);

//* POST /user/reset-password
userRoutes.post("/reset-password", json(), resetPasswordRequestController);

module.exports = userRoutes;
