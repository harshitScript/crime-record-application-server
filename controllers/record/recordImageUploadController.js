const Record = require("../../models/record");
const recordImageUploadController = async (req, res, next) => {
  const { recordId, type } = req.params;
  const uploadedImage = req.file;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Corresponding record not found.");
      throw error;
    }

    await record.addImage({
      type,
      url: uploadedImage.location,
      key: uploadedImage.key,
    });

    res.status(201).json({
      message: "File upload successful",
      url: uploadedImage.location,
      type,
    });
    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = recordImageUploadController;
