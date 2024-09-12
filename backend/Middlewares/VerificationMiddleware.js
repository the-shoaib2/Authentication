const Joi = require('joi');

const OTP_LENGTH = parseInt(process.env.OTP_LENGTH) || 6;

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
        otp: Joi.string().length(OTP_LENGTH).required(),
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
