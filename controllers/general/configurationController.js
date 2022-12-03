const Configuration = require("../../models/configuration");

const configurationController = async (req, res, next) => {
  const { tenant } = req.params;

  try {
    const response = await Configuration.findOne({ tenant });

    if (!response) {
      const error = new Error("Tenant Configuration Not Found.");
      throw error;
    }

    res.json(response);

    return 1;
  } catch (error) {
    next(error);

    return 0;
  }
};
module.exports = configurationController;
