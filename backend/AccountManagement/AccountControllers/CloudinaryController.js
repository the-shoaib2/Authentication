const { uploadOnCloudinary } = require('../AccountConfig/cloudinaryConfig');

// Controller function to upload files
const uploadFile = async (req, res) => {
    try {
        const filePath = req.file.path; // Get the file path
        const uploadResult = await uploadOnCloudinary(filePath, 'files', 'auto'); // Upload to Cloudinary
        res.status(200).json({
            message: 'File uploaded successfully',
            url: uploadResult.secure_url // Return the URL of the uploaded file
        });
    } catch (error) {
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
};

// Controller function to upload images with processing
const uploadImage = async (req, res) => {
    try {
        const uploadResult = await uploadOnCloudinary(req.file.buffer, 'images', 'image'); // Upload the processed image buffer
        res.status(200).json({
            message: 'Image uploaded successfully',
            url: uploadResult.secure_url // Return the URL of the uploaded image
        });
    } catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
};

module.exports = {
    uploadFile,
    uploadImage
};
