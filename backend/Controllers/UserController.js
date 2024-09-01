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

// Export the function 
module.exports = {
    getUserProfile
};
