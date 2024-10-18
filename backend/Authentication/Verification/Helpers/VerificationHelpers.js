import VerificationAttempt from '../Models/VerificationAttempt.js';
import VerificationCode from '../Models/Verification.js'; 
import User from '../../Models/UserModel.js';
import ApiError from '../../../utils/ApiError.js';

const MAX_ATTEMPTS = parseInt(process.env.MAX_VERIFICATION_ATTEMPTS) || 5;
const COOLDOWN_DURATION = parseInt(process.env.VERIFICATION_COOLDOWN_PERIOD) * 60 * 1000 || 15 * 60 * 1000; 
const LOCK_DURATION = parseInt(process.env.ACCOUNT_LOCK_DURATION) * 60 * 60 * 1000 || 72 * 60 * 60 * 1000; 

export const getVerificationAttempts = async (userId) => {
    let attempt = await VerificationAttempt.findOne({ userId });
    if (!attempt) {
        attempt = new VerificationAttempt({ userId });
        await attempt.save();
    }
    return attempt;
};

export const incrementAttempts = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    await attempt.incrementAttempt();
    
    if (attempt.attempts >= 9) {
        await lockAccount(userId);
    } else if (attempt.attempts >= MAX_ATTEMPTS) {
        await setCooldown(userId);
    }
};

export const setCooldown = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    attempt.cooldownEnd = new Date(Date.now() + COOLDOWN_DURATION);
    await attempt.save();
};

export const lockAccount = async (userId) => {
    const user = await User.findById(userId);
    user.isLocked = true;
    user.lockExpiresAt = new Date(Date.now() + LOCK_DURATION);
    await user.save();
};

export const checkLockStatus = async (userId) => {
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

export const resetAttempts = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    await attempt.resetAttempts();
};

export const getCooldownPeriod = async (userId) => {
    const attempt = await getVerificationAttempts(userId);
    if (attempt.cooldownEnd && attempt.cooldownEnd > new Date()) {
        return Math.ceil((attempt.cooldownEnd - new Date()) / 1000);
    }
    return 0;
};

export const generateVerificationCode = async (userId) => {
    const codeLength = parseInt(process.env.VERIFICATION_CODE_LENGTH) || 6;
    const code = Math.floor(10 ** (codeLength - 1) + Math.random() * 9 * 10 ** (codeLength - 1)).toString();
    const expiresAt = new Date(Date.now() + parseInt(process.env.VERIFICATION_CODE_EXPIRY) * 60 * 1000 || 10 * 60 * 1000); // Default to 10 minutes

    const newVerificationCode = new VerificationCode({
        userId,
        code,
        expiresAt
    });

    await newVerificationCode.save();
    return code;
};

export const validateVerificationCode = async (userId, code) => {
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

export default {
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
