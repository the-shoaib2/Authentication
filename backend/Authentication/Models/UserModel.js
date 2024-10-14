import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import DeletedUserModel from './DeletedUser.js';

const Schema = mongoose.Schema;

const AvatarHistorySchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  prev: {
    type: Schema.Types.ObjectId,
    ref: 'AvatarHistory',
  },
  next: {
    type: Schema.Types.ObjectId,
    ref: 'AvatarHistory',
  }
});

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
  avatar: {
    type: String,
    default: null,
  },
  avatarHistory: {
    type: [AvatarHistorySchema],
    default: [],
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
    default: true,  // false 
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
  activeStatus: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
    ref: 'users'
  },
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  mutedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  cloudinaryPublicId: {
    type: String,
    default: null,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FriendRequest'
  }],
});

// Pre-save hook to generate username if not provided and set default profile picture
UserSchema.pre('save', function (next) {
  if (!this.username) {
    const namePart = `${this.first_name}${this.last_name}`.replace(/\s+/g, '').toLowerCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    this.username = `@${namePart}.${randomPart}`;
  }

  // Set default profile picture based on gender
  if (this.gender === 'male') {
    this.avatar = 'https://res.cloudinary.com/dtteg3e2b/image/upload/v1728306869/CHATAPP/avatar/xqmmchslvhkpjbu6hbo0.jpg'; // Male image URL
  } else if (this.gender === 'female') {
    this.avatar = 'https://res.cloudinary.com/dtteg3e2b/image/upload/v1728306936/CHATAPP/avatar/uw7nihkwksrweo2k6qbc.jpg'; // Female image URL
  }

  // Add the default avatar to the history
  this.avatarHistory.push({ url: this.avatar });

  // Update updatedAt timestamp
  this.updatedAt = Date.now();

  next();
});

// Method to delete the current avatar and focus on the first node in the history
UserSchema.methods.deleteCurrentAvatar = async function () {
  if (this.avatarHistory.length > 0) {
    // Remove the current avatar from the history
    this.avatarHistory.shift(); // Remove the first node (current avatar)

    // Set the new avatar to the first node in the history
    if (this.avatarHistory.length > 0) {
      this.avatar = this.avatarHistory[0].url;
    } else {
      // If no history left, set to null or a default avatar
      this.avatar = this.gender === 'male'
        ? 'https://res.cloudinary.com/dtteg3e2b/image/upload/v1728306869/CHATAPP/avatar/xqmmchslvhkpjbu6hbo0.jpg'
        : 'https://res.cloudinary.com/dtteg3e2b/image/upload/v1728306936/CHATAPP/avatar/uw7nihkwksrweo2k6qbc.jpg';
    }

    await this.save();
  }
};

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
    this.lastActive = null;
  } else {
    this.lastActive = Date.now();
  }
  return this.save();
};

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
