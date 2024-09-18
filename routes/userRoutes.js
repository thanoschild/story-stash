const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { RegisterUser, LoginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

module.exports = router;