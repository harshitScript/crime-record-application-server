const User = require("../../../models/user");
const Record = require("../../../models/record");

const deleteRecordController = async (req, res, next) => {
  const { recordId } = req.params;
  const { userId: authUserId } = req;

  try {
    const authUser = await User.findById(authUserId);
    if (!authUser) {
      const error = new Error("Authenticated User Not Found.");
      throw error;
    }

    const isRootUser = authUser?.permissions?.includes("root");
    if (isRootUser) {
      next();
      return 1;
    }

    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Record Not Found.");
      throw error;
    }

    if (authUser?.toString() === record?.creator?.toString()) {
      await record.delete();

      res.json({
        message: "Record deleted successfully.",
      });

      return 1;
    } else {
      const error = new Error("Permissions denied.");
      throw error;
    }
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = deleteRecordController;
