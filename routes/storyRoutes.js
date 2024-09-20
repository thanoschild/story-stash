const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { addStory, userAction, getBookmarkAndLike, updateLikeCounts, getStory, updateStory, getStoriesByUserId } = require("../controllers/storyController");

const router = express.Router();

router.post("/add", validateToken, addStory);
router.get("/get", validateToken, getStory);
router.get("/get-userid", validateToken, getStoriesByUserId);
router.post("/update", validateToken, updateStory);
router.post("/action", validateToken, userAction);
router.get("/bookmark-like", validateToken, getBookmarkAndLike);
router.post("/update-like", validateToken, updateLikeCounts);

module.exports = router;