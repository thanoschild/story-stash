const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

connectDb();
const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/story", require("./routes/storyRoutes"));


app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});