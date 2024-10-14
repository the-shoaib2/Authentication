// backend/Routes/AuthRouter.js

import { signup, login, logout, deleteUser } from "../Controllers/AuthController.js";
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js";
import { refreshAccessToken } from "../Controllers/TokenController.js";
import ensureAuthenticated from '../Middlewares/Auth.js';
import rateLimit from 'express-rate-limit';
import { Router } from "express"; // Correctly import Router
const router = Router(); // Create a new router instance

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Protected routes
router.post(process.env.ROUTER_LOGIN, limiter, loginValidation, login);
router.post(process.env.ROUTER_SIGNUP, limiter, signupValidation, signup);
router.post(process.env.ROUTER_LOGOUT, limiter, ensureAuthenticated, logout);
router.delete(process.env.ROUTER_DELETE_USER, limiter, ensureAuthenticated, deleteUser);

// Add verification and refresh token routes
router.post(process.env.ROUTER_VERIFY_TOKEN, limiter, ensureAuthenticated); 
router.post(process.env.ROUTER_REFRESH_TOKEN, limiter, refreshAccessToken);

export default router; // Default export
