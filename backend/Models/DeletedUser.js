const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeletedUserSchema = new Schema({
  // Copy all fields from UserSchema
  // ... (existing fields remain unchanged)

  deletedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Method to restore a deleted user
DeletedUserSchema.methods.restoreUser = async function () {
  const UserModel = mongoose.model("users");
  const restoredUser = new UserModel(this.toObject());
  restoredUser.status = 'active';
  restoredUser.isActive = true;
  
  // Use Promise.all for concurrent operations
  await Promise.all([
    restoredUser.save(),
    this.deleteOne()
  ]);
  
  return restoredUser;
};

// Static method to delete a user and move to DeletedUser collection
DeletedUserSchema.statics.deleteUser = async function (userId) {
  const UserModel = mongoose.model("users");
  
  // Use findOneAndDelete for atomic operation
  const user = await UserModel.findOneAndDelete({ _id: userId });
  
  if (!user) {
    throw new Error("User not found");
  }

  // Create a new DeletedUser document
  const deletedUser = new this(user.toObject());
  await deletedUser.save();

  return deletedUser;
};

const DeletedUserModel = mongoose.model("deletedUsers", DeletedUserSchema);

module.exports = DeletedUserModel;
