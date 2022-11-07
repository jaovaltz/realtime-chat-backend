const Message = require("../models/message.model");

async function addMessage({ to, message, from }, callback) {
  try {
    const newMessage = await Message.create({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
    });
    return callback(null, newMessage);
  } catch (error) {
    return callback(error);
  }
}

async function getMessages({ to, from }, callback) {
  try {
    const messages = await Message.find({
      users: { $all: [from, to] },
    }).sort({ createdAt: 1 });
    const projectMessages = messages.map((message) => {
      return {
        fromSender: message.sender.toString() === from.toString(),
        message: message.message.text,
      };
    });
    return callback(null, projectMessages);
  } catch (error) {
    return callback(error);
  }
}

module.exports = {
  addMessage,
  getMessages,
};
