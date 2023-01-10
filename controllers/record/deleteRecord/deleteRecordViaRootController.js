const Record = require("../../../models/record");
const deleteRecordViaRootController = async (req, res, next) => {
  const { recordId } = req.params;
  try {
    await Record.findByIdAndDelete(recordId);

    res.json({
      message: "Record deleted successfully by root permission.",
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = deleteRecordViaRootController;
