const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Friends', friendsSchema);
