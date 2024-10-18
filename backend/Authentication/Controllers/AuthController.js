import bcrypt from 'bcrypt';
import UserModel from "../Models/UserModel.js";
import DeletedUserModel from "../Models/DeletedUser.js";
import { generateTokens, refreshAccessToken, setAuthCookies } from './TokenController.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { sendWelcomeEmail } from '../Verification/Helpers/EmailEventHandler/WelcomeEmailHelpers.js';
import { handleEmailEvent } from '../Verification/Helpers/EmailEventHandler/EmailEventHandler.js';
import { ACCOUNT_EXPIRY_DAYS, BCRYPT_SALT_ROUNDS } from '../../Constants.js';

/**
 * @description Handles user signup
 * @param {Object} req - The request object containing user details
 * @param {Object} res - The response object to send the response
 * @returns {Promise<void>}
 */
export const signup = asyncHandler(async (req, res) => {
    const startTime = Date.now();
    try {
        const { firstName, lastName, email, password, phone, dob, gender } = req.body;

        // Check if user with the provided email already exists
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            throw ApiError.badRequest('User with this email already exists, you can login');
        }

        // Check if user with the provided phone number already exists
        if (phone) {
            const existingUserByPhone = await UserModel.findOne({ phone });
            if (existingUserByPhone) {
                throw ApiError.badRequest('User with this phone number already exists, you can login');
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        // Create new user
        const newUser = new UserModel({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            password: hashedPassword,
            dob,
            gender,
            accountExpiryDate: new Date(Date.now() + ACCOUNT_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
        });

        await newUser.save();

        // Send welcome email asynchronously
        sendWelcomeEmail(email).catch(err => console.error('Failed to send welcome email:', err));

        // Generate tokens
        const tokens = await generateTokens(newUser);
        const { accessToken, refreshToken } = tokens;

        // Set cookies using the helper function
        setAuthCookies(res, accessToken, refreshToken);

        console.log(`Signup process took ${Date.now() - startTime}ms`);

        res
            .status(201)
            .json({
                message: "Signup successful! Please verify your email.",
                success: true,
                name: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email,
                accountExpiryDate: newUser.accountExpiryDate,
                isActive: newUser.isActive,
                isEmailVerified: newUser.isEmailVerified,
                is2FAEnabled: newUser.is2FAEnabled,
            });
    } catch (err) {
        throw new ApiError(500, err.message || "Internal server error");
    }
});

/**
 * @description Handles user login
 * @param {Object} req - The request object containing login credentials
 * @param {Object} res - The response object to send the response
 * @returns {Promise<void>}
 */
export const login = asyncHandler(async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        const trimmedInput = emailOrUsername.trim();

        const user = await UserModel.findOne({
            $or: [{ email: trimmedInput }, { username: trimmedInput }]
        }).select('+password');

        if (!user) {
            throw ApiError.unauthorized('Invalid email or username');
        }

        // Update the last login time
        user.lastLogin = new Date();
        await user.save();

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            throw ApiError.unauthorized('Incorrect password');
        }

        // Generate tokens
        const tokens = await generateTokens(user);
        const { accessToken, refreshToken } = tokens;

        // Save refresh token in the user document
        user.refreshToken = refreshToken;
        await user.save();

        console.log("Token:", tokens);

        // Set cookies using the helper function
        setAuthCookies(res, accessToken, refreshToken);

        // Send login email
        handleEmailEvent('login', user.email).catch(err => console.error('Failed to send login email:', err));

        res
            .status(200)
            .json({
                message: "Login successful!",
                success: true,
                name: `${user.first_name} ${user.last_name}`,
                isActive: user.isActive,
                accountExpiryDate: user.accountExpiryDate,
                isEmailVerified: user.isEmailVerified,
                is2FAEnabled: user.is2FAEnabled,
                
            });
    } catch (err) {
        throw new ApiError(500, err.message || "Internal server error");
    }
});

/**
 * @description Handles user logout
 * @param {Object} req - The request object containing user session data
 * @param {Object} res - The response object to send the response
 * @returns {Promise<void>}
 */
