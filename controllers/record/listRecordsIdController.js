const Records = require("../../models/record");
const listRecordsIdController = async (req, res, next) => {
  try {
    const recordsId = await Records.find().select(`_id`);

    res.json({
      recordsId,
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = listRecordsIdController;
