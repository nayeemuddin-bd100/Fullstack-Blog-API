const User = require("../../model/user/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey('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');
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

  const {email,password} = req.body
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`User does not exist`);
  }
  const passwordMatched = await user.isPasswordMatched(password);

  if (!passwordMatched) {
    return res.json('Password not matched')
  }

  if (user && passwordMatched) {
    res.json({
      _id:user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      profilePhoto: user?.profilePhoto,
      token: generateToken(user?._id,user?.firstName)
    });
  }
  

});

/*=====  End of Login User  ======*/



/*=============================================
=            Fetch All Users            =
=============================================*/

const fetchUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find({})
  try {
    res.json(users)
  } catch (error) {
    res.json(error)
  }
})

/*=====  End of Fetch All Users  ======*/




/*=============================================
=            Delete User           =
=============================================*/
const deleteUserCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id

  validateMongoDbId(id)

  try {
    const user = await User.deleteOne({ id });
    res.json('User Deleted Successfully')
  } catch (error) {
    res.json('Error Deleting user');
  }

})

/*=====  End of Delete    ======*/


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

/*=====  End of User Details  ======*/



/*=============================================
=            User profile            =
=============================================*/

const userProfileCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongoDbId(id)

  try {
    const user = await User.findById(id)
    res.json(user)
  } catch (error) {
    res.json(error);
  }
})

/*=====  End of User profile  ======*/



/*=============================================
=            Update User            =
=============================================*/
const updateUserCtrl = asyncHandler(async (req, res) => {
  const {_id} = req?.headers?.user
  validateMongoDbId(_id)

  try {
    const updateUser = await User.findByIdAndUpdate(_id, {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio:req?.body?.bio,
    }, {
      new: true,
      runValidators:true
    })

    res.json(updateUser)
  } catch (error) {
    res.json(error)
  }
})


/*=====  End of Update User  ======*/


/*=============================================
=            Update Password            =
=============================================*/

const updatePasswordCtrl = asyncHandler(async (req, res) => {
  const { id } = req?.headers?.user
  const {password} = req?.body
  validateMongoDbId(id)

  const user = await User.findById(id)

  if (password) {
    user.password = password
    const updatedUser = await user.save()

    res.json(updatedUser)
  }

  return res.json(user)


})

/*=====  End of Update Password  ======*/


/*=============================================
=            Follow User             =
=============================================*/

const followUserCtrl = asyncHandler(async (req, res) => {
  const { followId } = req?.body;
 const { id:loginId } = req?.headers?.user;

  
 
//find the target user and check if the login id exist
const targetUser = await User.findById(followId);
const alreadyFollowing = targetUser?.followers?.find(
  (user) => user?.toString() == loginId.toString()
);
  
  if (alreadyFollowing) throw new Error("You have already follow the user");

  await User.findByIdAndUpdate(followId, {
    $push: { followers: loginId },
    isFollowing:true
  },{new:true});
  await User.findByIdAndUpdate(
    loginId,
    {
      $push: { following: followId },

    },
    { new: true }
  );

  res.json('You have successfully followed this user')

})

/*=====  End of Follow User   ======*/



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

/*=====  End of Unfollow User  ======*/




/*=============================================
=            Block User            =
=============================================*/
const blockUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req?.params
  validateMongoDbId(id)

 try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    res.json(user);
 } catch (error) {
   res.json(error)
 }

})

/*=====  End of Block User  ======*/


/*=============================================
=            Block User            =
=============================================*/
const unBlockUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req?.params
  validateMongoDbId(id)

 try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );

    res.json(user);
 } catch (error) {
   res.json(error)
 }

})

/*=====  End of Block User  ======*/



/*=============================================
=        Email sending - sendgird            =
=============================================*/
const generateVerificationTokenCtrl = asyncHandler(async (req, res) => {
  const loginUserId = req?.headers?.user?.id
  const user = await User.findById(loginUserId)




  try {

    const accountVerificationToken = await user.createAccountVerificationToken();
    await user.save()
  console.log(accountVerificationToken);

    const restUrl = `Please verify your account, The link will be expired after 10 minutes <br/> </br> <a href="http://localhost:3000/verify-account/${accountVerificationToken}"> Verify your account</a>>  `;
    const msg = {
      to: "ctgnayeem0@gmail.com",
      from: "ctgnayeem0@gmail.com", // Use the email address or domain you verified above
      subject: "Verify user account of full stack Blog App",
      html: restUrl
    }

    await sgMail.send(msg);
    res.json('Email Sent')
  } catch (error) {
    res.json(error)
  }
})

/*=====  End of Email sending - sendgird  ======*/





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
};