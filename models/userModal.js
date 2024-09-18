const mongoose = require("mongoose");

const instaUserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please add the user name"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "please add the user password"],
    },
    userAction: []
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", instaUserSchema);