//backend/Controllers/TokenController.js

import jwt from 'jsonwebtoken';
import UserModel from "../Models/UserModel.js";
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';

/**
 * @description Generates an access token for a user
 * @param {Object} user - The user object containing user details
 * @returns {string} The generated access token
 */
export const generateAccessToken = (user) => {
    return jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );
};

/**
 * @description Generates a refresh token for a user
 * @param {Object} user - The user object containing user details
 * @returns {string} The generated refresh token
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );
};

/**
 * @description Generates both access and refresh tokens for a user
 * @param {Object} user - The user object containing user details
 * @returns {Promise<Object>} An object containing access and refresh tokens
 */
export const generateTokens = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = new Date(Date.now() + parseDuration(process.env.JWT_REFRESH_EXPIRES));
    await user.save();

    return { accessToken, refreshToken };
};

/**
 * @description Parses a JWT expiration string to milliseconds
 * @param {string} duration - The duration string (e.g., "1h", "30m")
 * @returns {number} The duration in milliseconds
 * @throws {Error} If the duration format is invalid
 */
export const parseDuration = (duration) => {
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

/**
 * @description Refreshes the access token using the refresh token
 * @param {Object} req - The request object containing the refresh token
 * @param {Object} res - The response object to send the response
 * @returns {Promise<void>}
 * @throws {ApiError} If the refresh token is invalid or expired
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

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

        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

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

/**
 * @description Sets authentication cookies in the response
 * @param {Object} res - The response object to set cookies
 * @param {string} accessToken - The access token to set in the cookie
 * @param {string} refreshToken - The refresh token to set in the cookie
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
    };

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
};

export default {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    refreshAccessToken,
    setAuthCookies,
};
