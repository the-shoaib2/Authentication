// backend/Routes/UsersRouter.js
// Loged in User 
import ensureAuthenticated from '../Middlewares/Auth.js';
import UserModel from '../Models/UserModel.js';
import { Router } from 'express'; 
const router = Router();

const GET_ME_ROUTE = process.env.ROUTER_GET_ME;

router.get(GET_ME_ROUTE, ensureAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id, { password: 0 }); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}); 

export default router;



