const { generateHash } = require("../../utils/helper");
const trackVisitorController = (req, res) => {
  res.cookie(
    "v.id",
    "harshit",
    { secure: true, httpOnly: true }
  );
  res.status(201).json({
    message: "Cookie set successfully",
  });
  return 1;
};

module.exports = trackVisitorController;
