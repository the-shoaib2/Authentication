// backend/Controllers/UserController.js

const UserModel = require('../../Authentication/Models/User'); 
const asyncHandler = require('../../Authentication/utils/asyncHandler');
const ApiResponse = require('../../Authentication/utils/ApiResponse');
const ApiError = require('../../Authentication/utils/ApiError');

// Add these lines at the top of the file
const USER_NOT_FOUND_MESSAGE = process.env.USER_NOT_FOUND_MESSAGE || 'User not found';
const USER_PROFILE_SUCCESS_MESSAGE = process.env.USER_PROFILE_SUCCESS_MESSAGE || 'User profile retrieved successfully';
const ACCOUNT_STATUS_SUCCESS_MESSAGE = process.env.ACCOUNT_STATUS_SUCCESS_MESSAGE || 'Account status retrieved successfully';

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if (!user) throw ApiError.notFound(USER_NOT_FOUND_MESSAGE);
    return res.status(200).json(new ApiResponse(200, user, USER_PROFILE_SUCCESS_MESSAGE));
});

const checkAccountStatus = asyncHandler(async (req, res) => {
    const user = req.user; // Assuming you have middleware that attaches the user to the request
    const status = user.isActive ? 'Active' : 'Inactive';
    return res.status(200).json(new ApiResponse(200, { status }, ACCOUNT_STATUS_SUCCESS_MESSAGE));
});

// Export the function 
module.exports = {
    getUserProfile,
    checkAccountStatus
};
