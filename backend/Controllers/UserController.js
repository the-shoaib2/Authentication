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
        const now = new Date();
        const expiryDate = new Date(user.accountExpiryDate);
        const timeDiff = expiryDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 0) {
            return res.json({ expired: true });
        } else {
            return res.json({ expired: false, remainingDays: daysDiff });
        }
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
