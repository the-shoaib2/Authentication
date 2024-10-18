import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// User constants
export const MIN_NAME_LENGTH = 2; 
export const MAX_NAME_LENGTH = 50; 
export const MIN_PASSWORD_LENGTH = 8; 
export const MAX_PASSWORD_LENGTH = 100; 
export const MIN_DOB_YEAR = 1900; 

// Image processing constants
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MIN_PROCESS_IMAGE_SIZE = 1 * 1024; // 1KB
export const SKIP_PROCESS_IMAGE_SIZE = 150 * 1024; // 150KB
export const IMAGE_MAX_DIMENSION = 800; // Maximum dimension for resizing
export const JPEG_QUALITY = 90; // JPEG quality setting

// Multer upload constants
export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
export const UPLOAD_FOLDER = "../public/images"; // Folder path for uploads
export const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|gif/; // Allowed image types
export const ALLOWED_OTHER_TYPES = /mp3|mp4|pdf|doc|docx/; // Allowed other file types

// Verification constants
export const VERIFICATION_CODE_LENGTH = 6; 
export const VERIFICATION_CODE_EXPIRY = "10m"; 
export const MAX_VERIFICATION_ATTEMPTS = 5; 
export const VERIFICATION_COOLDOWN_PERIOD = "15m"; 
export const ACCOUNT_LOCK_DURATION = "72h"; 
export const ACCOUNT_EXPIRY_DAYS = 15;

// Password Hashing
export const BCRYPT_SALT_ROUNDS = 10; 

// Email Configuration
export const SERVICES_EMAIL = "services@gmail.com"; 
export const SERVICES_NAME = "ZenZ"; 

// Cloudinary constants
export const BASE_FOLDER = "CHATAPP"; 
export const PUBLIC_DIR = path.join(__dirname, './public/images'); 
export const TEMP_FILE_NAME_FORMAT = `temp_${Date.now()}.jpg`; 

