const mongoose = require("mongoose");

const connectMongoDb = () => {
  return mongoose.connect(process.env.MONGO_URI);
};

module.exports = { connectMongoDb };
