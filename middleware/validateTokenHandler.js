const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = expressAsyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error("user is not authorized")
            }
            // console.log("decoded: ", decoded);
            req.userId = decoded.id;
            next();
        });

        if(!token) {
            res.status(401);
            throw new Error("user is not authorized or token is missing in the request");
        }
    }
});

module.exports = validateToken;