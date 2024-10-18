import MessageModel from './Models/MessageModel.js'; 
import UserModel from '../../Authentication/Models/UserModel.js'; 

export const chatService = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('send_message', async (data) => {
            const { senderId, receiverId, content, type } = data;

            const newMessage = new MessageModel({ sender: senderId, receiver: receiverId, content, type });
            await newMessage.save();

            socket.to(receiverId).emit('receive_message', newMessage);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export default chatService;
