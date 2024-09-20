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


  const userAction = expressAsyncHandler(async (req, res) => {
    const { storyId, newBookmark, newLike } = req.body;
    const userId = req.userId;

    if (!storyId) {
      res.status(400);
      throw new Error("storyId is required");
    }

    // if(newBookmark.length === 0 && newLike.length === 0) {
    //   res.status(400);
    //   throw new Error("both bookmark or like cannot be empty");
    // }
  
    const user = await User.findById(userId);
    const userActionIndex = user.userAction.findIndex(
      (action) => action.storyId.toString() === storyId
    );

    console.log("index: ", userActionIndex);
    if (userActionIndex > -1) {
      const currentAction = user.userAction[userActionIndex];
      currentAction.bookmark = newBookmark;
      currentAction.like = newLike;

      if(newBookmark.length === 0 && newLike.length === 0) {
        user.userAction.splice(userActionIndex, 1);
      }
      
      // if (currentAction.bookmark) {
      //   if (currentAction.like) {
      //     user.userAction[userActionIndex].bookmark = false;
      //   } else {
      //     user.userAction.splice(userActionIndex, 1);
      //   }
      // }else {
      //    user.userAction[userActionIndex].bookmark = true;
      // }
    } else {
      if(newBookmark.length !== 0 || newLike.length !== 0) {
        console.log("inside else")
        const newAction = {
          storyId: storyId,
          bookmark: newBookmark,
          like: newLike
        };
        user.userAction.push(newAction);
      }
    }
  
    const updatedUser = await user.save();
  
    res.status(200).json({
      success: true,
      error: false,
      data: updatedUser.userAction
    });
  });


 
  module.exports = { addStory, userAction };  



  // add story
  // get story 
  // update story 
  // bookmark click
  // like per click
  // ?story=123456&slide=1