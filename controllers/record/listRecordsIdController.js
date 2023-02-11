const Records = require("../../models/record");
const listRecordsIdController = async (req, res, next) => {
  const { creator } = req.query;

  try {
    const recordsId = await Records.find(
      creator === "all" ? {} : { creator }
    ).select("_id");

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
