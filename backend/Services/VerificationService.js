// VerificationService.js
const crypto = require('crypto');
const { VerificationCode } = require('../Models/Verification');
const User = require('../Models/User');
// const { sendVerificationCodeEmail } = require('./EmailService');

const generateVerificationCode = async (userId) => {
    // Generate a 6-digit random verification code
    const code = crypto.randomInt(100000, 999999).toString();
    
    // Set the expiration time to 1 minute from now
    const expiresAt = new Date(Date.now() + 60000);

    // Create and save the verification code in the database
    const verificationCode = new VerificationCode({
        code,
        userId,
        expiresAt
    });

    await verificationCode.save();

    // Fetch the user's email to send the verification code
    const user = await User.findById(userId);

    // Send the verification code via email
    // await sendVerificationCodeEmail(user.email, code);

    return code;
};

const validateVerificationCode = async (userId, code) => {
    const currentDate = new Date();

    // Find the verification code in the database
    const verificationCode = await VerificationCode.findOne({ userId, code });

    if (!verificationCode) throw new Error('Invalid verification code.');
    if (verificationCode.expiresAt < currentDate) throw new Error('Verification code expired.');
    if (verificationCode.verified) throw new Error('Verification code already used.');

    // Mark the verification code as used
    verificationCode.verified = true;
    await verificationCode.save();

    return true;
};

module.exports = {
    generateVerificationCode,
    validateVerificationCode
};
