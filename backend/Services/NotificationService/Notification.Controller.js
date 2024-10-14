const NotificationQueue = require('./Notification.Queue');

class NotificationService {
    constructor(io) {
        this.notificationQueue = new NotificationQueue(io); // Pass io instance
    }

    sendFriendRequestNotification(senderId, receiverId) {
        this.notificationQueue.addNotification({
            event: 'friend_request_sent',
            data: { senderId, receiverId }
        });
    }

    sendFriendRequestAcceptedNotification(senderId, receiverId) {
        this.notificationQueue.addNotification({
            event: 'friend_request_accepted',
            data: { senderId, receiverId }
        });
    }

    sendFriendRequestRejectedNotification(senderId, receiverId) {
        this.notificationQueue.addNotification({
            event: 'friend_request_rejected',
            data: { senderId, receiverId }
        });
    }

    sendUnfriendNotification(userId, friendId) {
        this.notificationQueue.addNotification({
            event: 'friend_unfriended',
            data: { userId, friendId }
        });
    }
}

module.exports = NotificationService;
