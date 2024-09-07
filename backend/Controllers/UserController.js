// backend/Controllers/UserController.js
const UserModel = require('../Models/User'); 

const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const checkAccountStatus = async (req, res) => {
    try {
        const user = req.user; // Assuming you have middleware that attaches the user to the request
        const status = user.isActive ? 'Active' : 'Inactive';
        res.json({ status });
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
