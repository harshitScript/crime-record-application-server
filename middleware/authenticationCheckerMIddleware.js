const jwt = require("jsonwebtoken");
const authenticationCheckerMIddleware = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      const error = new Error("Authorization token is missing.");
      throw error;
    }

    const authToken = authorization.split(" ")[1];

    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    if (!decodedToken) {
      const error = new Error("Authorization token expired.");
      throw error;
    }

    const { userId } = decodedToken;

    req.userId = userId;

    next();

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = authenticationCheckerMIddleware;
