const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { addStory } = require("../controllers/storyController");

const router = express.Router();

router.post("/add", validateToken, addStory);


module.exports = router;