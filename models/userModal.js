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
    userAction: [
      {
        storyId: {
          type: mongoose.Schema.Types.ObjectId, 
          required: true,
        },
        bookmark: {
          type: Boolean,
          default: false,
        },
        like: {
          type: String,
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", instaUserSchema);