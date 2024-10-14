import multer from "multer";

//importing constants
import { FILE_SIZE_LIMIT, UPLOAD_FOLDER, ALLOWED_IMAGE_TYPES, ALLOWED_OTHER_TYPES } from "../../Constants.js"; // Importing the constants

// Memory storage for images
export const memoryStorage = multer.memoryStorage();

// Disk storage for other file types
export const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_FOLDER);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

// File filter to accept specific file types
export const fileFilter = (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.test(file.mimetype)) {
        // Use memory storage for images
        return cb(null, true);
    } else if (ALLOWED_OTHER_TYPES.test(file.mimetype)) {
        // Use disk storage for other file types
        return cb(null, true);
    }
    cb(new Error('File type not allowed'));
};

// Create multer instance for images
export const uploadImages = multer({
    storage: memoryStorage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter
});

// Create multer instance for other files
export const uploadFiles = multer({
    storage: diskStorage,
    limits: { fileSize: FILE_SIZE_LIMIT }, 
    fileFilter
});

export default { 
    uploadImages, 
    uploadFiles,
};
