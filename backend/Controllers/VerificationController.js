const User = require("../Models/User");
const bcrypt = require("bcrypt");
const VerificationService = require('../Services/VerificationService');
const  VerificationCode  = require('../Models/Verification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

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
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// Send OTP to user
const sendOtp = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        const isLocked = await VerificationService.checkLockStatus(user._id);
        if (isLocked) {
            return res.status(403).json({ 
                message: 'Account is temporarily locked. Please try again later.', 
                success: false,
                isLocked: true
            });
        }

        const cooldownPeriod = await VerificationService.getCooldownPeriod(user._id);

        if (cooldownPeriod > 0) {
            return res.status(429).json({ 
                message: 'Too many attempts. Please try again later.', 
                success: false, 
                cooldownPeriod 
            });
        }

        const code = await VerificationService.generateVerificationCode(user._id);
        await VerificationService.incrementAttempts(user._id);

        // TODO: Send the code to the user's email

        // Code is now saved in the database by generateVerificationCode function
        // TODO: Implement email sending logic here
        console.log(`Verification code for ${email}: ${code}`);

        res.status(200).json({ message: 'Verification code sent successfully', success: true ,code });
    } catch (err) {
        console.error('Send Verification code Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// Verify OTP provided by user
const verifyOtp = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        await VerificationService.validateVerificationCode(user._id, otp);

        // Reset attempts after successful verification
        await VerificationService.resetAttempts(user._id);

        // Update user's isActive status
        user.isActive = true;
        await user.save();
         
        res.status(200).json({ 
            message: 'Your account is now activated successfuly.', 
            success: true,
            isActive: true
        });
    } catch (err) {
        console.error('Verify Verification code Error:', err);
        res.status(400).json({ message: err.message, success: false });
    }
});

// Reset user password
const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully', success: true });
    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

const verifyEmail = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.isActive) return res.sendStatus(400); // Already active or user not found

        // Here, implement the logic to verify the user's email (e.g., checking a token or code)
        user.isActive = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {
    findUserForgotPassword,
    sendOtp,
    verifyOtp,
    resetPassword,
    verifyEmail
};


