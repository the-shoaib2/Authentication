// backend/Controllers/UserController.js

const UserModel = require('../Models/User'); 
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if (!user) throw ApiError.notFound('User not found');
    return res.status(200).json(new ApiResponse(200, user, 'User profile retrieved successfully'));
});

const checkAccountStatus = asyncHandler(async (req, res) => {
    const user = req.user; // Assuming you have middleware that attaches the user to the request
    const status = user.isActive ? 'Active' : 'Inactive';
    return res.status(200).json(new ApiResponse(200, { status }, 'Account status retrieved successfully'));
});

// Export the function 
module.exports = {
    getUserProfile,
    checkAccountStatus
};
