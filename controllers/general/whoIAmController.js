const whoIAmController = (req, res) => {
  return res.json({
    name: process.env.SERVER_NAME,
    phase: process.env.APP_PHASE,
    author: process.env.AUTHOR,
  });
};

module.exports = whoIAmController;
