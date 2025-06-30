const mongoose = require("mongoose");

const avatarSchema = mongoose.Schema({
  name: String,
  avatar: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Avatar", avatarSchema);
