const { generateHash } = require("../../utils/helper");
const trackVisitorController = (req, res) => {
  console.log("The request cookies => ", req.cookies);
  res.cookie(
    "v.id",
    generateHash({ string: Math.random(), secret: process.env.VISITOR_SECRET }),
    { secure: true, httpOnly: true }
  );
  res.status(201).json({
    message: "Cookie set successfully",
  });
  return 1;
};

module.exports = trackVisitorController;
