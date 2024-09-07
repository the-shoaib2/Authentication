const { VerificationAttempt, VerificationCode } = require('../Models/Verification');
const User = require('../Models/User');
const ApiError = require('../utils/ApiError');

const getVerificationAttempts = async (userId) => {
    let attempt = await VerificationAttempt.findOne({ userId });
    if (!attempt) {
        attempt = new VerificationAttempt({ userId });
        await attempt.save();
    }
    return attempt;
};

const MAX_ATTEMPTS = 3;
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes
const LOCK_DURATION = 72 * 60 * 60 * 1000; // 72 hours

const incrementAttempts = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    await attempt.incrementAttempt();
    
    if (attempt.attempts >= 9) {
        await lockAccount(userId);
    } else if (attempt.attempts >= MAX_ATTEMPTS) {
        await setCooldown(userId);
    }
};

const setCooldown = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    attempt.cooldownEnd = new Date(Date.now() + COOLDOWN_DURATION);
    await attempt.save();
};

const lockAccount = async (userId) => {
    const user = await User.findById(userId);
    user.isLocked = true;
    user.lockExpiresAt = new Date(Date.now() + LOCK_DURATION);
    await user.save();
};

const checkLockStatus = async (userId) => {
    const user = await User.findById(userId);
    if (user.isLocked && user.lockExpiresAt > new Date()) {
        return true;
    } else if (user.isLocked) {
        user.isLocked = false;
        user.lockExpiresAt = null;
        await user.save();
    }
    return false;
};

const resetAttempts = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    await attempt.resetAttempts();
};

const getCooldownPeriod = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    if (attempt.cooldownEnd && attempt.cooldownEnd > new Date()) {
        return Math.ceil((attempt.cooldownEnd - new Date()) / 1000);
    }
    return 0;
};

const generateVerificationCode = async (userId) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() +  60 * 1000); 

    const newVerificationCode = new VerificationCode({
        userId,
        code,
        expiresAt
    });

    await newVerificationCode.save();
    return code;
};

const validateVerificationCode = async (userId, code) => {
    const verificationCode = await VerificationCode.findOne({ 
        userId, 
        code, 
        expiresAt: { $gt: new Date() } 
    });

    if (!verificationCode) {
        throw ApiError.badRequest('Invalid or expired verification code');
    }

    verificationCode.verified = true;
    await verificationCode.save();
};

module.exports = {
    getVerificationAttempts,
    incrementAttempts,
    resetAttempts,
    getCooldownPeriod,
    generateVerificationCode,
    setCooldown,
    lockAccount,
    checkLockStatus,
    validateVerificationCode
};
