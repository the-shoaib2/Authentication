import { uploadOnCloudinary } from '../AccountConfig/cloudinaryConfig.js';
import sharp from 'sharp';

// Controller function to edit and upload images
export const editAndUploadImage = async (req, res) => {
    try {
        const { crop, filter } = req.body; 
        let imageBuffer = req.file.buffer; 

        // Apply cropping if specified
        if (crop) {
            const { width, height, left, top } = crop; // Destructure crop parameters
            imageBuffer = await sharp(imageBuffer)
                .extract({ width, height, left, top }) // Crop the image
                .toBuffer();
        }

        // Apply filters if specified (example: grayscale)
        if (filter === 'grayscale') {
            imageBuffer = await sharp(imageBuffer)
                .grayscale()
                .toBuffer();
        }

        // Upload the processed image buffer to Cloudinary
        const uploadResult = await uploadOnCloudinary(imageBuffer, 'images', 'image');
        res.status(200).json({
            message: 'Image edited and uploaded successfully',
            url: uploadResult.secure_url 
        });
    } catch (error) {
        res.status(500).json({ message: 'Image editing or upload failed', error: error.message });
    }
};

export default {
    editAndUploadImage 
};