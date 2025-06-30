const Badge = require("../../models/badgeModel");
const Avatar = require("../../models/avatarModel")

const router = require("express").Router();

router.post("/addBadge", async (req, res) => {
  try {
    const image = req.file
      ? { data: req.file.buffer, contentType: req.file.mimetype }
      : null;
    const { title, description, score } = req.body;

    const res = await Badge.create({
        title, score, description, logo: image
    });
    res.send(res)
  } catch (error) {
    res.send(error);
  }
});


router.post("/addAvatar", async (req, res) => {
  try {
    const image = req.file
      ? { data: req.file.buffer, contentType: req.file.mimetype }
      : null;
    const { name } = req.body;

    const res = await Avatar.create({
        name, avatar: image
    });
    res.send(res)
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
