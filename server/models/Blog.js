const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: [3, "Must be at least 3 characters long"],
      maxlength: [120, "Must be no more than 120 characters long"],
    },
    content: {
      type: String,
      default: "",
      maxlength: [5000, "Must be no more than 5000 characters long"],
    },
    image: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    viewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
