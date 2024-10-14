import express from 'express';
import { uploadImages, uploadFiles } from '../AccountMiddlewares/MulterUploadMiddleware.js';
import { uploadFile, uploadImage, deleteImage } from '../AccountControllers/CloudinaryController.js'; 
import { editAndUploadImage } from '../AccountControllers/AccountController.js'; 
import { imageProcessingMiddleware } from '../AccountMiddlewares/ImageProcessingMiddleware.js'; 
import ensureAuthenticated from '../../Authentication/Middlewares/Auth.js'; 

export const AccountRouter = express.Router();

// Route to upload files (using disk storage)
AccountRouter.post('/upload/file', ensureAuthenticated, uploadFiles.single('file'), uploadFile);
// Route to upload images with processing (using memory storage)
AccountRouter.post('/upload/image', ensureAuthenticated, uploadImages.single('file'), imageProcessingMiddleware, uploadImage);
// Route to edit and upload images
AccountRouter.post('/upload/edit-image', ensureAuthenticated, uploadImages.single('file'), editAndUploadImage);
// Route to delete Images
AccountRouter.delete('/delete/Image', ensureAuthenticated, deleteImage);





// Use CommonJS export
export default AccountRouter;
