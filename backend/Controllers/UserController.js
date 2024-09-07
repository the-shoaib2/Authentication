// backend/Controllers/UserController.js

const UserModel = require('../Models/User'); 
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(new ApiResponse(200, user, 'User profile retrieved successfully'));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const checkAccountStatus = async (req, res) => {
    try {
        const user = req.user; // Assuming you have middleware that attaches the user to the request
        const status = user.isActive ? 'Active' : 'Inactive';
        return res.status(200).json(new ApiResponse(200, { status }, 'Account status retrieved successfully'));
    } catch (error) {
        console.error('Error checking account status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the function 
module.exports = {
    getUserProfile,
    checkAccountStatus
};
