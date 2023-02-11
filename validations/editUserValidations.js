const { body } = require("express-validator");

const editUserValidations = [
  body("name")
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage("Name must be 6 to 50 characters long."),
  body("email")
    .trim()
    .matches(
      /^(www.)?[a-zA-Z0-9.]{1,50}@[a-zA-Z0-9]{3,35}(.co|.com|.in|.org|.dev|)$/
    )
    .withMessage("Not a valid email."),
  body("mobile")
    .trim()
    .isLength({ max: 11, min: 10 })
    .withMessage("Mobile Number must be 10 to 11 digits long."),
  body("password")
    .trim()
    .isLength({ min: 8, max: 25 })
    .withMessage("Password must be 8 to 25 characters long."),
];

module.exports = editUserValidations;
