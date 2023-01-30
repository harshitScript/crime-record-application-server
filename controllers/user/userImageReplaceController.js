const User = require("../../models/user");

const userImageReplaceController = async (req, res, next) => {
  const { userId } = req.params;
  const replaceFile = req.file;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      throw error;
    }
    await user.replaceImage({
      url: replaceFile?.location,
      key: replaceFile?.key,
    });
    res.status(201).json({
      message: "Operation successful.",
    });
    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = userImageReplaceController;
