const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configurationSchema = new Schema({
  tenant: {
    type: String,
    required: true,
    unique: true,
  },
  theme: {
    type: {
      primaryColor: {
        type: String,
        required: true,
      },
      secondaryColor: {
        type: String,
        required: true,
      },
      primaryShade: {
        type: String,
        required: true,
      },
      secondaryShade: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  config: {
    type: {},
    required: true,
  },
});

module.exports = mongoose.model("configuration", configurationSchema);
