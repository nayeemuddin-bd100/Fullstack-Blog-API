const User = require("../../model/user/User");
const asyncHandler = require("express-async-handler");



/*=============================================
=                  Register            =
=============================================*/

const userRegisterCtrl = asyncHandler(async (req, res) => {
  // Prevent exist user
  const existUser = await User.findOne({ email: req?.body?.email });

  // if (existUser) {
  //   return res.json({ error: "User already exists" });

  // }
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

const userLoginCtrl = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    res.json('Login Successfully');
  } else {
    res.json({error: "User Not Found!"})
  }

  
}


/*=====  End of Login User  ======*/





module.exports = { userRegisterCtrl, userLoginCtrl };