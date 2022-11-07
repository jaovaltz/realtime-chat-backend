const messageService = require("../services/messages.services");

exports.addMessage = async (req, res) => {
  const { message } = req.body;
  const { to } = req.query;

  messageService.addMessage(
    { from: req.user.id, to, message },
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Error adding message" });
      }
      return res.status(200).json({ message: "Message added successfully" });
    }
  );
};

exports.getMessages = async (req, res) => {
  const { to } = req.query;

  messageService.getMessages({ from: req.user.id, to }, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Error getting messages" });
    }
    return res
      .status(200)
      .json({ message: "Messages fetched successfully", data: result });
  });
};
