const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { addStory, toggleBookmark, updateLike } = require("../controllers/storyController");

const router = express.Router();

router.post("/add", validateToken, addStory);
router.post("/bookmark", validateToken, toggleBookmark);
router.post("/like", validateToken, updateLike);


module.exports = router;