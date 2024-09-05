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
router.post('/find-user', searchUserValidation, findUserForgotPassword);

// Route to send OTP
router.post('/verification-code', sendOtpValidation, sendOtp);

// Route to verify OTP
router.post('/verify-code', verifyOtpValidation, verifyOtp);

// Route to reset password
router.post('/reset-password', resetPasswordValidation, resetPassword);

module.exports = router;



