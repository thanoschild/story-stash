const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Story = require("../models/storyModal");

const addStory = expressAsyncHandler(async (req, res) => {
    const sessionUserId = req.userId;
    const { slides } = req?.body;
    
    const payload = {
        userId: sessionUserId,
        slides: slides
    }

    const newStory = new Story(payload);
    const saveStory = await newStory.save();
  
    if (!saveStory) {
      res.status(400);
      throw new Error("Unable to add story");
    }
  
    res.status(201).json({
      message: "story added successfully",
      data: saveStory,
      success: true,
      error: false,
    });
  });

  module.exports = { addStory };  