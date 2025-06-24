const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    user_name: String,
    role: {
        type: String,
        enum: ["Admin", "User"]
    },
    email: String,
    password: String,
    image: {
        data: Buffer,
        contentType: String
    },
})

module.exports = mongoose.model("User", userSchema);