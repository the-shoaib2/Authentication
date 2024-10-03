const User = require("../../Models/User");
const bcrypt = require("bcrypt");
const VerificationService = require('../Helpers/VerificationHelpers');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const { sendVerificationEmail } = require('../Helpers/EmailEventHandler/VerificationCodeEmailHelpers');
const { sendConfirmedAccountEmail } = require('../Helpers/EmailEventHandler/WelcomeEmailHelpers'); // Import the function

// Add these lines at the top of the file
const VERIFICATION_CODE_LENGTH = parseInt(process.env.VERIFICATION_CODE_LENGTH);
const VERIFICATION_CODE_EXPIRY = process.env.VERIFICATION_CODE_EXPIRY;
const MAX_VERIFICATION_ATTEMPTS = parseInt(process.env.MAX_VERIFICATION_ATTEMPTS);
const VERIFICATION_COOLDOWN_PERIOD = process.env.VERIFICATION_COOLDOWN_PERIOD;
const ACCOUNT_LOCK_DURATION = process.env.ACCOUNT_LOCK_DURATION;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

// Wrap each controller function with asyncHandler
const findUserForgotPassword = asyncHandler(async (req, res) => {
    try {
        const { emailOrUsername } = req.body;

        // Search by email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Concatenate first and last name
        const fullName = `${user.first_name} ${user.last_name}`;

        return res.status(200).json(
            new ApiResponse(200, {
                user: {
                    name: fullName,
                    email: user.email,
                    username: user.username,
                    avatar: user.profilePicture
                }
            }, 'User found')
        );
    } catch (err) {
        console.error('Find User Error:', err);
        res.status(500).json(ApiError.internalError());
    }
});

// Send OTP to user
const sendOtp = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(ApiError.notFound('User not found.'));
        }

        const isLocked = await VerificationService.checkLockStatus(user._id);
        if (isLocked) {
            return res.status(403).json(ApiError.forbidden('Account is temporarily locked. Please try again later.'));
        }

        const cooldownPeriod = await VerificationService.getCooldownPeriod(user._id);

        if (cooldownPeriod > 0) {
            return res.status(429).json(ApiError.tooManyRequests('Too many attempts. Please try again later.'));
        }

        const code = await VerificationService.generateVerificationCode(user._id, VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_EXPIRY);
        await VerificationService.incrementAttempts(user._id);

        // Send the code to the user's email
        await sendVerificationEmail(email, code); // Call the email sending function

        console.log(`Verification code for ${email}: ${code}`);
        res.status(200).json(new ApiResponse(200, { code }, 'Verification code sent successfully'));
    } catch (err) {
        res.status(500).json(ApiError.internalError());
    }
});

// Verify OTP provided by user
const verifyOtp = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(ApiError.notFound('User not found.'));
        }

        // In the verifyOtp function, you might want to pass MAX_VERIFICATION_ATTEMPTS to the VerificationService:
        await VerificationService.validateVerificationCode(user._id, otp, MAX_VERIFICATION_ATTEMPTS);

        // Reset attempts after successful verification
        await VerificationService.resetAttempts(user._id);

        // Update user's isActive status
        user.isActive = true;
        await user.save();

        // Send confirmation email
        await sendConfirmedAccountEmail(email); // Call the function here
         
        res.status(200).json(new ApiResponse(200, { isActive: true }, 'Your account is now activated successfully.'));
    } catch (err) {
        console.error('Verify Verification code Error:', err);
        res.status(400).json(ApiError.badRequest(err.message));
    }
});

// Reset user password
const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(ApiError.notFound('User not found.'));
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json(new ApiResponse(200, null, 'Password reset successfully'));
    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json(ApiError.internalError());
    }
});

// Verify user's email
const verifyEmail = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.isActive) return res.status(400).json(ApiError.badRequest('User not found or already active.'));

        // Update user's isActive status
        user.isActive = true;
        await user.save();

        // Send confirmation email
        await sendConfirmedAccountEmail(user.email); 

        res.status(200).json(new ApiResponse(200, null, 'Email verified successfully'));
    } catch (err) {
        res.status(500).json(ApiError.internalError());
    }
});


module.exports = {
    findUserForgotPassword,
    sendOtp,
    verifyOtp,
    resetPassword,
    verifyEmail
};