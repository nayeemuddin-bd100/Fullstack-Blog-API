require("dotenv").config();
const fs = require("fs");
const User = require("../../model/user/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const cloudinaryUpload = require("../../utils/cloudinary");
const Comment = require("../../model/comment/Comment");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/*=============================================
=                  Register            =
=============================================*/

const userRegisterCtrl = asyncHandler(async (req, res) => {
  // Prevent exist user
  const existUser = await User.findOne({ email: req?.body?.email });
  if (existUser) throw new Error("User already exists");

  try {
    //   Register User
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });

    res.json(user);
  } catch (error) {
    res.json({ error: error });
  }
});

/*=============================================
=            Login User            =
=============================================*/
const userLoginCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`User does not exist`);
  }
  const passwordMatched = await user.isPasswordMatched(password);

  if (!passwordMatched) {
    return res.json("Password not matched");
  }

  if (user && passwordMatched) {
    res.json({
      _id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      isAdmin: user?.isAdmin,
      profilePhoto: user?.profilePhoto,
      token: generateToken(user?._id, user?.firstName),
      isVerified: user?.isAccountVerified,
      blockedUsers: user?.blockedUsers,
    });
  }
});

/*=============================================
=            Fetch All Users            =
=============================================*/

const fetchUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find({});
  try {
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=            Delete User           =
=============================================*/
const deleteUserCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const loggedInUserId = req?.headers?.user?._id;

  validateMongoDbId(id);

  try {
    const author = await User.findById(id);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser?.isAdmin) {
      throw new Error("Only Admin can delete this user");
    } else {
      await User.deleteOne({ _id: author?._id });
      res.json(user);
    }
  } catch (error) {
    res.json("Error Deleting user");
  }
});

/*=============================================
=            User Details            =
=============================================*/

const userDetailsCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=            User profile            =
=============================================*/

const userProfileCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const loggedInUser = req?.headers?.user?._id;
  validateMongoDbId(id);

  try {
    const user = await User.findById(id).populate("posts").populate("viewedBy");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const alreadyViewed = user?.viewedBy?.find((viewedUser) => {
      return viewedUser._id.toString() === loggedInUser.toString();
    });

    if (loggedInUser.toString() === id || alreadyViewed) {
      res.json(user);
    } else {
      const profile = await User.findOneAndUpdate(
        { _id: id },
        { $push: { viewedBy: loggedInUser } },
        { new: true }
      ).populate("viewedBy");
      res.json(profile);
    }
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=            Update User            =
=============================================*/
const updateUserCtrl = asyncHandler(async (req, res) => {
  const { _id } = req?.headers?.user;
  validateMongoDbId(_id);

  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Update the author's name in all comments by the user
    await Comment.updateMany(
      { "author._id": _id },
      {
        $set: {
          "author.firstName": req?.body?.firstName,
          "author.lastName": req?.body?.lastName,
        },
      },
	  {
        new: true,
        runValidators: true,
      }
    );

    res.json(updateUser);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=            Update Password            =
=============================================*/

const updatePasswordCtrl = asyncHandler(async (req, res) => {
  const { id } = req?.headers?.user;
  const { oldPassword, newPassword } = req.body;
  validateMongoDbId(id);

  const user = await User.findById(id);

  if (!user) {
    throw new Error(`User does not exist`);
  }

  const passwordMatched = await user.isPasswordMatched(oldPassword);
  if (!passwordMatched) {
    return res.json("Old Password does not matched");
  }

  if (passwordMatched) {
    user.password = newPassword;
    const updatedUser = await user.save();

    res.json(updatedUser);
  }

  return res.json(user);
});

/*=============================================
=            Follow User             =
=============================================*/

const followUserCtrl = asyncHandler(async (req, res) => {
  const { followId } = req?.body;
  const { id: loginId } = req?.headers?.user;

  //find the target user and check if the login id exist
  const targetUser = await User.findById(followId);
  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() == loginId.toString()
  );

  if (alreadyFollowing) throw new Error("You have already follow the user");

  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginId },
      isFollowing: true,
      isUnFollowing: false,
    },
    { new: true }
  );
  await User.findByIdAndUpdate(
    loginId,
    {
      $push: { following: followId },
    },
    { new: true }
  );

  res.json("You have successfully followed this user");
});

