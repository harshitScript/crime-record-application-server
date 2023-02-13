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
      ternaryColor: {
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
    type: {
      views: {
        type: [
          {
            title: {
              type: String,
              required: true,
            },
            code: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              required: true,
            },
            imageURL: {
              type: String,
              required: true,
            },
          },
        ],
        required: true,
      },
    },
    required: true,
  },
});

module.exports = mongoose.model("configuration", configurationSchema);
