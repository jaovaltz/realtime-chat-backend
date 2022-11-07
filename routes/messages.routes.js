const messageController = require("../controllers/message.controller");

const express = require("express");
const router = express.Router();

router.get("/get-messages", messageController.getMessages);
router.post("/add-messages", messageController.addMessage);

module.exports = router;
