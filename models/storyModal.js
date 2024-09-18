const mongoose = require("mongoose");

const instaStorySchema = mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    slides: []
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("story", instaStorySchema);