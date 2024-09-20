const expressAsyncHandler = require("express-async-handler");
const Story = require("../models/storyModal");
const User = require("../models/userModal");

const addStory = expressAsyncHandler(async (req, res) => {
  const sessionUserId = req.userId;
  const { slides } = req?.body;
  
  if(!slides || slides.length === 0) {
    res.status(400)
    throw new Error("slides parameter is required and connot be empty")
  }
  const payload = {
    userId: sessionUserId,
    slides: slides,
  };

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


const getStory = expressAsyncHandler(async (req, res) => {
  const { storyId } = req.body;

  if(!storyId) {
    res.status(404)
    throw new Error("StoryId not found")
  }

  const story = await Story.findById(storyId);

  res.status(200).json({
    message: "story fetched successfully",
    success: true,
    error: false,
    data: story,
  });
});


const getStoriesByUserId = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const stories = await Story.find({ userId });
  
  res.status(200).json({
    message: "story fetched successfully",
    success: true,
    error: false,
    data: stories,
  });
});


const updateStory = expressAsyncHandler(async (req, res) => {
  const { storyId, slides } = req.body;

  if(!storyId) {
    res.status(404)
    throw new Error("StoryId not found")
  }
  
  const story = await Story.findById(storyId);
  story.slides = slides;
  const saveStory = await story.save();

  res.status(200).json({
    message: "story updated successfully",
    success: true,
    error: false,
    data: saveStory,
  });
});


const userAction = expressAsyncHandler(async (req, res) => {
  const { storyId, newBookmark, newLike } = req.body;
  const userId = req.userId;

  if (!storyId || !newBookmark || !newLike) {
    res.status(400);
    throw new Error("storyId, bookmark and Like is required");
  }

  const user = await User.findById(userId);
  const userActionIndex = user.userAction.findIndex(
    (action) => action.storyId.toString() === storyId
  );

  if (userActionIndex > -1) {
    const currentAction = user.userAction[userActionIndex];
    currentAction.bookmark = newBookmark;
    currentAction.like = newLike;

    if (newBookmark.length === 0 && newLike.length === 0) {
      user.userAction.splice(userActionIndex, 1);
    }
  } else {
    if (newBookmark.length !== 0 || newLike.length !== 0) {
      const newAction = {
        storyId: storyId,
        bookmark: newBookmark,
        like: newLike,
      };
      user.userAction.push(newAction);
    }
  }
  const updatedUser = await user.save();

  res.status(200).json({
    message: "bookmark and like updated successfully",
    success: true,
    error: false,
    data: updatedUser.userAction,
  });
});


const updateLikeCounts = expressAsyncHandler(async (req, res) => {
  const {storyId, slideId, like} = req.body;
  const story = await Story.findById(storyId);
  if(!story) {
    res.status(400)
    throw new Error("story doesn't exist");
  }
  if(slideId >= story.slides.length) {
    res.status(404);
    throw new Error("Slide not found");
  }
  
  story.slides[slideId].likes += like;
  story.markModified('slides');
  const updatedStory = await story.save();

  res.status(200).json({
    message: "like updated successfully",
    success: true,
    error: false,
    data: updatedStory
  });
});


const getBookmarkAndLike = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);

  if(!user) {
    res.status(400);
    throw new Error("user doesn't exist");
  }

  res.status(200).json({
    message: "bookmark and like fetched successfully",
    success: true,
    error: false,
    data: user.userAction
  })
});

module.exports = { 
  addStory, 
  getStory, 
  getStoriesByUserId,
  updateStory, 
  userAction, 
  getBookmarkAndLike, 
  updateLikeCounts 
};

// add story -- done
// get story -- done
// update story -- done
// get story by userId -- done
// bookmark like update -- done
// get bookmark and like -- done
// like count per click -- done
// ?story=123456&slide=1
