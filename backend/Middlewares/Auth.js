//backend/Middlewares/Auth.js

const ApiError = require('../utils/ApiError');
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const ensureAuthenticated = asyncHandler(async (req, _, next) => {
    try {
        // Extract cookies from the request
        const cookies = req.headers.cookie;
        if (!cookies) {
            throw new ApiError(401, "No cookies found");
        }

        // Split cookies and find the access token
        const token = cookies.split('; ').find(cookie => cookie.startsWith('accessToken='));
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Extract the token value
        const accessToken = token.split('=')[1];

        // Verify the token
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token"); 
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

module.exports = ensureAuthenticated;

