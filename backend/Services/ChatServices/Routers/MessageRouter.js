import express from 'express';
const router = express.Router();
import messageController from '../Controllers/MessageController.js';
import { encrypt, decrypt } from '../E2E_Encryption.js'; // Import encryption functions

// Define your message-related routes here
router.post('/send', async (req, res) => {
  const { text, chatId } = req.body;
  const encryptedMessage = encrypt(text); // Encrypt the message
  const messageData = { text: encryptedMessage.encryptedData, chatId }; // Prepare message data
  await messageController.sendMessage(messageData); // Send the encrypted message
  res.status(200).json({ message: "Message sent successfully" });
});

router.get('/chat/:chatId/messages', async (req, res) => {
  const messages = await messageController.getChatMessages(req.params.chatId);
  const decryptedMessages = messages.map(msg => ({
    ...msg,
    text: decrypt({ iv: msg.iv, encryptedData: msg.text }) 
  }));
  res.status(200).json(decryptedMessages);
});

router.post('/reaction', messageController.addReaction);
router.delete('/:messageId', messageController.deleteMessage);
router.put('/:messageId/edit', messageController.editMessage);
router.post('/:messageId/pin', messageController.pinMessage);
router.post('/forward', messageController.forwardMessage);
router.post('/:messageId/bump', messageController.bumpMessage);
router.get('/search', messageController.searchMessages);

export default router;
