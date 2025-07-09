const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Badge = require("../models/badgeModel");

const userControllers = {
  createUser: async (req, res) => {
    // console.log(req.body);
    const { name, email, password, role } = req.body;
    // console.log(name, email, password, role)
    try {
      // Check for existing username or email in one query
      const existingUser = await User.findOne({
        $or: [{ user_name: name }, { email }],
      });

      if (existingUser) {
        const conflictField =
          existingUser.email === email ? "email" : "username";
        return res.status(400).send(`${conflictField} is already taken`);
      }

      // Hash password
      const saltRounds = 15;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await User.create({
        user_name: name,
        email,
        password: hashedPassword,
        role: role || "User",
        image: req.file
          ? { data: req.file.buffer, contentType: req.file.mimetype }
          : null,
      });

      // JWT token generation
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          user_name: newUser.user_name,
          role: newUser.role,
        },
        process.env.SECRET_KEY,
        { algorithm: "HS256", expiresIn: process.env.JWT_EXP }
      );

      // Send email
      const sentMail = await sendEmail(
        email,
        "Thank you!",
        "Thank you fro creating an account with us"
      );
      if (!sentMail.accepted?.length) {
        return res.status(500).send("Failed to send email");
      }

      // Send cookie
      res
        .cookie("IDETOKEN", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        })
        .send("Successfully logged in - cookie sent");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  },

  loginUser: async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    try {
      const userDetails = await User.findOne({ email });
      if (!userDetails) {
        return res.status(404).send("User not found - create account first");
      }

      const passwordMatch = await bcrypt.compare(
        password,
        userDetails.password
      );
      if (!passwordMatch) {
        return res.status(401).send("Invalid credentials");
      }

      const payload = {
        id: userDetails._id,
        email: userDetails.email,
        user_name: userDetails.user_name,
        role: userDetails.role,
      };

      const tokenFromCookie = req.cookies?.IDETOKEN;
      jwt.verify(tokenFromCookie, process.env.SECRET_KEY, async (err) => {
        if (err) {
          // Generate new token
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: "7d",
          });

          const sentMail = await sendEmail(email, "New Login", "New Login");
          if (!sentMail.accepted?.length) {
            return res.status(500).send("Failed to send email");
          }

          res
            .cookie("IDETOKEN", token, {
              httpOnly: true,
              sameSite: "strict",
              secure: false,
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .send("Successfully logged in - new cookie set");
        } else {
          res.send("Successfully logged in - cookie already valid");
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Login failed due to server error");
    }
  },
  logoutUser: (req, res) => {
    res
      .clearCookie("IDETOKEN", {
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        secure: false,
      })
      .send("successfully logged out--Redirecting to index page");
  },
  userWho: (req, res) => {
    const user_jwt = req.cookies?.IDETOKEN;
    const secret_key = process.env.SECRET_KEY;
    res.send(
      jwt.verify(user_jwt, secret_key, (err, decoded) => {
        if (err) {
          return err;
        } else {
          return decoded;
        }
      })
    );
  },
  getProfile: async (req, res) => {
    const user_id = req.query.user;

    try {
      const usr = await User.findOne({ _id: user_id })
        .populate("image")
        .populate({
          path: "successExec",
          options: {
            sort: { createdAt: -1 },
          },
        })
        .populate({
          path: "badges",
          options: {
            sort: { score: -1 },
          },
        });

        // console.log(usr)
      // Convert avatar to base64
      const finalUser = {
        ...usr._doc,
        image: usr?.image?.avatar
          ? `data:image/png;base64,${usr.image.avatar.toString("base64")}`
          : null,
        badges: usr.badges?.map((badge) => ({
          ...badge._doc,
          logo: badge.logo
            ? `data:image/png;base64,${badge.logo.toString("base64")}`
            : null,
        })),
      };

      // Attach next badge for each language
      const nextBadgePy = await Badge.find({
        score: { $gt: finalUser?.pyScore },
        lang: "python",
      })
        .sort({ score: 1 })
        .limit(1);
      const nextBadgeSql = await Badge.find({
        score: { $gt: finalUser?.sqlScore },
        lang: "sql",
      })
        .sort({ score: 1 })
        .limit(1);

      // Convert next badges to base64 too
      finalUser.nextBadgePy = nextBadgePy.map((badge) => ({
        ...badge._doc,
        logo: badge.logo
          ? `data:image/png;base64,${badge.logo.toString("base64")}`
          : null,
      }));

      finalUser.nextBadgeSql = nextBadgeSql.map((badge) => ({
        ...badge._doc,
        logo: badge.logo
          ? `data:image/png;base64,${badge.logo.toString("base64")}`
          : null,
      }));

      // console.log(finalUser)
      res.send(finalUser);
    } catch (error) {
      res.send(error);
    }
  },

  updateName: async(req, res)=>{
    const {id, name} = req.body;
    try {
      await User.updateOne({_id: id}, {user_name: name});
      res.send("updated.")
    } catch (error) {
      
    }
  }
};

module.exports = userControllers;
