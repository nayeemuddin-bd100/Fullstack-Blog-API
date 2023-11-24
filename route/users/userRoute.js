const express = require("express");
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
	profilePhotoUploadCtrl,
} = require("../../controllers/users/usersCtr");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	photoUpload,
	profilePhotoResize,
} = require("../../middlewares/uploads/photoUpload");
const userRoutes = express.Router();

/*=====  User authentication  ======*/

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", userLoginCtrl);
userRoutes.post(
	"/generate-verify-email-token",
	authMiddleware,
	generateVerificationTokenCtrl
);
userRoutes.put("/verify-account", authMiddleware, accountVerificationCtrl);

/*=====  User Account Management ======*/

userRoutes.get("/", authMiddleware, fetchUsersCtrl);
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/:id", userDetailsCtrl);
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/update-user-info", authMiddleware, updateUserCtrl);

/*=====  password Management  ======*/

userRoutes.put("/update-password", authMiddleware, updatePasswordCtrl);
userRoutes.put(
	"/forget-password-token",
	forgetPasswordTokenCtrl
);
userRoutes.put("/reset-password", restPasswordCtrl);

/*=====  Follow/unfollow  ======*/
userRoutes.put("/follow", authMiddleware, followUserCtrl);
userRoutes.put("/unfollow", authMiddleware, unfollowUserCtrl);

/*=====  Block/Unblock user  ======*/
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);

/*=====  Profile photo Upload  ======*/

userRoutes.put(
	"/profile-photo-upload",
	authMiddleware,
	photoUpload,
	profilePhotoResize,
	profilePhotoUploadCtrl
);

module.exports = userRoutes;
