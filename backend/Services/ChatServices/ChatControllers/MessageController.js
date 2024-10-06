const Message = require('../ChatModels/Message');
const Chat = require('../ChatModels/Chat');
const User = require('../../../Authentication/Models/User');
const asyncHandler = require('../../utils/asyncHandler');

// Send a message
exports.sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content, type } = req.body;
    const senderId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(senderId)) {
        return res.status(403).json({ message: 'You are not part of this chat' });
    }

    const newMessage = new Message({
        sender: senderId,
        chat: chatId,
        content,
        type,
    });

    await newMessage.save();
    chat.messages.push(newMessage._id);
    await chat.save();

    res.status(201).json(newMessage);
});

// Receive messages
exports.getChatMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId })
        .sort({ createdAt: 1 })
        .populate('sender', 'first_name last_name profile_picture');
    res.status(200).json(messages);
});

// Add reaction to a message
exports.addReaction = asyncHandler(async (req, res) => {
    const { messageId, reaction } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.reactions.push({ user: userId, reaction });
    await message.save();

    res.status(200).json(message);
});

// Delete a message
exports.deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
});

// Edit a message
exports.editMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.content = content;
    message.isEdited = true;
    message.editHistory.push({ content, editedAt: Date.now() });
    await message.save();

    res.status(200).json(message);
});

// Pin a message
exports.pinMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.isPinned = true;
    await message.save();

    res.status(200).json(message);
});

// Forward a message
exports.forwardMessage = asyncHandler(async (req, res) => {
    const { messageId, chatId } = req.body;
    const senderId = req.user._id;

    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) {
        return res.status(404).json({ message: 'Original message not found' });
    }

    const newMessage = new Message({
        sender: senderId,
        chat: chatId,
        content: originalMessage.content,
        type: originalMessage.type,
        fileUrl: originalMessage.fileUrl,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
});

// Bump a message
exports.bumpMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.bumpedAt = Date.now();
    await message.save();

    res.status(200).json(message);
});

// Search messages
exports.searchMessages = asyncHandler(async (req, res) => {
    const { chatId, query } = req.query;

    const messages = await Message.find({
        chat: chatId,
        content: { $regex: query, $options: 'i' }
    }).populate('sender', 'first_name last_name profile_picture');

    res.status(200).json(messages);
});

// Vanish mode for messages
exports.vanishMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.vanish = true; // Assuming you have a field to mark messages as vanished
    await message.save();

    res.status(200).json({ message: 'Message set to vanish mode' });
});