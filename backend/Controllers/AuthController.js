const bcrypt = require('bcrypt');
const UserModel = require("../Models/User");
const DeletedUserModel = require("../Models/DeletedUser");
const { generateTokens, refreshAccessToken, setAuthCookies } = require('./TokenController');
const fuzzySearch = require('../SearchEngine/FuzzySearch');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Add these lines at the top of the file
const ACCOUNT_EXPIRY_DAYS = parseInt(process.env.ACCOUNT_EXPIRY_DAYS);
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);



const signup = asyncHandler(async (req, res) => {
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

        // Generate tokens
        const tokens = await generateTokens(newUser);
        const { accessToken, refreshToken } = tokens;

        // Set cookies using the helper function
        setAuthCookies(res, accessToken, refreshToken);

        res
            .status(201)
            .json({
                message: "Signup successful! Please verify your email.",
                success: true,
                name: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email,
            });
    } catch (err) {
        throw new ApiError(500, err.message || "Internal server error");
    }
});

const login = asyncHandler(async (req, res) => {
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

        res
            .status(200)
            .json({
                message: "Login successful!",
                success: true,
                name: `${user.first_name} ${user.last_name}`,
                isActive: user.isActive,
                accountExpiryDate: user.accountExpiryDate,
            });
    } catch (err) {
        throw new ApiError(500, err.message || "Internal server error");
    }
});

const logout = asyncHandler(async (req, res) => {
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

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "Logout successfully."));
    } catch (err) {
        throw new ApiError(500, err.message || "Internal server error");
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        const deletedUser = await user.moveToDeletedAccounts();

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

const searchDeletedAccounts = asyncHandler(async (req, res) => {
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

const recoverAccount = asyncHandler(async (req, res) => {
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

module.exports = {
    signup,
    login,
    logout,
    refreshAccessToken,
    deleteUser,
    searchDeletedAccounts,
    recoverAccount,
};