const socketIo = require('socket.io');
const User = require('../Models/User');

module.exports = (server) => {
	const io = socketIo(server, {
		cors: {
			origin: 'http://localhost:3000', 
			methods: ['GET', 'POST'],
			credentials: true,
		},
	});

	const connectedUsers = new Map();

	const updateUserStatus = async (userId, status) => {
		await User.findByIdAndUpdate(userId, { onlineStatus: status, lastActive: Date.now() });
		io.emit('user_status', { userId, status: status ? 'online' : 'offline' }); // Notify all users
	};

	io.on('connection', (socket) => {
		console.log('New client connected');

		socket.on('user_connected', async (userId) => {
			connectedUsers.set(userId, socket.id);
			await updateUserStatus(userId, true);
		});

		socket.on('user_status_toggle', async (userId, status) => {
			await updateUserStatus(userId, status);
		});

		socket.on('disconnect', async () => {
			console.log('Client disconnected');
			for (const [userId, socketId] of connectedUsers.entries()) {
				if (socketId === socket.id) {
					await updateUserStatus(userId, false);
					connectedUsers.delete(userId);
					break;
				}
			}
		});

		// Handle friend request cancellation
		socket.on('friend_request_canceled', (data) => {
			const { requestId, userId } = data; // Extract requestId and userId from data
			io.emit('friend_request_canceled', { requestId, userId }); // Notify all users about the cancellation
			console.log(`Friend request ${requestId} canceled by user ${userId}`);
		});
	});

	return io;
};
