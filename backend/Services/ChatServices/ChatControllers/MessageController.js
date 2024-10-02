const Message = require('../ChatModels/Message');
const Chat = require('../ChatModels/Chat');

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content, type } = req.body;
    const sender = req.user.id;

    const newMessage = new Message({
      sender,
      content,
      chat: chatId,
      type,
    });

    await newMessage.save();
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: newMessage._id },
      updatedAt: Date.now(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status', error: error.message });
  }
};
