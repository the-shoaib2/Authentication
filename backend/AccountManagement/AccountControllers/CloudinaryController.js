const { uploadOnCloudinary, deleteFromCloudinary } = require('../AccountConfig/cloudinaryConfig');
const UserModel = require('../../Authentication/Models/User');

// Controller function to upload files
const uploadFile = async (req, res) => {
    try {
        const filePath = req.file.path; 
        const folderName = req.body.folderName || 'files'; 
        const uploadResult = await uploadOnCloudinary(filePath, folderName, 'auto'); 
        res.status(200).json({
            message: 'File uploaded successfully',
            url: uploadResult.secure_url 
        });
    } catch (error) {
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
};

// Controller function to upload images with processing
const uploadImage = async (req, res) => {
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
            message: 'Image uploaded successfully',
            url: uploadResult.secure_url 
        });
    } catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
};

// Controller function to delete files
const deleteImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId);

        if (!user.cloudinaryPublicId) {
            return res.status(400).json({ message: 'No image to delete' });
        }

        const deleteResult = await deleteFromCloudinary(user.cloudinaryPublicId);

        // Update the user's profile picture URL and clear the publicId in the database
        let defaultAvatar = user.gender === 'male' 
            ? 'https://res.cloudinary.com/dtteg3e2b/image/upload/v1728306869/CHATAPP/avatar/xqmmchslvhkpjbu6hbo0.jpg'
            : 'https://res.cloudinary.com/dtteg3e2b/image/upload/v1728306936/CHATAPP/avatar/uw7nihkwksrweo2k6qbc.jpg';

        await UserModel.findByIdAndUpdate(userId, { 
            avatar: defaultAvatar, 
            cloudinaryPublicId: null 
        }, { new: true });

        res.status(200).json({
            message: 'File deleted successfully',
            result: deleteResult
        });
    } catch (error) {
        res.status(500).json({ message: 'File deletion failed', error: error.message });
    }
};

module.exports = {
    uploadFile,
    uploadImage,
    deleteImage 
};
