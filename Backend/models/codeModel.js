const mongoose = require("mongoose");
const User = require("./userModel")


const codeSchema = mongoose.Schema({
    code: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

module.exports = mongoose.model("Code", codeSchema);