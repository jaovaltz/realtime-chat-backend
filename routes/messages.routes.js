const messageController = require("../controllers/message.controller");

const express = require("express");
const router = express.Router();

router.get("/get-messages", messageController.getMessage);

router.post("/add-message", messageController.addMessage);

module.exports = router;
