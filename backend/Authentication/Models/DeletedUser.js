import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const DeletedUserSchema = new Schema({
    originalUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    password: String,
    dob: {
        day: Number,
        month: Number,
        year: Number,
    },
    gender: String,
    username: String,
    profile_picture: String,
    isActive: Boolean,
    status: {
        type: String,
        default: 'deleted'
    },
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: {
        type: Date,
        default: Date.now,
    },
    deletionCount: {
        type: Number,
        default: 1,
    },
    accountExpiryDate: Date,
    two_factor_enabled: Boolean,
    two_factor_secret: String,
    refreshToken: String,
    refreshTokenExpiry: Date,
}, { 
    timestamps: true,
    strict: false,
});

// Remove all indexes
DeletedUserSchema.index({}, { unique: false });

// Create a compound index on originalUserId and deletedAt
DeletedUserSchema.index({ originalUserId: 1, deletedAt: 1 }, { unique: false });

// Remove the 'id' field from the schema
DeletedUserSchema.set('toObject', { virtuals: true });
DeletedUserSchema.set('toJSON', { virtuals: true });

export const DeletedUserModel = mongoose.model("deleted_users", DeletedUserSchema, "deleted_users");

export default DeletedUserModel;
