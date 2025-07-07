const mongoose = require("mongoose");

const badgeSchema = mongoose.Schema({
  title: String,
  score: {
    type: Number,
    min: [0, "Score cannot be negative"],
  },
  description: String,
  logo: Buffer,
  lang: {
    type: String,
    enum: ["python", "sql"]
  }
});

module.exports = mongoose.model("Badge", badgeSchema);
