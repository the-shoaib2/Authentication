// VerificationRouter.js

import { findUserForgotPassword, sendOtp, verifyOtp, resetPassword } from '../Controllers/VerificationController.js';
import {
    searchUserValidation,
    sendOtpValidation,
    verifyOtpValidation,
    resetPasswordValidation,
} from '../Middlewares/VerificationMiddleware.js';

import { Router } from 'express'; 
const router = Router();

// Route to find user for password reset
router.post(process.env.ROUTER_FIND_USER, searchUserValidation, findUserForgotPassword);
router.post(process.env.ROUTER_VERIFICATION_CODE, sendOtpValidation, sendOtp);
router.post(process.env.ROUTER_VERIFY_CODE, verifyOtpValidation, verifyOtp);
router.post(process.env.ROUTER_RESET_PASSWORD, resetPasswordValidation, resetPassword);

export default router;



