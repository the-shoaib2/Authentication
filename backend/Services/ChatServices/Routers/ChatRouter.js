// backend/Services/ChatServices/ChatRouters/ChatRouter.js

import express from 'express';
const router = express.Router();
import chatController from '../Controllers/ChatController.js';
import chatAuth from '../../../Authentication/Middlewares/Auth.js';

// Middleware to attach io instance to the request
router.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
});

// Define your chat-related routes here
router.post('/create-chat', chatAuth, chatController.createChat);

export default router;
