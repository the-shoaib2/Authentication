const multer = require("multer");
const path = require("path");

// Define a dynamic file size limit
const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

// Define the folder path dynamically
const UPLOAD_FOLDER = path.join(__dirname, "../public");

// Define allowed file types dynamically
const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|gif/;
const ALLOWED_OTHER_TYPES = /mp3|mp4|pdf|doc|docx/;

// Memory storage for images
const memoryStorage = multer.memoryStorage();

// Disk storage for other file types
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_FOLDER);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

// File filter to accept specific file types
const fileFilter = (req, file, cb) => {
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
const uploadImages = multer({
    storage: memoryStorage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter
});

// Create multer instance for other files
const uploadFiles = multer({
    storage: diskStorage,
    limits: { fileSize: FILE_SIZE_LIMIT }, 
    fileFilter
});

module.exports = { 
    uploadImages, 
    uploadFiles,
};
