// // AuthController.js

// const bcrypt = require('bcrypt');
// const UserModel = require("../Models/User");
// const { generateTokens, refreshAccessToken, generateVerificationToken } = require('./TokenController');


// const signup = async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         // Check if the user already exists
//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({
//                 message: 'User already exists, you can login',
//                 success: false
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new UserModel({
//             name,
//             email,
//             password: hashedPassword,
//             isActive: false,
//         });

//         // Save the user to get the ID for the token generation
//         await newUser.save();

//         // Create a verification token
//         const verificationToken = await generateVerificationToken(newUser);

//         // Generate access and refresh tokens
//         const tokens = await generateTokens(newUser);

//         // Send verification email
//         // await sendVerificationEmail(newUser.email, verificationToken);

//         // Return response without activating the user yet
//         res.status(201).json({
//             success: true,
//             message: "Signup successful. Please verify your email to activate your account.",
//             name: newUser.name,
//             email: newUser.email,
//             verificationToken,
//             ...tokens,
//         });

//     } catch (err) {
//         console.error('Signup Error:', err);
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// const login = async (req, res) => {
//     try {
//         const { emailOrUsername, password } = req.body;
//         const trimmedInput = emailOrUsername.trim();  // Trim any extra spaces
//         console.log('Login attempt with:', trimmedInput);

//         const user = await UserModel.findOne({
//             $or: [{ email: trimmedInput }, { username: trimmedInput }]
//         });
//         console.log('User found:', user);

//         if (!user) {
//             console.log('User not found');
//             return res.status(403).json({ message: 'Invalid email or username', success: true });
//         }

//         const isPassEqual = await bcrypt.compare(password, user.password);
//         if (!isPassEqual) {
//             console.log('Incorrect password');
//             return res.status(403).json({ message: 'Incorrect password', success: false });
//         }

//         const tokens = await generateTokens(user);

//         res.status(200).json({
//             message: "Login Success",
//             success: true,
//             ...tokens,
//             name: user.name
//         });
//     } catch (err) {
//         console.error('Login Error:', err);
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// const logout = async (req, res) => {
//     try {
//         const { refreshToken } = req.body;

//         if (!refreshToken) {
//             return res.status(400).json({ message: 'No refresh token provided', success: false });
//         }

//         const user = await UserModel.findOne({ refreshToken });
//         if (!user) {
//             return res.status(403).json({ message: 'Invalid refresh token', success: false });
//         }

//         user.refreshToken = null;
//         user.refreshTokenExpiry = null;
//         await user.save();

//         res.status(200).json({ message: 'Logout successful', success: true });
//     } catch (err) {
//         console.error('Logout Error:', err);
//         res.status(500).json({ message: 'Internal server error', success: false });
//     }
// };

// module.exports = {
//     signup,
//     login,
//     logout,
//     refreshAccessToken
// };









// backend/Controllers/AuthController.js
const bcrypt = require('bcrypt');
const UserModel = require("../Models/User");
const { generateTokens, refreshAccessToken, generateVerificationToken } = require('./TokenController');



// const signup = async (req, res) => {
//     try {
//       const { firstName, lastName, email, password, phone, dob, gender } = req.body;
  
//       // Check if user already exists
//       const user = await UserModel.findOne({ email });
//       if (user) {
//         return res.status(409).json({
//           message: 'User already exists, you can login',
//           success: false
//         });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Create new user
//       const newUser = new UserModel({
//         first_name: firstName,
//         last_name: lastName,
//         email,
//         phone,
//         password: hashedPassword,
//         dob,
//         gender
//       });
  
//       await newUser.save();

//       // Create a verification token
//       const verificationToken = await generateVerificationToken(newUser);
  
//       // Generate tokens
//       const tokens = await generateTokens(newUser);
  
//       res.status(201).json({
//         message: "Signup successful",
//         success: true,
//         name: `${newUser.first_name} ${newUser.last_name}`,
//         email: newUser.email,
//         verificationToken,
//         ...tokens,
//       });
//     } catch (err) {
//       console.error('Signup Error:', err);
//       res.status(500).json({
//         message: "Internal server error",
//         success: false
//       });
//     }
//   };


const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, dob, gender } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists, you can login',
                success: false
            });
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
            gender
        });

        await newUser.save();
        console.log('New user saved:', newUser);

        // Create a verification token
        const verificationToken = await generateVerificationToken(newUser);

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

        // Generate a verification token for the user (if required)
        const verificationToken = await generateVerificationToken(user);

        res.status(200).json({
            message: "Login Success",
            success: true,
            ...tokens,
            verificationToken, // Include the verification token in the response
            name: `${user.first_name} ${user.last_name}`
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

module.exports = {
    signup,
    login,
    logout,
    refreshAccessToken
};