/*=============================================
=            Unfollow User            =
=============================================*/

const unfollowUserCtrl = asyncHandler(async (req, res) => {
  const { unFollowId } = req?.body;
  const loginUserId = req?.headers?.user?.id;

  await User.findByIdAndUpdate(
    unFollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
      isUnFollowing: true,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unFollowId },
    },
    { new: true }
  );

  res.json("You have successfully unfollowed this user");
});

/*=============================================
=            Block User            =
=============================================*/
const blockUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const loggedInUserId = req?.headers?.user?._id;
  validateMongoDbId(id);

  try {
    const blockedUsers = await User.findOne({ _id: id });
    await User.findByIdAndUpdate(loggedInUserId, {
      $push: { blockedUsers: id },
    });
    res.json(blockedUsers);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=           Unblock User            =
=============================================*/
const unBlockUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const loggedInUserId = req?.headers?.user?._id;
  validateMongoDbId(id);

  try {
    const unBlockedUser = await User.findOne({ _id: id });
    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { blockedUsers: id },
    });

    res.json(unBlockedUser);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=   Generate email verification Token     =
=============================================*/
const generateVerificationTokenCtrl = asyncHandler(async (req, res) => {
  const loginUserId = req?.headers?.user?.id;
  const user = await User.findById(loginUserId);

  try {
    const accountVerificationToken =
      await user.createAccountVerificationToken();
    await user.save();

    const restUrl = `<strong>Please verify your account, The link will be expired after 10 minutes <br/> </br> <a href="${process.env.CLIENT_DOMAIN}/verify-token/${accountVerificationToken}"> Click Here </a>  </strong> `;
    const msg = {
      to: user?.email,
      from: "ctgnayeem0@gmail.com", // Use the email address or domain you verified above
      subject: "Verify user account of full stack Blog App",
      html: restUrl,
    };

    await sgMail.send(msg);
    res.json(restUrl);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=            Account verification            =
=============================================*/

const accountVerificationCtrl = asyncHandler(async (req, res) => {
  const { token } = req?.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // find user by token
  const user = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Token has been expired");
  }

  user.isAccountVerified = true;
  user.accountVerificationToken = undefined;
  user.accountVerificationTokenExpires = undefined;
  await user.save();

  res.json(user);
});

/*=============================================
=     Generate Forget Password Token        =
=============================================*/

const forgetPasswordTokenCtrl = asyncHandler(async (req, res) => {
  const { email } = req?.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const accountVerificationToken = await user.forgetPasswordToken();
    await user.save();

    const restUrl = `<strong> To reset your password , please verify your account first. The link will be expired after 10 minutes <br/> </br> <a href="${process.env.CLIENT_DOMAIN}/set-new-pass/${accountVerificationToken}"> Click Here </a>  </strong> `;

    const msg = {
      to: email,
      from: "ctgnayeem0@gmail.com", // Use the email address or domain you verified above
      subject: "Verify user account of full stack Blog App",
      html: restUrl,
    };

    await sgMail.send(msg);
    res.json(restUrl);
  } catch (error) {
    res.json(error);
  }

  res.json(user);
});

/*=============================================
=            Reset and update Password            =
=============================================*/

const restPasswordCtrl = asyncHandler(async (req, res) => {
  const { token, password } = req?.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Token has been expired");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json(user);
});

/*=============================================
=            Profile photo Upload            =
=============================================*/
const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  const _id = req?.headers?.user?.id;

  try {
    const localPath = `public/images/profile/${req.file.filename}`;
    const imgUpload = await cloudinaryUpload(localPath);

    const uploadPhoto = await User.findByIdAndUpdate(
      _id,
      {
        profilePhoto: imgUpload,
      },
      { new: true }
    );

    res.json(uploadPhoto);

    // Delete the temporarily saved image file from the server after uploading it to Cloudinary
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
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
};
