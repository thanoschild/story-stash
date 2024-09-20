const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { addStory, userAction } = require("../controllers/storyController");

const router = express.Router();

router.post("/add", validateToken, addStory);
router.post("/action", validateToken, userAction);


module.exports = router;