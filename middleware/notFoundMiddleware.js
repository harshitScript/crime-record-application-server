const notFoundMiddleware = (req, res) => {
  return res.status(404).json({
    message: `Endpoint not found on ${process.env.SERVER_NAME}.`,
  });
};

module.exports = notFoundMiddleware;
