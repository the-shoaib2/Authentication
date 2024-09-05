const mongoose = require("mongoose");
const { UserSchema } = require('./User');

const Schema = mongoose.Schema;

const DeletedUserSchema = new Schema({
  ...UserSchema.obj,
  
  deletedAt: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
    default: 'Account expired',
  }
});

const DeletedUserModel = mongoose.model("deletedUsers", DeletedUserSchema);

module.exports = DeletedUserModel;
