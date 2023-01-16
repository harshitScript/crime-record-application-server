const trackVisitorController = (req, res, next) => {
  console.log("The cookies recieved => ", req.cookies);
  res.cookie("new", "skdjkjsdk", { httpOnly: true });
  res.status(201).json({
    message: "Cookie set successfully",
  });
  return 1;
};

module.exports = trackVisitorController;
