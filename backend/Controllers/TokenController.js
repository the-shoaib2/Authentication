
//backend/Controllers/TokenController.js
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const { VerificationToken } = require('../Models/Verification');

// Function to generate a verification token using JWT
const generateVerificationToken = async (user) => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.VERIFICATION_TOKEN_EXPIRES }
    );

    // Calculate the expiration time based on the environment variable
    const expiresInMilliseconds = parseDuration(process.env.VERIFICATION_TOKEN_EXPIRES);

    // Create a new verification token entry in the database
    const newToken = new VerificationToken({
        userId: user._id,
        token,
        expiresAt: new Date(Date.now() + expiresInMilliseconds), // Dynamic expiration
    });

    // Save the verification token to the database
    await newToken.save();

    return token;
};

const generateAccessToken = (user) => {
    return jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );
};

const generateTokens = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token and its expiry date to the database
    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = new Date(Date.now() + parseDuration(process.env.JWT_REFRESH_EXPIRES));
    await user.save();

    return { accessToken, refreshToken };
};

// Helper function to parse JWT expiration string to milliseconds
const parseDuration = (duration) => {
    const match = /^(\d+)([smhdw])$/.exec(duration);
    if (!match) throw new Error('Invalid duration format');

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'w': return value * 7 * 24 * 60 * 60 * 1000;
        default: throw new Error('Unknown time unit');
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'No refresh token provided', success: false });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await UserModel.findOne({ _id: decoded._id, refreshToken });

        if (!user || user.refreshTokenExpiry < Date.now()) {
            return res.status(403).json({ message: 'Invalid or expired refresh token', success: false });
        }

        const tokens = await generateTokens(user);

        res.status(200).json({
            message: 'Token refreshed successfully',
            success: true,
            ...tokens
        });
    } catch (err) {
        console.error('Refresh Token Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = {
    generateVerificationToken,
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    refreshAccessToken
};