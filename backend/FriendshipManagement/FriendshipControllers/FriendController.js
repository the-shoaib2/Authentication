const FriendRequestModel = require('../FriendshipModels/FriendRequest');
const UserModel = require('../../Authentication/Models/User');
const logger = require('../FriendshipUtils/Logger');
const { findConnections, areFriends } = require('../FriendshipUtils/GraphUtils');

class FriendController {

    async sendFriendRequest(req, res) {
        const { receiverId } = req.body;
        const senderId = req.user._id;

        if (senderId === receiverId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const existingRequest = await FriendRequestModel.findOne({ sender: senderId, receiver: receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent." });
        }

        const friendRequest = new FriendRequestModel({ sender: senderId, receiver: receiverId });
        await friendRequest.save();
        logger.info(`Friend request sent from ${senderId} to ${receiverId}`);
        res.status(201).json({ message: "Friend request sent." });
    }

    async fetchFriendRequests(req, res) {
        const userId = req.user._id;
        const requests = await FriendRequestModel.find({ receiver: userId }).populate('sender', 'first_name last_name profile_picture');
        res.status(200).json({ incomingRequests: requests });
    }

    async acceptFriendRequest(req, res) {
        const { requestId } = req.body;
        const request = await FriendRequestModel.findById(requestId);

        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: "Friend request not found." });
        }

        request.status = 'accepted';
        await request.save();
        await UserModel.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
        await UserModel.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });

        logger.info(`Friend request accepted between ${request.sender} and ${request.receiver}`);
        res.status(200).json({ message: "Friend request accepted." });
    }

    async rejectFriendRequest(req, res) {
        const { requestId } = req.body;
        const request = await FriendRequestModel.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        request.status = 'rejected';
        await request.save();
        logger.info(`Friend request rejected from ${request.sender} to ${request.receiver}`);
        res.status(200).json({ message: "Friend request rejected." });
    }

    async unfriend(req, res) {
        const { friendId } = req.body;
        const userId = req.user._id;

        await UserModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        await UserModel.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
        logger.info(`User ${userId} unfriended ${friendId}`);
        res.status(200).json({ message: "Unfriended successfully." });
    }

    async blockUser(req, res) {
        const { userIdToBlock } = req.body;
        const userId = req.user._id;

        await UserModel.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: userIdToBlock } });
        logger.info(`User ${userId} blocked ${userIdToBlock}`);
        res.status(200).json({ message: "User blocked." });
    }

    async unblockUser(req, res) {
        const { userIdToUnblock } = req.body;
        const userId = req.user._id;

        await UserModel.findByIdAndUpdate(userId, { $pull: { blockedUsers: userIdToUnblock } });
        logger.info(`User ${userId} unblocked ${userIdToUnblock}`);
        res.status(200).json({ message: "User unblocked." });
    }

    async muteUser(req, res) {
        const { userIdToMute } = req.body;
        const userId = req.user._id;

        await UserModel.findByIdAndUpdate(userId, { $addToSet: { mutedUsers: userIdToMute } });
        logger.info(`User ${userId} muted ${userIdToMute}`);
        res.status(200).json({ message: "User muted." });
    }

    async unmuteUser(req, res) {
        const { userIdToUnmute } = req.body;
        const userId = req.user._id;

        await UserModel.findByIdAndUpdate(userId, { $pull: { mutedUsers: userIdToUnmute } });
        logger.info(`User ${userId} unmuted ${userIdToUnmute}`);
        res.status(200).json({ message: "User unmuted." });
    }

    async isFriend(req, res) {
        const { userId1, userId2 } = req.body;
        const user1 = await UserModel.findById(userId1);
        const isFriend = areFriends(user1.friends, userId2);
        res.status(200).json({ isFriend });
    }

    async getFriendSuggestions(req, res) {
        const userId = req.user._id;
        const user = await UserModel.findById(userId).populate('friends');

        const friendIds = user.friends.map(friend => friend._id);
        const suggestions = await UserModel.find({
            _id: { $nin: [...friendIds, userId] },
        }).limit(5);

        res.status(200).json({ suggestions });
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({}, '-password -__v');
            res.status(200).json(users);
        } catch (error) {
            logger.error(`Error fetching users: ${error.message}`);
            res.status(500).json({ message: "Error fetching users", error });
        }
    }

    async getAllFriends(req, res) {
        const userId = req.user._id;

        try {
            const user = await UserModel.findById(userId).populate('friends', '-password -__v');
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({ friends: user.friends });
        } catch (error) {
            logger.error(`Error fetching friends: ${error.message}`);
            res.status(500).json({ message: "Error fetching friends", error });
        }
    }

    async findMutualFriends(req, res) {
        const { userId1, userId2 } = req.body;

        try {
            const user1Connections = await findConnections(userId1);
            const user2Connections = await findConnections(userId2);

            const mutualFriends = user1Connections.filter(friendId => user2Connections.includes(friendId));
            res.status(200).json({ mutualFriends });
        } catch (error) {
            logger.error(`Error fetching mutual friends: ${error.message}`);
            res.status(500).json({ message: "Error fetching mutual friends", error });
        }
    }
}

module.exports = new FriendController();