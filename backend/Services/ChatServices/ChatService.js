import MessageModel from './Models/MessageModel.js'; 
import UserModel from '../../Authentication/Models/UserModel.js'; 

export const chatService = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Listen for chat messages
        socket.on('send_message', async (data) => {
            const { senderId, receiverId, content, type } = data;

            // Save the message to the database
            const newMessage = new MessageModel({ sender: senderId, receiver: receiverId, content, type });
            await newMessage.save();

            // Emit the message to the receiver
            socket.to(receiverId).emit('receive_message', newMessage);
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export default chatService;
