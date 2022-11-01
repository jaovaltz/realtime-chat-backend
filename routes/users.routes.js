const userController = require("../controllers/user.controller");

const express = require("express");
const router = express.Router();

router.get("/user-profile", userController.userProfile);
router.get("/get-contacts", userController.getAllOtherUsers);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/change-user-picture", userController.changeUserProfilePicture);

module.exports = router;
