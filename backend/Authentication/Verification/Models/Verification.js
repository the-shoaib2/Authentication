// backend/Models/Verification.js

import mongoose from 'mongoose';

export const BaseVerificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false }
}, { timestamps: true });

// This index ensures that documents will be deleted automatically after the 'expiresAt' date.
BaseVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    ...BaseVerificationSchema.obj 
}, { timestamps: true });

// The VerificationCode schema, if you're using it, would also have similar TTL logic.
export const VerificationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    ...BaseVerificationSchema.obj 
}, { timestamps: true });

VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

VerificationCodeSchema.pre('save', async function (next) {
    if (this.isNew) {
        const allCodes = await mongoose.model('VerificationCode').find({ userId: this.userId }).sort({ createdAt: -1 });
        if (allCodes.length >= 2) {
            const idsToDelete = allCodes.slice(2).map(code => code._id);
            await mongoose.model('VerificationCode').deleteMany({ _id: { $in: idsToDelete } });
        }
    }
    next();
});

export const VerificationAttempt = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now },
    cooldownEnd: { type: Date, default: null }
});

VerificationAttempt.methods.incrementAttempt = function() {
    this.attempts += 1;
    this.lastAttempt = new Date();
    if (this.attempts >= 3) {
        this.cooldownEnd = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes cooldown
    }
    return this.save();
};

VerificationAttempt.methods.resetAttempts = function() {
    this.attempts = 0;
    this.lastAttempt = null;
    this.cooldownEnd = null;
    return this.save();
};
        

export default {
    VerificationCode: mongoose.model('VerificationCode', VerificationCodeSchema),
    VerificationToken: mongoose.model('VerificationToken', VerificationTokenSchema),
    VerificationAttempt
};


