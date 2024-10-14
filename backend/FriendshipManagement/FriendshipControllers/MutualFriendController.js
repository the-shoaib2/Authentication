import logger from '../../Utils/Logger';
import { findConnections } from '../FriendshipUtils/GraphUtils';

export class MutualFriendController {
    async findMutualFriends(req, res) {
        const { userId1, userId2 } = req.body;

        try {
            const user1Connections = await findConnections(userId1);
            const user2Connections = await findConnections(userId2);

            const mutualFriends = user1Connections.filter(friendId => user2Connections.includes(friendId));
            logger.info(`Mutual friends found between ${userId1} and ${userId2}`);
            res.status(200).json({ mutualFriends });
        } catch (error) {
            logger.error(`Error fetching mutual friends: ${error.message}`);
            res.status(500).json({ message: "Error fetching mutual friends", error });
        }
    }
}

module.exports = new MutualFriendController();
