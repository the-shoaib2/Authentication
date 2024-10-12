// backend/Services/ChatServices/ChatRouters/ChatRouter.js

const express = require('express');
const router = express.Router();
const messageController = require('../ChatControllers/MessageController'); 
const chatController = require('../ChatControllers/ChatController');
const chatAuth = require('../../../Authentication/Middlewares/Auth');

// Middleware to attach io instance to the request
router.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
});

// Define your chat-related routes here
router.post('/create-chat', chatController.createChat);
router.post('/send-message', chatAuth, messageController.sendMessage); 
router.get('/chat/:chatId/messages', messageController.getChatMessages);
router.post('/message/reaction', messageController.addReaction);
router.delete('/message/:messageId', messageController.deleteMessage);
router.put('/message/:messageId/edit', messageController.editMessage);
router.post('/message/:messageId/pin', messageController.pinMessage);
router.post('/message/forward', messageController.forwardMessage);
router.post('/message/:messageId/bump', messageController.bumpMessage);
router.get('/message/search', messageController.searchMessages);

module.exports = router;
