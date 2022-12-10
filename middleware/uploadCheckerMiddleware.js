const uploadCheckerMiddleware = (req, res, next) => {
  const file = req.file;

  if (!file) {
    const error = new Error("Unable to upload file.");
    error.customStatus = 406;
    throw error;
  } else {
    next();
    return 1;
  }
};
module.exports = uploadCheckerMiddleware;
