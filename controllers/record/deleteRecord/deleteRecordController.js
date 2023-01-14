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

    // TODO : in development
    /* const isRootUser = authUser?.permissions?.includes("root");
    if (isRootUser) {
      next();
      return 1;
    } */

    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Record Not Found.");
      throw error;
    }

    if (authUserId?.toString() === record?.creator?.toString()) {
      const response = await record.delete();

      await authUser.removeRecord(response?._id);

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
