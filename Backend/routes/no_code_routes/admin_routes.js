const Badge = require("../../models/badgeModel");
const Avatar = require("../../models/avatarModel")

const router = require("express").Router();

router.post("/addBadge", async (req, res) => {
  try {
    const { title, description, score } = req.body;

    const res = await Badge.create({
        title, score, description, logo: req.file.buffer
    });
    res.send(res)
  } catch (error) {
    res.send(error);
  }
});


router.post("/addAvatar", async (req, res) => {
  try {
    const { name } = req.body;

    const res = await Avatar.create({
        name, avatar: req.file.buffer
    });
    res.send(res)
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
