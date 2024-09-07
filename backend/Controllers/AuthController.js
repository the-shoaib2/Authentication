const bcrypt = require('bcrypt');
const UserModel = require("../Models/User");
const DeletedUserModel = require("../Models/DeletedUser");
const { generateTokens, refreshAccessToken, generateVerificationToken } = require('./VerificationTokenController');
const fuzzySearch = require('../SearchEngine/FuzzySearch');

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, dob, gender } = req.body;

        // Check if user with the provided email already exists
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            return res.status(409).json({
                message: 'User with this email already exists, you can login',
                success: false
            });
        }

        // Check if user with the provided phone number already exists
        if (phone) {
            const existingUserByPhone = await UserModel.findOne({ phone });
            if (existingUserByPhone) {
                return res.status(409).json({
                    message: 'User with this phone number already exists, you can login',
                    success: false
                });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Generated hashed password:', hashedPassword);

        // Create new user
        const newUser = new UserModel({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            password: hashedPassword,
            dob,
            gender,
            accountExpiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
        });

        await newUser.save();
        console.log('New user saved:', newUser);

        // Create a verification token
        // const verificationToken = await generateVerificationToken(newUser);

        // Generate tokens
        const tokens = await generateTokens(newUser);

        res.status(201).json({
            message: "Signup successful",
            success: true,
            name: `${newUser.first_name} ${newUser.last_name}`,
            email: newUser.email,
            verificationToken,
            ...tokens,
        });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


const login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        const trimmedInput = emailOrUsername.trim();
        console.log('Login attempt with:', trimmedInput);

        const user = await UserModel.findOne({
            $or: [{ email: trimmedInput }, { username: trimmedInput }]
        }).select('+password');  // Explicitly select the password field

        if (!user) {
            console.log('User not found');
            return res.status(403).json({ message: 'Invalid email or username', success: false });
        }

        // Update the last login time
        user.lastLogin = new Date();
        await user.save();

        console.log('User found, password hash:', user.password);

        if (!user.password) {
            console.log('Password hash is undefined');
            return res.status(500).json({ message: 'Password is not set for this user.', success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            console.log('Incorrect password');
            return res.status(403).json({ message: 'Incorrect password', success: false });
        }

        // Generate tokens
        const tokens = await generateTokens(user);

        // // Generate a verification token for the user (if required)
        // const verificationToken = await generateVerificationToken(user);

        res.status(200).json({
            message: "Login Success",
            success: true,
            ...tokens,
            verificationToken, // Include the verification token in the response
            name: `${user.first_name} ${user.last_name}`,
            isActive: user.isActive,
            accountExpiryDate: user.accountExpiryDate
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'No refresh token provided', success: false });
        }

        const user = await UserModel.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Invalid refresh token', success: false });
        }

        user.refreshToken = null;
        user.refreshTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Logout successful', success: true });
    } catch (err) {
        console.error('Logout Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const deleteUser = async (req, res) => {
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
};

const searchDeletedAccounts = async (req, res) => {
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
};

const recoverAccount = async (req, res) => {
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
            accountExpiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
        });

        await recoveredUser.save();

        await DeletedUserModel.findByIdAndDelete(deletedUser._id);

        const tokens = await generateTokens(recoveredUser);

        res.status(200).json({
            message: 'Account recovered successfully',
            success: true,
            name: `${recoveredUser.first_name} ${recoveredUser.last_name}`,
            email: recoveredUser.email,
            username: recoveredUser.username,
            ...tokens
        });
    } catch (error) {
        console.error('Error recovering account:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = {
    signup,
    login,
    logout,
    refreshAccessToken,
    deleteUser,
    searchDeletedAccounts,
    recoverAccount
};