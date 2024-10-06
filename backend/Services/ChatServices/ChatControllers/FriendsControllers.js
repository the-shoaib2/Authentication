const FriendRequest = require('../ChatModels/Friends');
const User = require('../../../Authentication/Models/User');
const asyncHandler = require('../../utils/asyncHandler');
const { FRIEND_REQUEST_STATUS } = require('./constants');
const { createChat } = require('./ChatController'); // Import createChat function

const SUCCESS_MESSAGES = {
    FRIEND_REQUEST_SENT: 'Friend request sent.',
    FRIEND_REQUEST_ALREADY_SENT: 'Friend request already sent.',
    FRIEND_REQUEST_ACCEPTED: 'Friend request accepted.',
    FRIEND_REQUEST_NOT_FOUND: 'Friend request not found.',
    FRIEND_REQUEST_REJECTED: 'Friend request rejected.',
    UNFRIENDED: 'You have unfriended the user.',
    MUTED: 'User muted.',
    BLOCKED: 'User blocked.',
};

module.exports = (io) => {
    // Send a friend request
    const sendFriendRequest = asyncHandler(async (req, res) => {
        const senderId = req.user._id;
        const { receiverId } = req.body;

        // Check for existing requests
        const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: SUCCESS_MESSAGES.FRIEND_REQUEST_ALREADY_SENT });
        }

        // Check if the receiver has already sent a request to the sender
        const reverseRequest = await FriendRequest.findOne({ sender: receiverId, receiver: senderId });
        if (reverseRequest) {
            return res.status(400).json({ message: 'You cannot send a friend request to someone who has already sent you one.' });
        }

        // Create a new friend request
        const friendRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId,
            status: FRIEND_REQUEST_STATUS.PENDING,
        });

        await friendRequest.save();
        io.emit('friend_request_sent', { senderId, receiverId });

        res.status(200).json({ message: SUCCESS_MESSAGES.FRIEND_REQUEST_SENT });
    });

    // Accept a friend request
    const acceptFriendRequest = asyncHandler(async (req, res) => {
        const { requestId } = req.body;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: SUCCESS_MESSAGES.FRIEND_REQUEST_NOT_FOUND });
        }

        if (friendRequest.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You cannot accept this request.' });
        }

        // Check if the friend request is already accepted
        if (friendRequest.status === FRIEND_REQUEST_STATUS.ACCEPTED) {
            return res.status(400).json({ message: 'Friend request has already been accepted.' });
        }

        // Check if the users are already friends
        const sender = await User.findById(friendRequest.sender);
        const receiver = await User.findById(friendRequest.receiver);

        if (sender.friends.includes(receiver._id)) {
            return res.status(400).json({ message: 'You are already friends with this user.' });
        }

        friendRequest.status = FRIEND_REQUEST_STATUS.ACCEPTED;
        await friendRequest.save();

        // Add sender and receiver to each other's friends list
        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        // Emit notifications only to the sender
        io.emit('friend_request_accepted', { senderId: sender._id, receiverId: receiver._id });
        io.emit('notification', { userId: sender._id, message: `${receiver.first_name} accepted your friend request.` });

        // Create a chat after accepting the friend request
        const participants = [sender._id, receiver._id]; // Prepare participants for the chat
        const newChat = new Chat({ participants, type: 'individual' });
        await newChat.save(); // Save the new chat

        return res.status(200).json({ message: SUCCESS_MESSAGES.FRIEND_REQUEST_ACCEPTED, chat: newChat });
    });

    // Reject a friend request
    const rejectFriendRequest = asyncHandler(async (req, res) => {
        const { requestId } = req.body;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: SUCCESS_MESSAGES.FRIEND_REQUEST_NOT_FOUND });
        }

        if (friendRequest.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You cannot reject this request.' });
        }

        // Remove the friend request
        await FriendRequest.deleteOne({ _id: requestId });

        // Optionally, update the sender's friend request list if needed
        // You can also remove the request from the sender's outgoing requests if you have that logic

        // Update the sender's and receiver's friends list if necessary
        const sender = await User.findById(friendRequest.sender);
        const receiver = await User.findById(friendRequest.receiver);

        // If you want to ensure they are not added as friends, you can do this
        // (though they shouldn't be if it's a pending request)
        if (sender && receiver) {
            // Optionally, you can add logic to remove them from each other's friends list if they were added
        }

        io.emit('friend_request_rejected', { requestId });
        io.emit('notification', { userId: friendRequest.sender, message: `${req.user.first_name} rejected your friend request.` });

        res.status(200).json({ message: SUCCESS_MESSAGES.FRIEND_REQUEST_REJECTED });
    });

    // Cancel a friend request
    const cancelFriendRequest = asyncHandler(async (req, res) => {
        const { requestId } = req.body;

        // Find the friend request by ID
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: SUCCESS_MESSAGES.FRIEND_REQUEST_NOT_FOUND });
        }

        // Check if the sender is the user trying to cancel the request
        if (friendRequest.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You cannot cancel this request.' });
        }

        // Use deleteOne to remove the friend request
        await FriendRequest.deleteOne({ _id: requestId });

        // Emit the cancellation event to the socket
        io.emit('friend_request_canceled', { requestId });

        res.status(200).json({ message: 'Friend request canceled successfully.' });
    });

    // Unfriend a user
    const unfriend = asyncHandler(async (req, res) => {
        const { friendId } = req.body; // ID of the friend to unfriend
        const userId = req.user._id; // ID of the current user

        console.log(`User ID: ${userId}, Friend ID: ${friendId}`);

        // Find the current user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Remove the friendId from the current user's friends list
        user.friends.pull(friendId);
        await user.save();

        // Find the friend user
        const friend = await User.findById(friendId);
        if (friend) {
            // Remove the current user's ID from the friend's friends list
            friend.friends.pull(userId);
            await friend.save();
        }

        // Emit an event to notify both users
        io.emit('friend_unfriended', { userId: friendId, friendName: user.first_name });
        res.status(200).json({ message: SUCCESS_MESSAGES.UNFRIENDED });
    });

    // Mute a user
    const muteUser = asyncHandler(async (req, res) => {
        const { userId } = req.body;
        // Implement mute logic (e.g., store muted users in the database)
        res.status(200).json({ message: SUCCESS_MESSAGES.MUTED });
    });

    // Take a break from a user
    const takeABreak = asyncHandler(async (req, res) => {
        const { userId } = req.body;
        // Implement take a break logic (e.g., store break status in the database)
        res.status(200).json({ message: "You are taking a break from this user." });
    });

    // Block a user
    const blockUser = asyncHandler(async (req, res) => {
        const { userId } = req.body;
        const currentUserId = req.user._id;

        // Find the user who is blocking
        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Unfriend the user if they are friends
        user.friends.pull(userId);
        user.blockedUsers.push(userId); // Add to blocked users
        await user.save();

        // Also, unfriend the user being blocked
        const blockedUser = await User.findById(userId);
        if (blockedUser) {
            blockedUser.friends.pull(currentUserId);
            await blockedUser.save();
        }

        // Emit notification to both users
        io.emit('user_blocked', { userId: userId, blockerId: currentUserId });
        res.status(200).json({ message: SUCCESS_MESSAGES.BLOCKED });
    });

    // Get all users
    const getAllUsers = asyncHandler(async (req, res) => {
        try {
            const userId = req.user._id; // Get the logged-in user's ID from the request
            const user = await User.findById(userId).lean(); // Use lean for better performance
    
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
    
            // Get the list of blocked user IDs
            const blockedUserIds = user.blockedUsers.map(blocked => blocked.toString());
    
            // Fetch all users excluding the authenticated user and blocked users
            const users = await User.find({ 
                _id: { $ne: userId, $nin: blockedUserIds } 
            }).lean(); // Use lean for better performance
    
            res.status(200).json({
                message: "Users retrieved successfully.",
                success: true,
                users
            });
        } catch (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ message: 'Internal server error', success: false });
        }
    });

    // Fetch all friend requests for the logged-in user
    const fetchFriendRequests = asyncHandler(async (req, res) => {
        const userId = req.user._id;

        // Fetch incoming requests (requests sent to the user)
        const incomingRequests = await FriendRequest.find({ receiver: userId, status: FRIEND_REQUEST_STATUS.PENDING })
            .populate('sender', 'first_name last_name profile_picture')
            .lean(); // Use lean for better performance

        // Fetch outgoing requests (requests sent by the user)
        const outgoingRequests = await FriendRequest.find({ sender: userId, status: FRIEND_REQUEST_STATUS.PENDING })
            .populate('receiver', 'first_name last_name profile_picture')
            .lean(); // Use lean for better performance

        res.status(200).json({
            incomingRequests,
            outgoingRequests
        });
    });

    //Fetch All Friends

    const getFriends = asyncHandler(async(req, res) => {
        try {
            const userId = req.user._id; // Get the authenticated user's ID
            const user = await User.findById(userId).populate('friends', 'first_name last_name profile_picture username'); // Populate friends with username

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found!" });
            }

            res.status(200).json({ success: true, friends: user.friends });
        } catch (error) {
            console.error("Error fetching friends:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });

    // Unblock a user
    const unblockUser = asyncHandler(async (req, res) => {
        const { userId } = req.body;
        const currentUserId = req.user._id;

        // Find the user who is unblocking
        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Remove the user from the blocked list
        user.blockedUsers.pull(userId);
        await user.save();

        // Emit notification to the unblocked user
        io.emit('user_unblocked', { userId: userId, unblockerId: currentUserId });
        res.status(200).json({ message: "User unblocked successfully." });
    });

    // Get blocked users
    const getBlockedUsers = asyncHandler(async (req, res) => {
        const userId = req.user._id;

        // Find the user and populate blocked users
        const user = await User.findById(userId).populate('blockedUsers', 'first_name last_name profile_picture');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({
            message: "Blocked users retrieved successfully.",
            blockedUsers: user.blockedUsers
        });
    });

    // Exports
    return {
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        cancelFriendRequest,
        getAllUsers,
        fetchFriendRequests,
        getFriends,
        unfriend,
        muteUser,
        takeABreak,
        blockUser,
        unblockUser,
        getBlockedUsers,
    };
};