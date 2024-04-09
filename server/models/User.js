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
      required: true,
      minLength: [8, "Must be at least 8 characters long"],
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
