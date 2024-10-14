import sharp from 'sharp';
import { MAX_IMAGE_SIZE, MIN_PROCESS_IMAGE_SIZE, SKIP_PROCESS_IMAGE_SIZE, IMAGE_MAX_DIMENSION, JPEG_QUALITY } from "../../Constants.js"; // Importing the constants

// Constants for image processing
const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

// Middleware to process images
export const imageProcessingMiddleware = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file data received' });
    }

    try {
        if (!VALID_IMAGE_TYPES.has(req.file.mimetype)) {
            return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
        }

        if (!req.file.buffer || req.file.buffer.length === 0) {
            return res.status(400).json({ message: 'Invalid image buffer.' });
        }

        let imageBuffer = req.file.buffer;
        let { size } = await sharp(imageBuffer).metadata();

        // Skip processing if the image size is less than or equal to 150KB
        if (size <= SKIP_PROCESS_IMAGE_SIZE) {
            return next();
        }

        // Process if the image is between 80KB and 10MB
        if (size >= MIN_PROCESS_IMAGE_SIZE && size <= MAX_IMAGE_SIZE) {
            imageBuffer = await sharp(imageBuffer)
                .resize({ width: IMAGE_MAX_DIMENSION, height: IMAGE_MAX_DIMENSION, fit: sharp.fit.inside })
                .jpeg({ quality: JPEG_QUALITY })
                .toBuffer();

            size = await sharp(imageBuffer).metadata().then(metadata => metadata.size);

            if (size > MAX_IMAGE_SIZE) {
                return res.status(400).json({ message: 'Processed image exceeds 10MB.' });
            }
        } else if (size < MIN_PROCESS_IMAGE_SIZE) {
            return res.status(400).json({ message: 'Image size is below the minimum required size of 30KB for processing.' });
        }

        req.file.buffer = imageBuffer;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error processing image', error: error.message });
    }
};

export default {
    imageProcessingMiddleware
};
