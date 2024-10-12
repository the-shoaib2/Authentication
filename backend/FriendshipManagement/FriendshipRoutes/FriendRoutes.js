const express = require('express');
const router = express.Router();
const friendsController = require('../FriendshipControllers/FriendController');
const ensureAuthenticated = require('../../Authentication/Middlewares/Auth');
const friendRequestValidator = require('../FriendshipMiddlewares/FriendRequestValidator');
const asyncHandler = require('../FriendshipUtils/asyncHandler');

// Define friend-related routes
const friendRoutes = [
    { method: 'post', path: '/friend-requests', handler: [friendRequestValidator, asyncHandler(friendsController.sendFriendRequest)] },
    { method: 'post', path: '/friend-requests/accept', handler: [asyncHandler(friendsController.acceptFriendRequest)] },
    { method: 'post', path: '/friend-requests/reject', handler: [asyncHandler(friendsController.rejectFriendRequest)] },
    { method: 'post', path: '/unfriend', handler: [asyncHandler(friendsController.unfriend)] },
    { method: 'post', path: '/mutual-friends', handler: [asyncHandler(friendsController.findMutualFriends)] },
    { method: 'post', path: '/is-friend', handler: [asyncHandler(friendsController.isFriend)] },
    { method: 'post', path: '/block', handler: [asyncHandler(friendsController.blockUser)] },
    { method: 'post', path: '/unblock', handler: [asyncHandler(friendsController.unblockUser)] },
    { method: 'post', path: '/mute', handler: [asyncHandler(friendsController.muteUser)] },
    { method: 'post', path: '/unmute', handler: [asyncHandler(friendsController.unmuteUser)] },
    { method: 'post', path: '/suggestions', handler: [asyncHandler(friendsController.getFriendSuggestions)] },
    { method: 'get', path: '/users', handler: [asyncHandler(friendsController.getAllUsers)] },
    { method: 'get', path: '/friends', handler: [asyncHandler(friendsController.getAllFriends)] },
];

// Register friend-related routes
friendRoutes.forEach(route => {
    router[route.method](route.path, ensureAuthenticated, route.handler);
});

module.exports = router;