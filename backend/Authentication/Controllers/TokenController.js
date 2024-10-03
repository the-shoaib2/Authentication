//backend/Controllers/TokenController.js

const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

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

// Function to refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    console.log("Incoming Refresh Token:", incomingRefreshToken);

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request.");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await UserModel.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token.");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used.");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user); // Updated to use generateTokens

        // Set cookies using the helper function
        setAuthCookies(res, accessToken, newRefreshToken);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed."
                )
            );
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token.");
    }
});

// Helper function to set authentication cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
    };

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    refreshAccessToken,
    setAuthCookies,
};