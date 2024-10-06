const sharp = require('sharp');

// Constants for image processing
const MAX_IMAGE_SIZE = 150 * 1024; // 150KB
const MIN_IMAGE_SIZE = 80 * 1024; // 80KB
const IMAGE_MAX_DIMENSION = 800; // Maximum dimension for resizing
const JPEG_QUALITY = 90; // JPEG quality setting

// Define allowed image types dynamically
const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

// Middleware to process images
const imageProcessingMiddleware = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file data received' });
    }

    try {
        // Validate that the file is an image
        if (!VALID_IMAGE_TYPES.has(req.file.mimetype)) {
            return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
        }

        // Check if the buffer is valid
        if (!req.file.buffer || req.file.buffer.length === 0) {
            return res.status(400).json({ message: 'Invalid image buffer.' });
        }

        // Check the size of the image
        let imageBuffer = req.file.buffer;
        let { size } = await sharp(imageBuffer).metadata();

        // If the image is larger than 80KB, process it
        if (size > MIN_IMAGE_SIZE) {
            imageBuffer = await sharp(imageBuffer)
                .resize({ width: IMAGE_MAX_DIMENSION, height: IMAGE_MAX_DIMENSION, fit: sharp.fit.inside }) // Resize while maintaining aspect ratio
                .jpeg({ quality: JPEG_QUALITY })
                .toBuffer();

            // Check the size after processing
            size = await sharp(imageBuffer).metadata().then(metadata => metadata.size);

            // Ensure the image does not exceed 150KB
            if (size > MAX_IMAGE_SIZE) {
                return res.status(400).json({ message: 'Processed image exceeds 150KB.' });
            }
        }

        // If the image is less than 80KB, we can upload it directly without processing
        if (size < MIN_IMAGE_SIZE) {
            return res.status(400).json({ message: 'Image size is below the minimum required size of 80KB.' });
        }

        // Update the req.file buffer with the processed image
        req.file.buffer = imageBuffer;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error processing image', error: error.message });
    }
};

module.exports = {
    imageProcessingMiddleware
};
