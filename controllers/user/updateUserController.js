const User = require("../../models/user");
const updateUserController = async (req, res, next) => {
  const { name = "", email = "", mobile = "" } = req.body;

  try {
    const user = await User.findById(req?.userId);
    if (!user) {
      throw new Error("User Not Found.");
    }

    await user?.edit({ name, mobile, email });

    res.json({ message: "User Details updated successfully." });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = updateUserController;
