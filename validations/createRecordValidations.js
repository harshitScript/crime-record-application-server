const { body } = require("express-validator");

const createRecordValidations = [
  body("name")
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage("Name must be 6 to 50 characters long."),
  body("mobile")
    .trim()
    .isLength({ max: 11, min: 10 })
    .withMessage("Mobile Number must be 10 to 11 digits long."),
  body("address")
    .trim()
    .isLength({
      min: 6,
      max: 160,
    })
    .withMessage("Address must be 6 to 160 characters long."),
  /* body("crimes")
    .trim()
    .isArray()
    .withMessage("Crimes must be a non empty array."), */
];

module.exports = createRecordValidations;
