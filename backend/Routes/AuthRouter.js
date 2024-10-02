// backend/Routes/AuthRouter.js

const { signup, login, logout, deleteUser } = require("../Controllers/AuthController");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const { refreshAccessToken } = require("../Controllers/TokenController");
const ensureAuthenticated = require('../Middlewares/Auth');
const rateLimit = require('express-rate-limit');
const router = require("express").Router();

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

module.exports = router;

