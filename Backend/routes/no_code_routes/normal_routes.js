const router = require("express").Router();
const Avatar = require("../../models/avatarModel");
const User = require("../../models/userModel")
router.get("/getAvatars", async (req, res) => {
  try {
    const response = await Avatar.find({});

    const final = response.map((doc) => ({
      ...doc._doc,
      avatar: doc.avatar
        ? `data:image/png;base64,${doc.avatar.data.toString("base64")}`
        : null,
    }));

    res.send(final);
  } catch (error) {
    res.send(error);
  }
});

router.put("/selAvatar", async (req, res) => {
  try {
    const { currentUser, avatar } = req.body;
      await User.updateOne(
      { _id: currentUser },
      { image: avatar}
    );
    res.send("avatar uploaded....");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
