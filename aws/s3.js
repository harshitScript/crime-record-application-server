const aws = require("aws-sdk");

aws.config.update({
  region: process.env.S3_REGION,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_PUBLIC_ACCESS_KEY,
});

const s3 = new aws.S3();

module.exports = s3;
