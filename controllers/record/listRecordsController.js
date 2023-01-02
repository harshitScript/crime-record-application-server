const Records = require("../../models/record");
const listRecordsController = async (req, res, next) => {
  try {
    const records = await Records.find();

    res.json({
      records,
    });

    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = listRecordsController;
