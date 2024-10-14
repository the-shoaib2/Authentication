import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
 // Import the constants
import { 
    BASE_FOLDER, 
    PUBLIC_DIR, 
    TEMP_FILE_NAME_FORMAT 
} from '../../Constants.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



export const uploadOnCloudinary = async (file, folderName, resourceType) => {
    let filePath;

    try {
        if (Buffer.isBuffer(file)) {
            // Ensure the temporary directory exists
            if (!fs.existsSync(PUBLIC_DIR)) {
                fs.mkdirSync(PUBLIC_DIR);
            }

            // Create a temporary file path using the defined format
            filePath = path.join(PUBLIC_DIR, TEMP_FILE_NAME_FORMAT);

            fs.writeFileSync(filePath, file);
        } else {
            filePath = file;
        }

        // Upload the file to Cloudinary in the specified folder
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            folder: `${BASE_FOLDER}/${folderName}`
        });

        // Clean up the temporary file if it was created
        if (Buffer.isBuffer(file)) {
            fs.unlinkSync(filePath);
        }

        return response;

    } catch (error) {
        // Clean up the temporary file if it exists
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
}

export const deleteFromCloudinary = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        throw error;
    }
};

export default {
    uploadOnCloudinary,
    deleteFromCloudinary 
};
