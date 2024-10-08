const express = require('express');
const { uploadImages, uploadFiles } = require('../AccountMiddlewares/MulterUploadMiddleware');
const { uploadFile, uploadImage ,deleteImage} = require('../AccountControllers/CloudinaryController'); 
const { editAndUploadImage } = require('../AccountControllers/AccountController'); 
const { imageProcessingMiddleware } = require('../AccountMiddlewares/ImageProcessingMiddleware'); 
const ensureAuthenticated = require('../../Authentication/Middlewares/Auth'); 

const router = express.Router();

// Route to upload files (using disk storage)
router.post('/upload/file', ensureAuthenticated, uploadFiles.single('file'), uploadFile);
// Route to upload images with processing (using memory storage)
router.post('/upload/image', ensureAuthenticated, uploadImages.single('file'), imageProcessingMiddleware, uploadImage);
// Route to edit and upload images
router.post('/upload/edit-image', ensureAuthenticated, uploadImages.single('file'), editAndUploadImage);
// Route to delete Images
router.delete('/delete/Image', ensureAuthenticated, deleteImage);





// Use CommonJS export
module.exports = router;
