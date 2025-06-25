const jwt = require("jsonwebtoken");

const userWho = (IDETOKEN)=>{
    try {
        const secret_key = process.env.SECRET_KEY;
        return jwt.verify(IDETOKEN, secret_key)
    } catch (error) {
        return error;
    }
};

module.exports = userWho;