import express from 'express';
const router = express.Router();
import messageController from '../Controllers/MessageController.js'; 

// Define your message-related routes here
router.post('/send', messageController.sendMessage);
router.get('/chat/:chatId/messages', messageController.getChatMessages);
router.post('/reaction', messageController.addReaction); // This is where the reaction is handled
router.delete('/:messageId', messageController.deleteMessage);
router.put('/:messageId/edit', messageController.editMessage);
router.post('/:messageId/pin', messageController.pinMessage);
router.post('/forward', messageController.forwardMessage);
router.post('/:messageId/bump', messageController.bumpMessage);
router.get('/search', messageController.searchMessages);

export default router;
