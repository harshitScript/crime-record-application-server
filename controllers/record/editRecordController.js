const Record = require("../../models/record");

const editRecordController = async (req, res, next) => {
  const { recordId } = req.params;
  const { name, mobile, address, crimes, city, state } = req.body;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      throw new Error("Record not found");
    }
    await record.editRecord({ name, mobile, address, crimes, city, state });

    res.json({
      message: "Record updated successfully.",
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = editRecordController;
