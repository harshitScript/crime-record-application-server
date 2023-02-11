const User = require("../../models/user");

const getUserInfoController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select(
      "name mobile permissions email imageData.url createdAt updatedAt -_id"
    );

    if (!user) {
      const error = new Error("User Not Found.");
      error.customStatus = 403;
      throw error;
    }

    res.json({
      user,
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = getUserInfoController;
