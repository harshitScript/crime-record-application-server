const s3 = require("../aws/s3");
const multerS3 = require("multer-s3");
const multer = require("multer");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "application/octet-stream"
  ) {
    return cb(null, true);
  }
  return cb(null, false);
};

const limits = {
  fileSize: 5000000,
};

const s3Uploads = (folder = "") => {
  return multer({
    storage: multerS3({
      bucket: `${process.env.S3_BUCKET}`,
      s3: s3,
      contentDisposition: "inline",
      acl: "public-read",
      key: (req, file, cb) => {
        return cb(
          null,
          `${process.env.APPLICATION_CODE}/${process.env.APP_PHASE}/${folder}/${file.originalname}`
        );
      },
    }),
    fileFilter,
    limits,
  });
};

module.exports = s3Uploads;
