//backend/Middlewares/Auth.js

import ApiError from '../../utils/ApiError.js';
import asyncHandler from '../../utils/asyncHandler.js';
import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";

/**
 * @description Middleware to ensure the user is authenticated
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 * @throws {ApiError} If the user is not authenticated
 */
export const ensureAuthenticated = asyncHandler(async (req, _, next) => {
    try {
        // Extract cookies from the request
        const cookies = req.headers.cookie;
        if (!cookies) {
            throw new ApiError(401, "No cookies found");
        }

        // Split cookies and find the access token
        const token = cookies.split('; ').find(cookie => cookie.startsWith('accessToken='));
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Extract the token value
        const accessToken = token.split('=')[1];

        // Verify the token
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token"); 
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
        
export default ensureAuthenticated;

