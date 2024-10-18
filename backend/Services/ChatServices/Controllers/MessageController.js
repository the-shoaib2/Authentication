import MessageModel from '../Models/MessageModel.js';
import ChatModel from '../Models/ChatModel.js';
import asyncHandler from '../../../Utils/asyncHandler.js';
import MessageService from '../MessageService.js';

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content, type } = req.body;
    const senderId = req.user._id;

    if (!req.file && !content) {
        return res.status(400).json({ message: 'Content or file is required to send a message.' });
    }

    const newMessage = await MessageService.sendMessage(senderId, chatId, content, req.file, type);
    req.io.to(chatId).emit('receive_message', newMessage);
    res.status(201).json(newMessage);
});

// Receive messages
export const getChatMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const messages = await MessageModel.find({ chat: chatId })
        .sort({ createdAt: 1 })
        .populate('sender', 'first_name last_name profile_picture');
    res.status(200).json(messages);
});
// Add reaction to a message
export const addReaction = asyncHandler(async (req, res) => {
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
export const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
});

// Edit a message
export const editMessage = asyncHandler(async (req, res) => {
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
export const pinMessage = asyncHandler(async (req, res) => {
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
export const forwardMessage = asyncHandler(async (req, res) => {
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
export const bumpMessage = asyncHandler(async (req, res) => {
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
export const searchMessages = asyncHandler(async (req, res) => {
    const { chatId, query } = req.query;

    const messages = await Message.find({
        chat: chatId,
        content: { $regex: query, $options: 'i' }
    }).populate('sender', 'first_name last_name profile_picture');

    res.status(200).json(messages);
});

// Vanish mode for messages
export const vanishMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.vanish = true; // Assuming you have a field to mark messages as vanished
    await message.save();

    res.status(200).json({ message: 'Message set to vanish mode' });
});

// Export all functions
export default {
    sendMessage,
    getChatMessages,
    addReaction,
    deleteMessage,
    editMessage,
    pinMessage,
    forwardMessage,
    bumpMessage,
    searchMessages,
    vanishMessage
};

