const generateExpiryInMilSeconds = ({ hours = 1 }) => {
  const currentDate = new Date();

  currentDate.setHours(currentDate.getHours() + hours);

  return currentDate.getTime();
};

module.exports = {
  generateExpiryInMilSeconds,
};
