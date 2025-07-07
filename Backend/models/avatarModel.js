const mongoose = require("mongoose");

const avatarSchema = mongoose.Schema({
  name: String,
  avatar: Buffer,
});

module.exports = mongoose.model("Avatar", avatarSchema);
