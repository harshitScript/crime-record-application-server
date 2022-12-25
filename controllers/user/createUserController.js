const User = require("../../models/user");

const createUserController = async (req, res, next) => {
  const {
    name = "",
    email = "",
    mobile = "",
    password = "",
    permissions = "",
    creator = "",
  } = req.body;
  const image = req.file;
  let structuredPermissions = [];
  if (permissions) {
    structuredPermissions = permissions.split(", ");
  }

  try {
    const user = new User({
      password,
      permissions: structuredPermissions,
      name,
      email,
      mobile,
      records: [],
      imageData: {
        url: image.location,
        key: image?.key,
      },
      creator: creator,
    });

    const response = await user.save();

    res.status(201).json({
      message: "User creation successful",
      userId: response?._id,
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = createUserController;
