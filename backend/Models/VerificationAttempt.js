const mongoose = require('mongoose');

const VerificationAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VerificationAttempt', VerificationAttemptSchema);

