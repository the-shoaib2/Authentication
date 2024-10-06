const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSettingsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    privacy: {
        profileVisibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'friends',
        },
        messageRequests: {
            type: Boolean,
            default: true,
        },
        twoFactorAuthentication: {
            type: Boolean,
            default: false,
        },
    },
    appearance: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },
        fontSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium',
        },
    },
    notifications: {
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        pushNotifications: {
            type: Boolean,
            default: true,
        },
        smsNotifications: {
            type: Boolean,
            default: false,
        },
        mute: {
            isMuted: {
                type: Boolean,
                default: false,
            },
            muteUntil: {
                type: Date,
                default: null, 
            },
        },
    },
    language: {
        type: String,
        default: 'en', 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
AccountSettingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const AccountSettingsModel = mongoose.model("AccountSettings", AccountSettingsSchema);

module.exports = AccountSettingsModel;
