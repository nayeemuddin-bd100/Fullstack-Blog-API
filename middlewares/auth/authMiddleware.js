const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/user/User");


const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith('Bearer')) {
        try {
            token = req?.headers?.authorization?.split(" ")[1];

            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const {id} = decoded
                
                // find user by id and set user details in request headers
                const user = await User.findById(id).select("-password")
                req.headers.user = user
            } else {
                throw new Error("Token is expired , login again")
            }next();
           
       } catch (error) {
           throw new Error('Invalid token')
       }
    } else {
        throw new Error("There is no authorized token,Login again")
    }
})


module.exports = authMiddleware;