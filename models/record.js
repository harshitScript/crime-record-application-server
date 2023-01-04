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
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    crimes: {
      type: [{}],
      required: true,
    },
    imageData: {
      type: {
        urls: {
          type: {
            front: {
              type: String,
            },
            side: {
              type: String,
            },
          },
        },
        keys: {
          type: {
            front: {
              type: String,
            },
            side: {
              type: String,
            },
          },
        },
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

recordSchema.methods.addImage = function ({ type = "", url = "", key = "" }) {
  const imageData = this.imageData;
  imageData.urls = { ...imageData?.urls };
  imageData.urls[type] = url;
  imageData.keys = { ...imageData?.keys };
  imageData.keys[type] = key;
  this.imageData = imageData;

  return this.save();
};

module.exports = mongoose.model("record", recordSchema);
