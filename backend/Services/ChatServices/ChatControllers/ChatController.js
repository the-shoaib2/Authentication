const Chat = require('../ChatModels/Chat');
const Message = require('../ChatModels/Message');
const User = require('../../../Authentication/Models/User');
const asyncHandler = require('../../utils/asyncHandler');

// Create chat for two participants
const createChat = asyncHandler(async (req, res) => {
    const { participants } = req.body;

    // Ensure there are exactly two participants
    if (participants.length !== 2) {
        return res.status(400).json({ message: 'Exactly two participants are required for a one-on-one chat.' });
    }

    const newChat = new Chat({ participants, type: 'individual' });
    await newChat.save();

    // Create an initial empty message
    const initialMessage = new Message({
        sender: participants[0], // Assuming the first participant sends the initial message
        chat: newChat._id,
        content: '', // Empty content for the initial message
        type: 'text', // Assuming the type is text
    });

    await initialMessage.save();
    newChat.messages.push(initialMessage._id); // Add the message to the chat
    await newChat.save(); // Save the chat with the new message

    res.status(201).json({ chat: newChat, initialMessage }); // Return the new chat object and the initial message
});

// Delete a chat
const deleteChat = asyncHandler(async (req, res) => {
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
const getChatDetails = asyncHandler(async (req, res) => {
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
const getChats = async (req, res) => {
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

// Get messages for a specific chat
const getChatMessages = async (req, res) => {
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

// Export all functions
module.exports = {
    createChat,
    deleteChat,
    getChatDetails,
    getChats,
    getChatMessages,
};
