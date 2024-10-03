// VerificationRouter.js

const { findUserForgotPassword, sendOtp, verifyOtp, resetPassword } = require('../Controllers/VerificationController');
const {
    searchUserValidation,
    sendOtpValidation,
    verifyOtpValidation,
    resetPasswordValidation,
} = require('../Middlewares/VerificationMiddleware');

const router = require('express').Router();

// Route to find user for password reset
router.post(process.env.ROUTER_FIND_USER, searchUserValidation, findUserForgotPassword);
router.post(process.env.ROUTER_VERIFICATION_CODE, sendOtpValidation, sendOtp);
router.post(process.env.ROUTER_VERIFY_CODE, verifyOtpValidation, verifyOtp);
router.post(process.env.ROUTER_RESET_PASSWORD, resetPasswordValidation, resetPassword);

module.exports = router;



