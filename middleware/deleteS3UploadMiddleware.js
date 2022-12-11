const { validationResult } = require("express-validator");
const s3 = require("../aws/s3");

const deleteS3UploadMiddleware = async (req, res, next) => {
  const validationErrors = validationResult(req);

  try {
    if (validationErrors.isEmpty()) {
      return next();
    } else {
      const { file } = req;

      const folder = file.key.split("/")?.[2];

      await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET,
          Key: `${process.env.APPLICATION_CODE}/${process.env.APP_PHASE}/${folder}/${file.originalname}`,
        })
        .promise();

      next();
    }
  } catch (error) {
    next(error);
  }
};
module.exports = deleteS3UploadMiddleware;
