const mongoose = require("mongoose");
const { isEmail, contains } = require("validator");
const filter = require("../util/filter");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, "Must be at least 6 characters long"],
      maxlength: [30, "Must be no more than 30 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Must be valid email address"],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minLength: [8, "Must be at least 8 characters long"],
    },
    googleId: {
      type: String,
      sparse: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    phone: {
      type: String,
    },
    state: {
      type: String,
    },
    college: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    Links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link",
      },
    ],
    profile: {
      type: String,
      default: "https://www.gravatar.com/avatar/",
    },
    colour: {
      type: String,
      default: "#000000",
    },
    cover: {
      type: String,
      default:
        "https://media.istockphoto.com/id/938484386/vector/abstract-blue-gradient-background.jpg?s=612x612&w=0&k=20&c=F5lRq6NW_24AZHR1mTI0_gfkoacLu1gycs_TRZhvzr8=",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: String,
        unique: true,
      },
    ],
    viewedBy: [
      {
        type: String,
        unique: true,
      },
    ],
  },

  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (filter.isProfane(this.username)) {
    throw new Error("Username cannot contain profanity");
  }
  next();
});

module.exports = mongoose.model("user", UserSchema);
