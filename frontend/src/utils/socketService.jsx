import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';

class SocketService {
  constructor() {
    this.socket = io(SOCKET_URL);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  off(event) {
    this.socket.off(event);
  }

  getSocket() {
    return this.socket; // Return the socket instance
  }

  // New methods for user status
  emitUserStatus(userId, status) {
    this.socket.emit('user_status', { userId, status });
  }

  onUserStatus(callback) {
    this.socket.on('user_status', callback);
  }

  // New methods for user notifications
  onFriendRequestSent(callback) {
    this.socket.on('friend_request_sent', callback);
  }

  onFriendRequestAccepted(callback) {
    this.socket.on('friend_request_accepted', callback);
  }

  onFriendRequestRejected(callback) {
    this.socket.on('friend_request_rejected', callback);
  }

  onFriendUnfriended(callback) {
    this.socket.on('friend_unfriended', callback);
  }

  onUserBlocked(callback) {
    this.socket.on('user_blocked', callback);
  }

  onUserUnblocked(callback) {
    this.socket.on('user_unblocked', callback);
  }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;
