const Record = require("../../models/record.js");
const User = require("../../models/user.js");

const createRecordController = async (req, res, next) => {
  const { name, mobile, address, crimes, city, state } = req.body;

  try {
    const authUser = await User.findById(req.userId);
    if (!authUser) {
      const error = new Error("Unauthorized actions detected");
      throw error;
    }

    const record = new Record({
      address,
      mobile,
      name,
      city,
      state,
      crimes,
      imageData: {},
      creator: req?.userId,
    });
    const createdRecord = await record.save();

    await authUser.addRecord(createdRecord._id);

    res.status(201).json({
      message: "Record created successfully.",
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = createRecordController;
