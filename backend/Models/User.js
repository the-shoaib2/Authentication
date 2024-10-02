const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const DeletedUserModel = require('./DeletedUser');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: {
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
    required: true,
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
    default: false,  // false 
  },
  accountExpiryDate: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deactive', 'deleted'],
    default: 'inactive',
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
  onlineStatus: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  mutedUsers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    muteUntil: { type: Date }
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
  this.status = 'active';
  this.isActive = true;
  this.accountExpiryDate = null;
  return this.save();
};

// Method to deactivate a user
UserSchema.methods.deactivate = function () {
  if (this.status !== 'deleted') {
    this.status = 'deactive';
    return this.save();
  } else {
    throw new Error('Cannot deactivate a deleted user.');
  }
};

// Add a new method to check if the account has expired
UserSchema.methods.isAccountExpired = function () {
  return this.accountExpiryDate < new Date();
};

// Add a pre-save hook to ensure accountExpiryDate is null when isActive is true
UserSchema.pre('save', function (next) {
  if (this.isActive) {
    this.accountExpiryDate = null;
  }
  next();
});

// New method to move user to deleted accounts
UserSchema.methods.moveToDeletedAccounts = async function () {
  const userData = this.toObject();
  delete userData._id;

  let deletedUser = await DeletedUserModel.findOne({ originalUserId: this._id });

  if (deletedUser) {
    deletedUser.deletionCount += 1;
    deletedUser.deletedAt = new Date();
    Object.assign(deletedUser, userData);
  } else {
    deletedUser = new DeletedUserModel({
      ...userData,
      originalUserId: this._id,
      status: 'deleted',
      deletionCount: 1
    });
  }

  await DeletedUserModel.findOneAndUpdate(
    { originalUserId: this._id },
    deletedUser.toObject(),
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await this.deleteOne();
  return deletedUser;
};

// Method to update online status
UserSchema.methods.updateOnlineStatus = function (status) {
  this.onlineStatus = status;
  if (status) {
    this.lastActive = null; // Clear lastActive if user is online
  } else {
    this.lastActive = Date.now(); // Set lastActive time if user is offline
  }
  return this.save();
};

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
