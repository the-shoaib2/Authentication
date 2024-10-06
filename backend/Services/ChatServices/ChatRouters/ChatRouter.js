const ensureAuthenticated = require('../../../Authentication/Middlewares/Auth');
const express = require("express");
const router = express.Router();

module.exports = (io) => {
    const friendsController = require('../ChatControllers/FriendsControllers')(io);
    const messageController = require('../ChatControllers/MessageController');

    // Define friend-related routes
    const friendRoutes = [
        { method: 'get', path: '/all-users', handler: friendsController.getAllUsers },
        { method: 'post', path: '/friend-requests', handler: friendsController.sendFriendRequest },
        { method: 'post', path: '/friend-requests/accept', handler: friendsController.acceptFriendRequest },
        { method: 'post', path: '/friend-requests/reject', handler: friendsController.rejectFriendRequest },
        { method: 'post', path: '/friend-requests/cancel', handler: friendsController.cancelFriendRequest },
        { method: 'get', path: '/friend-requests', handler: friendsController.fetchFriendRequests },
        { method: 'get', path: '/friends', handler: friendsController.getFriends },
        { method: 'post', path: '/unfriend', handler: friendsController.unfriend },
        { method: 'post', path: '/mute', handler: friendsController.muteUser },
        { method: 'post', path: '/take-a-break', handler: friendsController.takeABreak },
        { method: 'post', path: '/block', handler: friendsController.blockUser },
        { method: 'post', path: '/unblock', handler: friendsController.unblockUser },
        { method: 'get', path: '/blocked-users', handler: friendsController.getBlockedUsers },
    ];

    // Define message-related routes
    const messageRoutes = [
        { method: 'post', path: '/send-message', handler: messageController.sendMessage },
        { method: 'get', path: '/chat/:chatId/messages', handler: messageController.getChatMessages },
        { method: 'post', path: '/message/reaction', handler: messageController.addReaction },
        { method: 'delete', path: '/message/:messageId', handler: messageController.deleteMessage },
        { method: 'put', path: '/message/:messageId/edit', handler: messageController.editMessage },
        { method: 'post', path: '/message/:messageId/pin', handler: messageController.pinMessage },
        { method: 'post', path: '/message/forward', handler: messageController.forwardMessage },
        { method: 'post', path: '/message/:messageId/bump', handler: messageController.bumpMessage },
        { method: 'get', path: '/message/search', handler: messageController.searchMessages },
        { method: 'post', path: '/message/:messageId/vanish', handler: messageController.vanishMessage },
    ];

    // Register friend-related routes
    friendRoutes.forEach(route => {
        router[route.method](route.path, ensureAuthenticated, route.handler);
    });

    // Register message-related routes
    messageRoutes.forEach(route => {
        router[route.method](route.path, ensureAuthenticated, route.handler);
    });

    return router;
};
