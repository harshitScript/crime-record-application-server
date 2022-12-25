const { validationResult } = require("express-validator");

const validationsResultMiddleware = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    next();

    return 1;
  } else {
    res.status(400).json({
      errors: validationErrors?.errors,
    });

    return 0;
  }
};
module.exports = validationsResultMiddleware;
