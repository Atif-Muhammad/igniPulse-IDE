const mongoose = require("mongoose");

const badgeSchema = mongoose.Schema({
  title: String,
  score: {
    type: Number,
    min: [0, "Score cannot be negative"],
  },
  description: String,
  logo: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Badge", badgeSchema);
