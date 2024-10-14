import mongoose from 'mongoose';

export const VerificationAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now }
});

export default mongoose.model('VerificationAttempt', VerificationAttemptSchema);

