const Configuration = require("../../models/configuration");
const addConfigurationController = async (req, res, next) => {
  const { tenant: paramTenant = "" } = req.params;
  const {
    tenant = "",
    primaryColor = "",
    secondaryColor = "",
    primaryShade = "",
    secondaryShade = "",
    ternaryColor = "",
    views = [],
  } = req.body;

  try {
    if (paramTenant !== tenant) {
      const error = new Error("Trying to store invalid property/data.");
      error.customStatus = 415;
      throw error;
    }

    const configuration = new Configuration({
      tenant,
      theme: {
        primaryColor,
        secondaryColor,
        primaryShade,
        secondaryShade,
        ternaryColor,
      },
      config: { views },
    });

    await configuration.save();

    res.status(201).json({
      message: "Tenant Configuration Stored Successfully.",
    });

    return 1;
  } catch (error) {
    next(error);

    return 0;
  }
};
module.exports = addConfigurationController;
