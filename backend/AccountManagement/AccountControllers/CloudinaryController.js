import { uploadOnCloudinary, deleteFromCloudinary } from '../AccountConfig/cloudinaryConfig.js';
import UserModel from '../../Authentication/Models/UserModel.js';

// Controller function to upload files
export const uploadFile = async (req, res) => {
    try {
        const filePath = req.file.path; 
        const folderName = req.body.folderName || 'files'; 
        const uploadResult = await uploadOnCloudinary(filePath, folderName, 'auto'); 
        res.status(200).json({
            message: 'File uploaded !',
            url: uploadResult.secure_url 
        });
    } catch (error) {
        res.status(500).json({ message: 'File Upload failed', error: error.message });
    }
};

// Controller function to upload images with processing
export const uploadImage = async (req, res) => {
    try {
        const folderName = req.body.folderName || 'images'; 
        const uploadResult = await uploadOnCloudinary(req.file.buffer, folderName, 'image'); 

        // Update the user's profile picture URL and publicId in the database
        const userId = req.user.id; 
        await UserModel.findByIdAndUpdate(userId, { 
            avatar: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id
        }, { new: true });

        res.status(200).json({
            message: 'Avatar Uploaded !',
            url: uploadResult.secure_url 
        });
    } catch (error) {
        res.status(500).json({ message: 'Avatar Upload failed', error: error.message });
    }
};

// Controller function to delete files
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.params; // Assuming you're passing the public ID of the image to delete
        const result = await deleteFromCloudinary(publicId);
        res.status(200).json({ message: 'Image deleted successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting image', error: error.message });
    }
};

export default {
    uploadFile,
    uploadImage,
    deleteImage 
};
