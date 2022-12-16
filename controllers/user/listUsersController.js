const User = require("../../models/user");
const listUsersController = async (req, res, next) => {
  try {
    const users = await User.find();

    res.json({
      users,
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = listUsersController;
