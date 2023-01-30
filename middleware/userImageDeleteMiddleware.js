const s3 = require("../aws/s3");
const User = require("../models/user");

const userImageDeleteMiddleware = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      throw error;
    }

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: user?.imageData?.key,
      })
      .promise();

    next();

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = userImageDeleteMiddleware;
