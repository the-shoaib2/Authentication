// VerificationRouter.js

const { findUserForgotPassword, sendOtp, verifyOtp, resetPassword } = require('../Controllers/VerificationController');
const {
    searchUserValidation,
    sendOtpValidation,
    verifyOtpValidation,
    resetPasswordValidation,
} = require('../Middlewares/VerificationValidation');

const router = require('express').Router();

// Route to find user for password reset
router.post('/forgot-password/find-user', searchUserValidation, findUserForgotPassword);

// Route to send OTP
router.post('/forgot-password/send-otp', sendOtpValidation, sendOtp);

// Route to verify OTP
router.post('/forgot-password/verify-otp', verifyOtpValidation, verifyOtp);

// Route to reset password
router.post('/forgot-password/reset-password', resetPasswordValidation, resetPassword);

module.exports = router;





// // backend/Routes/VerificationRouter.js
// const { verifyEmail } = require("../Controllers/VerificationController");
// // const { verificationValidation } = require('../Middlewares/VerificationMiddleware');

// const router = require('express').Router();


// module.exports = router;
