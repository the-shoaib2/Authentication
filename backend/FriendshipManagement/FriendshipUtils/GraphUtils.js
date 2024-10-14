import UserModel from '../../Authentication/Models/UserModel.js';

export const findConnections = async (userId) => {
    const user = await UserModel.findById(userId).populate('friends');
    return user.friends.map(friend => friend._id);
};

export const areFriends = (user1Friends, user2Id) => {
    return user1Friends.includes(user2Id);
};

export default { findConnections, areFriends };
