const UserModel = require('../../Authentication/Models/User');

const findConnections = async (userId) => {
    const user = await UserModel.findById(userId).populate('friends');
    return user.friends.map(friend => friend._id);
};

const areFriends = (user1Friends, user2Id) => {
    return user1Friends.includes(user2Id);
};

module.exports = { findConnections, areFriends };
