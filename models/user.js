const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageData: {
      type: {
        url: {
          type: String,
          required: true,
        },
        key: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    permissions: {
      type: Array,
      required: true,
    },
    records: {
      type: [{ type: Schema.Types.ObjectId, ref: "record" }],
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "criminals",
    },
  },
  { timestamps: true }
);
userSchema.methods.addRecord = function (recordId = "") {
  let tempRecords = this.records;

  tempRecords = [...tempRecords, recordId];

  this.records = tempRecords;

  return this.save();
};
userSchema.methods.removeRecord = function (recordId = "") {
  let tempRecords = this.records;

  tempRecords = tempRecords.filter((id) => id.toString() !== recordId);

  this.records = tempRecords;

  return this.save();
};
userSchema.methods.replaceImage = function ({ url = "", key = "" }) {
  this.imageData.url = url;
  this.imageData.key = key;
  return this.save();
};
module.exports = mongoose.model("user", userSchema);
