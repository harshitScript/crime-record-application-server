const { body } = require("express-validator");
const Configuration = require("../models/configuration");

const addConfigurationValidations = [
  body("tenant")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Tenant name must be 3 to 20 characters long.")
    .custom((value) => {
      return Configuration.findOne({ tenant: value }).then((tenant) => {
        if (tenant)
          return Promise.reject("Tenant configuration already exists.");
      });
    }),
  body("primaryColor")
    .trim()
    .isLength(7)
    .withMessage("A hex code must contain seven characters (# inclusive)."),

  body("secondaryColor")
    .trim()
    .isLength(7)
    .withMessage("A hex code must contain seven characters (# inclusive)."),

  body("primaryShade")
    .trim()
    .isLength(7)
    .withMessage("A hex code must contain seven characters (# inclusive)."),

  body("secondaryShade")
    .trim()
    .isLength(7)
    .withMessage("A hex code must contain seven characters (# inclusive)."),
];
module.exports = addConfigurationValidations;
