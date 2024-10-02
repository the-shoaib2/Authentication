const ensureAuthenticated = require('../../../Middlewares/Auth');
const express = require("express");
const router = express.Router();

module.exports = (io) => {
    const friendsController = require('../ChatControllers/FriendsControllers')(io);

    const routes = [
        { method: 'get', path: '/all-users', handler: friendsController.getAllUsers },
        { method: 'post', path: '/friend-requests', handler: friendsController.sendFriendRequest },
        { method: 'post', path: '/friend-requests/accept', handler: friendsController.acceptFriendRequest },
        { method: 'post', path: '/friend-requests/reject', handler: friendsController.rejectFriendRequest },
        { method: 'post', path: '/friend-requests/cancel', handler: friendsController.cancelFriendRequest }, // Add this line
        { method: 'get', path: '/friend-requests', handler: friendsController.fetchFriendRequests },
        { method: 'get', path: '/friends', handler: friendsController.getFriends },
        { method: 'post', path: '/unfriend', handler: friendsController.unfriend },
        { method: 'post', path: '/mute', handler: friendsController.muteUser },
        { method: 'post', path: '/take-a-break', handler: friendsController.takeABreak },
        { method: 'post', path: '/block', handler: friendsController.blockUser },
        { method: 'post', path: '/unblock', handler: friendsController.unblockUser },
        { method: 'get', path: '/blocked-users', handler: friendsController.getBlockedUsers },
    ];

    routes.forEach(route => {
        router[route.method](route.path, ensureAuthenticated, route.handler);
    });

    return router;
};
