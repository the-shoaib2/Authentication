import Chat from '../Models/ChatModel.js';
import MessageModel from '../Models/MessageModel.js';
import asyncHandler from '../../../Utils/asyncHandler.js';
import crypto from 'crypto'; 

// Create chat for two participants
export const createChat = asyncHandler(async (req, res) => {
    const { participants } = req.body;

    // Ensure there are exactly two participants
    if (participants.length !== 2) {
        return res.status(400).json({ message: 'Exactly two participants are required for a one-on-one chat.' });
    }

    // Check if a chat already exists between the two participants
    const existingChat = await Chat.findOne({
        participants: { $all: participants }
    });

    if (existingChat) {
        return res.status(400).json({ message: 'Chat already exists between these participants.' });
    }

    const newChat = new Chat({ participants, type: 'individual' });
    await newChat.save();

    const iv = crypto.randomBytes(16).toString('hex');
    const initialMessage = new MessageModel({
        sender: participants[0],
        chat: newChat._id,
        content: '',
        iv: iv,
        type: 'text',
    });

    await initialMessage.save();
    newChat.messages.push(initialMessage._id);
    await newChat.save();

    res.status(201).json({ chat: newChat, initialMessage }); // Return the new chat object and the initial message
});


// Delete a chat
export  const deleteChat = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if the user is a participant in the chat
        if (!chat.participants.includes(userId)) {
            return res.status(403).json({ message: 'You are not a participant in this chat' });
        }

        await Chat.findByIdAndDelete(chatId);
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chat', error: error.message });
    }
});

// Get chat details
export const getChatDetails = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate('participants', 'first_name last_name profile_picture')
            .populate({
                path: 'messages',
                populate: { path: 'sender', select: 'first_name last_name profile_picture' }
            });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat details', error: error.message });
    }
});

// Get all chats for a user
export const getChats = asyncHandler(async (req, res) => {
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
});

// Get messages for a specific chat
export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await MessageModel.find({ chat: chatId })
            .sort({ createdAt: 1 })
            .populate('sender', 'first_name last_name profile_picture');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

// Add reaction to a message
export const addReaction = asyncHandler(async (req, res) => {
    const { messageId, reaction } = req.body;
    const userId = req.user._id;

    const message = await MessageModel.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    // Check if the user has already reacted
    const existingReaction = message.reactions.find(r => r.user.toString() === userId.toString());
    if (existingReaction) {
        // If the user has already reacted, update the reaction
        existingReaction.reaction = reaction;
    } else {
        // If not, add a new reaction
        message.reactions.push({ user: userId, reaction });
    }

    await message.save();
    res.status(200).json(message);
});

// Delete a message
export const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await MessageModel.findByIdAndDelete(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
});
// Edit a message
export const editMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await MessageModel.findById(messageId);
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
const pinMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await MessageModel.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.isPinned = true;
    await message.save();

    res.status(200).json(message);
});

// Forward a message
const forwardMessage = asyncHandler(async (req, res) => {
    const { messageId, chatId } = req.body;
    const senderId = req.user._id;

    const originalMessage = await MessageModel.findById(messageId);
    if (!originalMessage) {
        return res.status(404).json({ message: 'Original message not found' });
    }

    const newMessage = new MessageModel({
        sender: senderId,
        chat: chatId,
        content: originalMessage.content,
        type: originalMessage.type,
        fileUrls: originalMessage.fileUrls,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
});

// Bump a message
const bumpMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await MessageModel.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.bumpedAt = Date.now();
    await message.save();

    res.status(200).json(message);
});

// Search messages
const searchMessages = asyncHandler(async (req, res) => {
    const { chatId, query } = req.query;

    const messages = await MessageModel.find({
        chat: chatId,
        content: { $regex: query, $options: 'i' }
    }).populate('sender', 'first_name last_name profile_picture');

    res.status(200).json(messages);
});

// Vanish mode for messages
const vanishMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await MessageModel.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }

    message.vanish = true; // Assuming you have a field to mark messages as vanished
    await message.save();

    res.status(200).json({ message: 'Message set to vanish mode' });
});

// Export all functions
export default {
    createChat,
    deleteChat,
    getChatDetails,
    getChats,
    getChatMessages,
    addReaction,
    deleteMessage,
    editMessage,
    pinMessage,
    forwardMessage,
    bumpMessage,
    searchMessages,
    vanishMessage,
};
