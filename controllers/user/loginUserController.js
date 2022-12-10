const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { generateExpiryInMilSeconds } = require("../../utils/helper");

const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
      password,
    });

    if (!user) {
      const error = new Error("User not Found");
      error.customStatus = 401;
      throw error;
    }

    const authToken = jwt.sign(
      {
        userId: user?._id,
        permissions: user?.permissions,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    const expiry = generateExpiryInMilSeconds({ hours: 2 });

    res.json({
      authToken,
      userId: user?._id,
      expiry,
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = loginUserController;
