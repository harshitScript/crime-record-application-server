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
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
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
  this.imageData.urls = { ...this.imageData?.urls };
  this.imageData.urls[type] = url;
  this.imageData.keys = { ...this.imageData?.keys };
  this.imageData.keys[type] = key;
  return this.save();
};

recordSchema.methods.deleteImage = function ({ type = "" }) {
  this.imageData.urls[type] = undefined;
  this.imageData.keys[type] = undefined;
  return this.save();
};

recordSchema.methods.editRecord = function ({
  name,
  mobile,
  address,
  crimes,
  city,
  state,
}) {
  this.name = name;
  this.address = address;
  this.mobile = mobile;
  this.crimes = crimes;
  this.city = city;
  this.state = state;
  return this.save();
};

module.exports = mongoose.model("record", recordSchema);
