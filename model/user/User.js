const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//User Schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First Name is required"],
      type: String,
    },
    lastName: {
      required: [true, "Last Name is required"],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://ed-spaces.com/wp-content/uploads/2020/10/default-avatar-profile-icon-vector-18942381.jpg",
    },
    email: {
      type: String,
      required: [true, "Email is required"],

    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Hash password by bcryptjs
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(this.password, salt);

  this.password = hash;

  next();
});

// Custom method to match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  if (!isMatch) {
    throw new Error("Password not matched");
  }
  return true;
};

// verify account
userSchema.methods.createAccountVerificationToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000 //10 minutes

  return verificationToken; 
  
};


// Forget password token
userSchema.methods.forgetPasswordToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto.createHash("sha256").update(verificationToken).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000 //10 minutes

  return verificationToken;
}

// compile schema into model=
const User = mongoose.model("User", userSchema);

module.exports = User;

/**
 *
 * There are two types of mongoose hooks, such as : pre and post
 *
 * pre- pre is called before saved data in database
 * post - post is called after saved data.
 *
 */
