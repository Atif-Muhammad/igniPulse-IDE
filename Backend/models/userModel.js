const mongoose = require("mongoose");
const Code = require("./codeModel");
const Badge = require("./badgeModel");


const userSchema = mongoose.Schema({
  user_name: String,
  role: {
    type: String,
    enum: ["Admin", "User"],
  },
  email: String,
  password: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  totalExec: {
    type: Number,
    default: 0,
  },
  successExec: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Code",
    },
  ],
  errorExec: {
    type: Number,
    default: 0,
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Badge"
  }]
});

module.exports = mongoose.model("User", userSchema);
