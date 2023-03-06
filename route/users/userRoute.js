const express = require('express');
const {
  userRegisterCtrl,
  userLoginCtrl,
  fetchUsersCtrl,
  deleteUserCtrl,
  userDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
  followUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
  restPasswordCtrl,
} = require("../../controllers/users/usersCtr");
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const userRoutes = express.Router();




userRoutes.post('/register', userRegisterCtrl)
userRoutes.post('/login', userLoginCtrl)
userRoutes.post("/generate-verify-email-token",authMiddleware, generateVerificationTokenCtrl);
userRoutes.put(
  "/verify-account",
  authMiddleware,
  accountVerificationCtrl
);
userRoutes.get('/',authMiddleware, fetchUsersCtrl)
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/:id", userDetailsCtrl);
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/updatePassword/:id", authMiddleware, updatePasswordCtrl);
userRoutes.put("/forget-password-token", authMiddleware,forgetPasswordTokenCtrl);
userRoutes.put("/reset-password", restPasswordCtrl);
userRoutes.put("/follow", authMiddleware, followUserCtrl);
userRoutes.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);



module.exports = userRoutes;