const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//create Schema

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
      required: [true, "Password is required"],
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
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(this.password, salt);

  this.password = hash;

  next()
})

// compile schema into model

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

