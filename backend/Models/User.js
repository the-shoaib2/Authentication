
// backend/Models/User.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  dob: {
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  gender: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
  },
  profile_picture: {
    type: String,
    default: '/avatar.png',
  },
  refreshToken: {
    type: String,
    default: null,
  },
  refreshTokenExpiry: {
    type: Date,
    default: null,
  },
  two_factor_enabled: {
    type: Boolean,
    default: false,
  },
  two_factor_secret: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'inactive', // Default status when a user is created
  },
  lastLogin: {
    type: Date,
    default: Date.now,
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

// Pre-save hook to generate username if not provided and set default profile picture
UserSchema.pre('save', function (next) {
  if (!this.username) {
    const namePart = `${this.first_name}${this.last_name}`.replace(/\s+/g, '').toLowerCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    this.username = `@${namePart}.${randomPart}`;
  }

  if (!this.profile_picture) {
    this.profile_picture = '/avatar.png';
  }

  // Update updatedAt timestamp
  this.updatedAt = Date.now();

  next();
});

// Method to activate a user
UserSchema.methods.activate = function () {
  if (this.status !== 'deleted') {
    this.status = 'active';
    return this.save();
  } else {
    throw new Error('Cannot activate a deleted user.');
  }
};

// Method to deactivate a user
UserSchema.methods.deactivate = function () {
  if (this.status !== 'deleted') {
    this.status = 'inactive';
    return this.save();
  } else {
    throw new Error('Cannot deactivate a deleted user.');
  }
};

// Method to delete a user
UserSchema.methods.deleteUser = function () {
  this.status = 'deleted';
  return this.save();
};

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
