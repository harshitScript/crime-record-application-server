const { createHmac } = require("crypto");

const generateExpiryInMilSeconds = ({ hours = 1 }) => {
  const currentDate = new Date();

  currentDate.setHours(currentDate.getHours() + hours);

  return currentDate.getTime();
};

const generateHash = ({ algorithm = "sha512", string = "", secret = "" }) => {
  return createHmac(algorithm, secret).update(string).digest("hex");
};

module.exports = {
  generateExpiryInMilSeconds,
  generateHash,
};
