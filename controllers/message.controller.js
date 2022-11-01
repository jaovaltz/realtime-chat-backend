const Message = require("../models/message.model");

exports.addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const newMessage = await Message.create({
      text: message,
      users: [from, to],
      sender: from,
    });
    if (newMessage) {
      res.status(200).json({ message: "Message sent successfully" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { from, to } = req.query;
    const messages = await Message.find({
      users: { $all: [from, to] },
    });
    if (messages) {
      res
        .status(200)
        .json({ message: "Messages fetched successfully", data: messages });
    }
    return res.status(500).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};
