const { generateHash } = require("../../utils/helper");
const trackVisitorController = (req, res) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  res.cookie("v.id", "harshit", {
    secure: true,
    httpOnly: true,
    expires: date,
  });
  res.status(201).json({
    message: "Cookie set successfully",
  });
  return 1;
};

module.exports = trackVisitorController;
