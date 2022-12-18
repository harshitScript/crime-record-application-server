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
    criminalsList: {
      type: [{ type: Schema.Types.ObjectId, ref: "criminals" }],
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

module.exports = mongoose.model("user", userSchema);
