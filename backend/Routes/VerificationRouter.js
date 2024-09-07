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
router.post('/verification-code', sendOtpValidation, sendOtp);
router.post('/verify-code', verifyOtpValidation, verifyOtp);
router.post('/reset-password', resetPasswordValidation, resetPassword);

module.exports = router;



