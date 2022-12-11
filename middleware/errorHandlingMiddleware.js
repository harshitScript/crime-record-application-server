const errorHandlingMiddleware = (error, req, res, next) => {
  if (error?.customStatus) {
    return res.status(error?.customStatus).json({
      message: error?.message,
    });
  }
  return res.status(500).json({
    message: error?.message,
    stack: error?.stack,
  });
};
module.exports = errorHandlingMiddleware;
