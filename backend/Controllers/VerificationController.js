//VerificationController.js

const User = require("../Models/User");
const bcrypt = require("bcrypt");
const VerificationService = require('../Services/VerificationService');

const findUserForgotPassword = async (req, res) => {
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
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        res.status(200).json({
            message: 'User found',
            success: true,
            user: {
                name: user.name,
                email: user.email,
                username: user.username,
                avatar: user.profilePicture
            }
        });
    } catch (err) {
        console.error('Find User Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Send OTP to user
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // if (!user) {
        //     return res.status(404).json({ message: 'User not found.', success: false });
        // }

        const code = await VerificationService.generateVerificationCode(user._id);
        res.status(200).json({ message: 'Verification code sent successfully', success: true, code });
    } catch (err) {
        console.error('Send Verification code Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Verify OTP provided by user
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        await VerificationService.validateVerificationCode(user._id, otp);
        res.status(200).json({ message: 'Verification code verified successfully', success: true });
    } catch (err) {
        console.error('Verify Verification code Error:', err);
        res.status(400).json({ message: err.message, success: false });
    }
};

// Reset user password
const resetPassword = async (req, res) => {
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
};

module.exports = {
    findUserForgotPassword,
    sendOtp,
    verifyOtp,
    resetPassword,
};



// backend/Controllers/VerificationController.js
const UserModel = require("../Models/User");
const { VerificationToken, VerificationCode } = require('../Models/Verification');


const verifyTokenValidity = (req, res) => {
    const token = req.headers['authorization'];

    try {
        jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        res.status(200).json({ success: true, message: "Token is valid." });
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

const verifyEmail = async (req, res) => {
    const { token, code } = req.body; 

    try {
        

        if (!verificationToken) {
            return res.status(400).json({
                message: "Invalid or expired verification token",
                success: false
            });
        }

        const user = await UserModel.findById(verificationToken.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if the provided code is valid
        const verificationCode = await VerificationCode.findOne({
            userId: user._id,
            code,
            expiresAt: { $gt: new Date() }
        });

        if (!verificationCode) {
            return res.status(400).json({
                message: "Invalid or expired verification code",
                success: false
            });
        }

        // Activate the user's account
        user.isActive = true;
        await user.save();


        // Delete the verification token and code after successful verification
        await VerificationToken.deleteOne({ _id: verificationToken._id });
        await VerificationCode.deleteOne({ _id: verificationCode._id });

        res.status(200).json({
            success: true,
            message: "Email verified successfully. Your account is now active.",
            name: user.name,
            email: user.email,
            ...tokens,
        });

    } catch (err) {
        console.error('Email Verification Error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    verifyTokenValidity,
    verifyEmail,
};
