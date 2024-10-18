import MessageModel from './Models/MessageModel.js';
import { uploadOnCloudinary } from '../../AccountManagement/AccountConfig/cloudinaryConfig.js';
import EncryptionMiddleware from './Middlewares/MessageEncryptionMiddleware.js';

class MessageService {
    async sendMessage(senderId, chatId, content, file, type) {
        const fileUrls = await this.handleFileUpload(file);
        const encryptedContent = this.encryptContent(content);

        const newMessage = new MessageModel({
            sender: senderId,
            chat: chatId,
            content: encryptedContent.encryptedData,
            iv: encryptedContent.iv,
            type: type || 'text',
            fileUrls: fileUrls
        });

        await newMessage.save();
        return newMessage;
    }

    async handleFileUpload(file) {
        if (!file) return [];
        const uploadResult = await uploadOnCloudinary(file.buffer, 'messages', file.mimetype.split('/')[0]);
        return [uploadResult.secure_url];
    }

    encryptContent(content) {
        return EncryptionMiddleware.encrypt(content || '');
    }
}

export default new MessageService();
