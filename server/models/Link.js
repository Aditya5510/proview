
const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
},
    title: {
      type: String,
      required: true,
      minlength: [3, "Must be at least 6 characters long"],
      maxlength: [30, "Must be no more than 30 characters long"],
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "Hey! checkout my account",
    },

  },


  { timestamps: true }
);



module.exports = mongoose.model("Link", LinkSchema);
