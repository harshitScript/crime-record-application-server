const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      required: true,
    },
    crimes: {
      type: [String],
      required: true,
    },
    imageData: {
      type: {
        urls: {
          type: [String],
        },
        keys: {
          type: [String],
        },
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("record", recordSchema);
