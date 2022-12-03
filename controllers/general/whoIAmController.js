const whoIAmController = (req, res) => {
  res.json({
    name: process.env.SERVER_NAME,
    phase: process.env.APP_PHASE,
    author: process.env.AUTHOR,
  });

  return 1;
};

module.exports = whoIAmController;