export const logout = asyncHandler(async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            throw ApiError.badRequest('No refresh token provided');
        }

        const user = await UserModel.findOne({ refreshToken });
        if (!user) {
            throw ApiError.unauthorized('Invalid refresh token');
        }

        // Remove the refresh token from the user document
        await UserModel.findByIdAndUpdate(
            user._id,
            { $set: { refreshToken: null } },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
        };

        // Send logout email
        handleEmailEvent('logout', user.email).catch(err => console.error('Failed to send logout email:', err));

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "Logout successfully."));
    } catch (err) {
        throw new ApiError(500, err.message || "Internal server error");
    }
});

/**
 * @description Deletes a user account
 * @param {Object} req - The request object containing user ID
 * @param {Object} res - The response object to send the response
 * @returns {Promise<void>}
 */
export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        const deletedUser = await user.moveToDeletedAccounts();

        // Send delete user email
        handleEmailEvent('deleteUser', user.email).catch(err => console.error('Failed to send delete user email:', err));

        res.status(200).json({
            message: 'User deleted successfully',
            success: true,
            deletedUser: {
                originalUserId: deletedUser.originalUserId,
                user_id: deletedUser.user_id,
                deletionCount: deletedUser.deletionCount
            }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

/**
 * @description Searches for deleted accounts based on a search term
 * @param {Object} req - The request object containing the search term
 * @param {Object} res - The response object to send the response
 * @returns {Promise<void>}
 */
export const searchDeletedAccounts = asyncHandler(async (req, res) => {
    try {
        const { searchTerm } = req.body;

        const deletedUsers = await DeletedUserModel.find({});

        const searchResults = fuzzySearch(searchTerm, deletedUsers, ['first_name', 'last_name', 'email', 'username', 'phone']);

        if (searchResults.length === 0) {
            return res.status(404).json({ message: 'No matching deleted accounts found', success: false });
        }

        const matchedAccounts = searchResults.map(result => ({
            id: result.obj._id,
            name: `${result.obj.first_name} ${result.obj.last_name}`,
            email: result.obj.email,
            username: result.obj.username,
            phone: result.obj.phone
        }));

        res.status(200).json({
            message: 'Matching deleted accounts found',
            success: true,
            accounts: matchedAccounts
        });
    } catch (error) {
        console.error('Error searching deleted accounts:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

/**
 * @description Recovers a deleted user account
 * @param {Object} req - The request object containing the ID of the deleted user
 * @param {Object} res - The response object to send the response
 * @returns {Promise<void>}
 */
export const recoverAccount = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        const deletedUser = await DeletedUserModel.findById(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'No deleted account found with this ID', success: false });
        }

        const recoveredUser = new UserModel({
            first_name: deletedUser.first_name,
            last_name: deletedUser.last_name,
            email: deletedUser.email,
            phone: deletedUser.phone,
            password: deletedUser.password,
            dob: deletedUser.dob,
            gender: deletedUser.gender,
            username: deletedUser.username,
            accountExpiryDate: new Date(Date.now() + ACCOUNT_EXPIRY_DAYS * 24 * 60 * 60 * 1000) // 15 days from now
        });

        await recoveredUser.save();

        await DeletedUserModel.findByIdAndDelete(deletedUser._id);

        const tokens = await generateTokens(recoveredUser);

        // Send recover account email
        handleEmailEvent('recoverAccount', recoveredUser.email).catch(err => console.error('Failed to send recover account email:', err));

        return res.status(200).json(
            new ApiResponse(200, {
                name: `${recoveredUser.first_name} ${recoveredUser.last_name}`,
                email: recoveredUser.email,
                username: recoveredUser.username,
                ...tokens
            }, 'Account recovered successfully')
        );
    } catch (error) {
        console.error('Error recovering account:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

export default {
    signup,
    login,
    logout,
    refreshAccessToken,
    deleteUser,
    searchDeletedAccounts,
    recoverAccount,
};
