const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Story = require("../models/storyModal");
const User = require("../models/userModal");


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


  const toggleBookmark = expressAsyncHandler(async (req, res) => {
    const { storyId } = req.body;
    const userId = req.userId;

    if (!storyId) {
      res.status(400);
      throw new Error("storyId is required");
    }
  
    const user = await User.findById(userId);
  
    // Find if the story is already bookmarked in userAction array
    const userActionIndex = user.userAction.findIndex(
      (action) => action.storyId.toString() === storyId
    );

  
    if (userActionIndex > -1) {
      const currentAction = user.userAction[userActionIndex];
      
      if (currentAction.bookmark) {
        if (currentAction.like) {
          user.userAction[userActionIndex].bookmark = false;
        } else {
          user.userAction.splice(userActionIndex, 1);
        }
      }else {
         user.userAction[userActionIndex].bookmark = true;
      }
    } else {
      const newAction = {
        storyId: storyId,
        bookmark: true,
        like: user.userAction[userActionIndex]?.like || ""
      };
      user.userAction.push(newAction);
    }
  
    const updatedUser = await user.save();
  
    res.status(200).json({
      success: true,
      error: false,
      data: updatedUser.userAction
    });
  });


  const updateLike = expressAsyncHandler(async (req, res) => {
    const { storyId, newLike } = req.body;
    const userId = req.userId;
    console.log("userId: ", userId);

    if (!storyId || !newLike) {
      res.status(400);
      throw new Error(" storyId and newLike are required");
    }
  
    const user = await User.findById(userId);

  
    // Find the userAction for the storyId
    const userActionIndex = user.userAction.findIndex(
      (action) => action.storyId.toString() === storyId
    );
  
    if (userActionIndex > -1) {
      const currentAction = user.userAction[userActionIndex];
      currentAction.like = newLike;
  
      if (currentAction.like === "" && !currentAction.bookmark) {
        user.userAction.splice(userActionIndex, 1);
      }
    } else {
      user.userAction.push({
        storyId: storyId,
        bookmark: false,  
        like: newLike,
      });
    }
  
    const updatedUser = await user.save();
  
    res.status(200).json({
      success: true,
      error: false,
      data: updatedUser.userAction
    });
  });

  module.exports = { addStory, toggleBookmark, updateLike };  