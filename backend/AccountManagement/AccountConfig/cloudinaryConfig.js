const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define the base folder for uploads
const BASE_FOLDER = "CHATAPP";

// Define the public directory for uploads
const PUBLIC_DIR = path.join(__dirname, '../public/images');

// Define the temporary file name format
const TEMP_FILE_NAME_FORMAT = `temp_${Date.now()}.jpg`;

const uploadOnCloudinary = async (file, folderName, resourceType) => {
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

const deleteFromCloudinary = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    uploadOnCloudinary,
    deleteFromCloudinary 
};