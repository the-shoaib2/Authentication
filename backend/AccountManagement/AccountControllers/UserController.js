// backend/Controllers/UserController.js

import User from '../../Authentication/Models/UserModel.js'; 
import asyncHandler from '../../Authentication/utils/asyncHandler.js';
import ApiResponse from '../../Authentication/utils/ApiResponse.js';
import ApiError from '../../Authentication/utils/ApiError.js';

// Add these lines at the top of the file
const USER_NOT_FOUND_MESSAGE = "User not found"; 
const USER_PROFILE_SUCCESS_MESSAGE = "User profile retrieved successfully"; 
const ACCOUNT_STATUS_SUCCESS_MESSAGE = "Account status retrieved successfully";

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) throw ApiError.notFound(USER_NOT_FOUND_MESSAGE);
    return res.status(200).json(new ApiResponse(200, user, USER_PROFILE_SUCCESS_MESSAGE));
});

export const checkAccountStatus = asyncHandler(async (req, res) => {
    const user = req.user; // Assuming you have middleware that attaches the user to the request
    const status = user.isActive ? 'Active' : 'Inactive';
    return res.status(200).json(new ApiResponse(200, { status }, ACCOUNT_STATUS_SUCCESS_MESSAGE));
});

// Export the function 
export default {
    getUserProfile,
    checkAccountStatus
};
