import Joi from "joi";

import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, MIN_DOB_YEAR } from "../../Constants.js";

export const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(MIN_NAME_LENGTH)
            .max(MAX_NAME_LENGTH)
            .required()
            .messages({
                'string.base': 'First Name must be a string',
                'string.empty': 'First Name cannot be empty',
                'string.min': `First Name should have a minimum length of ${MIN_NAME_LENGTH}`,
                'string.max': `First Name should have a maximum length of ${MAX_NAME_LENGTH}`,
                'any.required': 'First Name is required'
            }),
        lastName: Joi.string()
            .min(MIN_NAME_LENGTH)
            .max(MAX_NAME_LENGTH)
            .required()
            .messages({
                'string.base': 'Last Name must be a string',
                'string.empty': 'Last Name cannot be empty',
                'string.min': `Last Name should have a minimum length of ${MIN_NAME_LENGTH}`,
                'string.max': `Last Name should have a maximum length of ${MAX_NAME_LENGTH}`,
                'any.required': 'Last Name is required'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.base': 'Email must be a string',
                'string.empty': 'Email cannot be empty',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
        phone: Joi.string()
            .pattern(/^[0-9]+$/)
            .optional()
            .messages({
                'string.base': 'Phone Number must be a string',
                'string.pattern.base': 'Phone Number must contain only digits'
            }),
        dob: Joi.object({
            day: Joi.number().integer().min(1).max(31).required(),
            month: Joi.number().integer().min(1).max(12).required(),
            year: Joi.number().integer().min(MIN_DOB_YEAR).max(new Date().getFullYear()).required()
        }).required(),
        gender: Joi.string()
            .valid('male', 'female', 'other')
            .required(),
        password: Joi.string()
            .min(MIN_PASSWORD_LENGTH)
            .max(MAX_PASSWORD_LENGTH)
            .required()
            .messages({
                'string.base': 'Password must be a string',
                'string.empty': 'Password cannot be empty',
                'string.min': `Password should have a minimum length of ${MIN_PASSWORD_LENGTH}`,
                'string.max': `Password should have a maximum length of ${MAX_PASSWORD_LENGTH}`,
                'any.required': 'Password is required'
            }),
        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords must match',
                'any.required': 'Confirm Password is required'
            }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(err => ({
            field: err.context.label,
            message: err.message
        }));
        return res.status(400).json({ message: "Validation errors", errors });
    }

    next();
};

export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        emailOrUsername: Joi.string()
            .required()
            .messages({
                'string.base': 'Email or username must be a string',
                'string.empty': 'Email or username cannot be empty',
                'any.required': 'Email or username is required'
            }),
        password: Joi.string()
            .min(MIN_PASSWORD_LENGTH)
            .max(MAX_PASSWORD_LENGTH)
            .required()
            .messages({
                'string.base': 'Password must be a string',
                'string.empty': 'Password cannot be empty',
                'string.min': `Password should have a minimum length of ${MIN_PASSWORD_LENGTH}`,
                'string.max': `Password should have a maximum length of ${MAX_PASSWORD_LENGTH}`,
                'any.required': 'Password is required'
            }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(err => ({
            field: err.context.label,
            message: err.message
        }));
        return res.status(400).json({ message: "Validation errors", errors });
    }

    next();
};

export default {
    signupValidation,
    loginValidation,
};
