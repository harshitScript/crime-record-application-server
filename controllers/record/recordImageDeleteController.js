const s3 = require("../../aws/s3");
const Record = require("../../models/record");
const recordImageDeleteController = async (req, res, next) => {
  const { recordId, type } = req.params;

  const imagesType = {
    front: true,
    side: true,
  };

  try {
    if (!imagesType?.[type]) {
      const error = new Error("The type of image not found.");
      throw error;
    }
    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Corresponding record not found.");
      throw error;
    }
    const imageKey = record?.imageData?.keys?.[type];

    if (!imageKey) {
      const error = new Error("Image does not exits.");
      throw error;
    }

    await s3
      ?.deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: imageKey,
      })
      ?.promise();

    await record.deleteImage({ type });

    res.json({
      message: `Image of ${type} deleted successfully.`,
      type,
    });
    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = recordImageDeleteController;
