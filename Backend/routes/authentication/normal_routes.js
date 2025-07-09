const router = require("express").Router();

const userControllers = require("../../controllers/userControllers");
const upload = require("../../multerConf/multerConf");
router.post("/signup", upload.single("image"), userControllers.createUser);
router.post("/signin", userControllers.loginUser);
router.post("/logout", userControllers.logoutUser);
router.get("/me", userControllers.userWho);
router.get("/profile", userControllers.getProfile);

router.put("/updateName", userControllers.updateName);

module.exports = router;
