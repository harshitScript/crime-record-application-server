const errorHandlingMiddleware = (error, req, res, next) => {
  let resData = {
    message: error?.message,
    stack: error?.stack,
  };

  if (error?.customStatus) {
    if (process.env.APP_PHASE === "PROD") {
      delete resData.stack;
    }
    return res.status(error?.customStatus).json({
      message: error?.message,
      stack: error?.stack,
    });
  }

  if (process.env.APP_PHASE === "PROD") {
    delete resData.stack;
  }
  return res.status(500).json(resData);
};
module.exports = errorHandlingMiddleware;
