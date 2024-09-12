// backend/Routes/UsersRouter.js
// Loged in User 
const ensureAuthenticated = require('../Middlewares/Auth');
const UserModel = require('../Models/User');
const router = require('express').Router();

// Make sure process.env.ROUTER_GET_ME is defined and is a string
const GET_ME_ROUTE = process.env.ROUTER_GET_ME;

router.get(GET_ME_ROUTE, ensureAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id, { password: 0 }); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;


