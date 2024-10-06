const express = require('express');
const { uploadImages, uploadFiles } = require('../AccountMiddlewares/MulterUploadMiddleware');
const { uploadFile, uploadImage } = require('../AccountControllers/CloudinaryController'); 
const { imageProcessingMiddleware } = require('../AccountMiddlewares/ImageProcessingMiddleware'); 

const router = express.Router();

// Route to upload files (using disk storage)
router.post('/upload/file', uploadFiles.single('file'), uploadFile);

// Route to upload images with processing (using memory storage)
router.post('/upload/image', uploadImages.single('file'), imageProcessingMiddleware, uploadImage); 

// Use CommonJS export
module.exports = router;
