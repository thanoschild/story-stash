const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

// @desc Register a user
// @route POST /api/users/register
// @access public
const RegisterUser = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fileds are required");
  }

  const userAvailable = await User.findOne({ username });
  if (userAvailable) {
    res.status(400);
    throw new Error("username already exsist!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({ success: true, error: false, data: user });
  } else {
    res.status(400);
    throw new Error("user data is not valid");
  }
});

// @desc Login user
// @route POST /api/users/login
// @access public
const LoginUser = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fileds are required");
  }

  const user = await User.findOne({ username: username });
  if (user && (await bcrypt.compare(password, user.password))) {
    const tokenData = {
      id: user._id,
      username: username,
    };

    console.log("id: ", user._id.toString());

    const accessToken = jwt.sign(tokenData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    res.status(200).json({ success: true, error: false, data: accessToken });
  } else {
    res.status(401);
    throw new Error("username is not valid");
  }
});

module.exports = { RegisterUser, LoginUser };


//   {
//     "username": "rashmi",
//     "password": "123abc",
//     "id": "66eb177ef99a5e95cdb8c76f",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWIxNzdlZjk5YTVlOTVjZGI4Yzc2ZiIsInVzZXJuYW1lIjoicmFzaG1pIiwiaWF0IjoxNzI2Njg0NzI2LCJleHAiOjE3MjY2ODgzMjZ9.8dGZy6Jkr5dmz1zHUTSjguMfA-YFUDCMmHUFGlHSvWo"
//   }

//   {
//     "username": "sumeet",
//     "password": "abc123",
//     "token": "",
//     "id": "66eb1762f99a5e95cdb8c76c"
//   }


