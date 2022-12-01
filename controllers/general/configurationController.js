const configurationController = (req, res, next) => {
  const { tenant } = req.params;

  //? perform db operations here.

  return res.json({});
};
module.exports = configurationController;
