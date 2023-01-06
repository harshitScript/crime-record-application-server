const Record = require("../../models/record");
const getRecordInfoController = async (req, res, next) => {
  const { recordId } = req.params;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Record not Found.");
      throw error;
    }
    res.json({
      record,
    });
    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = getRecordInfoController;
