
// backend/Middlewares/VerificationMiddleware.js
const Joi = require('joi');

// Validation schema for searching user
const searchUserValidation = (req, res, next) => {
    const schema = Joi.object({
        emailOrUsername: Joi.string().min(3).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad request", error });
    }

    next();
};

// Middleware to validate OTP request
const sendOtpValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

// Middleware to validate OTP verification
const verifyOtpValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

// Middleware to validate password reset
const resetPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        newPassword: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

module.exports = {
    searchUserValidation,
    sendOtpValidation,
    verifyOtpValidation,
    resetPasswordValidation,
};




// // backend/Middlewares/VerificationMiddleware.js

// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];

//     if (!authHeader) {
//         return res.status(403).json({ message: 'No token provided', success: false });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.error('Token Middleware Error:', err);
//         return res.status(401).json({ message: 'Unauthorized', success: false });
//     }
// };


// module.exports = {
//     verifyToken,
// };

