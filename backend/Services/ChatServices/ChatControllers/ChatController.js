const Chat = require('../ChatModels/Chat');
const Message = require('../ChatModels/Message');
const User = require('../../../Models/User');

exports.createChat = async (req, res) => {
  try {
    const { participants } = req.body;
    const newChat = new Chat({ participants, type: 'individual' });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
};

exports.getChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'first_name last_name profile_picture onlineStatus')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: { path: 'sender', select: 'first_name last_name profile_picture' }
      });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'first_name last_name profile_picture');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'active' }, 'user_id first_name last_name profile_picture onlineStatus');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
